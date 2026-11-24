package com.campusone.algorithm;

import com.campusone.algorithm.bloom.BloomFilter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class BloomFilterTest {

    private BloomFilter<String> bloomFilter;

    @BeforeEach
    void setUp() {
        // Optimal for 1,000 elements with target 1% false positive rate
        bloomFilter = BloomFilter.optimal(1000, 0.01);
    }

    @Test
    @DisplayName("Unit 6 Bloom Filter: Zero False Negatives Guarantee")
    void testZeroFalseNegatives() {
        String[] reportIds = { "LF-2026-001", "LF-2026-002", "LF-2026-081", "LF-2026-999" };
        for (String id : reportIds) {
            bloomFilter.add(id);
        }

        for (String id : reportIds) {
            assertTrue(bloomFilter.mightContain(id),
                    "Bloom Filter must NEVER produce false negatives for added elements: " + id);
        }
    }

    @Test
    @DisplayName("Unit 6 Bloom Filter: Negative Lookups Screen Non-Existent IDs")
    void testNegativeLookupsScreenCorrectly() {
        bloomFilter.add("LF-2026-001");
        bloomFilter.add("LF-2026-002");

        // These IDs were never inserted
        assertFalse(bloomFilter.mightContain("NON-EXISTENT-ID-123456789"));
        assertFalse(bloomFilter.mightContain("INTRUDER-99999"));
    }

    @Test
    @DisplayName("Unit 6 Bloom Filter: Uncertain Synchronization Forces Fallback to DB")
    void testUncertainSyncFallback() {
        bloomFilter.add("LF-2026-001");
        assertFalse(bloomFilter.mightContain("UNTRACKED-ID-888"));

        // Mark sync as uncertain (e.g. during background rebuild or report deletion)
        bloomFilter.setSynchronized(false);

        // Safe query must return true to prevent false-negative 404
        assertTrue(bloomFilter.safeMightContain("UNTRACKED-ID-888"),
                "When sync is uncertain, filter must return true to force authoritative MongoDB check");
    }

    @Test
    @DisplayName("Unit 6 Bloom Filter: Clear Resets Bitset and Counts")
    void testClear() {
        bloomFilter.add("LF-2026-001");
        assertTrue(bloomFilter.mightContain("LF-2026-001"));

        bloomFilter.clear();
        assertEquals(0, bloomFilter.getElementCount());
        assertTrue(bloomFilter.isSynchronized());
        assertFalse(bloomFilter.mightContain("LF-2026-001"));
    }

    @Test
    @DisplayName("Unit 6 Bloom Filter: Theoretical vs Empirical False Positive Rate Measurement")
    void testFalsePositiveRateMeasurements() {
        int[] datasetSizes = { 100, 500, 1000 };

        for (int n : datasetSizes) {
            BloomFilter<String> bf = BloomFilter.optimal(n, 0.02); // 2% target
            Set<String> inserted = new HashSet<>();

            for (int i = 0; i < n; i++) {
                String id = "LF-REPORT-" + i;
                bf.add(id);
                inserted.add(id);
            }

            // Test 10,000 non-existent items
            int testQueries = 10000;
            int falsePositives = 0;
            for (int q = 0; q < testQueries; q++) {
                String testId = "NON-EXISTENT-QUERY-" + q;
                if (bf.mightContain(testId)) {
                    falsePositives++;
                }
            }

            double empiricalFPR = (double) falsePositives / testQueries;
            double theoreticalFPR = bf.getTheoreticalFalsePositiveRate();

            System.out.printf("[Bloom Filter N=%d] Theoretical FPR: %.4f | Empirical FPR: %.4f (%d / %d false positives)%n",
                    n, theoreticalFPR, empiricalFPR, falsePositives, testQueries);

            // Empirical rate should be within reasonable bound of theoretical rate
            assertTrue(empiricalFPR < 0.06, "Empirical FPR must stay within acceptable bound (target 2%)");
        }
    }
}
