package com.campusone.algorithm;

import com.campusone.algorithm.tree.LinearRangeBaseline;
import com.campusone.algorithm.tree.SegmentTree;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Correctness, Lazy-Propagation, and Comparative Benchmark Test Suite
 * for Segment Tree with Lazy Propagation (Unit 3).
 *
 * Compliant with CIA 3 Faculty Guidelines (Section 5, Page 2).
 */
public class SegmentTreeTest {

    private SegmentTree segmentTree;
    private LinearRangeBaseline linearBaseline;
    private static final int DEFAULT_SLOTS = 8;

    @BeforeEach
    void setUp() {
        segmentTree = new SegmentTree(DEFAULT_SLOTS);
        linearBaseline = new LinearRangeBaseline(DEFAULT_SLOTS);
    }

    @Test
    @DisplayName("Test 1: Initial Empty State — All Slots Completely Free")
    void testInitialEmptyState() {
        assertTrue(segmentTree.isIntervalFree(1, 8), "Entire day interval [1, 8] must initially be free");
        assertEquals(0, segmentTree.queryOccupiedCount(1, 8));
        assertEquals(0, segmentTree.queryOccupiedCount(3, 5));
    }

    @Test
    @DisplayName("Test 2: Lazy Range Update & Partial Overlap Queries")
    void testLazyRangeUpdateAndPartialQueries() {
        // Reserve multi-slot workshop for Slots 2, 3, 4
        segmentTree.updateRange(2, 4, true);

        assertEquals(3, segmentTree.queryOccupiedCount(1, 8));
        assertEquals(3, segmentTree.queryOccupiedCount(2, 4));
        assertEquals(2, segmentTree.queryOccupiedCount(3, 4));
        assertEquals(1, segmentTree.queryOccupiedCount(4, 5));

        assertFalse(segmentTree.isIntervalFree(2, 4));
        assertFalse(segmentTree.isIntervalFree(1, 3)); // Slot 2 & 3 are busy
        assertTrue(segmentTree.isIntervalFree(5, 8));  // Slots 5-8 remain free
        assertTrue(segmentTree.isIntervalFree(1, 1));  // Slot 1 remains free
    }

    @Test
    @DisplayName("Test 3: Cancellation / Freeing Sub-Interval via Lazy Propagation")
    void testCancellationAndFreeingInterval() {
        // Occupy all slots [1, 8]
        segmentTree.updateRange(1, 8, true);
        assertEquals(8, segmentTree.queryOccupiedCount(1, 8));

        // Cancel booking for slots [3, 6]
        segmentTree.updateRange(3, 6, false);

        assertEquals(4, segmentTree.queryOccupiedCount(1, 8)); // 1, 2, 7, 8 occupied
        assertTrue(segmentTree.isIntervalFree(3, 6), "Interval [3, 6] must now be completely free");
        assertFalse(segmentTree.isIntervalFree(2, 3), "Slot 2 is still occupied");
    }

    @Test
    @DisplayName("Test 4 (Boundary/Edge): Single-Slot Queries & Out-of-Bounds Exceptions")
    void testBoundaryAndInvalidRanges() {
        // Single slot point query and update
        segmentTree.updateRange(8, 8, true);
        assertEquals(1, segmentTree.queryOccupiedCount(8, 8));
        assertFalse(segmentTree.isIntervalFree(8, 8));
        assertTrue(segmentTree.isIntervalFree(1, 7));

        // Invalid boundaries
        assertThrows(IllegalArgumentException.class, () -> segmentTree.queryOccupiedCount(0, 4));
        assertThrows(IllegalArgumentException.class, () -> segmentTree.queryOccupiedCount(1, 9));
        assertThrows(IllegalArgumentException.class, () -> segmentTree.queryOccupiedCount(5, 3)); // Left > Right
        assertThrows(IllegalArgumentException.class, () -> new SegmentTree(0));
    }

    @Test
    @DisplayName("Test 5: Randomized Differential Testing — 100% Parity with Linear Baseline")
    void testDifferentialTestingAgainstLinearBaseline() {
        int slots = 48; // Scaled resolution (half-hour slots across day)
        SegmentTree tree = new SegmentTree(slots);
        LinearRangeBaseline baseline = new LinearRangeBaseline(slots);
        Random rng = new Random(1337);

        for (int op = 0; op < 1000; op++) {
            int left = 1 + rng.nextInt(slots);
            int right = left + rng.nextInt(slots - left + 1);

            if (rng.nextBoolean()) {
                // Update operation
                boolean occupy = rng.nextBoolean();
                tree.updateRange(left, right, occupy);
                baseline.updateRange(left, right, occupy);
            } else {
                // Query operation
                int treeCount = tree.queryOccupiedCount(left, right);
                int baselineCount = baseline.queryOccupiedCount(left, right);
                assertEquals(baselineCount, treeCount,
                        String.format("Mismatch on range [%d, %d] at operation %d", left, right, op));

                boolean treeFree = tree.isIntervalFree(left, right);
                boolean baselineFree = baseline.isIntervalFree(left, right);
                assertEquals(baselineFree, treeFree,
                        String.format("Free state mismatch on range [%d, %d]", left, right));
            }
        }
    }

    @Test
    @DisplayName("Test 6: Scalability Benchmark Across 3 Slot Resolutions (S1=8, S2=48, S3=96)")
    void testScalabilityBenchmarkThreeResolutions() {
        int[] resolutions = {8, 48, 96};
        int numOperations = 50_000;
        Random rng = new Random(99);

        for (int s : resolutions) {
            SegmentTree tree = new SegmentTree(s);
            LinearRangeBaseline baseline = new LinearRangeBaseline(s);

            // Benchmark Segment Tree
            long startTree = System.nanoTime();
            for (int i = 0; i < numOperations; i++) {
                int left = 1 + rng.nextInt(s);
                int right = left + rng.nextInt(s - left + 1);
                if ((i & 1) == 0) {
                    tree.updateRange(left, right, true);
                } else {
                    tree.queryOccupiedCount(left, right);
                }
            }
            long treeDurationNs = System.nanoTime() - startTree;

            // Benchmark Linear Baseline
            rng.setSeed(99); // Reset seed for identical sequence
            long startBaseline = System.nanoTime();
            for (int i = 0; i < numOperations; i++) {
                int left = 1 + rng.nextInt(s);
                int right = left + rng.nextInt(s - left + 1);
                if ((i & 1) == 0) {
                    baseline.updateRange(left, right, true);
                } else {
                    baseline.queryOccupiedCount(left, right);
                }
            }
            long baselineDurationNs = System.nanoTime() - startBaseline;

            System.out.printf("[Range Benchmark S=%d (%d ops)] SegmentTree: %.2f ms | LinearBaseline: %.2f ms%n",
                    s, numOperations, treeDurationNs / 1_000_000.0, baselineDurationNs / 1_000_000.0);

            assertTrue(treeDurationNs > 0);
        }
    }
}

