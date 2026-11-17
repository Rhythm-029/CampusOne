package com.campusone.algorithm;

import com.campusone.algorithm.matching.BipartiteMatcher;
import com.campusone.algorithm.matching.GreedyBaselineMatcher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Correctness, Edge-Case, and Comparative Benchmark Test Suite
 * for Maximum Bipartite Matching (Unit 5).
 *
 * Compliant with CIA 3 Faculty Guidelines (Section 5, Page 2).
 */
public class BipartiteMatcherTest {

    private BipartiteMatcher matcher;
    private GreedyBaselineMatcher greedyBaseline;

    @BeforeEach
    void setUp() {
        matcher = new BipartiteMatcher();
        greedyBaseline = new GreedyBaselineMatcher();
    }

    @Test
    @DisplayName("Test 1: Standard Campus Batch Allocation — Verifies Perfect Matching")
    void testStandardCampusBatchAllocation() {
        // 4 requests, 4 rooms
        int numRequests = 4;
        int numRooms = 4;
        List<Integer>[] adj = new List[numRequests];
        adj[0] = Arrays.asList(0, 1);
        adj[1] = Arrays.asList(1, 2);
        adj[2] = Arrays.asList(2, 3);
        adj[3] = Arrays.asList(0, 3);

        BipartiteMatcher.MatchingResult result = matcher.computeMaximumMatching(numRequests, numRooms, adj);

        assertEquals(4, result.getMaxMatchingCardinality(), "All 4 requests should be assigned to compatible rooms");
        assertEquals(4, result.getRequestToRoomAssignments().size());
        assertTrue(result.getUnallocatedRequests().isEmpty(), "No unallocated requests should remain");

        // Verify each assigned room is unique
        Set<Integer> assignedRooms = new HashSet<>(result.getRequestToRoomAssignments().values());
        assertEquals(4, assignedRooms.size(), "Every assigned room must be uniquely occupied");
    }

    @Test
    @DisplayName("Test 2: Slot Contention Bottleneck — Multiple Requests Competing for Special Seminar Room")
    void testSlotContentionBottleneck() {
        // 3 requests (e.g. large presentations) all requiring room 0 (Special Room 213, cap 200)
        int numRequests = 3;
        int numRooms = 1;
        List<Integer>[] adj = new List[numRequests];
        adj[0] = Collections.singletonList(0);
        adj[1] = Collections.singletonList(0);
        adj[2] = Collections.singletonList(0);

        BipartiteMatcher.MatchingResult result = matcher.computeMaximumMatching(numRequests, numRooms, adj);

        assertEquals(1, result.getMaxMatchingCardinality(), "Only 1 request can be allocated to the single bottleneck room");
        assertEquals(1, result.getRequestToRoomAssignments().size());
        assertEquals(2, result.getUnallocatedRequests().size(), "Remaining 2 requests must be flagged as unallocated");
    }

    @Test
    @DisplayName("Test 3: Zero Compatibility & Disconnected Graph — Equipment Unmatched")
    void testZeroCompatibilityAndDisconnected() {
        int numRequests = 3;
        int numRooms = 3;
        List<Integer>[] adj = new List[numRequests];
        adj[0] = Collections.emptyList(); // No room meets equipment requirements
        adj[1] = Collections.singletonList(1);
        adj[2] = Collections.emptyList();

        BipartiteMatcher.MatchingResult result = matcher.computeMaximumMatching(numRequests, numRooms, adj);

        assertEquals(1, result.getMaxMatchingCardinality());
        assertEquals(1, (int) result.getRequestToRoomAssignments().get(1));
        assertEquals(2, result.getUnallocatedRequests().size());
        assertTrue(result.getUnallocatedRequests().contains(0));
        assertTrue(result.getUnallocatedRequests().contains(2));
    }

