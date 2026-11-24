package com.campusone.algorithm.trie;

import java.util.HashMap;
import java.util.Map;

/**
 * Node for the Autocomplete Trie (Unit 4).
 * Stores outgoing character transitions and terminal frequency statistics.
 */
public class TrieNode {

    private final Map<Character, TrieNode> children = new HashMap<>();
    private boolean isEndOfWord = false;
    private int frequency = 0;
    private String canonicalTerm = null;

    public Map<Character, TrieNode> getChildren() {
        return children;
    }

    public boolean isEndOfWord() {
        return isEndOfWord;
    }

    public void setEndOfWord(boolean endOfWord) {
        isEndOfWord = endOfWord;
    }

    public int getFrequency() {
        return frequency;
    }

    public void setFrequency(int frequency) {
        this.frequency = frequency;
    }

    public void incrementFrequency(int delta) {
        this.frequency += delta;
        if (this.frequency <= 0) {
            this.frequency = 0;
            this.isEndOfWord = false;
        } else {
            this.isEndOfWord = true;
        }
    }

    public String getCanonicalTerm() {
        return canonicalTerm;
    }

    public void setCanonicalTerm(String canonicalTerm) {
        this.canonicalTerm = canonicalTerm;
    }
}

