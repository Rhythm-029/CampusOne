package com.campusone.model;

import java.util.ArrayList;
import java.util.List;

public class SpaceBookingRequest {
    private String id;
    private String studentEmail;
    private String studentName;
    private String department;
    private String roomId;
    private String roomName;
    private String date;
    private Integer slotId;
    private String slotTime;
    private Integer capacity;
    private List<String> equipment = new ArrayList<>();
    private String purpose;
    private String status; // PENDING_APPROVAL, APPROVED, REJECTED
    private String adminNotes;
    private String submittedAt;
    private boolean conflict;

    public SpaceBookingRequest() {}

    public SpaceBookingRequest(String id, String studentEmail, String studentName, String department,
                               String roomId, String roomName, String date, Integer slotId,
                               String slotTime, Integer capacity, List<String> equipment,
                               String purpose, String status, String adminNotes, String submittedAt, boolean conflict) {
        this.id = id;
        this.studentEmail = studentEmail;
        this.studentName = studentName;
        this.department = department;
        this.roomId = roomId;
        this.roomName = roomName;
        this.date = date;
        this.slotId = slotId;
        this.slotTime = slotTime;
        this.capacity = capacity;
        this.equipment = equipment != null ? equipment : new ArrayList<>();
        this.purpose = purpose;
        this.status = status;
        this.adminNotes = adminNotes;
        this.submittedAt = submittedAt;
        this.conflict = conflict;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Integer getSlotId() { return slotId; }
    public void setSlotId(Integer slotId) { this.slotId = slotId; }

    public String getSlotTime() { return slotTime; }
    public void setSlotTime(String slotTime) { this.slotTime = slotTime; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public List<String> getEquipment() { return equipment; }
    public void setEquipment(List<String> equipment) { this.equipment = equipment; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }

    public boolean isConflict() { return conflict; }
    public void setConflict(boolean conflict) { this.conflict = conflict; }
}
