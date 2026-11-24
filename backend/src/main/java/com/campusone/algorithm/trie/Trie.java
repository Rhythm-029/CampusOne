package com.campusone.algorithm.trie;

import java.util.*;

/**
 * Unit 4: Trie-based Autocomplete Data Structure implemented from scratch in pure Java.
 *
 * Provides prefix search for live item suggestions.
 * Suggestions are ranked primarily by stored occurrence frequency (descending)
 * and secondarily by alphabetical ordering (deterministic tie-breaking).
 *
 * Time Complexities:
 * - Insert / Update: O(L) where L is the term length.
 * - Prefix Search: O(P + K log K) where P is prefix length, and K is number of matched candidate terms.
 * Space Complexity: O(N * L * |Sigma|) where N is number of unique words, Sigma is alphabet size.
 */
public class Trie {

    private final TrieNode root;
    private int totalTermsCount;

    public Trie() {
        this.root = new TrieNode();
        this.totalTermsCount = 0;
    }

    public static String normalize(String input) {
        if (input == null) return "";
        return input.trim().toLowerCase().replaceAll("\\s+", " ");
    }

    /**
     * Inserts a term with a specified initial frequency into the Trie.
     */
    public synchronized void insert(String term, int initialFrequency) {
        if (term == null) return;
        String normalized = normalize(term);
        if (normalized.isEmpty()) return;

        TrieNode current = root;
        for (int i = 0; i < normalized.length(); i++) {
            char c = normalized.charAt(i);
            current = current.getChildren().computeIfAbsent(c, k -> new TrieNode());
        }

        if (!current.isEndOfWord()) {
            totalTermsCount++;
        }
        current.setEndOfWord(true);
        current.setFrequency(Math.max(1, initialFrequency));
        current.setCanonicalTerm(term.trim());
    }

    /**
     * Increments frequency of an existing term or inserts with frequency 1.
     */
    public synchronized void incrementFrequency(String term) {
        if (term == null) return;
        String normalized = normalize(term);
        if (normalized.isEmpty()) return;

        TrieNode current = root;
        for (int i = 0; i < normalized.length(); i++) {
            char c = normalized.charAt(i);
            current = current.getChildren().computeIfAbsent(c, k -> new TrieNode());
        }

        if (!current.isEndOfWord()) {
            totalTermsCount++;
            current.setEndOfWord(true);
            current.setFrequency(1);
            current.setCanonicalTerm(term.trim());
        } else {
            current.incrementFrequency(1);
        }
    }

    /**
     * Decrements frequency of a term (e.g. upon report deletion/withdrawal).
     * If frequency reaches 0, unsets end-of-word.
     */
    public synchronized void decrementFrequency(String term) {
        if (term == null) return;
        String normalized = normalize(term);
        if (normalized.isEmpty()) return;

        TrieNode current = root;
        for (int i = 0; i < normalized.length(); i++) {
            char c = normalized.charAt(i);
            current = current.getChildren().get(c);
            if (current == null) return;
        }

        if (current.isEndOfWord()) {
            current.incrementFrequency(-1);
            if (!current.isEndOfWord()) {
                totalTermsCount--;
            }
        }
    }

    /**
     * Autocomplete lookup: finds terms matching the prefix, ranked by frequency descending.
     *
     * @param prefix Search prefix
     * @param limit Maximum number of ranked suggestions to return
     * @return List of ranked suggested terms
     */
    public List<String> autocomplete(String prefix, int limit) {
        if (prefix == null || limit <= 0) return Collections.emptyList();
        String normalized = normalize(prefix);

        TrieNode current = root;
        for (int i = 0; i < normalized.length(); i++) {
            char c = normalized.charAt(i);
            current = current.getChildren().get(c);
            if (current == null) {
                return Collections.emptyList(); // Prefix not found
            }
        }

        PriorityQueue<TermCandidate> pq = new PriorityQueue<>(limit + 1, (a, b) -> {
            if (a.frequency != b.frequency) {
                return Integer.compare(a.frequency, b.frequency); // min-heap by frequency
            }
            return b.term.compareToIgnoreCase(a.term);
        });

        collectTopWords(current, pq, limit);

        LinkedList<String> results = new LinkedList<>();
        while (!pq.isEmpty()) {
            results.addFirst(pq.poll().term);
        }
        return results;
    }

    private void collectTopWords(TrieNode node, PriorityQueue<TermCandidate> pq, int limit) {
        if (node == null) return;
        if (node.isEndOfWord() && node.getCanonicalTerm() != null) {
            pq.offer(new TermCandidate(node.getCanonicalTerm(), node.getFrequency()));
            if (pq.size() > limit) {
                pq.poll();
            }
        }
        for (TrieNode child : node.getChildren().values()) {
            collectTopWords(child, pq, limit);
        }
    }

    public synchronized void clear() {
        root.getChildren().clear();
        totalTermsCount = 0;
    }

    public int size() {
        return totalTermsCount;
    }

    private static class TermCandidate {
        final String term;
        final int frequency;

        TermCandidate(String term, int frequency) {
            this.term = term;
            this.frequency = frequency;
        }
    }
}
