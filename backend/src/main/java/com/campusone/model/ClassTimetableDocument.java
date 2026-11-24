package com.campusone.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * MongoDB Atlas document representing an academic timetable class block.
 * Uses a compound unique index to guarantee that a room cannot have overlapping timetable classes on the same day and slot.
 */
@Document(collection = "class_timetable")
@CompoundIndex(name = "uq_room_day_slot", def = "{'roomId': 1, 'dayOfWeek': 1, 'slotId': 1}", unique = true)
public class ClassTimetableDocument {

    @Id
    private String id;

    @Indexed
    private String roomId; // e.g. "101", "205", "213", "313", "701"

    @Indexed
    private String dayOfWeek; // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday

    private Integer slotId; // 1 to 8

    private String courseCode; // e.g. "CS501"

    private String courseName; // e.g. "Advanced Algorithms"

    private String facultyName; // e.g. "Prof. Nimesh Bumb"

    private String section; // e.g. "B.Tech CS AI-ML Sem V"

    private String sessionType; // LECTURE, LAB, SEMINAR, WEEKEND_SESSION

    private String importBatchId;

    public ClassTimetableDocument() {
    }

    public ClassTimetableDocument(String roomId, String dayOfWeek, Integer slotId, String courseCode,
                                  String courseName, String facultyName, String section,
                                  String sessionType, String importBatchId) {
        this.roomId = roomId;
        this.dayOfWeek = dayOfWeek;
        this.slotId = slotId;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.facultyName = facultyName;
        this.section = section;
        this.sessionType = sessionType;
        this.importBatchId = importBatchId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public Integer getSlotId() {
        return slotId;
    }

    public void setSlotId(Integer slotId) {
        this.slotId = slotId;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getSessionType() {
        return sessionType;
    }

    public void setSessionType(String sessionType) {
        this.sessionType = sessionType;
    }

    public String getImportBatchId() {
        return importBatchId;
    }

    public void setImportBatchId(String importBatchId) {
        this.importBatchId = importBatchId;
    }
}

