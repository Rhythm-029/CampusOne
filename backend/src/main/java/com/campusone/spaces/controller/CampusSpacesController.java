package com.campusone.spaces.controller;

import com.campusone.algorithm.matching.BipartiteMatcher;
import com.campusone.algorithm.matching.GreedyBaselineMatcher;
import com.campusone.model.ClassTimetableDocument;
import com.campusone.model.RoomBookingSlotDocument;
import com.campusone.model.RoomDocument;
import com.campusone.repository.ClassTimetableMongoRepository;
import com.campusone.repository.RoomBookingSlotMongoRepository;
import com.campusone.repository.RoomMongoRepository;
import com.campusone.spaces.service.CentralAvailabilityService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
    private final ClassTimetableMongoRepository timetableRepository;

    public CampusSpacesController(RoomMongoRepository roomRepository,
                                  RoomBookingSlotMongoRepository bookingSlotRepository,
                                  CentralAvailabilityService availabilityService,
                                  ClassTimetableMongoRepository timetableRepository) {
        this.roomRepository = roomRepository;
        this.bookingSlotRepository = bookingSlotRepository;
        this.availabilityService = availabilityService;
        this.timetableRepository = timetableRepository;
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
        results.put("greedyMatchesCount", greedyResult.getTotalAllocations());
        results.put("bipartiteRuntimeMs", bipartiteResult.getExecutionTimeNs() / 1_000_000.0);
        results.put("greedyRuntimeMs", greedyResult.getExecutionTimeNs() / 1_000_000.0);
        results.put("bipartiteAssignments", assignments);
        results.put("theoreticalComplexity", "Bipartite: O(V * E) vs Greedy: O(N log N)");

        return ResponseEntity.ok(results);
    }

    /**
     * Get all weekly timetable entries, optionally filtered by room and day.
     */
    @GetMapping("/timetable")
    public ResponseEntity<List<ClassTimetableDocument>> getTimetable(
            @RequestParam(value = "roomId", required = false) String roomId,
            @RequestParam(value = "dayOfWeek", required = false) String dayOfWeek) {
        if (roomId != null && !roomId.isBlank() && dayOfWeek != null && !dayOfWeek.isBlank()) {
            return ResponseEntity.ok(timetableRepository.findByRoomIdAndDayOfWeekIgnoreCase(roomId, dayOfWeek));
        } else if (roomId != null && !roomId.isBlank()) {
            return ResponseEntity.ok(timetableRepository.findByRoomId(roomId));
        } else if (dayOfWeek != null && !dayOfWeek.isBlank()) {
            return ResponseEntity.ok(timetableRepository.findByDayOfWeekIgnoreCase(dayOfWeek));
        }
        return ResponseEntity.ok(timetableRepository.findAll());
    }

    /**
     * Bulk upload / sync parsed CSV timetable entries into MongoDB Atlas.
     */
    @PostMapping("/timetable/bulk")
    public ResponseEntity<?> bulkImportTimetable(@RequestBody List<ClassTimetableDocument> entries) {
        if (entries == null || entries.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No timetable entries provided"));
        }

        String batchId = "BATCH-" + System.currentTimeMillis();
        List<ClassTimetableDocument> toSave = new ArrayList<>();
        List<Map<String, Object>> conflicts = new ArrayList<>();

        for (ClassTimetableDocument entry : entries) {
            if (entry.getRoomId() == null || entry.getDayOfWeek() == null || entry.getSlotId() == null) {
                continue;
            }
            entry.setImportBatchId(batchId);
            // Check if slot already occupied in timetable
            boolean exists = timetableRepository.existsByRoomIdAndDayOfWeekIgnoreCaseAndSlotId(
                    entry.getRoomId(), entry.getDayOfWeek(), entry.getSlotId()
            );
            if (exists) {
                conflicts.add(Map.of(
                        "roomId", entry.getRoomId(),
                        "dayOfWeek", entry.getDayOfWeek(),
                        "slotId", entry.getSlotId(),
                        "courseCode", entry.getCourseCode() != null ? entry.getCourseCode() : "",
                        "reason", "Room is already scheduled for this day and slot"
                ));
            } else {
                toSave.add(entry);
            }
        }

        if (!toSave.isEmpty()) {
            timetableRepository.saveAll(toSave);
        }

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "batchId", batchId,
                "savedCount", toSave.size(),
                "conflictCount", conflicts.size(),
                "conflicts", conflicts,
                "totalSubmitted", entries.size()
        ));
    }

    /**
     * Clear all timetable entries.
     */
    @DeleteMapping("/timetable")
    public ResponseEntity<?> clearTimetable() {
        timetableRepository.deleteAll();
        return ResponseEntity.ok(Map.of("message", "All timetable entries cleared from MongoDB Atlas"));
    }

    /**
     * Download the standardized CSV template.
     */
    @GetMapping(value = "/timetable/template.csv", produces = "text/csv")
    public ResponseEntity<String> getCsvTemplate() {
        String csv = "room_id,day_of_week,slot_id,course_code,course_name,faculty_name,section,session_type\n" +
                "205,Monday,1,CS501,Advanced Algorithms,Prof. Nimesh Bumb,B.Tech CS AI-ML Sem V,LECTURE\n" +
                "205,Monday,2,CS501,Advanced Algorithms,Prof. Nimesh Bumb,B.Tech CS AI-ML Sem V,LECTURE\n" +
                "105,Monday,3,CS502,Distributed Operating Systems,Prof. Yogesh Jadhav,B.Tech CS AI-ML Sem V,LECTURE\n" +
                "105,Monday,4,CS502,Distributed Operating Systems,Prof. Yogesh Jadhav,B.Tech CS AI-ML Sem V,LECTURE\n" +
                "213,Monday,5,CS503,Database Engineering & Scalability,Prof. Kunal Meher,B.Tech CS AI-ML Sem V,LECTURE\n" +
                "213,Monday,6,CS503,Database Engineering & Scalability,Prof. Kunal Meher,B.Tech CS AI-ML Sem V,LECTURE\n" +
                "101,Tuesday,1,CS504,Computer Networks & Security,Prof. Rabindra Henry,B.Tech CS AI-ML Sem V,LECTURE\n" +
                "101,Tuesday,2,CS504,Computer Networks & Security,Prof. Rabindra Henry,B.Tech CS AI-ML Sem V,LECTURE\n" +
                "205,Tuesday,3,AI501,Machine Learning & Deep Learning,Prof. Lipika Majumdar,B.Tech CS AI-ML Sem V,LAB\n" +
                "205,Tuesday,4,AI501,Machine Learning & Deep Learning,Prof. Lipika Majumdar,B.Tech CS AI-ML Sem V,LAB\n" +
                "313,Tuesday,5,AI502,Data Structures & System Design,Prof. Mayank Srivastava,B.Tech CS AI-ML Sem V,LECTURE\n" +
                "313,Tuesday,6,AI502,Data Structures & System Design,Prof. Mayank Srivastava,B.Tech CS AI-ML Sem V,LECTURE\n" +
                "105,Wednesday,1,AI503,Human-Computer Interaction & Design,Prof. Maria Acharya,B.Tech CS AI-ML Sem V,LECTURE\n" +
                "105,Wednesday,2,AI503,Human-Computer Interaction & Design,Prof. Maria Acharya,B.Tech CS AI-ML Sem V,LECTURE\n" +
                "701,Wednesday,7,AI505,Applied Mathematics & Optimization,Prof. Amrita Banerjee,B.Tech CS AI-ML Sem V,SEMINAR\n" +
                "701,Wednesday,8,AI505,Applied Mathematics & Optimization,Prof. Amrita Banerjee,B.Tech CS AI-ML Sem V,SEMINAR\n" +
                "213,Saturday,3,CS590,Weekend Industry Masterclass & Hackathon,Prof. Nimesh Bumb,All CS AI-ML,WEEKEND_SESSION\n" +
                "213,Saturday,4,CS590,Weekend Industry Masterclass & Hackathon,Prof. Nimesh Bumb,All CS AI-ML,WEEKEND_SESSION\n" +
                "701,Saturday,5,AI591,Weekend AI Research Colloquium,Prof. Amrita Banerjee,Capstone Teams,WEEKEND_SESSION\n" +
                "701,Saturday,6,AI591,Weekend AI Research Colloquium,Prof. Amrita Banerjee,Capstone Teams,WEEKEND_SESSION\n" +
                "213,Sunday,2,CLUB-INC,Corporate Leadership Conclave,INC - The corporate club,Open Campus,WEEKEND_SESSION\n" +
                "213,Sunday,3,CLUB-INC,Corporate Leadership Conclave,INC - The corporate club,Open Campus,WEEKEND_SESSION\n";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", "campusone_timetable_template.csv");
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        return new ResponseEntity<>(csv, headers, HttpStatus.OK);
    }
}
