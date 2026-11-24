package com.campusone.repository;

import com.campusone.model.FacultyAppointmentDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyAppointmentMongoRepository extends MongoRepository<FacultyAppointmentDocument, String> {
    List<FacultyAppointmentDocument> findByFacultyId(String facultyId);
    List<FacultyAppointmentDocument> findByStudentId(String studentId);
    List<FacultyAppointmentDocument> findByFacultyIdAndAppointmentDate(String facultyId, String appointmentDate);
    boolean existsByFacultyIdAndAppointmentDateAndSlotIdAndStatusIn(String facultyId, String appointmentDate, int slotId, List<String> statuses);
}

