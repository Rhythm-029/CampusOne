package com.campusone.lostfound.service;

import com.campusone.lostfound.model.LostFoundClaim;
import com.campusone.lostfound.model.LostFoundReport;
import com.campusone.lostfound.repository.LostFoundClaimRepository;
import com.campusone.lostfound.repository.LostFoundReportRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.*;

@Service
public class LostFoundService {

    private final LostFoundReportRepository reportRepository;
    private final LostFoundClaimRepository claimRepository;
    private final LostFoundImageService imageService;
    private final LostFoundAutocompleteService autocompleteService;
    private final LostFoundScreeningService screeningService;
    private final LostFoundMatcherService matcherService;
    private final MongoTemplate mongoTemplate;

    public LostFoundService(LostFoundReportRepository reportRepository,
                            LostFoundClaimRepository claimRepository,
                            LostFoundImageService imageService,
                            LostFoundAutocompleteService autocompleteService,
                            LostFoundScreeningService screeningService,
                            LostFoundMatcherService matcherService,
                            MongoTemplate mongoTemplate) {
        this.reportRepository = reportRepository;
        this.claimRepository = claimRepository;
        this.imageService = imageService;
        this.autocompleteService = autocompleteService;
        this.screeningService = screeningService;
        this.matcherService = matcherService;
        this.mongoTemplate = mongoTemplate;
    }

    public synchronized String generateNextReportId() {
        long count = reportRepository.count() + 1;
        return String.format("LF-2026-%03d", count);
    }

    public synchronized String generateNextClaimId() {
        long count = claimRepository.count() + 1;
        return String.format("CLM-2026-%03d", count);
    }

    public LostFoundReport createReport(String reportType,
                                        String itemName,
                                        String category,
                                        String description,
                                        String location,
                                        String eventDate,
                                        String eventTime,
                                        String color,
                                        String identifyingDetails,
                                        String custodyLocation,
                                        MultipartFile imageFile,
                                        String userEmail,
                                        String userName) throws IOException {

        if (itemName == null || itemName.isBlank()) {
            throw new IllegalArgumentException("Item name is required");
        }
        if (category == null || category.isBlank()) {
            throw new IllegalArgumentException("Category is required");
        }

        String imageId = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imageId = imageService.storeImage(imageFile);
        }

        String reportId = generateNextReportId();

        LostFoundReport report = new LostFoundReport(
                reportId,
                reportType != null ? reportType.toUpperCase() : "LOST",
                itemName.trim(),
                category.trim(),
                description != null ? description.trim() : "",
                location != null ? location.trim() : "",
                eventDate != null ? eventDate.trim() : "",
                eventTime != null ? eventTime.trim() : "",
                color != null ? color.trim() : "",
                identifyingDetails != null ? identifyingDetails.trim() : "",
                imageId,
                custodyLocation != null ? custodyLocation.trim() : "",
                userEmail,
                userName
        );

        LostFoundReport saved = reportRepository.save(report);

        // Update in-memory assessed algorithm structures
        screeningService.registerReportId(saved.getReportId());
        autocompleteService.registerNewItem(saved.getItemName(), saved.getCategory());

