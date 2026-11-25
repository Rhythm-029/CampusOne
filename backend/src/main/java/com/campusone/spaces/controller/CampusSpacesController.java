package com.campusone.spaces.controller;

import com.campusone.algorithm.matching.BipartiteMatcher;
import com.campusone.algorithm.matching.GreedyBaselineMatcher;
import com.campusone.model.CampusNotification;
import com.campusone.model.ClassTimetableDocument;
import com.campusone.model.ClubProposal;
import com.campusone.model.RoomBookingSlotDocument;
import com.campusone.model.RoomDocument;
import com.campusone.model.SpaceBookingRequest;
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
    private final List<ClassTimetableDocument> inMemoryTimetableFallback = Collections.synchronizedList(new ArrayList<>());
    private final List<SpaceBookingRequest> inMemorySpaceRequests = Collections.synchronizedList(new ArrayList<>());
    private final List<CampusNotification> inMemoryNotifications = Collections.synchronizedList(new ArrayList<>());
    private final List<ClubProposal> inMemoryProposals = Collections.synchronizedList(new ArrayList<>());

    public CampusSpacesController(RoomMongoRepository roomRepository,
                                  RoomBookingSlotMongoRepository bookingSlotRepository,
                                  CentralAvailabilityService availabilityService,
                                  ClassTimetableMongoRepository timetableRepository) {
        this.roomRepository = roomRepository;
        this.bookingSlotRepository = bookingSlotRepository;
        this.availabilityService = availabilityService;
        this.timetableRepository = timetableRepository;
        initFallbackSchedule();
        initDefaultRequestsAndBroadcasts();
    }

    private void initDefaultRequestsAndBroadcasts() {
        // Initial real-time space booking requests from the 3 student accounts
        inMemorySpaceRequests.addAll(List.of(
                new SpaceBookingRequest(
                        "REQ-2026-101",
                        "rhythm.singhal.btech2028@atlasskilltech.university",
                        "Rhythm Singhal",
                        "B.Tech CS & AI (Batch 2028)",
                        "205",
                        "Room 205 (Smart Classroom)",
                        "2026-02-26",
                        3,
                        "10:45 – 11:45",
                        45,
                        List.of("Projector", "Linux PCs"),
                        "Advanced Algorithms Capstone Group Presentation",
                        "PENDING_APPROVAL",
                        "Submitted to Estate Admin Review Queue",
                        "2026-02-24 10:30 AM",
                        false
                ),
                new SpaceBookingRequest(
                        "REQ-2026-102",
                        "yashwardhan.singh.btech2028@atlasskilltech.university",
                        "Yashwardhan Singh",
                        "B.Tech CS & AI (Batch 2028)",
                        "213",
                        "Room 213 (Special Auditorium)",
                        "2026-02-27",
                        5,
                        "13:30 – 14:30",
                        120,
                        List.of("PA Audio Mic", "Projector"),
                        "INC - The Corporate Club Speaker Conclave & Workshop",
                        "PENDING_APPROVAL",
                        "Awaiting Estate Admin Hall Review",
                        "2026-02-24 11:15 AM",
                        false
                ),
                new SpaceBookingRequest(
                        "REQ-2026-103",
                        "prathamesh.bhandare.btech2028@atlasskilltech.university",
                        "Prathamesh Bhandare",
                        "B.Tech CS & AI (Batch 2028)",
                        "101",
                        "Room 101 (Smart Classroom)",
                        "2026-02-25",
                        2,
                        "09:30 – 10:30",
                        50,
                        List.of("Smartboard"),
                        "Computer Networks Peer Code Review & Lab Prep",
                        "APPROVED",
                        "Approved by Prof. Rajesh Verma (Space Admin)",
                        "2026-02-24 09:00 AM",
                        false
                )
        ));

        // Initial broadcast notifications posted by Admin
        inMemoryNotifications.addAll(List.of(
                new CampusNotification(
                        "NOTIF-1",
                        "Floor 3 Highflyers Lab Audio System Maintenance",
                        "Rooms 301 to 305 audio systems are undergoing scheduled maintenance on Friday Slot 7 & 8. Bookings shifted to Floor 2.",
                        "MAINTENANCE",
                        "Prof. Rajesh Verma",
                        "admin@atlasskilltech.university",
                        "Today, 09:15 AM",
                        true
                ),
                new CampusNotification(
                        "NOTIF-2",
                        "Mid-Semester Space Reservations Open for All Cohorts",
                        "Students can now reserve verified academic classrooms on Floors 1-7 for project presentations through the Smart Allocation portal.",
                        "ACADEMIC",
                        "Prof. Rajesh Verma",
                        "admin@atlasskilltech.university",
                        "Yesterday, 04:30 PM",
                        false
                ),
                new CampusNotification(
                        "NOTIF-3",
                        "Weekend Industry Hackathon & Masterclass in Room 213",
                        "INC - The Corporate Club and Computer Science AI-ML cohorts will host the weekend masterclass in Auditorium 213 this Saturday.",
                        "EVENT",
                        "Prof. Nimesh Bumb",
                        "nimesh.bumb@atlasskilltech.university",
                        "2 days ago",
                        false
                )
        ));

        // Initial club proposals
        inMemoryProposals.addAll(List.of(
                new ClubProposal(
                        "PROP-01",
                        "INC - The corporate club",
                        "Corporate Mentorship & Resume Roasting Night",
                        "Interactive session connecting B.Tech 2028 students with corporate executives.",
                        "2026-03-05",
                        150,
                        "rhythm.singhal.btech2028@atlasskilltech.university",
                        "Rhythm Singhal",
                        "PENDING_APPROVAL",
                        "Under Student Affairs review",
                        "2026-02-24 12:00 PM"
                )
        ));
    }

    private void initFallbackSchedule() {
        String batch = "SEED-SEMESTER-V-2026";
        inMemoryTimetableFallback.addAll(List.of(
                new ClassTimetableDocument("205", "Monday", 1, "CS501", "Advanced Algorithms", "Prof. Nimesh Bumb", "B.Tech CS AI-ML Sem V", "LECTURE", batch),
                new ClassTimetableDocument("205", "Monday", 2, "CS501", "Advanced Algorithms", "Prof. Nimesh Bumb", "B.Tech CS AI-ML Sem V", "LECTURE", batch),
                new ClassTimetableDocument("105", "Monday", 3, "CS502", "Distributed Operating Systems", "Prof. Yogesh Jadhav", "B.Tech CS AI-ML Sem V", "LECTURE", batch),
                new ClassTimetableDocument("105", "Monday", 4, "CS502", "Distributed Operating Systems", "Prof. Yogesh Jadhav", "B.Tech CS AI-ML Sem V", "LECTURE", batch),
                new ClassTimetableDocument("213", "Monday", 5, "CS503", "Database Engineering & Scalability", "Prof. Kunal Meher", "B.Tech CS AI-ML Sem V", "LECTURE", batch),
                new ClassTimetableDocument("213", "Monday", 6, "CS503", "Database Engineering & Scalability", "Prof. Kunal Meher", "B.Tech CS AI-ML Sem V", "LECTURE", batch),

                new ClassTimetableDocument("101", "Tuesday", 1, "CS504", "Computer Networks & Security", "Prof. Rabindra Henry", "B.Tech CS AI-ML Sem V", "LECTURE", batch),
                new ClassTimetableDocument("101", "Tuesday", 2, "CS504", "Computer Networks & Security", "Prof. Rabindra Henry", "B.Tech CS AI-ML Sem V", "LECTURE", batch),
                new ClassTimetableDocument("205", "Tuesday", 3, "AI501", "Machine Learning & Deep Learning", "Prof. Lipika Majumdar", "B.Tech CS AI-ML Sem V", "LAB", batch),
                new ClassTimetableDocument("205", "Tuesday", 4, "AI501", "Machine Learning & Deep Learning", "Prof. Lipika Majumdar", "B.Tech CS AI-ML Sem V", "LAB", batch),
                new ClassTimetableDocument("313", "Tuesday", 5, "AI502", "Data Structures & System Design", "Prof. Mayank Srivastava", "B.Tech CS AI-ML Sem V", "LECTURE", batch),
                new ClassTimetableDocument("313", "Tuesday", 6, "AI502", "Data Structures & System Design", "Prof. Mayank Srivastava", "B.Tech CS AI-ML Sem V", "LECTURE", batch),

                new ClassTimetableDocument("105", "Wednesday", 1, "AI503", "Human-Computer Interaction & Design", "Prof. Maria Acharya", "B.Tech CS AI-ML Sem V", "LECTURE", batch),
                new ClassTimetableDocument("105", "Wednesday", 2, "AI503", "Human-Computer Interaction & Design", "Prof. Maria Acharya", "B.Tech CS AI-ML Sem V", "LECTURE", batch),
                new ClassTimetableDocument("205", "Wednesday", 3, "CS501", "Advanced Algorithms Tutorial", "Prof. Nimesh Bumb", "B.Tech CS AI-ML Sem V", "LECTURE", batch),
                new ClassTimetableDocument("701", "Wednesday", 7, "AI505", "Applied Mathematics & Optimization", "Prof. Amrita Banerjee", "B.Tech CS AI-ML Sem V", "SEMINAR", batch),
                new ClassTimetableDocument("701", "Wednesday", 8, "AI505", "Applied Mathematics & Optimization", "Prof. Amrita Banerjee", "B.Tech CS AI-ML Sem V", "SEMINAR", batch),

                new ClassTimetableDocument("101", "Thursday", 2, "CS502", "Distributed Systems Lab", "Prof. Yogesh Jadhav", "B.Tech CS AI-ML Sem V", "LAB", batch),
                new ClassTimetableDocument("101", "Thursday", 3, "CS502", "Distributed Systems Lab", "Prof. Yogesh Jadhav", "B.Tech CS AI-ML Sem V", "LAB", batch),
                new ClassTimetableDocument("213", "Thursday", 5, "AI501", "Deep Learning Research Seminar", "Prof. Lipika Majumdar", "B.Tech CS AI-ML Sem V", "LECTURE", batch),
                new ClassTimetableDocument("213", "Thursday", 6, "AI501", "Deep Learning Research Seminar", "Prof. Lipika Majumdar", "B.Tech CS AI-ML Sem V", "LECTURE", batch),

                new ClassTimetableDocument("313", "Friday", 1, "CS503", "Database Engineering Capstone", "Prof. Kunal Meher", "B.Tech CS AI-ML Sem V", "LAB", batch),
                new ClassTimetableDocument("313", "Friday", 2, "CS503", "Database Engineering Capstone", "Prof. Kunal Meher", "B.Tech CS AI-ML Sem V", "LAB", batch),
                new ClassTimetableDocument("205", "Friday", 5, "CS504", "Network Defense & Pentesting", "Prof. Rabindra Henry", "B.Tech CS AI-ML Sem V", "LAB", batch),
                new ClassTimetableDocument("205", "Friday", 6, "CS504", "Network Defense & Pentesting", "Prof. Rabindra Henry", "B.Tech CS AI-ML Sem V", "LAB", batch),

                new ClassTimetableDocument("213", "Saturday", 3, "CS590", "Weekend Industry Masterclass & Hackathon", "Prof. Nimesh Bumb", "All CS AI-ML", "WEEKEND_SESSION", batch),
                new ClassTimetableDocument("213", "Saturday", 4, "CS590", "Weekend Industry Masterclass & Hackathon", "Prof. Nimesh Bumb", "All CS AI-ML", "WEEKEND_SESSION", batch),
                new ClassTimetableDocument("701", "Saturday", 5, "AI591", "Weekend AI Research Colloquium", "Prof. Amrita Banerjee", "Capstone Teams", "WEEKEND_SESSION", batch),
                new ClassTimetableDocument("701", "Saturday", 6, "AI591", "Weekend AI Research Colloquium", "Prof. Amrita Banerjee", "Capstone Teams", "WEEKEND_SESSION", batch),

                new ClassTimetableDocument("213", "Sunday", 2, "CLUB-INC", "Corporate Leadership Conclave", "INC - The corporate club", "Open Campus", "WEEKEND_SESSION", batch),
                new ClassTimetableDocument("213", "Sunday", 3, "CLUB-INC", "Corporate Leadership Conclave", "INC - The corporate club", "Open Campus", "WEEKEND_SESSION", batch)
        ));

        // Asynchronously sync from MongoDB Atlas in background without blocking application
        Thread syncThread = new Thread(() -> {
            try {
                List<ClassTimetableDocument> docs = timetableRepository.findAll();
                if (docs != null && !docs.isEmpty()) {
                    synchronized (inMemoryTimetableFallback) {
                        inMemoryTimetableFallback.clear();
                        inMemoryTimetableFallback.addAll(docs);
                    }
                }
            } catch (Exception ignored) {}
        });
        syncThread.setDaemon(true);
        syncThread.setName("timetable-atlas-sync");
        syncThread.start();
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
        List<ClassTimetableDocument> filtered = new ArrayList<>();
        synchronized (inMemoryTimetableFallback) {
            for (ClassTimetableDocument doc : inMemoryTimetableFallback) {
                boolean matchRoom = (roomId == null || roomId.isBlank() || roomId.equalsIgnoreCase(doc.getRoomId()));
                boolean matchDay = (dayOfWeek == null || dayOfWeek.isBlank() || dayOfWeek.equalsIgnoreCase(doc.getDayOfWeek()));
                if (matchRoom && matchDay) {
                    filtered.add(doc);
                }
            }
        }
        return ResponseEntity.ok(filtered);
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
            
            // Check in-memory list for fast conflict check
            boolean exists = false;
            synchronized (inMemoryTimetableFallback) {
                exists = inMemoryTimetableFallback.stream().anyMatch(e ->
                        e.getRoomId().equalsIgnoreCase(entry.getRoomId()) &&
                        e.getDayOfWeek().equalsIgnoreCase(entry.getDayOfWeek()) &&
                        e.getSlotId().equals(entry.getSlotId()));
            }

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
                inMemoryTimetableFallback.add(entry);
            }
        }

        // Asynchronously persist to MongoDB Atlas without blocking HTTP response
        if (!toSave.isEmpty()) {
            new Thread(() -> {
                try {
                    timetableRepository.saveAll(toSave);
                } catch (Exception ignored) {}
            }).start();
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
        try {
            timetableRepository.deleteAll();
        } catch (Exception ignored) {}
        inMemoryTimetableFallback.clear();
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

    // =========================================================================
    // REAL-TIME STUDENT <-> ADMIN COMMUNICATION ENDPOINTS
    // =========================================================================

    /**
     * Get space booking requests (filterable by student email).
     */
    @GetMapping("/requests")
    public ResponseEntity<List<SpaceBookingRequest>> getBookingRequests(
            @RequestParam(value = "studentEmail", required = false) String studentEmail) {
        List<SpaceBookingRequest> result = new ArrayList<>();
        synchronized (inMemorySpaceRequests) {
            for (SpaceBookingRequest req : inMemorySpaceRequests) {
                if (studentEmail == null || studentEmail.isBlank() || studentEmail.equalsIgnoreCase(req.getStudentEmail())) {
                    result.add(req);
                }
            }
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Student submits a new space booking request in real-time.
     */
    @PostMapping("/requests")
    public ResponseEntity<SpaceBookingRequest> submitBookingRequest(@RequestBody SpaceBookingRequest request) {
        if (request.getId() == null || request.getId().isBlank()) {
            request.setId("REQ-2026-" + (100 + inMemorySpaceRequests.size() + 1));
        }
        if (request.getStatus() == null || request.getStatus().isBlank()) {
            request.setStatus("PENDING_APPROVAL");
        }
        if (request.getSubmittedAt() == null || request.getSubmittedAt().isBlank()) {
            request.setSubmittedAt("Just now");
        }
        if (request.getAdminNotes() == null || request.getAdminNotes().isBlank()) {
            request.setAdminNotes("Awaiting Space Admin review in real-time queue");
        }

        // Check availability against timetable and active bookings
        boolean hasConflict = false;
        if (request.getRoomId() != null && request.getDate() != null && request.getSlotId() != null) {
            try {
                CentralAvailabilityService.AvailabilityCheckResult check =
                        availabilityService.checkMultiSlotAvailability(
                                request.getRoomId(),
                                request.getDate(),
                                List.of(request.getSlotId()),
                                "Monday"
                        );
                hasConflict = !check.isAvailable();
            } catch (Exception ignored) {}
        }
        request.setConflict(hasConflict);

        inMemorySpaceRequests.add(0, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(request);
    }

    /**
     * Admin approves or rejects a space booking request in real-time.
     */
    @PatchMapping("/requests/{id}/status")
    public ResponseEntity<?> updateBookingRequestStatus(
            @PathVariable("id") String id,
            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        String notes = body.get("adminNotes");

        SpaceBookingRequest target = null;
        synchronized (inMemorySpaceRequests) {
            for (SpaceBookingRequest req : inMemorySpaceRequests) {
                if (req.getId().equalsIgnoreCase(id)) {
                    target = req;
                    if (newStatus != null && !newStatus.isBlank()) {
                        req.setStatus(newStatus.toUpperCase());
                    }
                    if (notes != null && !notes.isBlank()) {
                        req.setAdminNotes(notes);
                    }
                    break;
                }
            }
        }

        if (target == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Request not found: " + id));
        }

        // If approved, commit the room booking slot reservation
        if ("APPROVED".equalsIgnoreCase(newStatus)) {
            try {
                if (target.getRoomId() != null && target.getDate() != null && target.getSlotId() != null) {
                    availabilityService.commitMultiSlotReservation(
                            target.getRoomId(),
                            target.getDate(),
                            List.of(target.getSlotId()),
                            target.getId(),
                            target.getStudentEmail()
                    );
                }
            } catch (Exception ignored) {}
        }

        return ResponseEntity.ok(target);
    }

    /**
     * Get campus broadcast notifications posted by Admin.
     */
    @GetMapping("/notifications")
    public ResponseEntity<List<CampusNotification>> getNotifications() {
        return ResponseEntity.ok(new ArrayList<>(inMemoryNotifications));
    }

    /**
     * Admin broadcasts a new campus announcement in real-time.
     */
    @PostMapping("/notifications")
    public ResponseEntity<CampusNotification> createNotification(@RequestBody CampusNotification notif) {
        if (notif.getId() == null || notif.getId().isBlank()) {
            notif.setId("NOTIF-" + System.currentTimeMillis());
        }
        if (notif.getCreatedAt() == null || notif.getCreatedAt().isBlank()) {
            notif.setCreatedAt("Just now");
        }
        if (notif.getAuthorName() == null || notif.getAuthorName().isBlank()) {
            notif.setAuthorName("Prof. Rajesh Verma (Space Admin)");
        }
        if (notif.getAuthorEmail() == null || notif.getAuthorEmail().isBlank()) {
            notif.setAuthorEmail("admin@atlasskilltech.university");
        }
        inMemoryNotifications.add(0, notif);
        return ResponseEntity.status(HttpStatus.CREATED).body(notif);
    }

    /**
     * Admin deletes a broadcast announcement.
     */
    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable("id") String id) {
        inMemoryNotifications.removeIf(n -> n.getId().equalsIgnoreCase(id));
        return ResponseEntity.ok(Map.of("message", "Notification deleted", "id", id));
    }

    /**
     * Get club event proposals.
     */
    @GetMapping("/proposals")
    public ResponseEntity<List<ClubProposal>> getClubProposals() {
        return ResponseEntity.ok(new ArrayList<>(inMemoryProposals));
    }

    /**
     * Student submits a club proposal in real-time.
     */
    @PostMapping("/proposals")
    public ResponseEntity<ClubProposal> submitClubProposal(@RequestBody ClubProposal proposal) {
        if (proposal.getId() == null || proposal.getId().isBlank()) {
            proposal.setId("PROP-" + (inMemoryProposals.size() + 1));
        }
        if (proposal.getStatus() == null || proposal.getStatus().isBlank()) {
            proposal.setStatus("PENDING_APPROVAL");
        }
        if (proposal.getSubmittedAt() == null || proposal.getSubmittedAt().isBlank()) {
            proposal.setSubmittedAt("Just now");
        }
        inMemoryProposals.add(0, proposal);
        return ResponseEntity.status(HttpStatus.CREATED).body(proposal);
    }

    /**
     * Admin approves/rejects a club proposal in real-time.
     */
    @PatchMapping("/proposals/{id}/status")
    public ResponseEntity<?> updateProposalStatus(
            @PathVariable("id") String id,
            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        String notes = body.get("adminNotes");

        ClubProposal target = null;
        synchronized (inMemoryProposals) {
            for (ClubProposal prop : inMemoryProposals) {
                if (prop.getId().equalsIgnoreCase(id)) {
                    target = prop;
                    if (newStatus != null && !newStatus.isBlank()) {
                        prop.setStatus(newStatus.toUpperCase());
                    }
                    if (notes != null && !notes.isBlank()) {
                        prop.setAdminNotes(notes);
                    }
                    break;
                }
            }
        }

        if (target == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Proposal not found: " + id));
        }
        return ResponseEntity.ok(target);
    }
}
