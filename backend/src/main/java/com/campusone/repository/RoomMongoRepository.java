package com.campusone.repository;

import com.campusone.model.RoomDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomMongoRepository extends MongoRepository<RoomDocument, String> {
    Optional<RoomDocument> findByRoomNumber(String roomNumber);
    List<RoomDocument> findByFloor(int floor);
    List<RoomDocument> findByActiveTrue();
}
