package com.campusone.lostfound.repository;

import com.campusone.lostfound.model.LostFoundClaim;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LostFoundClaimRepository extends MongoRepository<LostFoundClaim, String> {
    Optional<LostFoundClaim> findByClaimId(String claimId);
    List<LostFoundClaim> findByReportIdOrderByCreatedAtDesc(String reportId);
    List<LostFoundClaim> findByClaimantEmailOrderByCreatedAtDesc(String claimantEmail);
    List<LostFoundClaim> findByStatusOrderByCreatedAtDesc(String status);
    boolean existsByReportIdAndStatus(String reportId, String status);
}

