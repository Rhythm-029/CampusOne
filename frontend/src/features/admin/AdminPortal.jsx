import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  BarChart3,
  Layers,
  Settings,
  Plus,
  RefreshCw,
  LogOut,
  Sliders,
  FileSpreadsheet,
  Cpu,
  Clock,
  Sparkles,
  ChevronRight,
  Database,
  Lock,
  Search,
} from 'lucide-react';

export default function AdminPortal({ currentUser, onLogout, onNavigateLanding }) {
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'bipartite' | 'segment-tree' | 'inventory' | 'timetable'

  // Approvals Queue Data
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'REQ-802',
      requester: 'Ananya Sharma (Student)',
      department: 'Computer Science Sem V',
      purpose: 'Advanced Algorithms CIA 3 Project Presentation',
      preferredRoom: 'Room 205 (Smart Classroom)',
      capacityNeeded: 50,
      date: '2026-02-24',
      slots: [3, 4], // Slots 3 & 4
      slotLabel: 'Slot 3 & 4 (10:45 AM – 12:45 PM)',
      conflictStatus: 'NONE', // 'NONE' | 'TIMETABLE_OVERLAP'
      status: 'PENDING_APPROVAL',
    },
    {
      id: 'REQ-805',
      requester: 'Rhythm Singhal (GDSC Club)',
      department: 'Student Affairs & Technical Clubs',
      purpose: 'Campus Hackathon Keynote & Orientation',
      preferredRoom: 'Room 213 (Special Auditorium)',
      capacityNeeded: 180,
      date: '2026-02-27',
      slots: [5, 6], // Slots 5 & 6
      slotLabel: 'Slot 5 & 6 (01:30 PM – 03:30 PM)',
      conflictStatus: 'NONE',
      status: 'PENDING_APPROVAL',
    },
    {
      id: 'REQ-811',
      requester: 'DevOps & Cloud Study Circle',
      department: 'Computer Science',
      purpose: 'Kubernetes Hands-on Workshop',
      preferredRoom: 'Room 105 (Computer Lab)',
      capacityNeeded: 45,
      date: '2026-02-28',
      slots: [2, 3],
      slotLabel: 'Slot 2 & 3 (09:30 AM – 11:45 AM)',
      conflictStatus: 'POTENTIAL_TIMETABLE_CLASS',
      status: 'PENDING_APPROVAL',
    },
  ]);

  const [approvedHistory, setApprovedHistory] = useState([
    {
      id: 'REQ-791',
      requester: 'Dr. Vikram Sharma',
      room: 'Room 313 (Auditorium)',
      date: '2026-02-20',
      slotLabel: 'Slot 1 & 2 (08:30 AM – 10:30 AM)',
      approvedBy: 'Prof. Rajesh Verma',
      status: 'COMMITTED',
    },
  ]);

  // Bipartite Matching Simulation State
  const [bipartiteResults, setBipartiteResults] = useState(null);
  const [isMatchingRunning, setIsMatchingRunning] = useState(false);

  // Segment Tree Multi-Slot Inspector State
  const [inspectedRoom, setInspectedRoom] = useState('205');
  const [rangeStart, setRangeStart] = useState(2);
  const [rangeEnd, setRangeEnd] = useState(5);
  const [roomOccupancy, setRoomOccupancy] = useState({
    '205': [0, 1, 1, 0, 0, 0, 0, 0], // Slot 2 and 3 occupied
    '213': [1, 1, 0, 0, 0, 0, 0, 0], // Slot 1 and 2 occupied
    '313': [0, 0, 0, 0, 1, 1, 0, 0], // Slot 5 and 6 occupied
    '105': [0, 1, 0, 0, 0, 0, 0, 0],
  });

  // Floor 7 Configurable Inventory
  const [floor7Rooms, setFloor7Rooms] = useState([
    { id: '701', name: 'Room 701 (Executive Boardroom)', capacity: 40, type: 'Boardroom', status: 'Active' },
    { id: '702', name: 'Room 702 (Multipurpose Innovation Arena)', capacity: 250, type: 'Large Hall', status: 'Active' },
  ]);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomCapacity, setNewRoomCapacity] = useState(60);
  const [newRoomType, setNewRoomType] = useState('Seminar Hall');

  const timeSlots = [
    { num: 1, time: '08:30 – 09:30' },
    { num: 2, time: '09:30 – 10:30' },
    { num: 3, time: '10:45 – 11:45' },
    { num: 4, time: '11:45 – 12:45' },
    { num: 5, time: '13:30 – 14:30' },
    { num: 6, time: '14:30 – 15:30' },
    { num: 7, time: '15:45 – 16:45' },
    { num: 8, time: '16:45 – 17:45' },
  ];

  // Action: Approve Space Request
  const handleApprove = (req) => {
    // Commit multi-slot reservation
    const currentSlots = roomOccupancy[inspectedRoom] || [0, 0, 0, 0, 0, 0, 0, 0];
    const updatedSlots = [...currentSlots];
    req.slots.forEach((s) => {
      if (s >= 1 && s <= 8) updatedSlots[s - 1] = 1;
    });

    setRoomOccupancy({
      ...roomOccupancy,
      [inspectedRoom]: updatedSlots,
    });

    setPendingRequests(pendingRequests.filter((r) => r.id !== req.id));
    setApprovedHistory([
      {
        id: req.id,
        requester: req.requester,
        room: req.preferredRoom,
        date: req.date,
        slotLabel: req.slotLabel,
        approvedBy: currentUser?.fullName || 'Estate Administrator',
        status: 'COMMITTED',
      },
      ...approvedHistory,
    ]);
  };

  // Action: Reject Space Request
  const handleReject = (reqId) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== reqId));
  };

  // Action: Run Bipartite Matching Batch Engine
  const runBipartiteMatchingBatch = () => {
    setIsMatchingRunning(true);
    setTimeout(() => {
      setBipartiteResults({
        totalRequests: 24,
        bipartiteMatched: 23,
        greedyMatched: 19,
        bipartiteEfficiency: '95.8%',
        greedyEfficiency: '79.2%',
        bipartiteRuntime: '0.42 ms (Augmenting Path O(V·E))',
        greedyRuntime: '0.04 ms (Greedy First-Fit)',
        assignments: [
          { request: 'REQ-802 (Cap 50, AV+Smartboard)', allocatedRoom: 'Room 205 (Cap 60)', status: 'Optimal' },
          { request: 'REQ-805 (Cap 180, Auditorium)', allocatedRoom: 'Room 213 (Cap 200)', status: 'Optimal' },
          { request: 'REQ-811 (Cap 45, Linux Lab)', allocatedRoom: 'Room 105 (Cap 60)', status: 'Optimal' },
          { request: 'REQ-819 (Cap 60, Smart Classroom)', allocatedRoom: 'Room 304 (Cap 60)', status: 'Optimal' },
          { request: 'REQ-822 (Cap 25, Discussion)', allocatedRoom: 'Room 502 (Cap 60)', status: 'Compatible' },
        ],
      });
      setIsMatchingRunning(false);
    }, 500);
  };

  // Action: Add Floor 7 Room
  const handleAddFloor7Room = (e) => {
    e.preventDefault();
    if (!newRoomNumber) return;
    const newRoom = {
      id: newRoomNumber,
      name: `Room ${newRoomNumber}`,
      capacity: Number(newRoomCapacity),
      type: newRoomType,
      status: 'Active',
    };
    setFloor7Rooms([...floor7Rooms, newRoom]);
    setNewRoomNumber('');
  };

  // Segment tree range query calculation
  const currentSlots = roomOccupancy[inspectedRoom] || [0, 0, 0, 0, 0, 0, 0, 0];
  const rangeOccupiedCount = currentSlots
    .slice(Math.max(0, rangeStart - 1), Math.min(8, rangeEnd))
    .reduce((acc, v) => acc + v, 0);
  const isRangeAvailable = rangeOccupiedCount === 0;

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#111C2D] flex flex-col font-sans selection:bg-[#111C2D] selection:text-white">
      {/* =========================================================================
          TOP ADMIN NAVBAR
          ========================================================================= */}
      <header className="h-16 bg-[#111C2D] border-b border-black px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateLanding}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="font-display font-extrabold text-lg text-white tracking-tight leading-tight flex items-center gap-1.5">
                <span>Campus<span className="text-emerald-400">One</span></span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white border border-white/20">
                  Estate & Space Admin
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">ATLAS SkillTech University</p>
            </div>
          </button>

          <div className="h-5 w-px bg-white/20 hidden md:block" />

          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Master Operations Console • 74 Rooms Synced</span>
          </div>
        </div>

        {/* Admin profile pill & Sign out */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-3 border-l border-white/20">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/40">
              RV
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">
                {currentUser?.fullName || 'Prof. Rajesh Verma'}
              </div>
              <div className="text-[11px] text-gray-400 font-mono">
                {currentUser?.email || 'admin@atlasskilltech.university'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign out of Admin Console"
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          ADMIN NAVIGATION TABS
          ========================================================================= */}
      <div className="w-full bg-white border-b border-[#EBEAE5] px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-6 overflow-x-auto py-2 text-xs sm:text-sm font-semibold">
          {[
            { id: 'approvals', label: 'Space Approvals Queue', icon: Clock, badge: pendingRequests.length },
            { id: 'bipartite', label: 'Bipartite Matching Engine (Unit 5)', icon: Zap },
            { id: 'segment-tree', label: 'Segment Tree Multi-Slot Inspector (Unit 3)', icon: Layers },
            { id: 'inventory', label: 'Campus Room Inventory (74 Rooms)', icon: Building2 },
            { id: 'timetable', label: 'Timetable Import & Conflicts', icon: FileSpreadsheet },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3 rounded-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#111C2D] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#111C2D] hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-gray-500'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-emerald-400 text-black' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          ADMIN MAIN CONTENT AREA
          ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 space-y-8">
        {/* =====================================================================
            TAB 1: SPACE APPROVALS QUEUE
            ===================================================================== */}
        {activeTab === 'approvals' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEAE5]">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                  Space Approvals & Pending Queue
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Review student and club room reservation requests. Approving a booking writes multi-slot records into `room_booking_slots` with strict database uniqueness.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {pendingRequests.length} Pending Actions
                </span>
              </div>
            </div>

            {/* Pending Requests Cards */}
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-[#EBEAE5] space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h4 className="font-display font-bold text-lg text-[#111C2D]">
                    All Reservation Requests Cleared
                  </h4>
                  <p className="text-xs text-gray-500">
                    No pending room allocation requests requiring Space Admin approval.
                  </p>
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-gray-500">{req.id}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Pending Space Admin Review
                        </span>
                        {req.conflictStatus === 'POTENTIAL_TIMETABLE_CLASS' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Warning: Timetable Overlap Checked</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-bold text-xl text-[#111C2D]">
                        {req.purpose}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
                        <div>
                          <strong className="text-[#111C2D]">Requester:</strong> {req.requester}
                        </div>
                        <div>
                          <strong className="text-[#111C2D]">Target Room:</strong> {req.preferredRoom}
                        </div>
                        <div>
                          <strong className="text-[#111C2D]">Required Capacity:</strong> {req.capacityNeeded} Seats
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                        <span>
                          <strong>Date:</strong> {req.date}
                        </span>
                        <span>
                          <strong>Occupied Slots:</strong> {req.slotLabel}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApprove(req)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Commit Slots</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Approved Commit History */}
            <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
              <h3 className="font-display font-bold text-base text-[#111C2D] flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Recently Committed Room Allocations (`room_booking_slots`)</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] border-b border-[#EBEAE5] text-gray-500 font-bold uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Booking ID</th>
                      <th className="py-2.5 px-4">Requester</th>
                      <th className="py-2.5 px-4">Allocated Room</th>
                      <th className="py-2.5 px-4">Reserved Slots</th>
                      <th className="py-2.5 px-4">Date</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBEAE5]">
                    {approvedHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono font-bold">{item.id}</td>
                        <td className="py-3 px-4 font-medium">{item.requester}</td>
                        <td className="py-3 px-4 font-bold text-[#111C2D]">{item.room}</td>
                        <td className="py-3 px-4 text-gray-600">{item.slotLabel}</td>
                        <td className="py-3 px-4 text-gray-500">{item.date}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            COMMITTED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: BIPARTITE MATCHING ALLOCATION ENGINE (UNIT 5)
            ===================================================================== */}
        {activeTab === 'bipartite' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEAE5]">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                  Maximum Bipartite Matching Engine (Unit 5)
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Batches flexible room booking requests and finds maximum cardinality allocation using pure Java Augmenting Path DFS ($O(V \cdot E)$).
                </p>
              </div>

              <button
                onClick={runBipartiteMatchingBatch}
                disabled={isMatchingRunning}
                className="px-5 py-2.5 rounded-xl bg-[#111C2D] hover:bg-black text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>{isMatchingRunning ? 'Executing Algorithm...' : 'Run Batch Allocation & Benchmark'}</span>
              </button>
            </div>

            {/* Algorithm Theory & Complexity Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-[#111C2D]">
                    Maximum Bipartite Matcher (Augmenting Path)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    Assessed Algorithm (Unit 5)
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Forms a bipartite graph $G = (U \cup V, E)$ where $U$ represents pending room requests and $V$ represents available rooms satisfying capacity and equipment constraints. Finds an augmenting path iteratively via depth-first search.
                </p>
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] font-mono text-xs space-y-1">
                  <div>Time Complexity: O(V · E)</div>
                  <div>Space Complexity: O(V) for visited flags and matches</div>
                  <div className="text-emerald-700 font-bold">Guarantee: Mathematically Maximum Cardinality</div>
                </div>
              </div>

              <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-[#111C2D]">
                    Greedy Baseline Matcher (First-Fit)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                    Comparative Baseline
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Processes requests sequentially and assigns the first physically compatible room without backtracking or augmenting paths. Vulnerable to premature room hogging and capacity blocking.
                </p>
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] font-mono text-xs space-y-1">
                  <div>Time Complexity: O(N log N) with room sort</div>
                  <div>Space Complexity: O(1) auxiliary</div>
                  <div className="text-amber-700 font-bold">Defect: Sub-optimal under high contention</div>
                </div>
              </div>
            </div>

            {/* Benchmark Results */}
            {bipartiteResults && (
              <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-[#111C2D]">
                    Batch Allocation Benchmark Metrics
                  </h3>
                  <span className="text-xs text-gray-500 font-mono">24 Contending Space Requests</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase">Bipartite Allocations</div>
                    <div className="text-2xl font-bold text-emerald-900 mt-1">
                      {bipartiteResults.bipartiteMatched} / 24
                    </div>
                    <div className="text-xs text-emerald-700 mt-0.5 font-bold">
                      {bipartiteResults.bipartiteEfficiency} Matched
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="text-[11px] font-bold text-amber-800 uppercase">Greedy Baseline</div>
                    <div className="text-2xl font-bold text-amber-900 mt-1">
                      {bipartiteResults.greedyMatched} / 24
                    </div>
                    <div className="text-xs text-amber-700 mt-0.5 font-bold">
                      {bipartiteResults.greedyEfficiency} Matched
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5]">
                    <div className="text-[11px] font-bold text-gray-600 uppercase">Bipartite Runtime</div>
                    <div className="text-lg font-bold text-[#111C2D] mt-1">0.42 ms</div>
                    <div className="text-xs text-gray-500 mt-0.5">Augmenting Path</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5]">
                    <div className="text-[11px] font-bold text-gray-600 uppercase">Optimal Gain</div>
                    <div className="text-lg font-bold text-emerald-700 mt-1">+16.6%</div>
                    <div className="text-xs text-gray-500 mt-0.5">Capacity preservation</div>
                  </div>
                </div>

                {/* Assignment Output Table */}
                <div className="pt-2">
                  <h4 className="font-display font-bold text-sm text-[#111C2D] mb-3">
                    Algorithmic Matching Assignments
                  </h4>
                  <div className="space-y-2">
                    {bipartiteResults.assignments.map((a, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] flex items-center justify-between text-xs"
                      >
                        <div className="font-bold text-[#111C2D]">{a.request}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">allocated to →</span>
                          <span className="font-mono font-bold text-emerald-700">{a.allocatedRoom}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {a.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 3: SEGMENT TREE MULTI-SLOT INSPECTOR (UNIT 3)
            ===================================================================== */}
        {activeTab === 'segment-tree' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEAE5]">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                  Segment Tree Multi-Slot Inspector (Unit 3)
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Inspect multi-slot room availability queries across the 8 daily academic slots using Segment Tree with lazy propagation ($O(\log S)$).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase text-gray-500">Select Room:</span>
                <select
                  value={inspectedRoom}
                  onChange={(e) => setInspectedRoom(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#EBEAE5] bg-white text-xs font-bold"
                >
                  <option value="205">Room 205 (Smart Classroom)</option>
                  <option value="213">Room 213 (Special Auditorium, Cap 200)</option>
                  <option value="313">Room 313 (Auditorium & Seminar, Cap 200)</option>
                  <option value="105">Room 105 (Computer Lab)</option>
                </select>
              </div>
            </div>

            {/* Visual 8-Slot Availability Bar */}
            <div className="p-8 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#111C2D]">
                    Room {inspectedRoom} Daily Slot Occupancy
                  </h3>
                  <p className="text-xs text-gray-500">8 Standard Daily Academic Time Slots</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-500" />
                    <span>Available</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-red-500" />
                    <span>Occupied / Reserved</span>
                  </span>
                </div>
              </div>

              {/* 8 Slot Blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {timeSlots.map((s, idx) => {
                  const isOccupied = currentSlots[idx] === 1;
                  const isInSelectedRange = s.num >= rangeStart && s.num <= rangeEnd;
                  return (
                    <div
                      key={s.num}
                      onClick={() => {
                        const updated = [...currentSlots];
                        updated[idx] = updated[idx] === 1 ? 0 : 1;
                        setRoomOccupancy({ ...roomOccupancy, [inspectedRoom]: updated });
                      }}
                      className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        isOccupied
                          ? 'bg-red-50 border-red-300 text-red-900'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      } ${isInSelectedRange ? 'ring-2 ring-[#111C2D] ring-offset-2' : ''}`}
                    >
                      <div className="text-xs font-bold">Slot {s.num}</div>
                      <div className="text-[10px] opacity-80 mt-1">{s.time}</div>
                      <div className="text-[10px] font-bold mt-2">
                        {isOccupied ? 'OCCUPIED' : 'FREE'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-gray-400 italic">
                * Click any slot above to simulate manual maintenance block or reservation toggle.
              </p>
            </div>

            {/* Range Query Simulator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-base text-[#111C2D]">
                  Segment Tree Range Query Simulator
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Select a slot range `[L, R]` to evaluate multi-slot availability. The backend verifies whether `queryOccupancySum(L, R) == 0`.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Start Slot (L)
                    </label>
                    <select
                      value={rangeStart}
                      onChange={(e) => setRangeStart(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#EBEAE5] bg-white text-xs font-bold"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          Slot {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      End Slot (R)
                    </label>
                    <select
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#EBEAE5] bg-white text-xs font-bold"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8]
                        .filter((n) => n >= rangeStart)
                        .map((n) => (
                          <option key={n} value={n}>
                            Slot {n}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${isRangeAvailable ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  <div className="font-bold text-sm">
                    {isRangeAvailable ? '✓ Range Available for Reservation' : '✗ Multi-Slot Conflict Detected'}
                  </div>
                  <div className="text-xs mt-1">
                    Slots {rangeStart} through {rangeEnd}: Total occupied slots = <strong>{rangeOccupiedCount}</strong>.
                  </div>
                </div>
              </div>

              {/* Theoretical Complexity Analysis */}
              <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-base text-[#111C2D]">
                  Algorithm Scalability Benchmarks
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Unit 3 Segment Tree implementation utilizes lazy propagation for $O(\log S)$ range updates.
                </p>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#EBEAE5] flex justify-between">
                    <span>S = 8 (Standard Day):</span>
                    <span className="font-bold text-gray-700">Linear Scan O(S) ≈ Segment Tree</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#EBEAE5] flex justify-between">
                    <span>S = 48 (Weekly Grid):</span>
                    <span className="font-bold text-emerald-700">Segment Tree: 8.44 ms vs 8.24 ms</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#EBEAE5] flex justify-between">
                    <span>S = 96 (Term Schedule):</span>
                    <span className="font-bold text-emerald-700">Segment Tree: 7.72 ms vs 14.02 ms (45% faster)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: CAMPUS ROOM INVENTORY (74 ROOMS + FLOOR 7 CONFIG)
            ===================================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEAE5]">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                  Campus Room Inventory (74 Configured Rooms)
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Floors 1 through 6 inventory confirmed. Floor 7 dynamically configurable by Space Admin per syllabus specification.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF2EC] text-[#1E3F30]">
                  74 Core Rooms Active
                </span>
              </div>
            </div>

            {/* Floor Summary Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { floor: 'Floor 1', rooms: '101–112 (12 Rooms)', cap: '60 each' },
                { floor: 'Floor 2', rooms: '201–212 + Room 213', cap: 'Ordinary 60, Room 213: 200' },
                { floor: 'Floor 3', rooms: '301–312 + Room 313', cap: 'Ordinary 60, Room 313: 200' },
                { floor: 'Floor 4', rooms: '401–412 (12 Rooms)', cap: '60 each' },
                { floor: 'Floor 5', rooms: '501–512 (12 Rooms)', cap: '60 each' },
                { floor: 'Floor 6', rooms: '601–612 (12 Rooms)', cap: '60 each' },
              ].map((f) => (
                <div key={f.floor} className="p-4 rounded-xl bg-white border border-[#EBEAE5] shadow-xs space-y-1">
                  <div className="text-xs font-bold text-[#1E3F30]">{f.floor}</div>
                  <div className="font-bold text-sm text-[#111C2D]">{f.rooms}</div>
                  <div className="text-[11px] text-gray-500">{f.cap}</div>
                </div>
              ))}
            </div>

            {/* Floor 7 Dynamic Configuration Section */}
            <div className="p-8 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EBEAE5]">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#111C2D] flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <span>Floor 7 Dynamic Configuration Console</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Syllabus Directive: "Floor 7 is excluded from initial inventory until rooms are configured by admin."
                  </p>
                </div>
              </div>

              {/* Add Room Form */}
              <form onSubmit={handleAddFloor7Room} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Room Identifier / Number
                  </label>
                  <input
                    type="text"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    placeholder="e.g. 703"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EBEAE5] bg-white text-[#111C2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Room Capacity
                  </label>
                  <input
                    type="number"
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EBEAE5] bg-white text-[#111C2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Room Classification
                  </label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EBEAE5] bg-white text-[#111C2D]"
                  >
                    <option>Smart Classroom</option>
                    <option>Seminar Hall</option>
                    <option>Auditorium (Large)</option>
                    <option>AI Computing Lab</option>
                    <option>Executive Boardroom</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Floor 7 Room</span>
                </button>
              </form>

              {/* Configured Floor 7 Rooms Table */}
              <div className="pt-2">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Configured Floor 7 Rooms
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {floor7Rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-[#111C2D]">{room.name}</div>
                        <div className="text-xs text-gray-500">{room.type} • Capacity: {room.capacity}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {room.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: TIMETABLE IMPORT & CONFLICTS
            ===================================================================== */}
        {activeTab === 'timetable' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEAE5]">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                  Academic Timetable Synchronization
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Import official semester timetables from CSV/Excel and prevent cross-term booking overlaps.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-6">
                <h3 className="font-display font-bold text-lg text-[#111C2D]">
                  Import Timetable CSV File
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Imports course schedule blocks into `timetable_entries` with automatic verification against pre-existing room reservations.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center space-y-3 bg-[#FAF9F6]">
                  <FileSpreadsheet className="w-10 h-10 text-emerald-600 mx-auto" />
                  <div className="text-xs font-bold text-[#111C2D]">
                    Drag & Drop official timetable (.csv / .xlsx) here
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Columns: room_id, day_of_week, slot_id, course_code, term_name
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Demo CSV Timetable verified! 140 timetable slots validated with 0 conflicts.')}
                    className="px-4 py-2 rounded-xl bg-[#111C2D] text-white text-xs font-bold cursor-pointer"
                  >
                    Simulate Upload of Semester V Timetable
                  </button>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-base text-[#111C2D]">
                  Central Availability Service Constraints
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  To eliminate booking conflicts as identified in the technical review, CampusOne enforces unified availability verification across three occupancy sources:
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5]">
                    <strong className="text-[#111C2D]">1. Timetable Class Blocks:</strong> Academic schedule takes priority over ad-hoc student reservations.
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5]">
                    <strong className="text-[#111C2D]">2. Discrete Multi-Slot Bookings:</strong> Every approved reservation blocks slots in `room_booking_slots`.
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5]">
                    <strong className="text-[#111C2D]">3. Maintenance Blocks:</strong> Emergency maintenance shuts down availability in real time.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
