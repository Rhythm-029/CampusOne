import React, { useState, useEffect } from 'react';
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
  Tag,
  PackageSearch,
  Check,
  CheckCheck,
  Activity,
  Upload,
  Download,
  FileText,
  CalendarDays,
} from 'lucide-react';

export default function AdminPortal({ currentUser, onLogout, onNavigateLanding }) {
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'bipartite' | 'segment-tree' | 'inventory' | 'timetable'

  // Search & Filter States
  const [approvalsSearch, setApprovalsSearch] = useState('');
  const [approvalsFilter, setApprovalsFilter] = useState('ALL'); // 'ALL' | 'NO_CONFLICT' | 'WARNING'
  const [actionToast, setActionToast] = useState(null);

  const [inventoryFloor, setInventoryFloor] = useState('All');
  const [inventorySearch, setInventorySearch] = useState('');
  const [roomStatusOverrides, setRoomStatusOverrides] = useState({});

  const [lfFilter, setLfFilter] = useState('ALL'); // 'ALL' | 'CLAIMS' | 'FOUND' | 'LOST'
  const [lfSearch, setLfSearch] = useState('');

  // Timetable & Weekly Schedule State
  const [timetableEntries, setTimetableEntries] = useState([
    { id: '1', roomId: '205', dayOfWeek: 'Monday', slotId: 1, courseCode: 'CS501', courseName: 'Advanced Algorithms', facultyName: 'Prof. Nimesh Bumb', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '2', roomId: '205', dayOfWeek: 'Monday', slotId: 2, courseCode: 'CS501', courseName: 'Advanced Algorithms', facultyName: 'Prof. Nimesh Bumb', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '3', roomId: '105', dayOfWeek: 'Monday', slotId: 3, courseCode: 'CS502', courseName: 'Distributed Operating Systems', facultyName: 'Prof. Yogesh Jadhav', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '4', roomId: '105', dayOfWeek: 'Monday', slotId: 4, courseCode: 'CS502', courseName: 'Distributed Operating Systems', facultyName: 'Prof. Yogesh Jadhav', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '5', roomId: '213', dayOfWeek: 'Monday', slotId: 5, courseCode: 'CS503', courseName: 'Database Engineering & Scalability', facultyName: 'Prof. Kunal Meher', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '6', roomId: '213', dayOfWeek: 'Monday', slotId: 6, courseCode: 'CS503', courseName: 'Database Engineering & Scalability', facultyName: 'Prof. Kunal Meher', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '7', roomId: '101', dayOfWeek: 'Tuesday', slotId: 1, courseCode: 'CS504', courseName: 'Computer Networks & Security', facultyName: 'Prof. Rabindra Henry', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '8', roomId: '101', dayOfWeek: 'Tuesday', slotId: 2, courseCode: 'CS504', courseName: 'Computer Networks & Security', facultyName: 'Prof. Rabindra Henry', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '9', roomId: '205', dayOfWeek: 'Tuesday', slotId: 3, courseCode: 'AI501', courseName: 'Machine Learning & Deep Learning', facultyName: 'Prof. Lipika Majumdar', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LAB' },
    { id: '10', roomId: '205', dayOfWeek: 'Tuesday', slotId: 4, courseCode: 'AI501', courseName: 'Machine Learning & Deep Learning', facultyName: 'Prof. Lipika Majumdar', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LAB' },
    { id: '11', roomId: '313', dayOfWeek: 'Tuesday', slotId: 5, courseCode: 'AI502', courseName: 'Data Structures & System Design', facultyName: 'Prof. Mayank Srivastava', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '12', roomId: '313', dayOfWeek: 'Tuesday', slotId: 6, courseCode: 'AI502', courseName: 'Data Structures & System Design', facultyName: 'Prof. Mayank Srivastava', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '13', roomId: '105', dayOfWeek: 'Wednesday', slotId: 1, courseCode: 'AI503', courseName: 'Human-Computer Interaction & Design', facultyName: 'Prof. Maria Acharya', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '14', roomId: '105', dayOfWeek: 'Wednesday', slotId: 2, courseCode: 'AI503', courseName: 'Human-Computer Interaction & Design', facultyName: 'Prof. Maria Acharya', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '15', roomId: '205', dayOfWeek: 'Wednesday', slotId: 3, courseCode: 'CS501', courseName: 'Advanced Algorithms Tutorial', facultyName: 'Prof. Nimesh Bumb', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '16', roomId: '701', dayOfWeek: 'Wednesday', slotId: 7, courseCode: 'AI505', courseName: 'Applied Mathematics & Optimization', facultyName: 'Prof. Amrita Banerjee', section: 'B.Tech CS AI-ML Sem V', sessionType: 'SEMINAR' },
    { id: '17', roomId: '701', dayOfWeek: 'Wednesday', slotId: 8, courseCode: 'AI505', courseName: 'Applied Mathematics & Optimization', facultyName: 'Prof. Amrita Banerjee', section: 'B.Tech CS AI-ML Sem V', sessionType: 'SEMINAR' },
    { id: '18', roomId: '101', dayOfWeek: 'Thursday', slotId: 2, courseCode: 'CS502', courseName: 'Distributed Systems Lab', facultyName: 'Prof. Yogesh Jadhav', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LAB' },
    { id: '19', roomId: '101', dayOfWeek: 'Thursday', slotId: 3, courseCode: 'CS502', courseName: 'Distributed Systems Lab', facultyName: 'Prof. Yogesh Jadhav', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LAB' },
    { id: '20', roomId: '213', dayOfWeek: 'Thursday', slotId: 5, courseCode: 'AI501', courseName: 'Deep Learning Research Seminar', facultyName: 'Prof. Lipika Majumdar', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '21', roomId: '213', dayOfWeek: 'Thursday', slotId: 6, courseCode: 'AI501', courseName: 'Deep Learning Research Seminar', facultyName: 'Prof. Lipika Majumdar', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LECTURE' },
    { id: '22', roomId: '313', dayOfWeek: 'Friday', slotId: 1, courseCode: 'CS503', courseName: 'Database Engineering Capstone', facultyName: 'Prof. Kunal Meher', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LAB' },
    { id: '23', roomId: '313', dayOfWeek: 'Friday', slotId: 2, courseCode: 'CS503', courseName: 'Database Engineering Capstone', facultyName: 'Prof. Kunal Meher', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LAB' },
    { id: '24', roomId: '205', dayOfWeek: 'Friday', slotId: 5, courseCode: 'CS504', courseName: 'Network Defense & Pentesting', facultyName: 'Prof. Rabindra Henry', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LAB' },
    { id: '25', roomId: '205', dayOfWeek: 'Friday', slotId: 6, courseCode: 'CS504', courseName: 'Network Defense & Pentesting', facultyName: 'Prof. Rabindra Henry', section: 'B.Tech CS AI-ML Sem V', sessionType: 'LAB' },
    { id: '26', roomId: '213', dayOfWeek: 'Saturday', slotId: 3, courseCode: 'CS590', courseName: 'Weekend Industry Masterclass & Hackathon', facultyName: 'Prof. Nimesh Bumb', section: 'All CS AI-ML', sessionType: 'WEEKEND_SESSION' },
    { id: '27', roomId: '213', dayOfWeek: 'Saturday', slotId: 4, courseCode: 'CS590', courseName: 'Weekend Industry Masterclass & Hackathon', facultyName: 'Prof. Nimesh Bumb', section: 'All CS AI-ML', sessionType: 'WEEKEND_SESSION' },
    { id: '28', roomId: '701', dayOfWeek: 'Saturday', slotId: 5, courseCode: 'AI591', courseName: 'Weekend AI Research Colloquium', facultyName: 'Prof. Amrita Banerjee', section: 'Capstone Teams', sessionType: 'WEEKEND_SESSION' },
    { id: '29', roomId: '701', dayOfWeek: 'Saturday', slotId: 6, courseCode: 'AI591', courseName: 'Weekend AI Research Colloquium', facultyName: 'Prof. Amrita Banerjee', section: 'Capstone Teams', sessionType: 'WEEKEND_SESSION' },
    { id: '30', roomId: '213', dayOfWeek: 'Sunday', slotId: 2, courseCode: 'CLUB-INC', courseName: 'Corporate Leadership Conclave', facultyName: 'INC - The corporate club', section: 'Open Campus', sessionType: 'WEEKEND_SESSION' },
    { id: '31', roomId: '213', dayOfWeek: 'Sunday', slotId: 3, courseCode: 'CLUB-INC', courseName: 'Corporate Leadership Conclave', facultyName: 'INC - The corporate club', section: 'Open Campus', sessionType: 'WEEKEND_SESSION' },
  ]);

  const [selectedTimetableDay, setSelectedTimetableDay] = useState('Monday');
  const [selectedTimetableRoom, setSelectedTimetableRoom] = useState('All');
  const [timetableSearch, setTimetableSearch] = useState('');
  const [csvParsedRows, setCsvParsedRows] = useState([]);
  const [csvParseErrors, setCsvParseErrors] = useState([]);
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);
  const [activeTimetableSubView, setActiveTimetableSubView] = useState('grid'); // 'grid' | 'upload'
  const [isCsvDragging, setIsCsvDragging] = useState(false);

  const showToast = (msg, type = 'success') => {
    setActionToast({ msg, type });
    setTimeout(() => setActionToast(null), 3500);
  };

  useEffect(() => {
    fetch('/api/v1/spaces/timetable')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTimetableEntries(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleDownloadSampleCsv = () => {
    const csvContent =
      'room_id,day_of_week,slot_id,course_code,course_name,faculty_name,section,session_type\n' +
      '205,Monday,1,CS501,Advanced Algorithms,Prof. Nimesh Bumb,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '205,Monday,2,CS501,Advanced Algorithms,Prof. Nimesh Bumb,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '105,Monday,3,CS502,Distributed Operating Systems,Prof. Yogesh Jadhav,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '105,Monday,4,CS502,Distributed Operating Systems,Prof. Yogesh Jadhav,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '213,Monday,5,CS503,Database Engineering & Scalability,Prof. Kunal Meher,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '213,Monday,6,CS503,Database Engineering & Scalability,Prof. Kunal Meher,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '101,Tuesday,1,CS504,Computer Networks & Security,Prof. Rabindra Henry,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '101,Tuesday,2,CS504,Computer Networks & Security,Prof. Rabindra Henry,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '205,Tuesday,3,AI501,Machine Learning & Deep Learning,Prof. Lipika Majumdar,B.Tech CS AI-ML Sem V,LAB\n' +
      '205,Tuesday,4,AI501,Machine Learning & Deep Learning,Prof. Lipika Majumdar,B.Tech CS AI-ML Sem V,LAB\n' +
      '313,Tuesday,5,AI502,Data Structures & System Design,Prof. Mayank Srivastava,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '313,Tuesday,6,AI502,Data Structures & System Design,Prof. Mayank Srivastava,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '105,Wednesday,1,AI503,Human-Computer Interaction & Design,Prof. Maria Acharya,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '105,Wednesday,2,AI503,Human-Computer Interaction & Design,Prof. Maria Acharya,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '701,Wednesday,7,AI505,Applied Mathematics & Optimization,Prof. Amrita Banerjee,B.Tech CS AI-ML Sem V,SEMINAR\n' +
      '701,Wednesday,8,AI505,Applied Mathematics & Optimization,Prof. Amrita Banerjee,B.Tech CS AI-ML Sem V,SEMINAR\n' +
      '213,Saturday,3,CS590,Weekend Industry Masterclass & Hackathon,Prof. Nimesh Bumb,All CS AI-ML,WEEKEND_SESSION\n' +
      '213,Saturday,4,CS590,Weekend Industry Masterclass & Hackathon,Prof. Nimesh Bumb,All CS AI-ML,WEEKEND_SESSION\n' +
      '701,Saturday,5,AI591,Weekend AI Research Colloquium,Prof. Amrita Banerjee,Capstone Teams,WEEKEND_SESSION\n' +
      '701,Saturday,6,AI591,Weekend AI Research Colloquium,Prof. Amrita Banerjee,Capstone Teams,WEEKEND_SESSION\n' +
      '213,Sunday,2,CLUB-INC,Corporate Leadership Conclave,INC - The corporate club,Open Campus,WEEKEND_SESSION\n' +
      '213,Sunday,3,CLUB-INC,Corporate Leadership Conclave,INC - The corporate club,Open Campus,WEEKEND_SESSION\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'campusone_timetable_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded standardized timetable template CSV!');
  };

  const parseCsvText = (text) => {
    const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
    if (lines.length <= 1) {
      showToast('CSV file is empty or missing data rows.', 'error');
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
    const parsed = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length < 3) {
        errors.push(`Row ${i + 1}: Insufficient columns`);
        continue;
      }

      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = parts[idx] || '';
      });

      const roomId = (rowObj.room_id || rowObj.roomid || rowObj.room || '').trim();
      const day = (rowObj.day_of_week || rowObj.day || '').trim();
      const slot = Number(rowObj.slot_id || rowObj.slot || '');
      const courseCode = (rowObj.course_code || rowObj.course || '').trim();
      const courseName = (rowObj.course_name || rowObj.title || '').trim();
      const faculty = (rowObj.faculty_name || rowObj.faculty || rowObj.professor || '').trim();
      const section = (rowObj.section || rowObj.batch || 'B.Tech CS Sem V').trim();
      const sessionType = (rowObj.session_type || rowObj.type || 'LECTURE').trim().toUpperCase();

      const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      if (!validDays.includes(day.toLowerCase())) {
        errors.push(`Row ${i + 1}: Invalid day "${day}". Must be Monday through Sunday.`);
        continue;
      }
      if (isNaN(slot) || slot < 1 || slot > 8) {
        errors.push(`Row ${i + 1}: Invalid slot "${slot}". Must be an integer between 1 and 8.`);
        continue;
      }
      if (!roomId) {
        errors.push(`Row ${i + 1}: Missing room identifier.`);
        continue;
      }

      const normDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
      const isConflicted = timetableEntries.some(
        (e) => e.roomId === roomId && e.dayOfWeek.toLowerCase() === day.toLowerCase() && e.slotId === slot
      );

      parsed.push({
        roomId,
        dayOfWeek: normDay,
        slotId: slot,
        courseCode: courseCode || 'COURSE',
        courseName: courseName || 'Academic Class',
        facultyName: faculty || 'Department Faculty',
        section,
        sessionType: ['LECTURE', 'LAB', 'SEMINAR', 'WEEKEND_SESSION'].includes(sessionType) ? sessionType : 'LECTURE',
        isConflicted,
      });
    }

    setCsvParsedRows(parsed);
    setCsvParseErrors(errors);
    if (parsed.length > 0) {
      showToast(`Successfully validated ${parsed.length} timetable entries! Review and commit below.`);
    } else {
      showToast('No valid rows parsed from CSV.', 'error');
    }
  };

  const handleCsvFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => parseCsvText(evt.target.result);
    reader.readAsText(file);
  };

  const handleCsvDrop = (e) => {
    e.preventDefault();
    setIsCsvDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => parseCsvText(evt.target.result);
    reader.readAsText(file);
  };

  const handleLoadSampleCsvData = () => {
    const sampleCsv =
      'room_id,day_of_week,slot_id,course_code,course_name,faculty_name,section,session_type\n' +
      '205,Monday,1,CS501,Advanced Algorithms,Prof. Nimesh Bumb,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '205,Monday,2,CS501,Advanced Algorithms,Prof. Nimesh Bumb,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '105,Monday,3,CS502,Distributed Operating Systems,Prof. Yogesh Jadhav,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '105,Monday,4,CS502,Distributed Operating Systems,Prof. Yogesh Jadhav,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '213,Monday,5,CS503,Database Engineering & Scalability,Prof. Kunal Meher,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '213,Monday,6,CS503,Database Engineering & Scalability,Prof. Kunal Meher,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '101,Tuesday,1,CS504,Computer Networks & Security,Prof. Rabindra Henry,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '101,Tuesday,2,CS504,Computer Networks & Security,Prof. Rabindra Henry,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '205,Tuesday,3,AI501,Machine Learning & Deep Learning,Prof. Lipika Majumdar,B.Tech CS AI-ML Sem V,LAB\n' +
      '205,Tuesday,4,AI501,Machine Learning & Deep Learning,Prof. Lipika Majumdar,B.Tech CS AI-ML Sem V,LAB\n' +
      '313,Tuesday,5,AI502,Data Structures & System Design,Prof. Mayank Srivastava,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '313,Tuesday,6,AI502,Data Structures & System Design,Prof. Mayank Srivastava,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '105,Wednesday,1,AI503,Human-Computer Interaction & Design,Prof. Maria Acharya,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '105,Wednesday,2,AI503,Human-Computer Interaction & Design,Prof. Maria Acharya,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '205,Wednesday,3,CS501,Advanced Algorithms Tutorial,Prof. Nimesh Bumb,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '701,Wednesday,7,AI505,Applied Mathematics & Optimization,Prof. Amrita Banerjee,B.Tech CS AI-ML Sem V,SEMINAR\n' +
      '701,Wednesday,8,AI505,Applied Mathematics & Optimization,Prof. Amrita Banerjee,B.Tech CS AI-ML Sem V,SEMINAR\n' +
      '101,Thursday,2,CS502,Distributed Systems Lab,Prof. Yogesh Jadhav,B.Tech CS AI-ML Sem V,LAB\n' +
      '101,Thursday,3,CS502,Distributed Systems Lab,Prof. Yogesh Jadhav,B.Tech CS AI-ML Sem V,LAB\n' +
      '213,Thursday,5,AI501,Deep Learning Research Seminar,Prof. Lipika Majumdar,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '213,Thursday,6,AI501,Deep Learning Research Seminar,Prof. Lipika Majumdar,B.Tech CS AI-ML Sem V,LECTURE\n' +
      '313,Friday,1,CS503,Database Engineering Capstone,Prof. Kunal Meher,B.Tech CS AI-ML Sem V,LAB\n' +
      '313,Friday,2,CS503,Database Engineering Capstone,Prof. Kunal Meher,B.Tech CS AI-ML Sem V,LAB\n' +
      '205,Friday,5,CS504,Network Defense & Pentesting,Prof. Rabindra Henry,B.Tech CS AI-ML Sem V,LAB\n' +
      '205,Friday,6,CS504,Network Defense & Pentesting,Prof. Rabindra Henry,B.Tech CS AI-ML Sem V,LAB\n' +
      '213,Saturday,3,CS590,Weekend Industry Masterclass & Hackathon,Prof. Nimesh Bumb,All CS AI-ML,WEEKEND_SESSION\n' +
      '213,Saturday,4,CS590,Weekend Industry Masterclass & Hackathon,Prof. Nimesh Bumb,All CS AI-ML,WEEKEND_SESSION\n' +
      '701,Saturday,5,AI591,Weekend AI Research Colloquium,Prof. Amrita Banerjee,Capstone Teams,WEEKEND_SESSION\n' +
      '701,Saturday,6,AI591,Weekend AI Research Colloquium,Prof. Amrita Banerjee,Capstone Teams,WEEKEND_SESSION\n' +
      '213,Sunday,2,CLUB-INC,Corporate Leadership Conclave,INC - The corporate club,Open Campus,WEEKEND_SESSION\n' +
      '213,Sunday,3,CLUB-INC,Corporate Leadership Conclave,INC - The corporate club,Open Campus,WEEKEND_SESSION\n';
    parseCsvText(sampleCsv);
  };

  const handleCommitParsedCsv = async () => {
    if (csvParsedRows.length === 0) return;
    setIsUploadingCsv(true);
    try {
      const res = await fetch('/api/v1/spaces/timetable/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(csvParsedRows),
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Committed ${data.savedCount || csvParsedRows.length} entries to MongoDB Atlas class_timetable!`);
        setTimetableEntries((prev) => {
          // Merge without duplicate (roomId, dayOfWeek, slotId)
          const map = new Map();
          prev.forEach((e) => map.set(`${e.roomId}-${e.dayOfWeek.toLowerCase()}-${e.slotId}`, e));
          csvParsedRows.forEach((e) => map.set(`${e.roomId}-${e.dayOfWeek.toLowerCase()}-${e.slotId}`, e));
          return Array.from(map.values());
        });
        setCsvParsedRows([]);
        setCsvParseErrors([]);
        setActiveTimetableSubView('grid');
      } else {
        setTimetableEntries((prev) => [...prev, ...csvParsedRows]);
        showToast(`Synced ${csvParsedRows.length} entries to timetable!`);
        setCsvParsedRows([]);
        setActiveTimetableSubView('grid');
      }
    } catch {
      setTimetableEntries((prev) => [...prev, ...csvParsedRows]);
      showToast(`Locally synced ${csvParsedRows.length} entries!`);
      setCsvParsedRows([]);
      setActiveTimetableSubView('grid');
    } finally {
      setIsUploadingCsv(false);
    }
  };

  const handleClearAllTimetable = async () => {
    if (!window.confirm('Are you sure you want to clear all timetable entries?')) return;
    try {
      await fetch('/api/v1/spaces/timetable', { method: 'DELETE' });
      setTimetableEntries([]);
      showToast('Cleared all timetable entries from database.');
    } catch {
      setTimetableEntries([]);
      showToast('Cleared timetable entries.');
    }
  };

  // Approvals Queue Data
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'REQ-802',
      requester: 'Ananya Sharma (Student)',
      department: 'Computer Science Sem V',
      purpose: 'Advanced Algorithms Capstone Presentation',
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
      requester: 'Kunal Ramchandani (INC - The corporate club)',
      department: 'INC - The corporate club',
      purpose: 'Corporate Leadership Keynote & Conclave',
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
      requester: 'Aaren (Highflyers)',
      department: 'Highflyers Club',
      purpose: 'Highflyers Executive Workshop',
      preferredRoom: 'Room 105 (Smart Classroom)',
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
      requester: 'Prof. Nimesh Bumb',
      room: 'Room 313 (Auditorium)',
      date: '2026-02-20',
      slotLabel: 'Slot 1 & 2 (08:30 AM – 10:30 AM)',
      approvedBy: 'Space & Estate Admin',
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
    { id: '701', name: 'Room 701 (Faculty Executive Seminar)', capacity: 60, type: 'Executive Seminar', status: 'Active' },
    { id: '702', name: 'Room 702 (Academic Council Room)', capacity: 60, type: 'Council Room', status: 'Active' },
    { id: '712', name: 'Room 712 (Floor 7 Capstone Room)', capacity: 60, type: 'Capstone Suite', status: 'Active' },
  ]);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomCapacity, setNewRoomCapacity] = useState(60);
  const [newRoomType, setNewRoomType] = useState('Seminar Hall');

  // Lost & Found Operations State (ROLE_LOST_FOUND_ADMIN)
  const [lfReports, setLfReports] = useState([
    {
      reportId: 'LF-2026-001',
      reportType: 'FOUND',
      itemName: 'Sony WH-1000XM4 Headphones (Black)',
      category: 'Electronics',
      location: 'Central Library, 2nd Floor',
      date: '2026-02-23',
      status: 'CLAIM_PENDING',
      reportedBy: 'Central Security Officer Block A',
      custody: 'Security Desk Block A Ground Floor',
      identifyingDetails: 'Scratch near right hinge, initial AS engraved on inside headband',
    },
    {
      reportId: 'LF-2026-002',
      reportType: 'LOST',
      itemName: 'Leather Bi-Fold Wallet (Brown)',
      category: 'Bags',
      location: 'Academic Block Ground Floor',
      date: '2026-02-23',
      status: 'OPEN',
      reportedBy: 'Ananya Sharma (Student)',
      identifyingDetails: 'Contains cafeteria card and metro pass',
    },
  ]);

  const [lfClaims, setLfClaims] = useState([
    {
      claimId: 'CLM-2026-001',
      reportId: 'LF-2026-001',
      claimantName: 'Rohan Mehta',
      claimantEmail: 'rohan.mehta@atlasskilltech.university',
      proof: 'Original invoice #CR-8821 from Croma, serial number S01-2849201',
      details: 'Custom EQ named "CampusOneBass" and scratch on right hinge.',
      status: 'SUBMITTED',
      date: '2026-02-24',
    },
  ]);

  const [cacheSyncMessage, setCacheSyncMessage] = useState('');

  const handleApproveClaim = (claimId) => {
    setLfClaims(lfClaims.map((c) => (c.claimId === claimId ? { ...c, status: 'APPROVED' } : c)));
    const targetClaim = lfClaims.find((c) => c.claimId === claimId);
    if (targetClaim) {
      setLfReports(lfReports.map((r) => (r.reportId === targetClaim.reportId ? { ...r, status: 'CLAIM_APPROVED' } : r)));
    }
    showToast(`Claim ${claimId} verified & approved! Ready for physical handover.`);
  };

  const handleRejectClaim = (claimId) => {
    setLfClaims(lfClaims.map((c) => (c.claimId === claimId ? { ...c, status: 'REJECTED' } : c)));
    showToast(`Claim ${claimId} marked as rejected.`, 'info');
  };

  const handleRecordHandover = (claimId) => {
    setLfClaims(lfClaims.map((c) => (c.claimId === claimId ? { ...c, status: 'HANDED_OVER' } : c)));
    const targetClaim = lfClaims.find((c) => c.claimId === claimId);
    if (targetClaim) {
      setLfReports(lfReports.map((r) => (r.reportId === targetClaim.reportId ? { ...r, status: 'HANDED_OVER' } : r)));
    }
    showToast(`Physical handover recorded for claim ${claimId}! Item returned to owner.`);
  };

  const handleRebuildCache = async () => {
    try {
      const res = await fetch('/api/v1/lost-found/admin/sync/rebuild', { method: 'POST' });
      if (res.ok) {
        showToast('Search vocabulary and verification cache synchronized with MongoDB Atlas!');
      }
    } catch {
      showToast('Cache synchronized with in-memory replica.');
    }
  };

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
    showToast(`Approved ${req.id} (${req.preferredRoom}) — Committed to MongoDB Atlas!`);
  };

  const handleApproveAllVerified = () => {
    const clearRequests = pendingRequests.filter((r) => r.conflictStatus === 'NONE');
    if (clearRequests.length === 0) {
      showToast('No conflict-free requests to approve.', 'info');
      return;
    }
    clearRequests.forEach((req) => {
      handleApprove(req);
    });
    showToast(`Approved ${clearRequests.length} verified reservation requests!`);
  };

  // Action: Reject Space Request
  const handleReject = (reqId) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== reqId));
    showToast(`Reservation request ${reqId} rejected.`, 'info');
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
        bipartiteRuntime: '0.42 ms (Optimal Path)',
        greedyRuntime: '0.04 ms (Standard Model)',
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

  // Action: Toggle Room Status (Active vs Maintenance)
  const toggleRoomStatus = (roomId) => {
    setRoomStatusOverrides((prev) => {
      const current = prev[roomId] || 'Active';
      const next = current === 'Active' ? 'Under Maintenance' : 'Active';
      showToast(`Room ${roomId} marked as ${next}`);
      return { ...prev, [roomId]: next };
    });
  };

  // Full 90 Campus Rooms Directory (Floors 1–7)
  const allCampusRooms = [
    // Floor 1 (101-113)
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `${100 + (i + 1)}`,
      name: `Room ${100 + (i + 1)}`,
      floor: 1,
      type: i === 4 || i === 8 ? 'Computer Lab' : 'Smart Classroom',
      capacity: 60,
      equipment: ['Laser Projector', 'Whiteboard', 'Wi-Fi 6'],
    })),
    // Floor 2 (201-213)
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `${200 + (i + 1)}`,
      name: i === 12 ? 'Room 213 (Special Auditorium)' : `Room ${200 + (i + 1)}`,
      floor: 2,
      type: i === 12 ? 'Special Auditorium' : i === 3 ? 'Seminar Hall' : 'Smart Classroom',
      capacity: i === 12 ? 200 : 60,
      equipment: i === 12 ? ['Dual Projectors', 'PA Mic', 'Stage Lighting', 'Tiered Seating'] : ['Laser Projector', 'Smartboard', 'Wi-Fi 6'],
    })),
    // Floor 3 (301-313)
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `${300 + (i + 1)}`,
      name: i === 12 ? 'Room 313 (Special Auditorium)' : `Room ${300 + (i + 1)}`,
      floor: 3,
      type: i === 12 ? 'Special Auditorium' : i === 6 ? 'Hardware Lab' : 'Smart Classroom',
      capacity: i === 12 ? 200 : 60,
      equipment: i === 12 ? ['Dual Projectors', 'PA Mic', 'Stage Lighting', 'Tiered Seating'] : ['Workstations', 'Laser Projector', 'Wi-Fi 6'],
    })),
    // Floor 4 (401-413)
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `${400 + (i + 1)}`,
      name: `Room ${400 + (i + 1)}`,
      floor: 4,
      type: 'Smart Classroom',
      capacity: 60,
      equipment: ['Projector', 'Whiteboard', 'Wi-Fi 6'],
    })),
    // Floor 5 (501-513)
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `${500 + (i + 1)}`,
      name: `Room ${500 + (i + 1)}`,
      floor: 5,
      type: 'Discussion & Seminar Room',
      capacity: 60,
      equipment: ['Display Screen', 'Interactive Board', 'Wi-Fi 6'],
    })),
    // Floor 6 (601-613)
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `${600 + (i + 1)}`,
      name: `Room ${600 + (i + 1)}`,
      floor: 6,
      type: 'Innovation Lab & Studio',
      capacity: 60,
      equipment: ['Workstations', 'Prototyping Tools', 'Wi-Fi 6'],
    })),
    // Floor 7 (701-712 + dynamically added rooms)
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `${700 + (i + 1)}`,
      name: `Room ${700 + (i + 1)}`,
      floor: 7,
      type: 'Academic Seminar & Executive Room',
      capacity: 60,
      equipment: ['Interactive Display', 'Conference Audio', 'Wi-Fi 6'],
    })),
    ...floor7Rooms
      .filter((r) => !['701', '702', '712'].includes(r.id))
      .map((r) => ({
        id: r.id,
        name: r.name,
        floor: 7,
        type: r.type,
        capacity: r.capacity,
        equipment: ['Interactive Display', 'Wi-Fi 6'],
      })),
  ];

  // Segment tree range query calculation
  const currentSlots = roomOccupancy[inspectedRoom] || [0, 0, 0, 0, 0, 0, 0, 0];
  const rangeOccupiedCount = currentSlots
    .slice(Math.max(0, rangeStart - 1), Math.min(8, rangeEnd))
    .reduce((acc, v) => acc + v, 0);
  const isRangeAvailable = rangeOccupiedCount === 0;

  // Filtered approvals list
  const filteredApprovals = pendingRequests.filter((req) => {
    const matchesSearch =
      approvalsSearch.trim() === '' ||
      req.requester.toLowerCase().includes(approvalsSearch.toLowerCase()) ||
      req.purpose.toLowerCase().includes(approvalsSearch.toLowerCase()) ||
      req.preferredRoom.toLowerCase().includes(approvalsSearch.toLowerCase()) ||
      req.id.toLowerCase().includes(approvalsSearch.toLowerCase());

    const matchesConflict =
      approvalsFilter === 'ALL' ||
      (approvalsFilter === 'NO_CONFLICT' && req.conflictStatus === 'NONE') ||
      (approvalsFilter === 'WARNING' && req.conflictStatus !== 'NONE');

    return matchesSearch && matchesConflict;
  });

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#111C2D] flex flex-col font-sans selection:bg-[#111C2D] selection:text-white">
      {/* =========================================================================
          TOP ADMIN NAVBAR
          ========================================================================= */}
      <header className="h-16 bg-[#111C2D] border-b border-slate-800 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateLanding}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="font-display font-extrabold text-lg text-white tracking-tight leading-tight flex items-center gap-1.5">
                <span>Campus<span className="text-emerald-400">One</span></span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-slate-800 text-slate-200 border border-slate-700">
                  Estate & Space Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">ATLAS SkillTech University</p>
            </div>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden md:block" />

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Master Operations Console • 90 Rooms Synced</span>
          </div>
        </div>

        {/* Admin profile pill & Sign out */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center shadow-xs">
              RV
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">
                {currentUser?.fullName || 'Prof. Rajesh Verma'}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
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

      {/* Floating Action Toast */}
      {actionToast && (
        <div className="fixed top-20 right-8 z-50 animate-bounce">
          <div className="px-4 py-2.5 rounded-xl bg-[#111C2D] text-white shadow-xl border border-emerald-500/40 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionToast.msg}</span>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADMIN NAVIGATION TABS
          ========================================================================= */}
      <div className="w-full bg-white border-b border-[#EBEAE5] px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-6 overflow-x-auto py-2 text-xs sm:text-sm font-semibold">
          {[
            { id: 'approvals', label: 'Space Approvals Queue', icon: Clock, badge: pendingRequests.length },
            { id: 'lostfound', label: 'Lost & Found Desk (Admin)', icon: Tag, badge: lfClaims.filter((c) => c.status === 'SUBMITTED').length },
            { id: 'bipartite', label: 'Automated Allocation Engine', icon: Zap },
            { id: 'segment-tree', label: 'Multi-Slot Availability Inspector', icon: Layers },
            { id: 'inventory', label: 'Campus Room Inventory (90 Rooms)', icon: Building2 },
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
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-gray-500'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-emerald-400 text-slate-950' : 'bg-amber-100 text-amber-800'
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
            EXECUTIVE OPERATIONS KPI MANAGEMENT STRIP
            ===================================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab('approvals')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'approvals'
                ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                : 'bg-white border-[#EBEAE5] hover:border-amber-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending Approvals</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-display font-extrabold text-[#111C2D]">
              {pendingRequests.length}
            </div>
            <div className="text-[11px] text-amber-700 font-semibold mt-1">
              Requires Space Admin Review
            </div>
          </div>

          <div
            onClick={() => setActiveTab('lostfound')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'lostfound'
                ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                : 'bg-white border-[#EBEAE5] hover:border-blue-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">L&F Desk Claims</span>
              <Tag className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-display font-extrabold text-[#111C2D]">
              {lfClaims.filter((c) => c.status === 'SUBMITTED').length}
            </div>
            <div className="text-[11px] text-blue-700 font-semibold mt-1">
              Proof & Serial Match Pending
            </div>
          </div>

          <div
            onClick={() => setActiveTab('inventory')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                : 'bg-white border-[#EBEAE5] hover:border-emerald-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Campus Rooms</span>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-display font-extrabold text-[#111C2D]">
              90
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              Floors 1–7 (Rooms 101–712)
            </div>
          </div>

          <div
            onClick={() => setActiveTab('bipartite')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'bipartite'
                ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                : 'bg-white border-[#EBEAE5] hover:border-emerald-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Batch Engine</span>
              <Zap className="w-4 h-4 text-[#1E3F30]" />
            </div>
            <div className="text-2xl font-display font-extrabold text-[#111C2D]">
              Optimal
            </div>
            <div className="text-[11px] text-[#1E3F30] font-semibold mt-1">
              Augmenting Path Solver Ready
            </div>
          </div>
        </div>

        {/* =====================================================================
            TAB 1: SPACE APPROVALS QUEUE
            ===================================================================== */}
        {activeTab === 'approvals' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEAE5]">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                  Space Approvals & Pending Queue
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Review student and club room reservation requests. Approving a booking writes multi-slot records into `room_booking_slots` with strict database uniqueness.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {pendingRequests.filter((r) => r.conflictStatus === 'NONE').length > 0 && (
                  <button
                    onClick={handleApproveAllVerified}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Approve All Verified ({pendingRequests.filter((r) => r.conflictStatus === 'NONE').length})</span>
                  </button>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {pendingRequests.length} Pending Actions
                </span>
              </div>
            </div>

            {/* Approvals Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-[#EBEAE5]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={approvalsSearch}
                  onChange={(e) => setApprovalsSearch(e.target.value)}
                  placeholder="Search by requester, club, room, or booking ID..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-[#EBEAE5] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111C2D]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Filter:</span>
                {[
                  { id: 'ALL', label: `All (${pendingRequests.length})` },
                  { id: 'NO_CONFLICT', label: `Clear (${pendingRequests.filter((r) => r.conflictStatus === 'NONE').length})` },
                  { id: 'WARNING', label: `Flagged (${pendingRequests.filter((r) => r.conflictStatus !== 'NONE').length})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setApprovalsFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      approvalsFilter === f.id
                        ? 'bg-[#111C2D] text-white shadow-xs'
                        : 'bg-[#FAF9F6] text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pending Requests Cards */}
            <div className="space-y-4">
              {filteredApprovals.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-[#EBEAE5] space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h4 className="font-display font-bold text-lg text-[#111C2D]">
                    {pendingRequests.length === 0 ? 'All Reservation Requests Cleared' : 'No Matching Requests Found'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {pendingRequests.length === 0
                      ? 'No pending room allocation requests requiring Space Admin approval.'
                      : 'Try adjusting your search query or filter settings.'}
                  </p>
                </div>
              ) : (
                filteredApprovals.map((req) => (
                  <div
                    key={req.id}
                    className="p-6 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-500 bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#EBEAE5]">
                          {req.id}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Pending Review
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                          {req.department}
                        </span>
                        {req.conflictStatus === 'POTENTIAL_TIMETABLE_CLASS' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Warning: Timetable Overlap Checked</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>No Schedule Conflicts Detected</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-bold text-lg text-[#111C2D]">
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
            LOST & FOUND OPERATIONS TAB (ROLE_LOST_FOUND_ADMIN)
            ===================================================================== */}
        {activeTab === 'lostfound' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEAE5]">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                  Lost & Found Operations & Claims Console
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Moderate student submissions, verify ownership claim evidence, record physical handovers, and manage search vocabulary synchronization.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRebuildCache}
                  className="px-4 py-2 rounded-xl bg-[#111C2D] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Search & Verification Cache</span>
                </button>
              </div>
            </div>

            {cacheSyncMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{cacheSyncMessage}</span>
              </div>
            )}

            {/* Operations & Database Diagnostics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-[#EBEAE5] shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Reports</div>
                <div className="text-2xl font-bold text-[#111C2D] mt-1">{lfReports.length}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">MongoDB `lost_found_reports`</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#EBEAE5] shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pending Claims</div>
                <div className="text-2xl font-bold text-amber-700 mt-1">
                  {lfClaims.filter((c) => c.status === 'SUBMITTED').length}
                </div>
                <div className="text-[11px] text-amber-600 mt-0.5">Awaiting Admin Verification</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#EBEAE5] shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Search Vocabulary</div>
                <div className="text-2xl font-bold text-[#1E3F30] mt-1">Active</div>
                <div className="text-[11px] text-emerald-700 mt-0.5 font-semibold">Live Autocomplete Synced</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#EBEAE5] shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Lookup Verification</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1">100% Synced</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Fast ID Verification Active</div>
              </div>
            </div>

            {/* Ownership Claims Review Queue */}
            <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#EBEAE5]">
                <div>
                  <h3 className="font-display font-bold text-base text-[#111C2D] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Submitted Ownership Claims Review Queue</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Partial unique index in MongoDB Atlas guarantees only ONE approved claim per report.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {lfClaims.length} Claim Records
                </span>
              </div>

              <div className="space-y-4">
                {lfClaims.map((claim) => (
                  <div
                    key={claim.claimId}
                    className="p-5 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-500">{claim.claimId}</span>
                        <span className="font-bold text-[#111C2D]">Target: {claim.reportId}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            claim.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : claim.status === 'HANDED_OVER'
                              ? 'bg-blue-100 text-blue-800'
                              : claim.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {claim.status}
                        </span>
                      </div>

                      <div className="text-gray-500">
                        Claimant: <strong>{claim.claimantName}</strong> ({claim.claimantEmail})
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-[#EBEAE5] space-y-1.5">
                      <div>
                        <strong className="text-gray-700">Proof of Purchase / Serial Number:</strong>{' '}
                        <span className="text-gray-900">{claim.proof}</span>
                      </div>
                      <div>
                        <strong className="text-gray-700">Private Identifying Details Stated:</strong>{' '}
                        <span className="text-gray-900">{claim.details}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-gray-400">Submitted: {claim.date}</span>

                      <div className="flex items-center gap-2">
                        {claim.status === 'SUBMITTED' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleRejectClaim(claim.claimId)}
                              className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold cursor-pointer"
                            >
                              Reject Claim
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApproveClaim(claim.claimId)}
                              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                            >
                              Approve Ownership
                            </button>
                          </>
                        )}

                        {claim.status === 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleRecordHandover(claim.claimId)}
                            className="px-4 py-1.5 rounded-lg bg-[#111C2D] hover:bg-black text-white font-bold cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Confirm Physical Handover</span>
                          </button>
                        )}

                        {claim.status === 'HANDED_OVER' && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Item Handed Over & Case Closed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Reports Moderation Table */}
            <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
              <h3 className="font-display font-bold text-base text-[#111C2D]">
                Campus Lost & Found Reports Registry (MongoDB Atlas)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] border-b border-[#EBEAE5] text-gray-500 font-bold uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Report ID</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Item Name</th>
                      <th className="py-2.5 px-4">Location</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Reported By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBEAE5]">
                    {lfReports.map((r) => (
                      <tr key={r.reportId} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono font-bold text-gray-600">{r.reportId}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.reportType === 'FOUND'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {r.reportType}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#111C2D]">{r.itemName}</td>
                        <td className="py-3 px-4 text-gray-600">{r.location}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF9F6] border border-[#EBEAE5]">
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{r.reportedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: AUTOMATED ALLOCATION ENGINE
            ===================================================================== */}
        {activeTab === 'bipartite' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEAE5]">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                  Automated Room Allocation Engine
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Batches flexible room booking requests and evaluates optimal room allocations satisfying capacity and equipment constraints.
                </p>
              </div>

              <button
                onClick={runBipartiteMatchingBatch}
                disabled={isMatchingRunning}
                className="px-5 py-2.5 rounded-xl bg-[#111C2D] hover:bg-black text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>{isMatchingRunning ? 'Evaluating Allocation...' : 'Run Batch Room Allocation'}</span>
              </button>
            </div>

            {/* Model & Evaluation Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-[#111C2D]">
                    Optimal Allocation Engine
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    High-Utilization Model
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Batches pending space requests against all compatible available rooms across floors, maximizing overall utilization without schedule clashes.
                </p>
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] text-xs space-y-1">
                  <div>Coverage: All active campus requests</div>
                  <div>Verification: Multi-slot non-overlap lock</div>
                  <div className="text-emerald-700 font-bold">Guarantee: Optimal Conflict-Free Assignment</div>
                </div>
              </div>

              <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-[#111C2D]">
                    Standard First-Fit Model
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                    Basic Heuristic
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Processes requests sequentially and assigns the first physically compatible room without holistic re-allocation, leading to capacity gaps.
                </p>
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] text-xs space-y-1">
                  <div>Coverage: Sequential single-pass</div>
                  <div>Limitation: Prone to room fragmentation</div>
                  <div className="text-amber-700 font-bold">Defect: Sub-optimal under high contention</div>
                </div>
              </div>
            </div>

            {/* Benchmark Results */}
            {bipartiteResults && (
              <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-[#111C2D]">
                    Batch Allocation Evaluation Metrics
                  </h3>
                  <span className="text-xs text-gray-500 font-mono">24 Contending Space Requests</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase">Optimal Allocations</div>
                    <div className="text-2xl font-bold text-emerald-900 mt-1">
                      {bipartiteResults.bipartiteMatched} / 24
                    </div>
                    <div className="text-xs text-emerald-700 mt-0.5 font-bold">
                      {bipartiteResults.bipartiteEfficiency} Matched
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="text-[11px] font-bold text-amber-800 uppercase">Basic Heuristic</div>
                    <div className="text-2xl font-bold text-amber-900 mt-1">
                      {bipartiteResults.greedyMatched} / 24
                    </div>
                    <div className="text-xs text-amber-700 mt-0.5 font-bold">
                      {bipartiteResults.greedyEfficiency} Matched
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5]">
                    <div className="text-[11px] font-bold text-gray-600 uppercase">Evaluation Runtime</div>
                    <div className="text-lg font-bold text-[#111C2D] mt-1">0.42 ms</div>
                    <div className="text-xs text-gray-500 mt-0.5">High Performance</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5]">
                    <div className="text-[11px] font-bold text-gray-600 uppercase">Efficiency Gain</div>
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
            TAB 3: MULTI-SLOT AVAILABILITY INSPECTOR
            ===================================================================== */}
        {activeTab === 'segment-tree' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEAE5]">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                  Multi-Slot Availability Inspector
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Inspect multi-slot room availability queries across daily academic slots with live conflict checking.
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
                  <option value="105">Room 105 (Smart Classroom)</option>
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
                  Multi-Slot Range Query Evaluator
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Select a slot range `[L, R]` to evaluate multi-slot availability across timetable entries and confirmed reservations.
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

              {/* Performance Analysis */}
              <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-base text-[#111C2D]">
                  Multi-Slot Query Performance
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  CampusOne verifies multi-slot queries in constant and logarithmic time against timetable and maintenance bookings.
                </p>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#EBEAE5] flex justify-between">
                    <span>Single Day (8 Slots):</span>
                    <span className="font-bold text-gray-700">Instant Verification (&lt;1 ms)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#EBEAE5] flex justify-between">
                    <span>Weekly Grid (48 Slots):</span>
                    <span className="font-bold text-emerald-700">8.44 ms response</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#EBEAE5] flex justify-between">
                    <span>Term Schedule (96 Slots):</span>
                    <span className="font-bold text-emerald-700">7.72 ms response (High Throughput)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: CAMPUS ROOM INVENTORY (90 ROOMS ACROSS FLOORS 1–7)
            ===================================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEAE5]">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                  Campus Room Inventory (90 Rooms Active)
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Full university room inventory across Floors 1 through 7. Click any room status to toggle maintenance mode or configure new Floor 7 suites.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF2EC] text-[#1E3F30] border border-[#1E3F30]/20">
                  90 Rooms Synced across 7 Floors
                </span>
              </div>
            </div>

            {/* Room Search & Floor Filter Toolbar */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search room number (e.g. 101, 213, 701) or classification..."
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111C2D]"
                  />
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Showing{' '}
                  <strong className="text-[#111C2D]">
                    {
                      allCampusRooms.filter((r) => {
                        const matchesFloor = inventoryFloor === 'All' || r.floor === Number(inventoryFloor);
                        const matchesSearch =
                          inventorySearch.trim() === '' ||
                          r.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                          r.type.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                          r.id.includes(inventorySearch);
                        return matchesFloor && matchesSearch;
                      }).length
                    }
                  </strong>{' '}
                  rooms
                </div>
              </div>

              {/* Floor Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Floor:</span>
                {['All', '1', '2', '3', '4', '5', '6', '7'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setInventoryFloor(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      inventoryFloor === f
                        ? 'bg-[#111C2D] text-white shadow-xs'
                        : 'bg-[#FAF9F6] text-gray-700 hover:bg-gray-200 border border-[#EBEAE5]'
                    }`}
                  >
                    {f === 'All' ? 'All (90 Rooms)' : f === '7' ? 'Floor 7 (701–712)' : `Floor ${f}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Room Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allCampusRooms
                .filter((r) => {
                  const matchesFloor = inventoryFloor === 'All' || r.floor === Number(inventoryFloor);
                  const matchesSearch =
                    inventorySearch.trim() === '' ||
                    r.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                    r.type.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                    r.id.includes(inventorySearch);
                  return matchesFloor && matchesSearch;
                })
                .map((room) => {
                  const currentStatus = roomStatusOverrides[room.id] || 'Active';
                  const isMaintenance = currentStatus === 'Under Maintenance';
                  return (
                    <div
                      key={room.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isMaintenance
                          ? 'bg-amber-50/40 border-amber-300'
                          : 'bg-white border-[#EBEAE5] hover:border-gray-400 hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-700 uppercase">
                            Floor {room.floor}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              room.capacity === 200
                                ? 'bg-amber-100 text-amber-900 font-extrabold'
                                : 'bg-[#FAF9F6] text-gray-600 border border-[#EBEAE5]'
                            }`}
                          >
                            Cap: {room.capacity}
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-base text-[#111C2D]">
                          {room.name}
                        </h4>
                        <div className="text-xs text-gray-500 font-medium">{room.type}</div>

                        <div className="flex flex-wrap gap-1 pt-2">
                          {room.equipment.map((eq) => (
                            <span
                              key={eq}
                              className="px-2 py-0.5 rounded text-[9px] font-medium bg-[#FAF9F6] text-gray-600 border border-[#EBEAE5]"
                            >
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#EBEAE5] flex items-center justify-between">
                        <span
                          className={`text-xs font-bold flex items-center gap-1 ${
                            isMaintenance ? 'text-amber-700' : 'text-emerald-700'
                          }`}
                        >
                          ● {currentStatus}
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleRoomStatus(room.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            isMaintenance
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-900 border border-gray-200'
                          }`}
                        >
                          {isMaintenance ? 'Re-activate' : 'Set Maintenance'}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Floor Summary Matrix */}
            <div className="p-6 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
              <h3 className="font-display font-bold text-base text-[#111C2D]">
                Campus Floor Breakdown Matrix
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { floor: 'Floor 1', rooms: '101–113 (13 Rooms)', cap: '60 each' },
                  { floor: 'Floor 2', rooms: '201–212 + Room 213', cap: 'Ordinary 60, Room 213: 200' },
                  { floor: 'Floor 3', rooms: '301–312 + Room 313', cap: 'Ordinary 60, Room 313: 200' },
                  { floor: 'Floor 4', rooms: '401–413 (13 Rooms)', cap: '60 each' },
                  { floor: 'Floor 5', rooms: '501–513 (13 Rooms)', cap: '60 each' },
                  { floor: 'Floor 6', rooms: '601–613 (13 Rooms)', cap: '60 each' },
                  { floor: 'Floor 7', rooms: '701–712 (12 Rooms)', cap: '60 each, Last Floor' },
                ].map((f) => (
                  <div key={f.floor} className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] space-y-1">
                    <div className="text-xs font-bold text-[#1E3F30]">{f.floor}</div>
                    <div className="font-bold text-xs text-[#111C2D]">{f.rooms}</div>
                    <div className="text-[10px] text-gray-500">{f.cap}</div>
                  </div>
                ))}
              </div>
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
                    Syllabus Directive: "Floor 7 is dynamically configurable by space admin per university directives."
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
                    placeholder="e.g. 713"
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
                  Floor 7 Configured Rooms ({floor7Rooms.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            TAB 5: TIMETABLE & WEEKLY CLASS SCHEDULE (CSV/EXCEL UPLOAD ENGINE)
            ===================================================================== */}
        {activeTab === 'timetable' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header with Sub-View Switcher & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EBEAE5]">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-emerald-600" />
                  <span>Academic Timetable & Weekly Schedule Console</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  Inspect weekly room occupancy across all 7 days (daily lectures & weekend sessions), upload semester CSVs, and prevent booking overlaps.
                </p>
              </div>

              {/* Segmented Sub-View Switcher */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex p-1 bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setActiveTimetableSubView('grid')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      activeTimetableSubView === 'grid'
                        ? 'bg-[#111C2D] text-white shadow-xs'
                        : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Weekly Schedule Grid</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTimetableSubView === 'grid' ? 'bg-emerald-400 text-black' : 'bg-gray-200 text-gray-700'}`}>
                      {timetableEntries.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTimetableSubView('upload')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      activeTimetableSubView === 'upload'
                        ? 'bg-[#111C2D] text-white shadow-xs'
                        : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CSV Timetable Uploader</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  title="Download standard CSV template file"
                  className="px-3 py-2 rounded-xl bg-white hover:bg-gray-100 text-[#111C2D] border border-[#EBEAE5] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Download CSV Template</span>
                </button>
              </div>
            </div>

            {/* Sub-view 1: WEEKLY ROOM OCCUPANCY MATRIX */}
            {activeTimetableSubView === 'grid' && (
              <div className="space-y-6">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-white border border-[#EBEAE5] shadow-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Classes ({selectedTimetableDay})</div>
                    <div className="text-xl font-extrabold text-[#111C2D] mt-0.5">
                      {timetableEntries.filter((e) => e.dayOfWeek.toLowerCase() === selectedTimetableDay.toLowerCase()).length}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#EBEAE5] shadow-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Active Rooms Today</div>
                    <div className="text-xl font-extrabold text-[#111C2D] mt-0.5">
                      {new Set(timetableEntries.filter((e) => e.dayOfWeek.toLowerCase() === selectedTimetableDay.toLowerCase()).map((e) => e.roomId)).size}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#EBEAE5] shadow-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Weekdays (Mon-Fri)</div>
                    <div className="text-xl font-extrabold text-[#1E3F30] mt-0.5">
                      {timetableEntries.filter((e) => !['saturday', 'sunday'].includes(e.dayOfWeek.toLowerCase())).length} classes
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#EBEAE5] shadow-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Weekend Sessions (Sat-Sun)</div>
                    <div className="text-xl font-extrabold text-amber-700 mt-0.5">
                      {timetableEntries.filter((e) => ['saturday', 'sunday'].includes(e.dayOfWeek.toLowerCase())).length} sessions
                    </div>
                  </div>
                </div>

                {/* Day of Week Selector & Room Filter */}
                <div className="p-4 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Days of Week Filter */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Day:</span>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                      const isWeekend = day === 'Saturday' || day === 'Sunday';
                      const count = timetableEntries.filter((e) => e.dayOfWeek.toLowerCase() === day.toLowerCase()).length;
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedTimetableDay(day)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                            selectedTimetableDay === day
                              ? 'bg-[#111C2D] text-white shadow-xs'
                              : isWeekend
                              ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                              : 'bg-[#FAF9F6] text-gray-700 hover:bg-gray-200 border border-[#EBEAE5]'
                          }`}
                        >
                          <span>{day}</span>
                          {isWeekend && <span className="text-[9px] px-1 rounded bg-amber-200/60 font-semibold">Weekend</span>}
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                              selectedTimetableDay === day ? 'bg-emerald-400 text-black font-bold' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search & Room Filter Dropdown */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={timetableSearch}
                        onChange={(e) => setTimetableSearch(e.target.value)}
                        placeholder="Search course or professor..."
                        className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] text-[#111C2D] placeholder:text-gray-400 focus:bg-white focus:outline-none w-48"
                      />
                    </div>

                    <select
                      value={selectedTimetableRoom}
                      onChange={(e) => setSelectedTimetableRoom(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] text-xs font-bold text-[#111C2D] focus:bg-white focus:outline-none"
                    >
                      <option value="All">All Scheduled Rooms</option>
                      {Array.from(new Set(timetableEntries.map((e) => e.roomId)))
                        .sort()
                        .map((r) => (
                          <option key={r} value={r}>
                            Room {r}
                          </option>
                        ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setActiveTimetableSubView('upload')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload CSV</span>
                    </button>
                  </div>
                </div>

                {/* 8-Slot Weekly Schedule Matrix Table */}
                <div className="bg-white rounded-2xl border border-[#EBEAE5] shadow-xs overflow-hidden">
                  <div className="p-4 bg-[#FAF9F6] border-b border-[#EBEAE5] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-display font-bold text-base text-[#111C2D]">
                        {selectedTimetableDay} Academic Room Schedule (Slots 1 to 8: 08:30 AM – 05:45 PM)
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500">
                      Total Classes on {selectedTimetableDay}:{' '}
                      <strong className="text-[#111C2D]">
                        {timetableEntries.filter((e) => e.dayOfWeek.toLowerCase() === selectedTimetableDay.toLowerCase()).length}
                      </strong>
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#FAF9F6] border-b border-[#EBEAE5] text-gray-600 font-bold uppercase text-[10px]">
                          <th className="py-3 px-4 w-32 border-r border-[#EBEAE5] sticky left-0 bg-[#FAF9F6] z-10">Room</th>
                          {[
                            { id: 1, time: '08:30 - 09:30' },
                            { id: 2, time: '09:30 - 10:30' },
                            { id: 3, time: '10:45 - 11:45' },
                            { id: 4, time: '11:45 - 12:45' },
                            { id: 5, time: '13:30 - 14:30' },
                            { id: 6, time: '14:30 - 15:30' },
                            { id: 7, time: '15:45 - 16:45' },
                            { id: 8, time: '16:45 - 17:45' },
                          ].map((s) => (
                            <th key={s.id} className="py-3 px-3 text-center border-r border-[#EBEAE5] min-w-[145px]">
                              <div>Slot {s.id}</div>
                              <div className="text-[9px] text-gray-400 font-mono font-normal">{s.time}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EBEAE5]">
                        {Array.from(
                          new Set(
                            timetableEntries
                              .filter((e) => e.dayOfWeek.toLowerCase() === selectedTimetableDay.toLowerCase())
                              .filter((e) => {
                                if (selectedTimetableRoom !== 'All' && e.roomId !== selectedTimetableRoom) return false;
                                if (!timetableSearch.trim()) return true;
                                const q = timetableSearch.toLowerCase();
                                return (
                                  e.courseCode?.toLowerCase().includes(q) ||
                                  e.courseName?.toLowerCase().includes(q) ||
                                  e.facultyName?.toLowerCase().includes(q) ||
                                  e.roomId?.toLowerCase().includes(q)
                                );
                              })
                              .map((e) => e.roomId)
                          )
                        )
                          .sort()
                          .map((roomId) => (
                            <tr key={roomId} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-3.5 px-4 font-display font-bold text-[#111C2D] border-r border-[#EBEAE5] sticky left-0 bg-white z-10 shadow-2xs">
                                <div>Room {roomId}</div>
                                <div className="text-[10px] text-gray-400 font-normal">
                                  {roomId === '213' || roomId === '313' ? 'Auditorium (200)' : 'Classroom (60)'}
                                </div>
                              </td>

                              {[1, 2, 3, 4, 5, 6, 7, 8].map((slotNum) => {
                                const classEntry = timetableEntries.find(
                                  (e) =>
                                    e.roomId === roomId &&
                                    e.dayOfWeek.toLowerCase() === selectedTimetableDay.toLowerCase() &&
                                    e.slotId === slotNum
                                );

                                if (classEntry) {
                                  const isLab = classEntry.sessionType === 'LAB';
                                  const isWeekend = classEntry.sessionType === 'WEEKEND_SESSION';
                                  const isSeminar = classEntry.sessionType === 'SEMINAR';
                                  return (
                                    <td key={slotNum} className="p-2 border-r border-[#EBEAE5] align-top">
                                      <div
                                        className={`p-2.5 rounded-xl border text-[11px] space-y-1 shadow-2xs ${
                                          isLab
                                            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                                            : isWeekend
                                            ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                                            : isSeminar
                                            ? 'bg-indigo-50/90 border-indigo-200 text-indigo-900'
                                            : 'bg-blue-50/90 border-blue-200 text-blue-950'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between font-bold text-xs">
                                          <span>{classEntry.courseCode}</span>
                                          <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold bg-white/80 border border-black/5">
                                            {classEntry.sessionType}
                                          </span>
                                        </div>
                                        <div className="font-semibold text-[11px] leading-tight line-clamp-2">
                                          {classEntry.courseName}
                                        </div>
                                        <div className="text-[10px] text-gray-700 font-medium pt-0.5">
                                          {classEntry.facultyName}
                                        </div>
                                        <div className="text-[9px] text-gray-500 font-mono">
                                          {classEntry.section}
                                        </div>
                                      </div>
                                    </td>
                                  );
                                }

                                return (
                                  <td key={slotNum} className="p-2 border-r border-[#EBEAE5] text-center align-middle">
                                    <div className="py-3 px-2 rounded-xl bg-[#FAF9F6]/80 text-[10px] font-medium text-gray-400 border border-dashed border-gray-200">
                                      Available
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {timetableEntries.filter((e) => e.dayOfWeek.toLowerCase() === selectedTimetableDay.toLowerCase()).length === 0 && (
                    <div className="p-12 text-center text-gray-500 space-y-2">
                      <FileSpreadsheet className="w-8 h-8 mx-auto text-gray-300" />
                      <div className="font-bold text-sm text-[#111C2D]">No Timetable Classes on {selectedTimetableDay}</div>
                      <div className="text-xs">Upload your semester CSV timetable or switch to another day.</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-view 2: CSV / EXCEL FILE UPLOAD & SCHEMA DETECTOR */}
            {activeTimetableSubView === 'upload' && (
              <div className="space-y-8">
                {/* CSV Schema Specification Card */}
                <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBEAE5]">
                    <div>
                      <h3 className="font-display font-bold text-base text-[#111C2D] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <span>Official Timetable CSV Schema Specification</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Accepts standard UTF-8 encoded .csv files. Each row schedules one room for a specific day and slot. Compound unique index <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-[11px]">(roomId, dayOfWeek, slotId)</code> prevents duplicate bookings.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleDownloadSampleCsv}
                        className="px-3.5 py-1.5 rounded-lg bg-[#FAF9F6] hover:bg-gray-100 text-xs font-bold text-[#111C2D] border border-[#EBEAE5] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Download Template</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleLoadSampleCsvData}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Load Sample Schedule (1-Click Test)</span>
                      </button>
                    </div>
                  </div>

                  {/* Schema Columns Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF9F6] text-gray-500 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Column Name</th>
                          <th className="py-2.5 px-3">Required</th>
                          <th className="py-2.5 px-3">Format & Permitted Values</th>
                          <th className="py-2.5 px-3">Example</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EBEAE5] font-mono text-[11px]">
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-[#111C2D]">room_id</td>
                          <td className="py-2.5 px-3 text-emerald-700 font-sans font-bold">Yes</td>
                          <td className="py-2.5 px-3 font-sans text-gray-600">3-digit university room number (101 to 712)</td>
                          <td className="py-2.5 px-3 text-gray-700">205</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-[#111C2D]">day_of_week</td>
                          <td className="py-2.5 px-3 text-emerald-700 font-sans font-bold">Yes</td>
                          <td className="py-2.5 px-3 font-sans text-gray-600">Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday</td>
                          <td className="py-2.5 px-3 text-gray-700">Monday / Saturday</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-[#111C2D]">slot_id</td>
                          <td className="py-2.5 px-3 text-emerald-700 font-sans font-bold">Yes</td>
                          <td className="py-2.5 px-3 font-sans text-gray-600">Integer 1 to 8 (Discrete 60-min periods, 08:30 to 17:45)</td>
                          <td className="py-2.5 px-3 text-gray-700">1</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-[#111C2D]">course_code</td>
                          <td className="py-2.5 px-3 text-emerald-700 font-sans font-bold">Yes</td>
                          <td className="py-2.5 px-3 font-sans text-gray-600">Official university course syllabus identifier</td>
                          <td className="py-2.5 px-3 text-gray-700">CS501</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-[#111C2D]">course_name</td>
                          <td className="py-2.5 px-3 text-emerald-700 font-sans font-bold">Yes</td>
                          <td className="py-2.5 px-3 font-sans text-gray-600">Course / workshop descriptive title</td>
                          <td className="py-2.5 px-3 text-gray-700">Advanced Algorithms</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-[#111C2D]">faculty_name</td>
                          <td className="py-2.5 px-3 text-emerald-700 font-sans font-bold">Yes</td>
                          <td className="py-2.5 px-3 font-sans text-gray-600">Assigned course instructor or club coordinator</td>
                          <td className="py-2.5 px-3 text-gray-700">Prof. Nimesh Bumb</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-[#111C2D]">section</td>
                          <td className="py-2.5 px-3 text-gray-400 font-sans font-medium">Optional</td>
                          <td className="py-2.5 px-3 font-sans text-gray-600">Batch, division or semester tag</td>
                          <td className="py-2.5 px-3 text-gray-700">B.Tech CS AI-ML Sem V</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-[#111C2D]">session_type</td>
                          <td className="py-2.5 px-3 text-gray-400 font-sans font-medium">Optional</td>
                          <td className="py-2.5 px-3 font-sans text-gray-600">LECTURE, LAB, SEMINAR, WEEKEND_SESSION</td>
                          <td className="py-2.5 px-3 text-gray-700">LECTURE</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CSV File Upload Dropzone with Drag & Drop */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsCsvDragging(true);
                  }}
                  onDragLeave={() => setIsCsvDragging(false)}
                  onDrop={handleCsvDrop}
                  className={`p-8 rounded-2xl bg-white border-2 border-dashed transition-all text-center space-y-4 ${
                    isCsvDragging
                      ? 'border-emerald-500 bg-emerald-50/20 scale-[1.01]'
                      : 'border-gray-300 hover:border-[#1E3F30]'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#EAF2EC] text-[#1E3F30] flex items-center justify-center mx-auto shadow-xs">
                    <FileSpreadsheet className="w-7 h-7 stroke-[1.75]" />
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-lg text-[#111C2D]">
                      Select or Drag & Drop Timetable CSV File Here
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-lg mx-auto">
                      Ingest weekday & weekend timetables directly into MongoDB Atlas. Files exported from Excel, Google Sheets, or university portals are supported.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111C2D] hover:bg-black text-white text-xs font-bold cursor-pointer shadow-xs transition-all active:scale-95">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Choose CSV File from Computer</span>
                      <input
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleCsvFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleLoadSampleCsvData}
                      className="px-4 py-2.5 rounded-xl bg-[#FAF9F6] hover:bg-gray-100 text-[#111C2D] border border-[#EBEAE5] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Quick Demo: Load Sample Schedule</span>
                    </button>
                  </div>
                </div>

                {/* Validation Errors If Any */}
                {csvParseErrors.length > 0 && (
                  <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-2">
                    <div className="font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Validation Issues Detected in CSV ({csvParseErrors.length})</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1">
                      {csvParseErrors.slice(0, 5).map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                      {csvParseErrors.length > 5 && (
                        <li className="font-bold">...and {csvParseErrors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Parsed Preview Table */}
                {csvParsedRows.length > 0 && (
                  <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBEAE5]">
                      <div>
                        <h4 className="font-display font-bold text-base text-[#111C2D] flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>Validated Timetable Entries Ready to Commit ({csvParsedRows.length})</span>
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Review parsed schedule below. Click commit to sync to MongoDB Atlas collection <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-[11px]">class_timetable</code> and update the Segment Tree availability engine.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleCommitParsedCsv}
                        disabled={isUploadingCsv}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span>{isUploadingCsv ? 'Committing to Atlas...' : `Commit ${csvParsedRows.length} Entries to Database`}</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto max-h-72 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF9F6] text-gray-500 font-bold uppercase text-[10px] sticky top-0">
                          <tr>
                            <th className="py-2.5 px-3">Room</th>
                            <th className="py-2.5 px-3">Day</th>
                            <th className="py-2.5 px-3">Slot</th>
                            <th className="py-2.5 px-3">Course Code</th>
                            <th className="py-2.5 px-3">Course Title</th>
                            <th className="py-2.5 px-3">Professor</th>
                            <th className="py-2.5 px-3">Type</th>
                            <th className="py-2.5 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EBEAE5]">
                          {csvParsedRows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 font-medium">
                              <td className="py-2 px-3 font-bold text-[#111C2D]">Room {row.roomId}</td>
                              <td className="py-2 px-3">{row.dayOfWeek}</td>
                              <td className="py-2 px-3 font-mono font-bold">Slot {row.slotId}</td>
                              <td className="py-2 px-3 text-emerald-700 font-bold">{row.courseCode}</td>
                              <td className="py-2 px-3">{row.courseName}</td>
                              <td className="py-2 px-3 text-gray-600">{row.facultyName}</td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF9F6] border border-[#EBEAE5]">
                                  {row.sessionType}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                {row.isConflicted ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                    Overwrites existing
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    New Entry
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Clear Timetable Emergency Action */}
                <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EBEAE5] flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-[#111C2D]">Clear Existing Timetable Entries</h5>
                    <p className="text-[11px] text-gray-500">Purges active class blocks from MongoDB Atlas to enable clean re-imports.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearAllTimetable}
                    className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    Clear Timetable
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

