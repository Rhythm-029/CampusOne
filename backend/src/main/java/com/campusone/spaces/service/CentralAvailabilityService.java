package com.campusone.spaces.service;

import com.campusone.model.RoomBookingSlotDocument;
import com.campusone.model.RoomDocument;
import com.campusone.repository.RoomBookingSlotMongoRepository;
import com.campusone.repository.RoomMongoRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Unified Availability Service ensuring classroom occupancy is checked across ALL THREE
 * occupancy sources:
 * 1. Timetable class schedules
 * 2. Maintenance / Emergency blocks
 * 3. Approved booking slots
 *
 * Backed by atomic compound unique indexes in MongoDB Atlas.
 */
@Service
public class CentralAvailabilityService {

    private final RoomMongoRepository roomRepository;
    private final RoomBookingSlotMongoRepository bookingSlotRepository;
    private final MongoTemplate mongoTemplate;

    public CentralAvailabilityService(RoomMongoRepository roomRepository,
                                      RoomBookingSlotMongoRepository bookingSlotRepository,
                                      MongoTemplate mongoTemplate) {
        this.roomRepository = roomRepository;
        this.bookingSlotRepository = bookingSlotRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public static class AvailabilityCheckResult {
        private final boolean isAvailable;
        private final String conflictSource; // "NONE", "TIMETABLE", "MAINTENANCE", "EXISTING_BOOKING"
        private final String details;

        public AvailabilityCheckResult(boolean isAvailable, String conflictSource, String details) {
            this.isAvailable = isAvailable;
            this.conflictSource = conflictSource;
            this.details = details;
        }

        public boolean isAvailable() { return isAvailable; }
        public String getConflictSource() { return conflictSource; }
        public String getDetails() { return details; }
    }

    /**
     * Checks availability across ALL THREE sources for a given room, date, and list of time slots.
     */
    public AvailabilityCheckResult checkMultiSlotAvailability(String roomId, String date, List<Integer> slotIds, String dayOfWeek) {
        if (slotIds == null || slotIds.isEmpty()) {
            return new AvailabilityCheckResult(false, "INVALID_REQUEST", "No slots provided");
        }

        for (int slotId : slotIds) {
            // Source 1: Check existing confirmed bookings in MongoDB
            if (bookingSlotRepository.existsByRoomIdAndBookingDateAndSlotId(roomId, date, slotId)) {
                return new AvailabilityCheckResult(
                        false,
                        "EXISTING_BOOKING",
                        String.format("Room %s is already reserved on %s during Slot %d.", roomId, date, slotId)
                );
            }

            // Source 2: Check maintenance blocks
            Query maintenanceQuery = new Query(Criteria.where("roomId").is(roomId)
                    .and("blockDate").is(date)
                    .and("slotId").is(slotId));
            if (mongoTemplate.exists(maintenanceQuery, "room_blocks")) {
                return new AvailabilityCheckResult(
                        false,
                        "MAINTENANCE",
                        String.format("Room %s is blocked for facility maintenance on %s during Slot %d.", roomId, date, slotId)
                );
            }

            // Source 3: Check regular class timetable
            if (dayOfWeek != null && !dayOfWeek.isBlank()) {
                Query timetableQuery = new Query(Criteria.where("roomId").is(roomId)
                        .and("dayOfWeek").regex(dayOfWeek, "i")
                        .and("slotId").is(slotId));
                if (mongoTemplate.exists(timetableQuery, "class_timetable")) {
                    return new AvailabilityCheckResult(
                            false,
                            "TIMETABLE",
                            String.format("Room %s has a scheduled academic class on %s during Slot %d.", roomId, dayOfWeek, slotId)
                    );
                }
            }
        }

        return new AvailabilityCheckResult(true, "NONE", "All requested slots are free and available.");
    }

    /**
     * Atomically commits a multi-slot room reservation using MongoDB unique compound index protection.
     */
    @Transactional
    public List<RoomBookingSlotDocument> commitMultiSlotReservation(String roomId,
                                                                   String date,
                                                                   List<Integer> slotIds,
                                                                   String bookingRequestId,
                                                                   String reservedBy) {
        // Pre-check
        AvailabilityCheckResult check = checkMultiSlotAvailability(roomId, date, slotIds, null);
        if (!check.isAvailable()) {
            throw new IllegalStateException("Cannot reserve room: " + check.getDetails());
        }

        List<RoomBookingSlotDocument> committedSlots = new ArrayList<>();

        try {
            for (int slotId : slotIds) {
                RoomBookingSlotDocument slotDoc = new RoomBookingSlotDocument(
                        roomId, date, slotId, bookingRequestId, "RESERVATION", reservedBy
                );
                committedSlots.add(bookingSlotRepository.save(slotDoc));
            }
        } catch (DuplicateKeyException ex) {
            // Race condition caught by MongoDB unique index: rolls back transaction!
            throw new IllegalStateException("Concurrency conflict: Room " + roomId + " was booked by another transaction during confirmation.");
        }

        return committedSlots;
    }
}

