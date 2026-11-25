package com.campusone.model;

public class CampusNotification {
    private String id;
    private String title;
    private String content;
    private String category; // URGENT, ACADEMIC, MAINTENANCE, EVENT
    private String authorName;
    private String authorEmail;
    private String createdAt;
    private boolean pinned;

    public CampusNotification() {}

    public CampusNotification(String id, String title, String content, String category,
                              String authorName, String authorEmail, String createdAt, boolean pinned) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.category = category;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
        this.createdAt = createdAt;
        this.pinned = pinned;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorEmail() { return authorEmail; }
    public void setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public boolean isPinned() { return pinned; }
    public void setPinned(boolean pinned) { this.pinned = pinned; }
}
