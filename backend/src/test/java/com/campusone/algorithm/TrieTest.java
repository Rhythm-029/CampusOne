package com.campusone.algorithm;

import com.campusone.algorithm.trie.LinearScanPrefixBaseline;
import com.campusone.algorithm.trie.Trie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class TrieTest {

    private Trie trie;
    private LinearScanPrefixBaseline baseline;

    @BeforeEach
    void setUp() {
        trie = new Trie();
        baseline = new LinearScanPrefixBaseline();
    }

    @Test
    @DisplayName("Unit 4 Trie: Basic Insertion and Prefix Autocomplete")
    void testBasicInsertionAndAutocomplete() {
        trie.insert("Laptop", 5);
        trie.insert("Laptop Charger", 8);
        trie.insert("Laptop Sleeve", 3);
        trie.insert("Water Bottle", 10);

        List<String> suggestions = trie.autocomplete("la", 5);
        assertEquals(3, suggestions.size());
        // Ranked by frequency: Charger (8), Laptop (5), Sleeve (3)
        assertEquals("Laptop Charger", suggestions.get(0));
        assertEquals("Laptop", suggestions.get(1));
        assertEquals("Laptop Sleeve", suggestions.get(2));
    }

    @Test
    @DisplayName("Unit 4 Trie: Case Insensitivity and Whitespace Normalization")
    void testCaseAndWhitespaceNormalization() {
        trie.insert("  airpods pro  ", 4);
        trie.insert("AIRPODS MAX", 2);

        List<String> res1 = trie.autocomplete("air", 5);
        assertEquals(2, res1.size());
        assertEquals("airpods pro", res1.get(0));

        List<String> res2 = trie.autocomplete("  AIRPODS  ", 5);
        assertEquals(2, res2.size());
    }

    @Test
    @DisplayName("Unit 4 Trie: Frequency Increment and Dynamic Ranking Reorder")
    void testDynamicFrequencyUpdate() {
        trie.insert("Calculator Casio", 1);
        trie.insert("Calculator Texas Instruments", 5);

        List<String> initial = trie.autocomplete("calc", 2);
        assertEquals("Calculator Texas Instruments", initial.get(0));

        // Increment Casio multiple times
        trie.incrementFrequency("Calculator Casio");
        trie.incrementFrequency("Calculator Casio");
        trie.incrementFrequency("Calculator Casio");
        trie.incrementFrequency("Calculator Casio");
        trie.incrementFrequency("Calculator Casio");
        trie.incrementFrequency("Calculator Casio"); // frequency now 7

        List<String> updated = trie.autocomplete("calc", 2);
        assertEquals("Calculator Casio", updated.get(0));
    }

    @Test
    @DisplayName("Unit 4 Trie: Frequency Decrement and Word Pruning on Zero")
    void testFrequencyDecrement() {
        trie.insert("Student ID Card", 1);
        assertEquals(1, trie.autocomplete("student", 5).size());

        trie.decrementFrequency("Student ID Card");
        List<String> empty = trie.autocomplete("student", 5);
        assertTrue(empty.isEmpty(), "Term with frequency <= 0 should no longer appear in suggestions");
    }

    @Test
    @DisplayName("Unit 4 Trie: Non-Existent Prefix Returns Empty Gracefully")
    void testNonExistentPrefix() {
        trie.insert("Headphones", 3);
        List<String> suggestions = trie.autocomplete("xyz", 5);
        assertNotNull(suggestions);
        assertTrue(suggestions.isEmpty());
    }

    @Test
    @DisplayName("Unit 4 Trie: Scalability Benchmark (N=100, 1000, 10000) vs Linear Baseline")
    void testScalabilityBenchmark() {
        // Warm up JIT
        Trie warmTrie = new Trie();
        LinearScanPrefixBaseline warmBase = new LinearScanPrefixBaseline();
        for (int i = 0; i < 200; i++) {
            warmTrie.insert("warmup_" + i, i);
            warmBase.insert("warmup_" + i, i);
        }
        for (int i = 0; i < 500; i++) {
            warmTrie.autocomplete("warm", 5);
            warmBase.autocomplete("warm", 5);
        }

        int[] sizes = { 100, 1000, 10000 };

        for (int n : sizes) {
            Trie t = new Trie();
            LinearScanPrefixBaseline b = new LinearScanPrefixBaseline();

            for (int i = 0; i < n; i++) {
                String term = "item_" + (i % 50) + "_category_" + i;
                int freq = (i * 37) % 100 + 1;
                t.insert(term, freq);
                b.insert(term, freq);
            }

            int queryCount = 2000;
            String prefix = "item_1";

            // Benchmark Trie
            long startTrie = System.nanoTime();
            for (int q = 0; q < queryCount; q++) {
                t.autocomplete(prefix, 5);
            }
            long endTrie = System.nanoTime();
            double trieMs = (endTrie - startTrie) / 1_000_000.0;

            // Benchmark Baseline
            long startBase = System.nanoTime();
            for (int q = 0; q < queryCount; q++) {
                b.autocomplete(prefix, 5);
            }
            long endBase = System.nanoTime();
            double baseMs = (endBase - startBase) / 1_000_000.0;

            System.out.printf("[Trie Benchmark N=%d (%d queries)] Trie: %.2f ms | LinearBaseline: %.2f ms (%.1fx faster)%n",
                    n, queryCount, trieMs, baseMs, baseMs / Math.max(0.001, trieMs));

            assertTrue(trieMs > 0);
            assertTrue(baseMs > 0);
        }
    }
}
