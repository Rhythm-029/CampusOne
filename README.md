# CampusOne

## University Space Allocation and Lost & Found Intelligence Platform

### Academic Context
- **Course**: Advanced Algorithms (CIA 3)
- **Academic Year**: 2026-2027 | Semester V (B.Tech Computer Science & AI / ML)
- **Institution**: ATLAS SkillTech University — uGDX School of Technology

---

## 1. Executive Summary

CampusOne is an academic enterprise platform designed to resolve university scheduling bottlenecks and campus item loss through custom algorithmic engines. The platform couples a responsive, multi-role user interface with high-performance Java algorithmic cores executed server-side.

The project addresses two distinct operational problems:
1. **Discrete Academic Space Allocation**: Resolving conflicts among student club events, guest lectures, and semester-long departmental timetables across multi-floor lecture halls, executive suites, and laboratories.
2. **Lost and Found Custody Lifecycle**: Providing prefix autocomplete, fast probabilistic verification, and chain-of-custody tracking from loss declaration to security handover.

---

## 2. Core Functional Modules

### Student Portal
- **Space Reservation Engine**: Submit room requests by selecting academic date, preferred facility, slot requirements, and expected capacity.
- **Weekly Timetable Matrix**: Visual weekly schedule covering Monday through Saturday across standard 8-period university slots.
- **Lost & Found Portal**: File loss reports with identifying marks, browse found items filtered by campus floor and category, and submit verified ownership claims with purchase invoices and unlock verification.
- **Live Campus Notice Feed**: Real-time broadcast channel receiving announcements from the Estate Directorate.

### Estate & Space Operations Console (Admin Portal)
- **Space Approvals Queue**: Live workflow to approve, reject, or flag space reservation requests with automated conflict checks against scheduled classes.
- **Timetable Matrix & CSV Uploader**: Interactive timetable grid supporting single-entry edits and bulk CSV ingestion with schema validation and error reporting.
- **Lost & Found Custody Registry**: Central registry for security officers to review submitted ownership claims, approve handovers, and maintain verified logs.
- **Campus Broadcast Manager**: Compose, pin, and publish campus-wide bulletins delivered to student terminals.

### Algorithm Benchmarking Suite
- Side-by-side performance benchmarking comparing exact graph-theoretic algorithms with greedy approximations, complete with execution timing and memory metrics.

---

## 3. Algorithm Specifications and Complexity Analysis

### 3.1 Maximum Bipartite Matching for Space Allocation

#### Problem Formulation
Let $U = \{u_1, u_2, \dots, u_m\}$ denote the set of pending reservation requests, and $V = \{v_1, v_2, \dots, v_n\}$ denote the available room-timeslot units. An edge $(u_i, v_j) \in E$ exists if and only if room $v_j$ satisfies the capacity, equipment, and timeslot constraints of request $u_i$. The objective is to compute a matching $M \subseteq E$ of maximum cardinality such that no two edges share a common vertex.

#### Implementations
1. **Augmenting Path Engine (Hopcroft-Karp / Ford-Fulkerson variant)**:
   - Uses Breadth-First Search (BFS) to identify shortest augmenting paths in the residual graph, followed by Depth-First Search (DFS) to augment matching cardinality.
   - **Time Complexity**: Worst-case $O(V \cdot E)$, optimized to $O(\sqrt{V} \cdot E)$ for unit networks.
   - **Optimality**: Guaranteed maximum cardinality matching.

2. **Greedy First-Fit Heuristic (Benchmark Baseline)**:
   - Sorts requests by constraint severity and allocates the first unoccupied compatible room.
   - **Time Complexity**: $O(U \cdot V)$.
   - **Trade-off**: Fast execution but susceptible to sub-optimal local choices that block subsequent allocations.

### 3.2 Segment Tree for Multi-Slot Interval Conflict Detection

#### Problem Formulation
University rooms operate on 8 continuous time slots per day. Club conclaves and academic workshops frequently request contiguous slot ranges (e.g., Slot 2 through Slot 5).

#### Implementation Details
- Built as a balanced binary tree over the discrete interval $[1, 8]$.
- Each node stores an occupancy bitmask and a maximum utilization value.
- **Query Complexity**: $O(\log N)$ to determine if an interval $[L, R]$ has any overlapping booking.
- **Update Complexity**: $O(\log N)$ to commit or release an allocation.
- **Space Complexity**: $O(N)$ where $N = 8$ leaves ($2N - 1$ total nodes).

### 3.3 Trie Data Structure for Prefix Search

#### Problem Formulation
Campus students searching the Lost & Found database require instant search-as-you-type autocomplete over item names, categories, and brands.

#### Implementation Details
- Standard 26-way / extended ASCII trie node with terminal flag and frequency metadata.
- **Lookup Complexity**: $O(L)$ where $L$ is the length of the query prefix, independent of the total item registry size $M$.
- **Benchmarked Against**: Linear string scan requiring $O(M \cdot L)$ operations.

### 3.4 Counting Bloom Filter for Custody Verification

#### Problem Formulation
Quickly determine whether a reported item tracking ID exists in the central custody ledger before initiating expensive database queries.

