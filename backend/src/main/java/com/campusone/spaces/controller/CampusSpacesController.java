package com.campusone.spaces.controller;

import com.campusone.algorithm.matching.BipartiteMatcher;
import com.campusone.algorithm.matching.GreedyBaselineMatcher;
import com.campusone.model.RoomBookingSlotDocument;
import com.campusone.model.RoomDocument;
import com.campusone.repository.RoomBookingSlotMongoRepository;
import com.campusone.repository.RoomMongoRepository;
import com.campusone.spaces.service.CentralAvailabilityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/spaces")
public class CampusSpacesController {

    private final RoomMongoRepository roomRepository;
    private final RoomBookingSlotMongoRepository bookingSlotRepository;
    private final CentralAvailabilityService availabilityService;

    public CampusSpacesController(RoomMongoRepository roomRepository,
                                  RoomBookingSlotMongoRepository bookingSlotRepository,
                                  CentralAvailabilityService availabilityService) {
        this.roomRepository = roomRepository;
        this.bookingSlotRepository = bookingSlotRepository;
        this.availabilityService = availabilityService;
    }

    /**
     * Get all verified rooms from MongoDB Atlas.
     */
    @GetMapping("/rooms")
    public ResponseEntity<List<RoomDocument>> getRooms(@RequestParam(value = "floor", required = false) Integer floor) {
        if (floor != null && floor >= 1 && floor <= 7) {
            return ResponseEntity.ok(roomRepository.findByFloor(floor));
        }
        return ResponseEntity.ok(roomRepository.findAll());
    }

    /**
     * Centralized multi-slot availability check across all 3 occupancy sources.
     */
    @PostMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(@RequestBody Map<String, Object> body) {
        String roomId = (String) body.get("roomId");
        String date = (String) body.get("date");
        String dayOfWeek = (String) body.get("dayOfWeek");
        @SuppressWarnings("unchecked")
        List<Integer> slots = (List<Integer>) body.get("slots");

        CentralAvailabilityService.AvailabilityCheckResult result =
                availabilityService.checkMultiSlotAvailability(roomId, date, slots, dayOfWeek);

        return ResponseEntity.ok(Map.of(
                "isAvailable", result.isAvailable(),
                "conflictSource", result.getConflictSource(),
                "details", result.getDetails()
        ));
    }

    /**
     * Multi-slot reservation commit with atomic MongoDB compound unique index.
     */
    @PostMapping("/book")
    public ResponseEntity<?> bookRoom(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String roomId = (String) body.get("roomId");
            String date = (String) body.get("date");
            @SuppressWarnings("unchecked")
            List<Integer> slots = (List<Integer>) body.get("slots");
            String userEmail = userDetails != null ? userDetails.getUsername() : "ananya.student@atlasskilltech.university";
            String reqId = "REQ-" + System.currentTimeMillis();

            List<RoomBookingSlotDocument> committed = availabilityService.commitMultiSlotReservation(
                    roomId, date, slots, reqId, userEmail
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "status", "CONFIRMED",
                    "bookingRequestId", reqId,
                    "committedSlotsCount", committed.size(),
                    "slots", committed
            ));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Live Unit 5 Maximum Bipartite Matching vs Greedy Baseline execution & comparison.
     */
    @PostMapping("/admin/bipartite-allocation")
    public ResponseEntity<?> runBipartiteAllocation(@RequestBody(required = false) Map<String, Object> payload) {
        List<RoomDocument> availableRooms = roomRepository.findAll();
        if (availableRooms.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No rooms configured in MongoDB Atlas"));
        }

        int requestCount = 20;
        int roomCount = availableRooms.size();

        @SuppressWarnings("unchecked")
        List<Integer>[] adjList = new ArrayList[requestCount];
        for (int i = 0; i < requestCount; i++) {
            adjList[i] = new ArrayList<>();
            int requestedCapacity = 30 + (i % 4) * 20; // 30, 50, 70, 90
            for (int r = 0; r < roomCount; r++) {
                if (availableRooms.get(r).getCapacity() >= requestedCapacity) {
                    adjList[i].add(r);
                }
            }
        }

        // Run Maximum Bipartite Matching
        BipartiteMatcher matcher = new BipartiteMatcher();
        BipartiteMatcher.MatchingResult bipartiteResult = matcher.computeMaximumMatching(requestCount, roomCount, adjList);

        // Run Greedy Baseline
        GreedyBaselineMatcher baselineMatcher = new GreedyBaselineMatcher();
        GreedyBaselineMatcher.GreedyResult greedyResult = baselineMatcher.computeGreedyMatching(requestCount, roomCount, adjList);

        Map<String, String> assignments = new LinkedHashMap<>();
        for (Map.Entry<Integer, Integer> entry : bipartiteResult.getRequestToRoomAssignments().entrySet()) {
            String reqName = "REQ-" + (entry.getKey() + 1);
            String roomName = availableRooms.get(entry.getValue()).getRoomNumber();
            assignments.put(reqName, "Room " + roomName);
        }

        Map<String, Object> results = new LinkedHashMap<>();
        results.put("algorithm", "Maximum Bipartite Matching (Augmenting Path DFS)");
        results.put("baseline", "Greedy First-Fit Heuristic");
        results.put("totalRequests", requestCount);
        results.put("bipartiteMatchesCount", bipartiteResult.getMaxMatchingCardinality());
        results.put("greedyMatchesCount", greedyResult.getMatchedCount());
        results.put("bipartiteRuntimeMs", bipartiteResult.getExecutionTimeNs() / 1_000_000.0);
        results.put("greedyRuntimeMs", greedyResult.getExecutionTimeNs() / 1_000_000.0);
        results.put("bipartiteAssignments", assignments);
        results.put("theoreticalComplexity", "Bipartite: O(V * E) vs Greedy: O(N log N)");

        return ResponseEntity.ok(results);
    }
}
