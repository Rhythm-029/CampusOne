package com.campusone.lostfound.repository;

import com.campusone.lostfound.model.LostFoundReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LostFoundReportRepository extends MongoRepository<LostFoundReport, String> {
    Optional<LostFoundReport> findByReportId(String reportId);
    boolean existsByReportId(String reportId);
    List<LostFoundReport> findByReportTypeOrderByCreatedAtDesc(String reportType);
    List<LostFoundReport> findByReportedByUserIdOrderByCreatedAtDesc(String reportedByUserId);
    List<LostFoundReport> findByStatusOrderByCreatedAtDesc(String status);
    List<LostFoundReport> findByCategoryOrderByCreatedAtDesc(String category);
}
