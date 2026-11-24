package com.campusone.algorithm.trie;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Baseline Prefix Search implementation for benchmarking against Unit 4 Trie.
 * Performs a linear array scan with startsWith() check and sorting.
 * Time Complexity: O(N * L + K log K) for every search.
 */
public class LinearScanPrefixBaseline {

    private final List<Entry> entries = new ArrayList<>();

    public synchronized void insert(String term, int frequency) {
        if (term == null || term.isBlank()) return;
        String normalized = term.trim().toLowerCase();
        for (Entry e : entries) {
            if (e.normalized.equals(normalized)) {
                e.frequency = frequency;
                return;
            }
        }
        entries.add(new Entry(term.trim(), normalized, frequency));
    }

    public List<String> autocomplete(String prefix, int limit) {
        if (prefix == null || limit <= 0) return Collections.emptyList();
        String normalizedPrefix = prefix.trim().toLowerCase();

        List<Entry> matched = new ArrayList<>();
        for (Entry e : entries) {
            if (e.normalized.startsWith(normalizedPrefix)) {
                matched.add(e);
            }
        }

        matched.sort((a, b) -> {
            if (b.frequency != a.frequency) {
                return Integer.compare(b.frequency, a.frequency);
            }
            return a.canonical.compareToIgnoreCase(b.canonical);
        });

        List<String> results = new ArrayList<>();
        for (int i = 0; i < Math.min(limit, matched.size()); i++) {
            results.add(matched.get(i).canonical);
        }
        return results;
    }

    public void clear() {
        entries.clear();
    }

    private static class Entry {
        final String canonical;
        final String normalized;
        int frequency;

        Entry(String canonical, String normalized, int frequency) {
            this.canonical = canonical;
            this.normalized = normalized;
            this.frequency = frequency;
        }
    }
}

