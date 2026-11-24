package com.campusone.lostfound.repository;

import com.campusone.lostfound.model.ItemVocabulary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemVocabularyRepository extends MongoRepository<ItemVocabulary, String> {
    Optional<ItemVocabulary> findByNormalizedWord(String normalizedWord);
    List<ItemVocabulary> findAllByOrderByFrequencyDesc();
}

