package com.campusone.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "rooms")
public class RoomDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private String roomNumber;

    @Indexed
    private int floor;

    private int capacity;
    private String roomType; // e.g. "Smart Classroom", "Special Auditorium", "Computer Lab"
    private List<String> equipment = new ArrayList<>();
    private boolean accessible = true;
    private boolean verified = false;
    private boolean active = true;

    public RoomDocument() {}

    public RoomDocument(String roomNumber, int floor, int capacity, String roomType, List<String> equipment, boolean accessible, boolean verified) {
        this.roomNumber = roomNumber;
        this.floor = floor;
        this.capacity = capacity;
        this.roomType = roomType;
        this.equipment = equipment != null ? equipment : new ArrayList<>();
        this.accessible = accessible;
        this.verified = verified;
        this.active = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public int getFloor() { return floor; }
    public void setFloor(int floor) { this.floor = floor; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }
    public List<String> getEquipment() { return equipment; }
    public void setEquipment(List<String> equipment) { this.equipment = equipment; }
    public boolean isAccessible() { return accessible; }
    public void setAccessible(boolean accessible) { this.accessible = accessible; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
