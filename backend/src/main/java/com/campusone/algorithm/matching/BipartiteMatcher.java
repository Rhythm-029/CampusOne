package com.campusone.algorithm.matching;

import java.util.*;

/**
 * Maximum Bipartite Matching Algorithm (Unit 5 - Network & Matching).
 *
 * Implements the Augmenting Path algorithm via Depth-First Search (DFS)
 * to compute the maximum cardinality matching between booking requests (U)
 * and available campus rooms (V).
 *
 * Time Complexity: O(V * E) where V is the number of rooms and E is the number of compatibility edges.
 * Space Complexity: O(V + E) for adjacency representation and match tracking.
 */
public class BipartiteMatcher {

    public static class MatchingResult {
        private final int maxMatchingCardinality;
        private final Map<Integer, Integer> requestToRoomAssignments; // RequestId -> RoomId
        private final List<Integer> unallocatedRequests;
        private final long executionTimeNs;

        public MatchingResult(int maxMatchingCardinality,
                              Map<Integer, Integer> requestToRoomAssignments,
                              List<Integer> unallocatedRequests,
                              long executionTimeNs) {
            this.maxMatchingCardinality = maxMatchingCardinality;
            this.requestToRoomAssignments = Collections.unmodifiableMap(requestToRoomAssignments);
            this.unallocatedRequests = Collections.unmodifiableList(unallocatedRequests);
            this.executionTimeNs = executionTimeNs;
        }

        public int getMaxMatchingCardinality() {
            return maxMatchingCardinality;
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

    /**
     * Computes the Maximum Bipartite Matching.
     *
     * @param numRequests Total number of requests in partition U (indexed 0 to numRequests - 1).
     * @param numRooms    Total number of rooms in partition V (indexed 0 to numRooms - 1).
     * @param adjList     Compatibility adjacency list: adjList[u] contains all compatible room indices for request u.
     * @return MatchingResult containing assignment mapping and performance telemetry.
     */
    public MatchingResult computeMaximumMatching(int numRequests, int numRooms, List<Integer>[] adjList) {
        long startTime = System.nanoTime();

        if (numRequests <= 0 || numRooms <= 0 || adjList == null || adjList.length < numRequests) {
            return new MatchingResult(0, Collections.emptyMap(), Collections.emptyList(), System.nanoTime() - startTime);
        }

        // match[v] stores the request u matched with room v, or -1 if room v is currently unmatched.
        int[] match = new int[numRooms];
        Arrays.fill(match, -1);

        int maxMatching = 0;

        // Iterate through all requests and seek an augmenting path
        for (int u = 0; u < numRequests; u++) {
            boolean[] visited = new boolean[numRooms];
            if (findAugmentingPath(u, adjList, visited, match)) {
                maxMatching++;
            }
        }

        // Reconstruct assignments: request -> room
        Map<Integer, Integer> assignments = new HashMap<>();
        for (int v = 0; v < numRooms; v++) {
            if (match[v] != -1) {
                assignments.put(match[v], v);
            }
        }

        // Identify unallocated requests
        List<Integer> unallocated = new ArrayList<>();
        for (int u = 0; u < numRequests; u++) {
            if (!assignments.containsKey(u)) {
                unallocated.add(u);
            }
        }

        long duration = System.nanoTime() - startTime;
        return new MatchingResult(maxMatching, assignments, unallocated, duration);
    }

    /**
     * Depth-First Search to find an augmenting path from request u.
     */
    private boolean findAugmentingPath(int u, List<Integer>[] adjList, boolean[] visited, int[] match) {
        if (adjList[u] == null) {
            return false;
        }

        for (int v : adjList[u]) {
            // If room v has not been visited in the current DFS traversal
            if (!visited[v]) {
                visited[v] = true;

                // If room v is unmatched, or its currently matched request can find an alternate room
                if (match[v] < 0 || findAugmentingPath(match[v], adjList, visited, match)) {
                    match[v] = u;
                    return true;
                }
            }
        }
        return false;
    }
}
