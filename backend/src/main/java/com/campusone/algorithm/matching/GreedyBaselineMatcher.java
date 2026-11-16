package com.campusone.algorithm.matching;

import java.util.*;

/**
 * Greedy First-Fit Allocation Baseline (Comparative Baseline for Unit 5).
 *
 * Iterates through requests in order and assigns the first compatible,
 * currently unassigned room. Does not explore augmenting paths or backtrack.
 *
 * Used as an empirical baseline to demonstrate where and why Maximum Bipartite
 * Matching achieves superior allocation cardinality under slot contention.
 */
public class GreedyBaselineMatcher {

    public static class GreedyResult {
        private final int totalAllocations;
        private final Map<Integer, Integer> requestToRoomAssignments;
        private final List<Integer> unallocatedRequests;
        private final long executionTimeNs;

        public GreedyResult(int totalAllocations,
                            Map<Integer, Integer> requestToRoomAssignments,
                            List<Integer> unallocatedRequests,
                            long executionTimeNs) {
            this.totalAllocations = totalAllocations;
            this.requestToRoomAssignments = Collections.unmodifiableMap(requestToRoomAssignments);
            this.unallocatedRequests = Collections.unmodifiableList(unallocatedRequests);
            this.executionTimeNs = executionTimeNs;
        }

        public int getTotalAllocations() {
            return totalAllocations;
        }

        public Map<Integer, Integer> getRequestToRoomAssignments() {
            return requestToRoomAssignments;
        }

        public List<Integer> getUnallocatedRequests() {
            return unallocatedRequests;
        }

        public long getExecutionTimeNs() {
            return executionTimeNs;
        }
    }

    public GreedyResult computeGreedyMatching(int numRequests, int numRooms, List<Integer>[] adjList) {
        long startTime = System.nanoTime();

        if (numRequests <= 0 || numRooms <= 0 || adjList == null || adjList.length < numRequests) {
            return new GreedyResult(0, Collections.emptyMap(), Collections.emptyList(), System.nanoTime() - startTime);
        }

        boolean[] roomTaken = new boolean[numRooms];
        Map<Integer, Integer> assignments = new HashMap<>();
        List<Integer> unallocated = new ArrayList<>();

        for (int u = 0; u < numRequests; u++) {
            boolean allocated = false;
            if (adjList[u] != null) {
                for (int v : adjList[u]) {
                    if (v >= 0 && v < numRooms && !roomTaken[v]) {
                        roomTaken[v] = true;
                        assignments.put(u, v);
                        allocated = true;
                        break; // Greedy choice: take the very first available compatible room
                    }
                }
            }
            if (!allocated) {
                unallocated.add(u);
            }
        }

        long duration = System.nanoTime() - startTime;
        return new GreedyResult(assignments.size(), assignments, unallocated, duration);
    }
}
