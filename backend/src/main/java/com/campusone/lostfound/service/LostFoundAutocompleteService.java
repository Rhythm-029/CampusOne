package com.campusone.lostfound.service;

import com.campusone.algorithm.trie.Trie;
import com.campusone.lostfound.model.ItemVocabulary;
import com.campusone.lostfound.model.LostFoundReport;
import com.campusone.lostfound.repository.ItemVocabularyRepository;
import com.campusone.lostfound.repository.LostFoundReportRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LostFoundAutocompleteService {

    private final Trie trie;
    private final ItemVocabularyRepository itemVocabularyRepository;
    private final LostFoundReportRepository lostFoundReportRepository;

    public LostFoundAutocompleteService(ItemVocabularyRepository itemVocabularyRepository,
                                        LostFoundReportRepository lostFoundReportRepository) {
        this.trie = new Trie();
        this.itemVocabularyRepository = itemVocabularyRepository;
        this.lostFoundReportRepository = lostFoundReportRepository;
    }

    @PostConstruct
    public void initTrieFromDatabase() {
        // 1. Seed instant in-memory vocabulary so autocomplete is immediately available
        seedDefaultVocabulary();

        // 2. Sync with database asynchronously in background
        new Thread(() -> {
            try {
                rebuildTrie();
            } catch (Exception ex) {
                System.err.println("[WARN] Initial Trie sync deferred due to connectivity: " + ex.getMessage());
            }
        }, "trie-init-thread").start();
    }

    private void seedDefaultVocabulary() {
        trie.insert("Laptop", 40);
        trie.insert("Laptop Charger", 30);
        trie.insert("Laptop Sleeve", 25);
        trie.insert("Laptop Bag", 20);
        trie.insert("MacBook Pro", 28);
        trie.insert("MacBook Air", 26);
        trie.insert("Apple AirPods", 32);
        trie.insert("Student ID Card", 50);
        trie.insert("Scientific Calculator (Casio)", 18);
        trie.insert("Water Bottle", 21);
        trie.insert("Wireless Mouse", 15);
    }

    public synchronized void rebuildTrie() {
        trie.clear();

        // 1. Load admin-managed item vocabulary
        List<ItemVocabulary> vocabularyList = itemVocabularyRepository.findAll();
        for (ItemVocabulary iv : vocabularyList) {
            trie.insert(iv.getDisplayTerm(), iv.getFrequency());
            if (iv.getNormalizedWord() != null && !iv.getNormalizedWord().equalsIgnoreCase(iv.getDisplayTerm())) {
                trie.insert(iv.getNormalizedWord(), iv.getFrequency());
            }
        }

        // 2. Aggregate active report item names
        List<LostFoundReport> reports = lostFoundReportRepository.findAll();
        for (LostFoundReport r : reports) {
            if (!"WITHDRAWN".equalsIgnoreCase(r.getStatus()) && r.getItemName() != null && !r.getItemName().isBlank()) {
                trie.incrementFrequency(r.getItemName());
            }
        }
    }

    public List<String> autocomplete(String prefix, int limit) {
        if (prefix == null || prefix.trim().isEmpty()) {
            return List.of();
        }
        return trie.autocomplete(prefix.trim(), Math.min(limit, 10));
    }

    public void registerNewItem(String itemName, String category) {
        if (itemName == null || itemName.isBlank()) return;
        trie.incrementFrequency(itemName.trim());

        String normalized = Trie.normalize(itemName);
        itemVocabularyRepository.findByNormalizedWord(normalized).ifPresentOrElse(
                existing -> {
                    existing.setFrequency(existing.getFrequency() + 1);
                    itemVocabularyRepository.save(existing);
                },
                () -> {
                    ItemVocabulary newVocab = new ItemVocabulary(normalized, itemName.trim(), category, 1, "REPORTS");
                    itemVocabularyRepository.save(newVocab);
                }
        );
    }

    public void unregisterItem(String itemName) {
        if (itemName == null || itemName.isBlank()) return;
        trie.decrementFrequency(itemName.trim());

        String normalized = Trie.normalize(itemName);
        itemVocabularyRepository.findByNormalizedWord(normalized).ifPresent(existing -> {
            if (existing.getFrequency() > 1) {
                existing.setFrequency(existing.getFrequency() - 1);
                itemVocabularyRepository.save(existing);
            }
        });
    }

    public int getTrieSize() {
        return trie.size();
    }
}