    @Test
    @DisplayName("Test 4 (Boundary/Edge): Empty and Malformed Inputs")
    void testBoundaryAndEmptyInputs() {
        // 0 requests, 0 rooms
        BipartiteMatcher.MatchingResult r1 = matcher.computeMaximumMatching(0, 0, new List[0]);
        assertEquals(0, r1.getMaxMatchingCardinality());

        // Null list
        BipartiteMatcher.MatchingResult r2 = matcher.computeMaximumMatching(5, 5, null);
        assertEquals(0, r2.getMaxMatchingCardinality());

        // Negative dimensions
        BipartiteMatcher.MatchingResult r3 = matcher.computeMaximumMatching(-1, 5, new List[0]);
        assertEquals(0, r3.getMaxMatchingCardinality());
    }

    @Test
    @DisplayName("Test 5: Baseline Comparison — Demonstrates Bipartite Matching Outperforming Greedy First-Fit")
    void testBipartiteMatchingOutperformsGreedyBaseline() {
        // Trap topology where greedy choice blocks an optimal global matching:
        // Request 0 can take Room 0 or Room 1
        // Request 1 can ONLY take Room 0
        //
        // Greedy first-fit:
        // Processes Request 0 -> greedily grabs Room 0.
        // Processes Request 1 -> Room 0 is already taken! Request 1 fails. Total = 1 allocation.
        //
        // Bipartite Matching (Augmenting Path):
        // Processes Request 0 -> matches Room 0.
        // Processes Request 1 -> pushes Request 0 to Room 1 (augmenting path), matches Request 1 to Room 0. Total = 2 allocations!

        int numRequests = 2;
        int numRooms = 2;
        List<Integer>[] adj = new List[numRequests];
        adj[0] = Arrays.asList(0, 1);
        adj[1] = Collections.singletonList(0);

        GreedyBaselineMatcher.GreedyResult greedyRes = greedyBaseline.computeGreedyMatching(numRequests, numRooms, adj);
        BipartiteMatcher.MatchingResult bpmRes = matcher.computeMaximumMatching(numRequests, numRooms, adj);

        assertEquals(1, greedyRes.getTotalAllocations(), "Greedy gets trapped into assigning Room 0 to Request 0");
        assertEquals(2, bpmRes.getMaxMatchingCardinality(), "Bipartite matching finds augmenting path to allocate both requests");
        assertTrue(bpmRes.getMaxMatchingCardinality() > greedyRes.getTotalAllocations(),
                "Bipartite matching must achieve strictly greater cardinality under this conflict topology");
    }

    @Test
    @DisplayName("Test 6: Scalability Benchmarking Across 3 Increasing Input Sizes (N1=20, N2=100, N3=500)")
    void testScalabilityBenchmarkingThreeSizes() {
        int[] sizes = {20, 100, 500};
        Random rng = new Random(42); // Deterministic seed for reproducible evaluation

        for (int n : sizes) {
            int numRequests = n;
            int numRooms = n;
            List<Integer>[] adj = new List[numRequests];

            for (int u = 0; u < numRequests; u++) {
                adj[u] = new ArrayList<>();
                // Each request is compatible with 3 to 5 random rooms
                int roomDegree = 3 + rng.nextInt(3);
                for (int d = 0; d < roomDegree; d++) {
                    int v = rng.nextInt(numRooms);
                    if (!adj[u].contains(v)) {
                        adj[u].add(v);
                    }
                }
            }

            BipartiteMatcher.MatchingResult bpmResult = matcher.computeMaximumMatching(numRequests, numRooms, adj);
            GreedyBaselineMatcher.GreedyResult greedyResult = greedyBaseline.computeGreedyMatching(numRequests, numRooms, adj);

            assertTrue(bpmResult.getMaxMatchingCardinality() >= greedyResult.getTotalAllocations(),
                    "Bipartite matching must always be >= greedy heuristic cardinality");
            assertTrue(bpmResult.getExecutionTimeNs() > 0);

            System.out.printf("[Benchmark N=%d] Bipartite Matches: %d (in %.3f ms) | Greedy Matches: %d (in %.3f ms)%n",
                    n,
                    bpmResult.getMaxMatchingCardinality(),
                    bpmResult.getExecutionTimeNs() / 1_000_000.0,
                    greedyResult.getTotalAllocations(),
                    greedyResult.getExecutionTimeNs() / 1_000_000.0);
        }
    }
}

