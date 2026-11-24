package com.campusone.lostfound.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Ownership claim document.
 * Partial unique index guarantees that only ONE claim can be APPROVED per report,
 * preventing duplicate approvals and conflicting handovers.
 */
@Document(collection = "lost_found_claims")
@CompoundIndexes({
    @CompoundIndex(
        name = "uq_single_approved_claim",
        def = "{'reportId': 1}",
        unique = true,
        partialFilter = "{'status': 'APPROVED'}"
    )
})
public class LostFoundClaim {

    @Id
    private String id;

    @Indexed(unique = true)
    private String claimId; // e.g. "CLM-2026-001"

    @Indexed
    private String reportId; // Reference to LostFoundReport.reportId

    private String claimantEmail;
    private String claimantName;
    private String claimantDepartment;

    private String ownershipProof; // Invoice details, purchase receipt, serial number, etc.
    private String identifyingDetailsProvided; // Custom marks, stickers, engravings

    private String status = "SUBMITTED"; // SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, HANDED_OVER

    private String adminReviewerEmail;
    private String adminReviewNotes;
    private Instant reviewTimestamp;

    private Instant handoverTimestamp;
    private String handoverRecordedBy;

    @CreatedDate
    private Instant createdAt = Instant.now();

    public LostFoundClaim() {}

    public LostFoundClaim(String claimId, String reportId, String claimantEmail, String claimantName, String claimantDepartment, String ownershipProof, String identifyingDetailsProvided) {
        this.claimId = claimId;
        this.reportId = reportId;
        this.claimantEmail = claimantEmail;
        this.claimantName = claimantName;
        this.claimantDepartment = claimantDepartment;
        this.ownershipProof = ownershipProof;
        this.identifyingDetailsProvided = identifyingDetailsProvided;
        this.status = "SUBMITTED";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getClaimId() { return claimId; }
    public void setClaimId(String claimId) { this.claimId = claimId; }
    public String getReportId() { return reportId; }
    public void setReportId(String reportId) { this.reportId = reportId; }
    public String getClaimantEmail() { return claimantEmail; }
    public void setClaimantEmail(String claimantEmail) { this.claimantEmail = claimantEmail; }
    public String getClaimantName() { return claimantName; }
    public void setClaimantName(String claimantName) { this.claimantName = claimantName; }
    public String getClaimantDepartment() { return claimantDepartment; }
    public void setClaimantDepartment(String claimantDepartment) { this.claimantDepartment = claimantDepartment; }
    public String getOwnershipProof() { return ownershipProof; }
    public void setOwnershipProof(String ownershipProof) { this.ownershipProof = ownershipProof; }
    public String getIdentifyingDetailsProvided() { return identifyingDetailsProvided; }
    public void setIdentifyingDetailsProvided(String identifyingDetailsProvided) { this.identifyingDetailsProvided = identifyingDetailsProvided; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAdminReviewerEmail() { return adminReviewerEmail; }
    public void setAdminReviewerEmail(String adminReviewerEmail) { this.adminReviewerEmail = adminReviewerEmail; }
    public String getAdminReviewNotes() { return adminReviewNotes; }
    public void setAdminReviewNotes(String adminReviewNotes) { this.adminReviewNotes = adminReviewNotes; }
    public Instant getReviewTimestamp() { return reviewTimestamp; }
    public void setReviewTimestamp(Instant reviewTimestamp) { this.reviewTimestamp = reviewTimestamp; }
    public Instant getHandoverTimestamp() { return handoverTimestamp; }
    public void setHandoverTimestamp(Instant handoverTimestamp) { this.handoverTimestamp = handoverTimestamp; }
    public String getHandoverRecordedBy() { return handoverRecordedBy; }
    public void setHandoverRecordedBy(String handoverRecordedBy) { this.handoverRecordedBy = handoverRecordedBy; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

