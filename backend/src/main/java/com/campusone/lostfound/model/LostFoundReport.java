package com.campusone.lostfound.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "lost_found_reports")
@CompoundIndexes({
    @CompoundIndex(name = "idx_type_status_cat", def = "{'reportType': 1, 'status': 1, 'category': 1}"),
    @CompoundIndex(name = "idx_user_reports", def = "{'reportedByUserId': 1, 'createdAt': -1}")
})
public class LostFoundReport {

    @Id
    private String id;

    @Indexed(unique = true)
    private String reportId; // e.g. "LF-2026-001"

    private String reportType; // "LOST" or "FOUND"

    @TextIndexed(weight = 3)
    private String itemName;

    private String category; // Electronics, Bags, ID & Cards, Books, Accessories, Clothing, Other

    @TextIndexed(weight = 1)
    private String description;

    @TextIndexed(weight = 2)
    private String location; // e.g. "Central Library, 2nd Floor", "Seminar Hall B-101"

    private String eventDate; // YYYY-MM-DD
    private String eventTime;
    private String color;
    private String identifyingDetails; // Hidden from general public to protect ownership verification

    private String imageId; // Reference to GridFS file
    private String imageUrl; // Endpoint path: /api/v1/lost-found/images/{imageId}
    private String custodyLocation; // For FOUND items (e.g. "Security Desk Block A")

    private String status = "OPEN"; // OPEN, CLAIM_PENDING, HANDED_OVER, CLOSED, WITHDRAWN

    private String reportedByUserId; // Student / Faculty email
    private String reportedByName;
    private boolean isPrivate = true; // Protects sensitive details from public view

    @CreatedDate
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    private Instant updatedAt = Instant.now();

    public LostFoundReport() {}

    public LostFoundReport(String reportId, String reportType, String itemName, String category, String description, String location, String eventDate, String eventTime, String color, String identifyingDetails, String imageId, String custodyLocation, String reportedByUserId, String reportedByName) {
        this.reportId = reportId;
        this.reportType = reportType;
        this.itemName = itemName;
        this.category = category;
        this.description = description;
        this.location = location;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.color = color;
        this.identifyingDetails = identifyingDetails;
        this.imageId = imageId;
        if (imageId != null) {
            this.imageUrl = "/api/v1/lost-found/images/" + imageId;
        }
        this.custodyLocation = custodyLocation;
        this.reportedByUserId = reportedByUserId;
        this.reportedByName = reportedByName;
        this.status = "OPEN";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getReportId() { return reportId; }
    public void setReportId(String reportId) { this.reportId = reportId; }
    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }
    public String getEventTime() { return eventTime; }
    public void setEventTime(String eventTime) { this.eventTime = eventTime; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getIdentifyingDetails() { return identifyingDetails; }
    public void setIdentifyingDetails(String identifyingDetails) { this.identifyingDetails = identifyingDetails; }
    public String getImageId() { return imageId; }
    public void setImageId(String imageId) { 
        this.imageId = imageId;
        if (imageId != null) {
            this.imageUrl = "/api/v1/lost-found/images/" + imageId;
        }
    }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getCustodyLocation() { return custodyLocation; }
    public void setCustodyLocation(String custodyLocation) { this.custodyLocation = custodyLocation; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getReportedByUserId() { return reportedByUserId; }
    public void setReportedByUserId(String reportedByUserId) { this.reportedByUserId = reportedByUserId; }
    public String getReportedByName() { return reportedByName; }
    public void setReportedByName(String reportedByName) { this.reportedByName = reportedByName; }
    public boolean isPrivate() { return isPrivate; }
    public void setPrivate(boolean aPrivate) { isPrivate = aPrivate; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

