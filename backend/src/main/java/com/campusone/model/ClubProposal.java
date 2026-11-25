package com.campusone.model;

public class ClubProposal {
    private String id;
    private String clubName;
    private String title;
    private String description;
    private String proposedDate;
    private Integer expectedAttendees;
    private String submittedByEmail;
    private String submittedByName;
    private String status; // PENDING_APPROVAL, APPROVED, REJECTED
    private String adminNotes;
    private String submittedAt;

    public ClubProposal() {}

    public ClubProposal(String id, String clubName, String title, String description,
                        String proposedDate, Integer expectedAttendees, String submittedByEmail,
                        String submittedByName, String status, String adminNotes, String submittedAt) {
        this.id = id;
        this.clubName = clubName;
        this.title = title;
        this.description = description;
        this.proposedDate = proposedDate;
        this.expectedAttendees = expectedAttendees;
        this.submittedByEmail = submittedByEmail;
        this.submittedByName = submittedByName;
        this.status = status;
        this.adminNotes = adminNotes;
        this.submittedAt = submittedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getClubName() { return clubName; }
    public void setClubName(String clubName) { this.clubName = clubName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getProposedDate() { return proposedDate; }
    public void setProposedDate(String proposedDate) { this.proposedDate = proposedDate; }

    public Integer getExpectedAttendees() { return expectedAttendees; }
    public void setExpectedAttendees(Integer expectedAttendees) { this.expectedAttendees = expectedAttendees; }

    public String getSubmittedByEmail() { return submittedByEmail; }
    public void setSubmittedByEmail(String submittedByEmail) { this.submittedByEmail = submittedByEmail; }

    public String getSubmittedByName() { return submittedByName; }
    public void setSubmittedByName(String submittedByName) { this.submittedByName = submittedByName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }
}

