package com.campusone.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Atomic multi-slot reservation record.
 * Compound unique index on (roomId, bookingDate, slotId) prevents overlapping
 * bookings or double allocations at the database engine level.
 */
@Document(collection = "room_booking_slots")
@CompoundIndexes({
    @CompoundIndex(name = "uq_room_date_slot", def = "{'roomId': 1, 'bookingDate': 1, 'slotId': 1}", unique = true)
})
public class RoomBookingSlotDocument {

    @Id
    private String id;

    private String roomId;
    private String bookingDate; // YYYY-MM-DD
    private int slotId; // 1 to 8

    private String bookingRequestId;
    private String bookingType; // "RESERVATION", "TIMETABLE", "MAINTENANCE"
    private String reservedBy;

    @CreatedDate
    private Instant createdAt = Instant.now();

    public RoomBookingSlotDocument() {}

    public RoomBookingSlotDocument(String roomId, String bookingDate, int slotId, String bookingRequestId, String bookingType, String reservedBy) {
        this.roomId = roomId;
        this.bookingDate = bookingDate;
        this.slotId = slotId;
        this.bookingRequestId = bookingRequestId;
        this.bookingType = bookingType;
        this.reservedBy = reservedBy;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
    public int getSlotId() { return slotId; }
    public void setSlotId(int slotId) { this.slotId = slotId; }
    public String getBookingRequestId() { return bookingRequestId; }
    public void setBookingRequestId(String bookingRequestId) { this.bookingRequestId = bookingRequestId; }
    public String getBookingType() { return bookingType; }
    public void setBookingType(String bookingType) { this.bookingType = bookingType; }
    public String getReservedBy() { return reservedBy; }
    public void setReservedBy(String reservedBy) { this.reservedBy = reservedBy; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