        return sanitizeReport(saved, userEmail, false);
    }

    public List<LostFoundReport> searchReports(String reportType,
                                              String category,
                                              String status,
                                              String searchQuery,
                                              String location,
                                              String currentUserEmail,
                                              boolean isAdmin) {
        Query query = new Query();

        if (reportType != null && !reportType.isBlank() && !"ALL".equalsIgnoreCase(reportType)) {
            query.addCriteria(Criteria.where("reportType").is(reportType.toUpperCase()));
        }

        if (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category) && !"ALL ITEMS".equalsIgnoreCase(category)) {
            query.addCriteria(Criteria.where("category").is(category));
        }

        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            query.addCriteria(Criteria.where("status").is(status.toUpperCase()));
        } else {
            // By default hide withdrawn reports unless specifically requested
            query.addCriteria(Criteria.where("status").ne("WITHDRAWN"));
        }

        if (location != null && !location.isBlank()) {
            query.addCriteria(Criteria.where("location").regex(location.trim(), "i"));
        }

        if (searchQuery != null && !searchQuery.isBlank()) {
            String regex = searchQuery.trim();
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("itemName").regex(regex, "i"),
                    Criteria.where("description").regex(regex, "i"),
                    Criteria.where("location").regex(regex, "i")
            ));
        }

        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));

        List<LostFoundReport> raw = mongoTemplate.find(query, LostFoundReport.class);
        List<LostFoundReport> sanitized = new ArrayList<>();
        for (LostFoundReport r : raw) {
            sanitized.add(sanitizeReport(r, currentUserEmail, isAdmin));
        }
        return sanitized;
    }

    public Optional<LostFoundReport> getReportById(String reportId, String currentUserEmail, boolean isAdmin) {
        // Step 1: Bloom Filter existence screening
        if (!screeningService.mightContain(reportId)) {
            // Negative response: item definitely does NOT exist in MongoDB
            return Optional.empty();
        }

        // Step 2: Positive response: verify authoritatively in MongoDB Atlas
        return reportRepository.findByReportId(reportId)
                .map(r -> sanitizeReport(r, currentUserEmail, isAdmin));
    }

    public List<LostFoundReport> getMyReports(String userEmail) {
        List<LostFoundReport> list = reportRepository.findByReportedByUserIdOrderByCreatedAtDesc(userEmail);
        // Author can see their own private details
        return list;
    }

    public LostFoundReport withdrawReport(String reportId, String userEmail, boolean isAdmin) {
        LostFoundReport report = reportRepository.findByReportedByUserIdOrderByCreatedAtDesc(userEmail).stream()
                .filter(r -> r.getReportId().equals(reportId))
                .findFirst()
                .or(() -> isAdmin ? reportRepository.findByReportId(reportId) : Optional.empty())
                .orElseThrow(() -> new IllegalArgumentException("Report not found or unauthorized to withdraw"));

        report.setStatus("WITHDRAWN");
        report.setUpdatedAt(Instant.now());
        LostFoundReport saved = reportRepository.save(report);

        autocompleteService.unregisterItem(saved.getItemName());
        return saved;
    }

    public LostFoundClaim submitClaim(String reportId,
                                      String ownershipProof,
                                      String identifyingDetails,
                                      String claimantEmail,
                                      String claimantName,
                                      String claimantDepartment) {

        LostFoundReport report = reportRepository.findByReportedByUserIdOrderByCreatedAtDesc(claimantEmail).stream()
                .filter(r -> r.getReportId().equals(reportId))
                .findFirst()
                .orElse(null);

        if (report == null) {
            report = reportRepository.findByReportId(reportId)
                    .orElseThrow(() -> new IllegalArgumentException("Report with ID " + reportId + " not found"));
        }

        if (claimantEmail.equalsIgnoreCase(report.getReportedByUserId())) {
            throw new IllegalArgumentException("You cannot submit an ownership claim on an item you personally reported.");
        }

        if ("HANDED_OVER".equalsIgnoreCase(report.getStatus())) {
            throw new IllegalStateException("This item has already been verified and handed over.");
        }

        String claimId = generateNextClaimId();
        LostFoundClaim claim = new LostFoundClaim(
                claimId,
                reportId,
                claimantEmail,
                claimantName,
                claimantDepartment != null ? claimantDepartment : "University Student",
                ownershipProof,
                identifyingDetails
        );

        LostFoundClaim saved = claimRepository.save(claim);

        // Update report status to indicate claim under review
        if (!"CLAIM_PENDING".equalsIgnoreCase(report.getStatus())) {
            report.setStatus("CLAIM_PENDING");
            report.setUpdatedAt(Instant.now());
            reportRepository.save(report);
        }

        return saved;
    }

    public List<LostFoundClaim> getMyClaims(String claimantEmail) {
        return claimRepository.findByClaimantEmailOrderByCreatedAtDesc(claimantEmail);
    }

    public List<LostFoundClaim> getClaimsForReport(String reportId) {
        return claimRepository.findByReportIdOrderByCreatedAtDesc(reportId);
    }

    @Transactional
    public LostFoundClaim reviewClaim(String claimId, String decision, String notes, String adminEmail) {
        LostFoundClaim claim = claimRepository.findByClaimId(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found: " + claimId));

        if (!"APPROVED".equalsIgnoreCase(decision) && !"REJECTED".equalsIgnoreCase(decision)) {
            throw new IllegalArgumentException("Invalid review decision. Must be APPROVED or REJECTED.");
        }

        claim.setStatus(decision.toUpperCase());
        claim.setAdminReviewerEmail(adminEmail);
        claim.setAdminReviewNotes(notes);
        claim.setReviewTimestamp(Instant.now());

        LostFoundClaim saved = claimRepository.save(claim);

        LostFoundReport report = reportRepository.findByReportId(claim.getReportId()).orElse(null);
        if (report != null) {
            if ("APPROVED".equalsIgnoreCase(decision)) {
                // Reject other pending claims for this report
                List<LostFoundClaim> otherClaims = claimRepository.findByReportIdOrderByCreatedAtDesc(claim.getReportId());
                for (LostFoundClaim other : otherClaims) {
                    if (!other.getClaimId().equals(claimId) && "SUBMITTED".equalsIgnoreCase(other.getStatus())) {
                        other.setStatus("REJECTED");
                        other.setAdminReviewNotes("Another ownership claim was verified and approved.");
                        claimRepository.save(other);
                    }
                }
            } else if ("REJECTED".equalsIgnoreCase(decision)) {
                // Check if any other claims remain
                boolean hasOtherActive = claimRepository.findByReportIdOrderByCreatedAtDesc(claim.getReportId()).stream()
                        .anyMatch(c -> "SUBMITTED".equalsIgnoreCase(c.getStatus()) || "APPROVED".equalsIgnoreCase(c.getStatus()));
                if (!hasOtherActive) {
                    report.setStatus("OPEN");
                    reportRepository.save(report);
                }
            }
        }

        return saved;
    }

    @Transactional
    public LostFoundClaim recordHandover(String claimId, String adminEmail) {
        LostFoundClaim claim = claimRepository.findByClaimId(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found: " + claimId));

        if (!"APPROVED".equalsIgnoreCase(claim.getStatus())) {
            throw new IllegalStateException("Handover can only be recorded for an APPROVED claim.");
        }

        claim.setStatus("HANDED_OVER");
        claim.setHandoverTimestamp(Instant.now());
        claim.setHandoverRecordedBy(adminEmail);
        LostFoundClaim saved = claimRepository.save(claim);

        reportRepository.findByReportId(claim.getReportId()).ifPresent(r -> {
            r.setStatus("HANDED_OVER");
            r.setUpdatedAt(Instant.now());
            reportRepository.save(r);
        });

        return saved;
    }

    public List<LostFoundMatcherService.MatchSuggestion> getPotentialMatches(String reportId) {
        LostFoundReport target = reportRepository.findByReportId(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found: " + reportId));

        List<LostFoundReport> allCandidates = reportRepository.findAll();
        return matcherService.findPotentialMatches(target, allCandidates);
    }

    public Map<String, Object> getAdminStatistics() {
        long total = reportRepository.count();
        long lostCount = reportRepository.findByReportTypeOrderByCreatedAtDesc("LOST").size();
        long foundCount = reportRepository.findByReportTypeOrderByCreatedAtDesc("FOUND").size();
        long openCount = reportRepository.findByStatusOrderByCreatedAtDesc("OPEN").size();
        long handedOverCount = reportRepository.findByStatusOrderByCreatedAtDesc("HANDED_OVER").size();
        long claimsCount = claimRepository.count();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalReports", total);
        stats.put("lostReports", lostCount);
        stats.put("foundReports", foundCount);
        stats.put("openReports", openCount);
        stats.put("handedOverReports", handedOverCount);
        stats.put("totalClaims", claimsCount);
        stats.put("trieVocabularyCount", autocompleteService.getTrieSize());
        stats.put("bloomFilterElementsCount", screeningService.getElementCount());
        stats.put("bloomFilterSynchronized", screeningService.isSynchronized());
        stats.put("bloomFilterTheoreticalFPR", screeningService.getTheoreticalFalsePositiveRate());
        return stats;
    }

    /**
     * Sanitizes private identifying details from public view to protect verification integrity.
     */
    private LostFoundReport sanitizeReport(LostFoundReport r, String currentUserEmail, boolean isAdmin) {
        if (isAdmin || (currentUserEmail != null && currentUserEmail.equalsIgnoreCase(r.getReportedByUserId()))) {
            return r; // Author or Admin gets full access
        }

        // Return a copy with private verification marks hidden
        LostFoundReport copy = new LostFoundReport();
        copy.setId(r.getId());
        copy.setReportId(r.getReportId());
        copy.setReportType(r.getReportType());
        copy.setItemName(r.getItemName());
        copy.setCategory(r.getCategory());
        copy.setDescription(r.getDescription());
        copy.setLocation(r.getLocation());
        copy.setEventDate(r.getEventDate());
        copy.setEventTime(r.getEventTime());
        copy.setColor(r.getColor());
        copy.setImageId(r.getImageId());
        copy.setImageUrl(r.getImageUrl());
        copy.setCustodyLocation(r.getCustodyLocation());
        copy.setStatus(r.getStatus());
        copy.setReportedByName(r.getReportedByName());
        copy.setCreatedAt(r.getCreatedAt());
        copy.setUpdatedAt(r.getUpdatedAt());
        copy.setIdentifyingDetails("Private identifying details protected for verification.");
        return copy;
    }
}
