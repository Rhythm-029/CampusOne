package com.campusone.lostfound.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "item_vocabulary")
public class ItemVocabulary {

    @Id
    private String id;

    @Indexed(unique = true)
    private String normalizedWord; // lowercased & trimmed

    private String displayTerm; // e.g. "Laptop (MacBook Pro)"
    private String category;
    private int frequency = 1;
    private String source = "SEED"; // "SEED", "REPORTS", "ADMIN"
    private Instant lastUpdated = Instant.now();

    public ItemVocabulary() {}

    public ItemVocabulary(String normalizedWord, String displayTerm, String category, int frequency, String source) {
        this.normalizedWord = normalizedWord;
        this.displayTerm = displayTerm;
        this.category = category;
        this.frequency = frequency;
        this.source = source;
        this.lastUpdated = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNormalizedWord() { return normalizedWord; }
    public void setNormalizedWord(String normalizedWord) { this.normalizedWord = normalizedWord; }
    public String getDisplayTerm() { return displayTerm; }
    public void setDisplayTerm(String displayTerm) { this.displayTerm = displayTerm; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public int getFrequency() { return frequency; }
    public void setFrequency(int frequency) { this.frequency = frequency; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Instant getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(Instant lastUpdated) { this.lastUpdated = lastUpdated; }
}