#### Implementation Details
- Utilizes $k$ independent hash functions (Murmur3 variants) over an $m$-bit array.
- Supports insertion, lookup, and safe deletion via 4-bit counters.
- **Properties**: Zero false negatives; false positive rate bounded by $p \approx (1 - e^{-kn/m})^k$.

---

## 4. Evaluator Quick Access and Test Credentials

The application provides a dedicated 1-click evaluator shortcut directly within the central login interface. Evaluators can inspect either portal without manually entering credentials.

### Evaluator Quick-Access Options
- **Test Student Portal**: Single click logs in as `Rhythm Singhal` (B.Tech CS & AI Batch 2028).
- **Test Admin Console**: Single click logs in as `Prof. Rajesh Verma` (Estate & Operations Directorate).

### Manual Credentials

| Role | Email Address | Password |
|---|---|---|
| Estate & Space Admin | `admin@atlasskilltech.university` | `Password123!` |
| Student 1 (Rhythm Singhal) | `rhythm.singhal.btech2028@atlasskilltech.university` | `Password123!` |
| Student 2 (Yashwardhan Singh) | `yashwardhan.singh.btech2028@atlasskilltech.university` | `Password123!` |
| Student 3 (Prathamesh Bhandare) | `prathamesh.bhandare.btech2028@atlasskilltech.university` | `Password123!` |
| New Students | Any valid email address | Any password (min 4 characters) |

New students can also register via the **Create Student Account** tab in the login dialog. Registration completes instantly and activates immediately.

---

## 5. Technology Stack and Architecture

```
CampusOne/
├── frontend/                     # Client application (Single Page App)
│   ├── src/
│   │   ├── components/auth/      # LoginModal, Authentication Provider
│   │   ├── features/landing/     # University Landing Page
│   │   ├── features/student/     # Student Portal (Spaces, Timetable, Feeds)
│   │   ├── features/admin/       # Admin Console (Approvals, Matrices, Custody)
│   │   ├── features/lostfound/   # Lost & Found Catalog and Claim Workflow
│   │   ├── App.jsx               # Root Router & Auth State Manager
│   │   └── main.jsx              # Entry point with ErrorBoundary
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json               # SPA rewrite rules for production
├── backend/                      # Server application (Spring Boot)
│   ├── src/main/java/com/campusone/
│   │   ├── algorithm/            # Pure Java algorithm engines
│   │   │   ├── BipartiteMatcher.java
│   │   │   ├── SegmentTree.java
│   │   │   ├── Trie.java
│   │   │   └── CountingBloomFilter.java
│   │   ├── auth/                 # Spring Security, BCrypt, JWT
│   │   └── spaces/               # REST Controllers, Entities, Repositories
│   ├── src/test/java/            # JUnit 5 standalone algorithm test suites
│   └── pom.xml
└── README.md
```

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide React icons.
- **Backend**: Java 17, Spring Boot 3.2, Spring Security, BCrypt, HMAC-SHA512 JWT.
- **Persistence**: Dual-mode architecture supporting embedded H2 for isolated verification and MongoDB Atlas / MySQL for enterprise multi-node deployment.
- **Deployment**: Vercel SPA continuous deployment linked with GitHub repository.

---

## 6. Local Setup and Installation

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 9 or higher)
- Java Development Kit (JDK 17 or higher, optional for full backend execution)
- Apache Maven (version 3.8 or higher, optional)

### Running the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite local development server
npm run dev
```

Open `http://localhost:5173` in your web browser.

### Running the Backend (Optional)

```bash
# Navigate to the backend directory
cd backend

# Compile and run the Spring Boot service
mvn spring-boot:run
```

The Spring Boot service runs on `http://localhost:8080`.

### Running Algorithm Test Suites

```bash
# Run standalone JUnit 5 unit tests verifying algorithm correctness
cd backend
mvn test
```

---

## 7. Timetable CSV Schema Specification

Administrators can update weekly room timetables via bulk CSV upload in the Admin Portal. The CSV file must adhere to the following format:

### Column Definitions
1. `room_id` (Integer or String): Physical room identifier (e.g., `205`, `213`, `313`, `105`, `701`).
2. `day_of_week` (String): Day name (`Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`).
3. `slot_id` (Integer, 1 through 8): Daily university time slot.
4. `course_code` (String): Official course code (e.g., `CS501`, `AI502`).
5. `course_name` (String): Descriptive course title.
6. `faculty_name` (String): Assigned professor or instructor.
7. `section` (String): Student cohort or division (e.g., `B.Tech CS AI-ML Sem V`).
8. `session_type` (String): Session format (`LECTURE`, `LAB`, `SEMINAR`, `WEEKEND_SESSION`).

### Sample CSV Row
```csv
room_id,day_of_week,slot_id,course_code,course_name,faculty_name,section,session_type
205,Monday,1,CS501,Advanced Algorithms,Prof. Nimesh Bumb,B.Tech CS AI-ML Sem V,LECTURE
```

A downloadable sample template is provided directly inside the Admin Portal CSV upload interface.

---

## 8. Development Team

- **Student Developer**: Rhythm Singhal
- **Roll Number**: B.Tech CS & AI (Batch 2028)
- **Institution**: ATLAS SkillTech University
