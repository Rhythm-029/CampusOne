package com.campusone.lostfound.controller;

import com.campusone.lostfound.model.LostFoundClaim;
import com.campusone.lostfound.model.LostFoundReport;
import com.campusone.lostfound.service.LostFoundAutocompleteService;
import com.campusone.lostfound.service.LostFoundImageService;
import com.campusone.lostfound.service.LostFoundMatcherService;
import com.campusone.lostfound.service.LostFoundScreeningService;
import com.campusone.lostfound.service.LostFoundService;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lost-found")
public class LostFoundController {

    private final LostFoundService lostFoundService;
    private final LostFoundAutocompleteService autocompleteService;
    private final LostFoundImageService imageService;
    private final LostFoundScreeningService screeningService;

    public LostFoundController(LostFoundService lostFoundService,
                               LostFoundAutocompleteService autocompleteService,
                               LostFoundImageService imageService,
                               LostFoundScreeningService screeningService) {
        this.lostFoundService = lostFoundService;
        this.autocompleteService = autocompleteService;
        this.imageService = imageService;
        this.screeningService = screeningService;
    }

    /**
     * Autocomplete item names via Unit 4 Trie data structure.
     */
    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> getAutocompleteSuggestions(
            @RequestParam(name = "q", defaultValue = "") String query,
            @RequestParam(name = "limit", defaultValue = "5") int limit) {
        List<String> suggestions = autocompleteService.autocomplete(query, limit);
        return ResponseEntity.ok(suggestions);
    }

    /**
     * Submit a new Lost or Found item report.
     */
    @PostMapping(value = "/reports", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitReport(
            @RequestParam("reportType") String reportType,
            @RequestParam("itemName") String itemName,
            @RequestParam("category") String category,
            @RequestParam(value = "description", required = false, defaultValue = "") String description,
            @RequestParam(value = "location", required = false, defaultValue = "") String location,
            @RequestParam(value = "eventDate", required = false, defaultValue = "") String eventDate,
            @RequestParam(value = "eventTime", required = false, defaultValue = "") String eventTime,
            @RequestParam(value = "color", required = false, defaultValue = "") String color,
            @RequestParam(value = "identifyingDetails", required = false, defaultValue = "") String identifyingDetails,
            @RequestParam(value = "custodyLocation", required = false, defaultValue = "") String custodyLocation,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String email = userDetails != null ? userDetails.getUsername() : "student@atlasskilltech.university";
            String name = email.split("@")[0].replace('.', ' ');

            LostFoundReport report = lostFoundService.createReport(
                    reportType, itemName, category, description, location,
                    eventDate, eventTime, color, identifyingDetails, custodyLocation,
                    image, email, name
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(report);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Image upload failed: " + ex.getMessage()));
        }
    }

    /**
     * Search and filter lost & found reports.
     */
    @GetMapping("/reports")
    public ResponseEntity<List<LostFoundReport>> getReports(
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "location", required = false) String location,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        boolean isAdmin = userDetails != null && userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("ADMIN"));

