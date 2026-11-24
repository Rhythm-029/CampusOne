package com.campusone.repository;

import com.campusone.model.RoomBookingSlotDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomBookingSlotMongoRepository extends MongoRepository<RoomBookingSlotDocument, String> {
    Optional<RoomBookingSlotDocument> findByRoomIdAndBookingDateAndSlotId(String roomId, String bookingDate, int slotId);
    List<RoomBookingSlotDocument> findByRoomIdAndBookingDate(String roomId, String bookingDate);
    List<RoomBookingSlotDocument> findByBookingDateAndSlotId(String bookingDate, int slotId);
    List<RoomBookingSlotDocument> findByBookingRequestId(String bookingRequestId);
    boolean existsByRoomIdAndBookingDateAndSlotId(String roomId, String bookingDate, int slotId);
}

