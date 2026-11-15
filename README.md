# CampusOne

> **An Algorithm-Driven Campus Resource Allocation and Lost & Found Management System**  
> *Course:* Advanced Algorithms (CIA 3) — Academic Year 2026–27 | Semester V (B.Tech CS AI & ML)  
> *Institution:* ATLAS – uGDX | School of Technology  

---

## 1. Project Overview

CampusOne is a unified academic web application engineered to solve two high-friction university operational challenges through custom, server-side advanced algorithmic techniques:

1. **Campus Resource Allocation:** Discretized timeslot batch room allocation using a self-implemented **Maximum Bipartite Matching** engine (Augmenting Path / Hopcroft-Karp) benchmarked against a **Greedy First-Fit Heuristic**.
2. **Lost & Found Management:** Fast predictive prefix autocomplete via a custom **Trie** data structure (benchmarked against Linear Scan), paired with discrete report ID screening using a handcrafted **Bloom Filter** (probabilistic pre-screening with authoritative database verification to satisfy CO5).

---

## 2. Architecture & Design Principles

- **Strict Responsibility Boundaries:**
  - `frontend/`: React 18, Vite, Tailwind CSS, Lucide-React. Modern editorial typography, warm ivory palette, zero generic AI SaaS gradients.
  - `backend/`: Java 17+, Spring Boot 3.x REST architecture, Spring Data JPA, MySQL persistence.
  - `backend/.../algorithm/`: Pure Java algorithm engines with zero framework dependencies, covered by standalone JUnit 5 correctness suites.
- **Academic Compliance:** All assessed algorithms execute server-side in Java; no browser libraries or precomputed results.

---

## 3. Directory Structure

```
CampusOne/
├── README.md                                  # Root documentation & setup
├── .gitignore                                 # Git ignore definitions
├── docs/                                      # Reference specifications & guidelines
├── frontend/                                  # React + Vite application
│   ├── src/
│   │   ├── components/layout/                 # AppShell, Navbar, Sidebar
│   │   ├── components/ui/                     # Badge, Button, Card, Modal
│   │   └── features/                          # Allocation, Lost & Found, Benchmarks
└── backend/                                   # Spring Boot application (Milestone 2)
```

---

## 4. Getting Started (Frontend Development)

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Running Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to explore the application interface.