        List<LostFoundReport> reports = lostFoundService.searchReports(
                type, category, status, query, location, userEmail, isAdmin
        );
        return ResponseEntity.ok(reports);
    }

    /**
     * Get single report by ID with Bloom Filter screening.
     */
    @GetMapping("/reports/{reportId}")
    public ResponseEntity<?> getReportById(
            @PathVariable("reportId") String reportId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        boolean isAdmin = userDetails != null && userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("ADMIN"));

        return lostFoundService.getReportById(reportId, userEmail, isAdmin)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body((LostFoundReport) null));
    }

    /**
     * Withdraw personal report.
     */
    @DeleteMapping("/reports/{reportId}")
    public ResponseEntity<?> withdrawReport(
            @PathVariable("reportId") String reportId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userEmail = userDetails != null ? userDetails.getUsername() : "student@atlasskilltech.university";
            boolean isAdmin = userDetails != null && userDetails.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().contains("ADMIN"));

            LostFoundReport withdrawn = lostFoundService.withdrawReport(reportId, userEmail, isAdmin);
            return ResponseEntity.ok(withdrawn);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Get current user's submitted reports.
     */
    @GetMapping("/my-reports")
    public ResponseEntity<List<LostFoundReport>> getMyReports(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : "ananya.student@atlasskilltech.university";
        List<LostFoundReport> reports = lostFoundService.getMyReports(email);
        return ResponseEntity.ok(reports);
    }

    /**
     * Submit an ownership claim for a found report.
     */
    @PostMapping("/claims")
    public ResponseEntity<?> submitClaim(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String reportId = body.get("reportId");
            String proof = body.get("ownershipProof");
            String details = body.get("identifyingDetailsProvided");

            String email = userDetails != null ? userDetails.getUsername() : "ananya.student@atlasskilltech.university";
            String name = email.split("@")[0].replace('.', ' ');

            LostFoundClaim claim = lostFoundService.submitClaim(
                    reportId, proof, details, email, name, "Computer Science"
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(claim);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Get current user's claims.
     */
    @GetMapping("/my-claims")
    public ResponseEntity<List<LostFoundClaim>> getMyClaims(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : "ananya.student@atlasskilltech.university";
        return ResponseEntity.ok(lostFoundService.getMyClaims(email));
    }

    /**
     * View claims for a report (Admin or Author).
     */
    @GetMapping("/claims/report/{reportId}")
    public ResponseEntity<List<LostFoundClaim>> getClaimsForReport(@PathVariable("reportId") String reportId) {
        return ResponseEntity.ok(lostFoundService.getClaimsForReport(reportId));
    }

    /**
     * Review ownership claim (Admin only).
     */
    @PostMapping("/claims/{claimId}/review")
    public ResponseEntity<?> reviewClaim(
            @PathVariable("claimId") String claimId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String decision = body.get("decision");
            String notes = body.get("notes");
            String adminEmail = userDetails != null ? userDetails.getUsername() : "admin@atlasskilltech.university";

            LostFoundClaim reviewed = lostFoundService.reviewClaim(claimId, decision, notes, adminEmail);
            return ResponseEntity.ok(reviewed);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Record physical handover (Admin only).
     */
    @PostMapping("/claims/{claimId}/handover")
    public ResponseEntity<?> recordHandover(
            @PathVariable("claimId") String claimId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String adminEmail = userDetails != null ? userDetails.getUsername() : "admin@atlasskilltech.university";
            LostFoundClaim handedOver = lostFoundService.recordHandover(claimId, adminEmail);
            return ResponseEntity.ok(handedOver);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Potential matches between Lost & Found reports.
     */
    @GetMapping("/reports/{reportId}/potential-matches")
    public ResponseEntity<?> getPotentialMatches(@PathVariable("reportId") String reportId) {
        try {
            List<LostFoundMatcherService.MatchSuggestion> matches = lostFoundService.getPotentialMatches(reportId);
            return ResponseEntity.ok(matches);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Serve uploaded images from GridFS.
     */
    @GetMapping("/images/{imageId}")
    public ResponseEntity<Resource> serveImage(@PathVariable("imageId") String imageId) {
        GridFsResource resource = imageService.retrieveImage(imageId);
        if (resource == null) {
            return ResponseEntity.notFound().build();
        }

        String contentType = resource.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = MediaType.IMAGE_JPEG_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(new org.springframework.core.io.InputStreamResource(resource.getContent()));
    }

    /**
     * Admin statistics & algorithm diagnostics.
     */
    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        return ResponseEntity.ok(lostFoundService.getAdminStatistics());
    }

    /**
     * Force rebuild of Trie and Bloom Filter cache from MongoDB Atlas.
     */
    @PostMapping("/admin/sync/rebuild")
    public ResponseEntity<?> rebuildCache() {
        autocompleteService.rebuildTrie();
        screeningService.rebuildSync();
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Trie vocabulary and Bloom Filter cache successfully synchronized with MongoDB Atlas."
        ));
    }
}

