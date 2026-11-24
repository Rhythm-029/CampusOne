package com.campusone.repository;

import com.campusone.model.ClassTimetableDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassTimetableMongoRepository extends MongoRepository<ClassTimetableDocument, String> {

    List<ClassTimetableDocument> findByRoomId(String roomId);

    List<ClassTimetableDocument> findByDayOfWeekIgnoreCase(String dayOfWeek);

    List<ClassTimetableDocument> findByRoomIdAndDayOfWeekIgnoreCase(String roomId, String dayOfWeek);

    boolean existsByRoomIdAndDayOfWeekIgnoreCaseAndSlotId(String roomId, String dayOfWeek, Integer slotId);

    void deleteByImportBatchId(String importBatchId);
}

