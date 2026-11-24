package com.campusone.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Concurrency-Safe Faculty Appointment Document.
 * Partial index ensures that cancelled or rejected appointments do NOT block slots.
 */
@Document(collection = "faculty_appointments")
@CompoundIndexes({
    @CompoundIndex(
        name = "uq_faculty_active_slot",
        def = "{'facultyId': 1, 'appointmentDate': 1, 'slotId': 1}",
        unique = true,
        partialFilter = "{'status': {'$in': ['REQUESTED', 'CONFIRMED']}}"
    )
})
public class FacultyAppointmentDocument {

    @Id
    private String id;

    private String facultyId; // e.g. "dr.sharma@atlasskilltech.university"
    private String studentId; // e.g. "ananya.student@atlasskilltech.university"
    private String studentName;
    private String facultyName;
    private String courseCode;

    private String appointmentDate; // YYYY-MM-DD
    private int slotId; // 1 to 8
    private String slotTime;
    private String topic;

    private String status = "REQUESTED"; // REQUESTED, CONFIRMED, REJECTED, CANCELLED, COMPLETED
    private String facultyNotes;
    private String officeLocation;

    @CreatedDate
    private Instant createdAt = Instant.now();

    public FacultyAppointmentDocument() {}

    public FacultyAppointmentDocument(String facultyId, String studentId, String studentName, String facultyName, String courseCode, String appointmentDate, int slotId, String slotTime, String topic, String officeLocation) {
        this.facultyId = facultyId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.facultyName = facultyName;
        this.courseCode = courseCode;
        this.appointmentDate = appointmentDate;
        this.slotId = slotId;
        this.slotTime = slotTime;
        this.topic = topic;
        this.officeLocation = officeLocation;
        this.status = "REQUESTED";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFacultyId() { return facultyId; }
    public void setFacultyId(String facultyId) { this.facultyId = facultyId; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }
    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }
    public int getSlotId() { return slotId; }
    public void setSlotId(int slotId) { this.slotId = slotId; }
    public String getSlotTime() { return slotTime; }
    public void setSlotTime(String slotTime) { this.slotTime = slotTime; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getFacultyNotes() { return facultyNotes; }
    public void setFacultyNotes(String facultyNotes) { this.facultyNotes = facultyNotes; }
    public String getOfficeLocation() { return officeLocation; }
    public void setOfficeLocation(String officeLocation) { this.officeLocation = officeLocation; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

