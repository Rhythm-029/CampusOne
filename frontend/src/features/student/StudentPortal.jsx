import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Clock3,
  Search,
  Filter,
  Plus,
  BookOpen,
  MessageSquare,
  Award,
  AlertCircle,
  ChevronRight,
  LogOut,
  Building,
  Laptop,
  Tv,
  Mic,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Tag,
  PackageSearch,
  Bell,
  Megaphone,
  RefreshCw,
} from 'lucide-react';
import LostFoundBrowsePage from '../lostfound/LostFoundBrowsePage';

export default function StudentPortal({ currentUser, onLogout, onNavigateLanding }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'spaces' | 'my-bookings' | 'faculty' | 'clubs'

  // Spaces Booking State
  const [bookingMode, setBookingMode] = useState('smart'); // 'smart' | 'catalog' | 'timetable'
  const [selectedFloor, setSelectedFloor] = useState('All');
  const [smartCapacity, setSmartCapacity] = useState(45);
  const [smartSlot, setSmartSlot] = useState(3);
  const [smartEquipment, setSmartEquipment] = useState(['Projector']);
  const [smartPurpose, setSmartPurpose] = useState('AI & ML Project Group Discussion');
  const [allocationSuccess, setAllocationSuccess] = useState(null);

  // Weekly Timetable & Room Occupancy State
  const [studentTimetableDay, setStudentTimetableDay] = useState('Monday');
  const [studentTimetableRoom, setStudentTimetableRoom] = useState('All');
  const [studentTimetableSearch, setStudentTimetableSearch] = useState('');
  const [studentTimetableEntries, setStudentTimetableEntries] = useState([
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

  // Real-time Campus Notifications
  const [campusNotifications, setCampusNotifications] = useState([
    {
      id: 'NOTIF-1',
      title: 'Mid-Term Examination & Lab Schedule Finalized',
      content: 'All B.Tech AI & ML batches: Room allocations for mid-term assessments are committed to the central availability matrix.',
      category: 'ACADEMIC',
      authorName: 'Academic Directorate',
      createdAt: '2026-02-24 09:00',
      pinned: true,
    },
    {
      id: 'NOTIF-2',
      title: 'Server Room & Lab 205 High-Performance GPU Cluster Maintenance',
      content: 'Scheduled infrastructure update on Sunday 06:00 AM – 09:00 AM. Cluster access will be paused during this maintenance window.',
      category: 'MAINTENANCE',
      authorName: 'Prof. Rajesh Verma',
      createdAt: '2026-02-23 16:30',
      pinned: false,
    },
  ]);

  const fetchCampusNotifications = () => {
    fetch('/api/v1/spaces/notifications')
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) return res.json();
        return null;
      })
      .then((data) => {
        const localNotifs = JSON.parse(localStorage.getItem('campusone_campus_notifications') || '[]');
        if (Array.isArray(data) && data.length > 0) {
          const ids = new Set(localNotifs.map(n => n.id));
          const merged = [...localNotifs, ...data.filter(d => !ids.has(d.id))];
          setCampusNotifications(merged);
        } else if (localNotifs.length > 0) {
          setCampusNotifications(localNotifs);
        }
      })
      .catch(() => {});
  };

  // My Bookings Data
  const [bookings, setBookings] = useState([
    {
      id: 'BK-2026-081',
      room: 'Room 205 (Smart Classroom)',
      floor: 'Floor 2',
      date: '2026-02-24',
      slots: 'Slot 3 & 4 (10:45 AM – 12:45 PM)',
      purpose: 'Advanced Algorithms Capstone Project Presentation',
      capacity: 60,
      status: 'APPROVED',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      approver: 'Prof. Rajesh Verma (Space Admin)',
      notes: 'Smartboard and PA mic confirmed available.',
    },
    {
      id: 'BK-2026-094',
      room: 'Room 313 (Special Auditorium)',
      floor: 'Floor 3',
      date: '2026-02-27',
      slots: 'Slot 5 & 6 (01:30 PM – 03:30 PM)',
      purpose: 'INC - The corporate club Conclave & Hands-on Workshop',
      capacity: 200,
      status: 'PENDING_APPROVAL',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      approver: 'Pending Estate Admin Review',
      notes: 'Requested dual laser projectors and stage microphones.',
    },
  ]);

  const fetchBookings = () => {
    const studentEmail = currentUser?.email;
    const url = studentEmail ? `/api/v1/spaces/requests?studentEmail=${encodeURIComponent(studentEmail)}` : '/api/v1/spaces/requests';
    fetch(url)
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) return res.json();
        return null;
      })
      .then((data) => {
        const localReqs = JSON.parse(localStorage.getItem('campusone_space_requests') || '[]');
        let combined = Array.isArray(data) && data.length > 0 ? [...data] : [];
        localReqs.forEach((lr) => {
          const idx = combined.findIndex(c => c.id === lr.id);
          if (idx >= 0) {
            combined[idx] = lr;
          } else {
            combined.unshift(lr);
          }
        });

        if (studentEmail && combined.length > 0) {
          combined = combined.filter(b => !b.studentEmail || b.studentEmail.toLowerCase() === studentEmail.toLowerCase());
        }

        if (combined.length > 0) {
          const mapped = combined.map((b) => ({
            id: b.id,
            room: b.roomName || `Room ${b.roomId}`,
            floor: `Floor ${b.roomId ? b.roomId.charAt(0) : '2'}`,
            date: b.date,
            slots: b.slotTime || `Slot ${b.slotId}`,
            purpose: b.purpose,
            capacity: b.capacity,
            status: b.status || 'PENDING_APPROVAL',
            statusColor:
              b.status === 'APPROVED'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : b.status === 'REJECTED'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-amber-50 text-amber-700 border-amber-200',
            approver:
              b.status === 'APPROVED'
                ? 'Prof. Rajesh Verma (Space Admin)'
                : b.status === 'REJECTED'
                ? 'Estate Operations'
                : 'Pending Estate Admin Review',
            notes: b.adminNotes || 'Submitted for central reservation review.',
          }));
          setBookings(mapped);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetch('/api/v1/spaces/timetable')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStudentTimetableEntries(data);
        }
      })
      .catch(() => {});

    fetchCampusNotifications();
    fetchBookings();

    // Real-time polling every 5 seconds for live sync with admin actions
    const interval = setInterval(() => {
      fetchCampusNotifications();
      fetchBookings();
    }, 5000);

    const handleStorageChange = () => {
      fetchCampusNotifications();
      fetchBookings();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUser?.email]);

  // Faculty Connect State
  const [selectedCourse, setSelectedCourse] = useState('CS501');
  const [consultationDate, setConsultationDate] = useState('2026-02-25');
  const [consultationSlot, setConsultationSlot] = useState('14:30 – 15:30');
  const [consultationTopic, setConsultationTopic] = useState('');
  const [consultationSuccess, setConsultationSuccess] = useState(false);
  const [consultations, setConsultations] = useState([
    {
      id: 'FC-102',
      faculty: 'Prof. Nimesh Bumb',
      course: 'CS501: Advanced Algorithms',
      date: '2026-02-25',
      time: '02:30 PM – 03:30 PM',
      topic: 'Algorithm Optimization & Project Guidance Clarification',
      status: 'CONFIRMED',
      office: 'Cabin 701, Floor 7 Academic Block',
    },
  ]);

  // Clubs State
  const [clubProposalTitle, setClubProposalTitle] = useState('');
  const [clubProposalDesc, setClubProposalDesc] = useState('');
  const [clubProposalAttendees, setClubProposalAttendees] = useState(80);
  const [clubProposalSuccess, setClubProposalSuccess] = useState(false);

  // Time Slots
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

  // Verified Campus Rooms Catalog (Floors 1-7: Rooms 101-113 to 701-712)
  const campusRooms = [
    // Floor 1 (101-113)
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `${100 + (i + 1)}`,
      name: `Room ${100 + (i + 1)}`,
      floor: 1,
      type: i === 4 || i === 8 ? 'Computer Lab' : 'Smart Classroom',
      capacity: 60,
      equipment: ['Laser Projector', 'Whiteboard', 'Wi-Fi 6', i % 2 === 0 ? 'Workstations' : 'PA Audio'],
      status: i === 2 || i === 7 ? 'Occupied (Timetable)' : 'Available',
    })),
    // Floor 2 (201-213, with 213 cap 200)
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `${200 + (i + 1)}`,
      name: i === 12 ? 'Room 213 (Special Auditorium)' : `Room ${200 + (i + 1)}`,
      floor: 2,
      type: i === 12 ? 'Special Auditorium' : i === 3 ? 'Seminar Hall' : 'Smart Classroom',
      capacity: i === 12 ? 200 : 60,
      equipment:
        i === 12
          ? ['Dual Laser Projectors', 'Stage PA Mic System', 'Tiered Seating', 'Acoustic Paneling']
          : ['Laser Projector', 'Smartboard', 'Wi-Fi 6'],
      status: i === 4 ? 'Occupied (Class)' : 'Available',
    })),
    // Floor 3 (301-313, with 313 cap 200)
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `${300 + (i + 1)}`,
      name: i === 12 ? 'Room 313 (Special Auditorium)' : `Room ${300 + (i + 1)}`,
      floor: 3,
      type: i === 12 ? 'Special Auditorium' : i === 6 ? 'Hardware Lab' : 'Smart Classroom',
      capacity: i === 12 ? 200 : 60,
      equipment:
        i === 12
          ? ['Dual Laser Projectors', 'PA Audio System', 'Stage Lighting', 'Tiered Seating']
          : ['Workstations', 'Laser Projector', 'Wi-Fi 6'],
      status: 'Available',
    })),
    // Floor 4 (401-413)
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `${400 + (i + 1)}`,
      name: `Room ${400 + (i + 1)}`,
      floor: 4,
      type: 'Smart Classroom',
      capacity: 60,
      equipment: ['Projector', 'Whiteboard', 'Wi-Fi 6'],
      status: 'Available',
    })),
    // Floor 5 (501-513)
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `${500 + (i + 1)}`,
      name: `Room ${500 + (i + 1)}`,
      floor: 5,
      type: 'Discussion & Seminar Room',
      capacity: 60,
      equipment: ['Display Screen', 'Interactive Board', 'Wi-Fi 6'],
      status: 'Available',
    })),
    // Floor 6 (601-613)
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `${600 + (i + 1)}`,
      name: `Room ${600 + (i + 1)}`,
      floor: 6,
      type: 'Innovation Lab & Studio',
      capacity: 60,
      equipment: ['Workstations', 'Prototyping Tools', 'Wi-Fi 6'],
      status: 'Available',
    })),
    // Floor 7 (701-712, 7th floor is the last floor)
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `${700 + (i + 1)}`,
      name: `Room ${700 + (i + 1)}`,
      floor: 7,
      type: 'Academic Seminar & Executive Room',
      capacity: 60,
      equipment: ['Interactive Display', 'Conference Audio', 'Wi-Fi 6'],
      status: 'Available',
    })),
  ];

  const handleEquipmentToggle = (item) => {
    setSmartEquipment((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleSmartAllocationSubmit = async (e) => {
    e.preventDefault();
    const matchedRoom = smartCapacity > 70 ? 'Room 213 (Special Auditorium, Cap 200)' : 'Room 205 (Smart Classroom, Cap 60)';
    const roomId = smartCapacity > 70 ? '213' : '205';
    const targetDate = '2026-02-26';
    const slotTimeStr = timeSlots[smartSlot - 1]?.time || '10:45 – 11:45';

    const reqPayload = {
      id: `BK-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentEmail: currentUser?.email || 'rhythm.singhal.btech2028@atlasskilltech.university',
      studentName: currentUser?.fullName || 'Rhythm Singhal',
      department: currentUser?.department || 'B.Tech CS AI-ML Sem V',
      roomId: roomId,
      roomName: matchedRoom,
      date: targetDate,
      slotId: smartSlot,
      slotTime: `Slot ${smartSlot} (${slotTimeStr})`,
      capacity: smartCapacity,
      equipment: smartEquipment,
      purpose: smartPurpose,
      status: 'PENDING_APPROVAL',
      adminNotes: `Optimal room matched satisfying capacity (${smartCapacity}) and equipment (${smartEquipment.join(', ')}).`,
    };

    try {
      const res = await fetch('/api/v1/spaces/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqPayload),
      });

      if (res.ok) {
        const created = await res.json().catch(() => null);
        if (created && created.id) {
          reqPayload.id = created.id;
        }
      }
    } catch {
      // Backend unavailable; proceed with local storage
    }

    // Persist locally for cross-tab live sync on Vercel
    const stored = JSON.parse(localStorage.getItem('campusone_space_requests') || '[]');
    localStorage.setItem('campusone_space_requests', JSON.stringify([reqPayload, ...stored]));
    window.dispatchEvent(new Event('storage'));

    fetchBookings();
    setAllocationSuccess({
      room: matchedRoom,
      slot: `Slot ${smartSlot} (${slotTimeStr})`,
      bookingId: reqPayload.id,
    });
  };

  const handleConsultationSubmit = (e) => {
    e.preventDefault();
    const facultyMap = {
      CS501: 'Prof. Nimesh Bumb',
      CS502: 'Prof. Yogesh Jadhav',
      CS503: 'Prof. Kunal Meher',
      CS504: 'Prof. Rabindra Henry',
      AI501: 'Prof. Lipika Majumdar',
      AI502: 'Prof. Mayank Srivastava',
      AI503: 'Prof. Maria Acharya',
      AI504: 'Prof. Amrita Banerjee',
    };

    const newAppointment = {
      id: `FC-${Math.floor(100 + Math.random() * 900)}`,
      faculty: facultyMap[selectedCourse] || 'Course Faculty',
      course: selectedCourse,
      date: consultationDate,
      time: consultationSlot,
      topic: consultationTopic || 'Coursework & Project Guidance',
      status: 'PENDING_FACULTY_CONFIRMATION',
      office: 'Floor 7 Faculty Block',
    };

    setConsultations([newAppointment, ...consultations]);
    setConsultationSuccess(true);
    setConsultationTopic('');
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#111C2D] flex flex-col font-sans selection:bg-[#1E3F30] selection:text-white">
      {/* =========================================================================
          TOP UNIVERSITY PORTAL NAVBAR
          ========================================================================= */}
      <header className="h-16 bg-white border-b border-[#EBEAE5] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Brand identity */}
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateLanding}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EAF2EC] text-[#1E3F30] border border-[#1E3F30]/20 flex items-center justify-center font-bold shadow-xs">
              <GraduationCap className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="font-display font-extrabold text-lg text-[#111C2D] tracking-tight leading-tight flex items-center gap-1.5">
                <span>Campus<span className="text-[#1E3F30]">One</span></span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-[#EAF2EC] border border-[#1E3F30]/20 text-[#1E3F30]">
                  Student Portal
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">ATLAS SkillTech University</p>
            </div>
          </button>

          <div className="h-5 w-px bg-gray-200 hidden md:block" />

          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-700 font-medium bg-[#FAF9F6] px-2.5 py-1 rounded-full border border-[#EBEAE5]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Semester V 2026-27 (Spring)</span>
          </div>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#EAF2EC] text-[#1E3F30] border border-[#1E3F30]/20 font-bold text-xs flex items-center justify-center shadow-xs">
              {currentUser?.fullName ? currentUser.fullName.substring(0, 2).toUpperCase() : 'AS'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-[#111C2D] leading-tight">
                {currentUser?.fullName || 'Ananya Sharma'}
              </div>
              <div className="text-[11px] text-gray-500 font-mono">
                {currentUser?.email || 'ananya.student@atlasskilltech.university'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign out of Student Portal"
            className="p-2 rounded-lg text-gray-400 hover:text-[#BA4A38] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN NAVIGATION BAR (SUB-HEADER TABS)
          ========================================================================= */}
      <div className="w-full bg-white border-b border-[#EBEAE5] px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-6 overflow-x-auto py-2 text-xs sm:text-sm font-semibold">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Layers },
            { id: 'spaces', label: 'Campus Spaces & Room Booking', icon: Calendar },
            { id: 'lostfound', label: 'Lost & Found Desk', icon: Tag },
            { id: 'my-bookings', label: 'My Bookings', icon: Clock },
            { id: 'faculty', label: 'Faculty Connect', icon: BookOpen },
            { id: 'clubs', label: 'Events & Student Clubs', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3 rounded-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E3F30] text-white shadow-xs'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MAIN PORTAL CONTENT AREA
          ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 space-y-8">
        {/* =====================================================================
            TAB 1: DASHBOARD OVERVIEW
            ===================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Welcome banner with subtle light styling */}
            <div className="p-8 rounded-2xl bg-gradient-to-r from-white via-[#FAF9F6] to-[#FAF9F6] border border-[#EBEAE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-[#1E3F30]">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF2EC] text-[#1E3F30] border border-[#1E3F30]/20">
                  <Sparkles className="w-3.5 h-3.5 text-[#1E3F30]" />
                  <span>Welcome back, {currentUser?.fullName || 'Ananya'}</span>
                </div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#111C2D] tracking-tight">
                  Academic Operations Terminal
                </h1>
                <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
                  Reserve academic spaces with non-overlapping slot guarantees, connect with course faculty for 1-on-1 consultations, and propose club activities.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setActiveTab('spaces');
                    setBookingMode('smart');
                  }}
                  className="px-5 py-3 rounded-xl bg-[#1E3F30] hover:bg-[#152C22] text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Space</span>
                </button>
                <button
                  onClick={() => setActiveTab('faculty')}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-gray-50 text-[#111C2D] border border-gray-300 text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#1E3F30]" />
                  <span>Faculty Consultation</span>
                </button>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-6 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Bookings</span>
                  <Calendar className="w-5 h-5 text-[#1E3F30]" />
                </div>
                <div className="text-3xl font-display font-extrabold text-[#111C2D]">
                  {bookings.length}
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>1 Approved for this week</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Campus Rooms</span>
                  <Building className="w-5 h-5 text-[#1E3F30]" />
                </div>
                <div className="text-3xl font-display font-extrabold text-[#111C2D]">90</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Floors 1–7 (Rooms 101–712)</div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Enrolled Courses</span>
                  <BookOpen className="w-5 h-5 text-[#1E3F30]" />
                </div>
                <div className="text-3xl font-display font-extrabold text-[#111C2D]">3</div>
                <div className="text-xs text-gray-500 font-medium mt-1">CS501, CS502, AI503</div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Consultations</span>
                  <Users className="w-5 h-5 text-[#1E3F30]" />
                </div>
                <div className="text-3xl font-display font-extrabold text-[#111C2D]">
                  {consultations.length}
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirmed with Prof. Nimesh Bumb</span>
                </div>
              </div>
            </div>

            {/* Real-time Campus Broadcast Announcements Feed */}
            <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EBEAE5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF2EC] text-[#1E3F30] flex items-center justify-center font-bold">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#111C2D]">
                      Campus Broadcasts & Official Announcements
                    </h3>
                    <p className="text-xs text-gray-500">Live operational updates and estate notices from university administration</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fetchCampusNotifications}
                  className="px-2.5 py-1 text-xs rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Alerts</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campusNotifications.map((notif) => {
                  const categoryBadgeColor =
                    notif.category === 'URGENT'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : notif.category === 'ACADEMIC'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : notif.category === 'MAINTENANCE'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                  return (
                    <div
                      key={notif.id}
                      className="p-4 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] hover:bg-white hover:shadow-xs transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${categoryBadgeColor}`}>
                          {notif.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {notif.createdAt}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-[#111C2D]">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {notif.content}
                      </p>
                      <div className="text-[11px] text-gray-400 pt-1 border-t border-gray-200/60 flex items-center justify-between">
                        <span>Issued by: <strong className="text-gray-700">{notif.authorName}</strong></span>
                        {notif.pinned && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#EAF2EC] text-[#1E3F30]">
                            PINNED
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Reservation & Timetable Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Confirmed Upcoming Booking */}
              <div className="lg:col-span-2 p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#EBEAE5]">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#111C2D]">
                      Next Confirmed Space Booking
                    </h3>
                    <p className="text-xs text-gray-500">Estate Administrator verified and approved</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Space Approved</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Assigned Room
                    </div>
                    <div className="font-display font-bold text-base text-[#111C2D]">
                      Room 205 (Smart Classroom)
                    </div>
                    <div className="text-xs text-gray-500">Floor 2 • Capacity: 60</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Reserved Timetable Slots
                    </div>
                    <div className="font-display font-bold text-base text-[#111C2D]">
                      Slots 3 & 4 (10:45 AM – 12:45 PM)
                    </div>
                    <div className="text-xs text-gray-500">Tuesday, 24 Feb 2026</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#EAF2EC]/60 border border-[#1E3F30]/15 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#1E3F30] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#1E3F30] leading-relaxed">
                    <strong>Algorithmic Multi-Slot Guarantee:</strong> Room 205 is reserved across discrete slots in the database (`room_booking_slots`) with unique constraints. No other class, maintenance block, or booking can overlap with this interval.
                  </div>
                </div>
              </div>

              {/* Right Col: Standard 8 Academic Slots */}
              <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-base text-[#111C2D]">
                  Standard Daily Academic Slots
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Campus operations follow 8 discrete slots as configured in the academic timetable.
                </p>

                <div className="space-y-2 pt-2">
                  {timeSlots.map((s) => (
                    <div
                      key={s.num}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F6] border border-[#EBEAE5] text-xs"
                    >
                      <span className="font-bold text-[#111C2D]">Slot {s.num}</span>
                      <span className="font-mono text-gray-600">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: CAMPUS SPACES & ROOM BOOKING
            ===================================================================== */}
        {activeTab === 'spaces' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top toggle: Smart Allocation vs Exact Room Catalog */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEAE5]">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                  Reserve Academic Spaces
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Choose between automatic optimal room matching or selecting an exact room from the campus inventory.
                </p>
              </div>

              <div className="p-1 bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl flex items-center gap-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setBookingMode('smart')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    bookingMode === 'smart'
                      ? 'bg-[#1E3F30] text-white shadow-xs'
                      : 'text-gray-600 hover:text-[#111C2D]'
                  }`}
                >
                  Smart Room Allocation
                </button>
                <button
                  type="button"
                  onClick={() => setBookingMode('catalog')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    bookingMode === 'catalog'
                      ? 'bg-[#1E3F30] text-white shadow-xs'
                      : 'text-gray-600 hover:text-[#111C2D]'
                  }`}
                >
                  Browse Exact Rooms (Floors 1–7)
                </button>
                <button
                  type="button"
                  onClick={() => setBookingMode('timetable')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    bookingMode === 'timetable'
                      ? 'bg-[#1E3F30] text-white shadow-xs'
                      : 'text-gray-600 hover:text-[#111C2D]'
                  }`}
                >
                  Weekly Class Timetable
                </button>
              </div>
            </div>

            {bookingMode === 'smart' ? (
              /* SMART ALLOCATION MODE */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Col */}
                <div className="lg:col-span-2 p-8 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] text-[#1E3F30] flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#111C2D]">
                        Smart Room Allocation Engine
                      </h3>
                      <p className="text-xs text-gray-500">
                        Automated matching by room capacity, floor, and equipment
                      </p>
                    </div>
                  </div>

                  {allocationSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2">
                      <div className="font-bold flex items-center gap-1.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Room Allocated Successfully!</span>
                      </div>
                      <p>
                        The allocation algorithm matched your requirements to <strong>{allocationSuccess.room}</strong> for <strong>{allocationSuccess.slot}</strong>.
                      </p>
                      <div className="text-[11px] text-emerald-700">
                        Request ID: <span className="font-mono font-bold">{allocationSuccess.bookingId}</span> • Submitted to Space Admin Approval Queue.
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSmartAllocationSubmit} className="space-y-6">
                    {/* Capacity Slider */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-[#111C2D] uppercase tracking-wider">
                          Required Student Capacity
                        </label>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF2EC] text-[#1E3F30]">
                          {smartCapacity} Seats
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        step="5"
                        value={smartCapacity}
                        onChange={(e) => setSmartCapacity(Number(e.target.value))}
                        className="w-full accent-[#1E3F30] cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                        <span>10 (Discussion)</span>
                        <span>60 (Ordinary Classrooms)</span>
                        <span>200 (Rooms 213 & 313)</span>
                      </div>
                    </div>

                    {/* Time Slot Selector */}
                    <div>
                      <label className="block text-xs font-bold text-[#111C2D] uppercase tracking-wider mb-2">
                        Select Academic Slot
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {timeSlots.map((s) => (
                          <button
                            key={s.num}
                            type="button"
                            onClick={() => setSmartSlot(s.num)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              smartSlot === s.num
                                ? 'bg-[#1E3F30] text-white border-[#1E3F30]'
                                : 'bg-[#FAF9F6] border-[#EBEAE5] text-[#111C2D] hover:bg-gray-100'
                            }`}
                          >
                            <div className="text-xs font-bold">Slot {s.num}</div>
                            <div className={`text-[10px] ${smartSlot === s.num ? 'text-white/80' : 'text-gray-500'}`}>
                              {s.time}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Required Equipment Multi-Select */}
                    <div>
                      <label className="block text-xs font-bold text-[#111C2D] uppercase tracking-wider mb-2">
                        Required Facilities & Equipment
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { name: 'Projector', icon: Tv },
                          { name: 'PA Audio Mic', icon: Mic },
                          { name: 'Linux PCs', icon: Laptop },
                          { name: 'Smartboard', icon: Layers },
                        ].map((eq) => {
                          const isSelected = smartEquipment.includes(eq.name);
                          const Icon = eq.icon;
                          return (
                            <button
                              key={eq.name}
                              type="button"
                              onClick={() => handleEquipmentToggle(eq.name)}
                              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#EAF2EC] text-[#1E3F30] border-[#1E3F30]'
                                  : 'bg-white border-[#EBEAE5] text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#1E3F30]' : 'text-gray-400'}`} />
                              <span>{eq.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Purpose / Notes */}
                    <div>
                      <label className="block text-xs font-bold text-[#111C2D] uppercase tracking-wider mb-1.5">
                        Event / Purpose Description
                      </label>
                      <input
                        type="text"
                        value={smartPurpose}
                        onChange={(e) => setSmartPurpose(e.target.value)}
                        placeholder="e.g. Capstone Presentation or INC - The corporate club Meet"
                        required
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EBEAE5] bg-white text-[#111C2D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3F30]/30 focus:border-[#1E3F30]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#1E3F30] hover:bg-[#152C22] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Find & Allocate Compatible Space</span>
                    </button>
                  </form>
                </div>

                {/* Allocation Guidelines Card */}
                <div className="space-y-6">
                  <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                    <h3 className="font-display font-bold text-base text-[#111C2D] flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#1E3F30]" />
                      <span>Automated Space Allocation</span>
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      CampusOne automatically balances room capacity and equipment criteria to provide conflict-free reservations without capacity waste.
                    </p>

                    <div className="space-y-2 pt-2 border-t border-[#EBEAE5] text-xs">
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">Allocation Criteria:</span>
                        <span className="font-bold text-[#111C2D]">Capacity & Equipment Fit</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">Inventory Scope:</span>
                        <span className="font-bold text-[#111C2D]">Floors 1 through 7</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">Overlap Prevention:</span>
                        <span className="font-bold text-[#111C2D]">Multi-Slot Unique Lock</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#EBEAE5] space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#1E3F30]">
                      Approval Policy
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Per university policy, every room booking requires Space Admin approval. Once approved, the allocated slots are committed with database uniqueness constraints to prevent concurrent double-booking.
                    </p>
                  </div>
                </div>
              </div>
            ) : bookingMode === 'catalog' ? (
              /* EXACT ROOM CATALOG (90 ROOMS ACROSS FLOORS 1–7) */
              <div className="space-y-6">
                {/* Floor filter bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mr-2">
                    Filter by Floor:
                  </span>
                  {['All', '1', '2', '3', '4', '5', '6', '7'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFloor(f)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedFloor === f
                          ? 'bg-[#1E3F30] text-white shadow-xs'
                          : 'bg-white border border-[#EBEAE5] text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {f === 'All' ? 'All Floors (1–7: 90 Rooms)' : f === '7' ? 'Floor 7 (Last Floor: 701-712)' : `Floor ${f}`}
                    </button>
                  ))}
                </div>

                {/* Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campusRooms
                    .filter((r) => selectedFloor === 'All' || r.floor === Number(selectedFloor))
                    .map((room) => (
                      <div
                        key={room.id}
                        className="p-6 rounded-2xl bg-white border border-[#EBEAE5] hover:border-[#1E3F30]/40 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-xs font-bold text-[#1E3F30]">Floor {room.floor}</div>
                              <h4 className="font-display font-bold text-lg text-[#111C2D]">
                                {room.name}
                              </h4>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                room.capacity === 200
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-[#FAF9F6] text-gray-700 border-[#EBEAE5]'
                              }`}
                            >
                              Cap: {room.capacity}
                            </span>
                          </div>

                          <div className="text-xs text-gray-500">{room.type}</div>

                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#EBEAE5]">
                            {room.equipment.map((eq) => (
                              <span
                                key={eq}
                                className="px-2 py-0.5 rounded-md bg-[#FAF9F6] text-[10px] font-medium text-gray-600 border border-[#EBEAE5]"
                              >
                                {eq}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-5 mt-5 border-t border-[#EBEAE5] flex items-center justify-between">
                          <span
                            className={`text-xs font-bold ${
                              room.status === 'Available' ? 'text-emerald-600' : 'text-gray-400'
                            }`}
                          >
                            ● {room.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSmartPurpose(`Specific booking for ${room.name}`);
                              setSmartCapacity(room.capacity);
                              setBookingMode('smart');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#FAF9F6] hover:bg-[#1E3F30] hover:text-white text-xs font-semibold text-[#111C2D] border border-[#EBEAE5] transition-all cursor-pointer"
                          >
                            Book Room →
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              /* WEEKLY CLASS TIMETABLE GRID (DAILY & WEEKEND SESSIONS) */
              <div className="space-y-6">
                {/* Controls: Day Selector, Room Filter, Search */}
                <div className="p-4 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Days Selector */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Day:</span>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                      const isWeekend = day === 'Saturday' || day === 'Sunday';
                      const count = studentTimetableEntries.filter((e) => e.dayOfWeek?.toLowerCase() === day.toLowerCase()).length;
                      return (
                        <button
                          key={day}
                          onClick={() => setStudentTimetableDay(day)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                            studentTimetableDay === day
                              ? 'bg-[#1E3F30] text-white shadow-xs'
                              : isWeekend
                              ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                              : 'bg-[#FAF9F6] text-gray-700 hover:bg-gray-200 border border-[#EBEAE5]'
                          }`}
                        >
                          <span>{day}</span>
                          {isWeekend && <span className="text-[9px] px-1 rounded bg-amber-200/70 text-amber-900 font-semibold">Weekend</span>}
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${studentTimetableDay === day ? 'bg-emerald-300 text-black font-bold' : 'bg-gray-200 text-gray-700'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Room & Search Filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={studentTimetableSearch}
                        onChange={(e) => setStudentTimetableSearch(e.target.value)}
                        placeholder="Search course or faculty..."
                        className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] text-[#111C2D] placeholder:text-gray-400 focus:bg-white focus:outline-none w-48"
                      />
                    </div>

                    <select
                      value={studentTimetableRoom}
                      onChange={(e) => setStudentTimetableRoom(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-[#EBEAE5] bg-[#FAF9F6] text-xs font-bold text-[#111C2D] focus:bg-white focus:outline-none"
                    >
                      <option value="All">All Scheduled Rooms</option>
                      {Array.from(new Set(studentTimetableEntries.map((e) => e.roomId)))
                        .sort()
                        .map((r) => (
                          <option key={r} value={r}>
                            Room {r}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Timetable Matrix */}
                <div className="bg-white rounded-2xl border border-[#EBEAE5] shadow-xs overflow-hidden">
                  <div className="p-4 bg-[#FAF9F6] border-b border-[#EBEAE5] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#1E3F30]" />
                      <h3 className="font-display font-bold text-base text-[#111C2D]">
                        {studentTimetableDay} Academic Room Schedule & Class Bookings
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500">
                      Total Classes:{' '}
                      <strong className="text-[#111C2D]">
                        {studentTimetableEntries.filter((e) => e.dayOfWeek?.toLowerCase() === studentTimetableDay.toLowerCase()).length}
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
                            <th key={s.id} className="py-3 px-3 text-center border-r border-[#EBEAE5] min-w-[135px]">
                              <div>Slot {s.id}</div>
                              <div className="text-[9px] text-gray-400 font-mono font-normal">{s.time}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EBEAE5]">
                        {Array.from(
                          new Set(
                            studentTimetableEntries
                              .filter((e) => e.dayOfWeek?.toLowerCase() === studentTimetableDay.toLowerCase())
                              .filter((e) => {
                                if (studentTimetableRoom !== 'All' && e.roomId !== studentTimetableRoom) return false;
                                if (!studentTimetableSearch.trim()) return true;
                                const q = studentTimetableSearch.toLowerCase();
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
                              <td className="py-3 px-4 font-display font-bold text-[#111C2D] border-r border-[#EBEAE5] sticky left-0 bg-white z-10 shadow-2xs">
                                <div>Room {roomId}</div>
                                <div className="text-[10px] text-gray-400 font-normal">
                                  {roomId === '213' || roomId === '313' ? 'Auditorium (200)' : 'Classroom (60)'}
                                </div>
                              </td>

                              {[1, 2, 3, 4, 5, 6, 7, 8].map((slotNum) => {
                                const classEntry = studentTimetableEntries.find(
                                  (e) =>
                                    e.roomId === roomId &&
                                    e.dayOfWeek?.toLowerCase() === studentTimetableDay.toLowerCase() &&
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
                                      </div>
                                    </td>
                                  );
                                }

                                return (
                                  <td key={slotNum} className="p-2 border-r border-[#EBEAE5] text-center align-middle">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setBookingMode('smart');
                                        setSmartSlot(slotNum);
                                      }}
                                      title={`Book Room ${roomId} at Slot ${slotNum}`}
                                      className="w-full py-2.5 px-2 rounded-xl bg-emerald-50/50 hover:bg-emerald-100 text-[10px] font-semibold text-emerald-800 border border-dashed border-emerald-200 transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 group"
                                    >
                                      <span className="group-hover:scale-105 transition-transform">Available</span>
                                      <span className="text-[9px] text-emerald-600 font-normal opacity-80 group-hover:opacity-100">Click to Book</span>
                                    </button>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {studentTimetableEntries.filter((e) => e.dayOfWeek?.toLowerCase() === studentTimetableDay.toLowerCase()).length === 0 && (
                    <div className="p-12 text-center text-gray-500 space-y-2">
                      <Calendar className="w-8 h-8 mx-auto text-gray-300" />
                      <div className="font-bold text-sm text-[#111C2D]">No Timetable Classes on {studentTimetableDay}</div>
                      <div className="text-xs">All rooms are available for student reservation on this day.</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            LOST & FOUND DESK TAB
            ===================================================================== */}
        {activeTab === 'lostfound' && (
          <div className="space-y-6 animate-fade-in">
            <LostFoundBrowsePage />
          </div>
        )}

        {/* =====================================================================
            TAB 3: MY BOOKINGS
            ===================================================================== */}
        {activeTab === 'my-bookings' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBEAE5]">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                  My Reservation Records
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Track room reservation lifecycle: Submitted → Space Admin Review → Approved.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchBookings}
                  className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-[#111C2D] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Status</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('spaces');
                    setBookingMode('smart');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1E3F30] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Space Request</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-6 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-gray-500">{b.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${b.statusColor}`}>
                        {b.status}
                      </span>
                      <span className="text-xs text-gray-400">• {b.floor}</span>
                    </div>

                    <h4 className="font-display font-bold text-lg text-[#111C2D]">{b.room}</h4>
                    <p className="text-xs text-gray-600 font-medium">
                      <strong>Purpose:</strong> {b.purpose}
                    </p>

                    <div className="text-xs text-gray-500 flex flex-wrap items-center gap-4 pt-1">
                      <span>
                        <strong>Date:</strong> {b.date}
                      </span>
                      <span>
                        <strong>Slots:</strong> {b.slots}
                      </span>
                      <span>
                        <strong>Approver:</strong> {b.approver}
                      </span>
                    </div>

                    {b.notes && (
                      <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#EBEAE5] text-xs text-gray-600">
                        {b.notes}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {b.status === 'PENDING_APPROVAL' && (
                      <button
                        onClick={() => setBookings(bookings.filter((x) => x.id !== b.id))}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer"
                      >
                        Cancel Request
                      </button>
                    )}
                    <div className="text-xs font-semibold text-[#1E3F30] flex items-center gap-1">
                      <span>View Audit Log</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: FACULTY CONNECT
            ===================================================================== */}
        {activeTab === 'faculty' && (
          <div className="space-y-8 animate-fade-in">
            <div className="pb-4 border-b border-[#EBEAE5]">
              <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                Faculty Connect & Consultations
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Select your enrolled courses and book 1-on-1 office consultations with assigned professors.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Form to schedule consultation */}
              <div className="lg:col-span-2 p-8 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-6">
                <h3 className="font-display font-bold text-lg text-[#111C2D]">
                  Schedule a Consultation Appointment
                </h3>

                {consultationSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Appointment request submitted to professor! You will receive confirmation on your dashboard.
                    </span>
                  </div>
                )}

                <form onSubmit={handleConsultationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#111C2D] uppercase tracking-wider mb-1.5">
                      Select Enrolled Course & Assigned Professor
                    </label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EBEAE5] bg-white text-[#111C2D] focus:outline-none focus:ring-2 focus:ring-[#1E3F30]/30"
                    >
                      <option value="CS501">CS501: Advanced Algorithms — Prof. Nimesh Bumb</option>
                      <option value="CS502">CS502: Distributed Operating Systems — Prof. Yogesh Jadhav</option>
                      <option value="CS503">CS503: Database Engineering & Scalability — Prof. Kunal Meher</option>
                      <option value="CS504">CS504: Computer Networks & Security — Prof. Rabindra Henry</option>
                      <option value="AI501">AI501: Machine Learning & Deep Learning — Prof. Lipika Majumdar</option>
                      <option value="AI502">AI502: Data Structures & System Design — Prof. Mayank Srivastava</option>
                      <option value="AI503">AI503: Human-Computer Interaction & Design — Prof. Maria Acharya</option>
                      <option value="AI504">AI504: Cloud Computing & Big Data — Prof. Amrita Banerjee</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#111C2D] uppercase tracking-wider mb-1.5">
                        Consultation Date
                      </label>
                      <input
                        type="date"
                        value={consultationDate}
                        onChange={(e) => setConsultationDate(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EBEAE5] bg-white text-[#111C2D] focus:outline-none focus:ring-2 focus:ring-[#1E3F30]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111C2D] uppercase tracking-wider mb-1.5">
                        Available Office Hours
                      </label>
                      <select
                        value={consultationSlot}
                        onChange={(e) => setConsultationSlot(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EBEAE5] bg-white text-[#111C2D] focus:outline-none focus:ring-2 focus:ring-[#1E3F30]/30"
                      >
                        <option value="11:45 – 12:45">Slot 4 (11:45 AM – 12:45 PM)</option>
                        <option value="14:30 – 15:30">Slot 6 (02:30 PM – 03:30 PM)</option>
                        <option value="16:45 – 17:45">Slot 8 (04:45 PM – 05:45 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111C2D] uppercase tracking-wider mb-1.5">
                      Consultation Topic & Specific Questions
                    </label>
                    <textarea
                      rows={3}
                      value={consultationTopic}
                      onChange={(e) => setConsultationTopic(e.target.value)}
                      placeholder="e.g. Coursework clarification, concept discussion, or capstone guidance"
                      required
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EBEAE5] bg-white text-[#111C2D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3F30]/30"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1E3F30] hover:bg-[#152C22] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Request Consultation Meeting</span>
                  </button>
                </form>
              </div>

              {/* Right Col: Consultation List */}
              <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-base text-[#111C2D]">
                  My Scheduled Consultations
                </h3>

                <div className="space-y-3">
                  {consultations.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EBEAE5] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111C2D]">{c.faculty}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'CONFIRMED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="text-gray-500">{c.course}</div>
                      <div className="font-medium text-gray-700">
                        {c.date} • {c.time}
                      </div>
                      <div className="text-gray-600 italic">"{c.topic}"</div>
                      <div className="text-[11px] text-gray-400">Location: {c.office}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: EVENTS & STUDENT CLUBS
            ===================================================================== */}
        {activeTab === 'clubs' && (
          <div className="space-y-8 animate-fade-in">
            <div className="pb-4 border-b border-[#EBEAE5]">
              <h2 className="font-display font-extrabold text-2xl text-[#111C2D] tracking-tight">
                Events & Student Clubs
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Submit campus event proposals, track faculty and event administrator reviews, and request auditorium venues.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Proposal Submission */}
              <div className="lg:col-span-2 p-8 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-6">
                <h3 className="font-display font-bold text-lg text-[#111C2D]">
                  Submit New Club Event Proposal
                </h3>

                {clubProposalSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Event proposal submitted! Sent to Faculty Coordinator for Stage 1 document review.
                    </span>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setClubProposalSuccess(true);
                    setClubProposalTitle('');
                    setClubProposalDesc('');
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#111C2D] uppercase tracking-wider mb-1.5">
                        Organizing Student Club
                      </label>
                      <select className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EBEAE5] bg-white text-[#111C2D]">
                        <option>INC - The corporate club</option>
                        <option>Highflyers</option>
                        <option>Agile</option>
                        <option>Futureprenuers</option>
                        <option>The student council</option>
                        <option>Finterest</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111C2D] uppercase tracking-wider mb-1.5">
                        Club Coordinator
                      </label>
                      <select className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EBEAE5] bg-white text-[#111C2D]">
                        <option>Kunal Ramchandani</option>
                        <option>Aaren</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111C2D] uppercase tracking-wider mb-1.5">
                        Expected Attendance
                      </label>
                      <input
                        type="number"
                        value={clubProposalAttendees}
                        onChange={(e) => setClubProposalAttendees(Number(e.target.value))}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EBEAE5] bg-white text-[#111C2D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111C2D] uppercase tracking-wider mb-1.5">
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={clubProposalTitle}
                      onChange={(e) => setClubProposalTitle(e.target.value)}
                      placeholder="e.g. HackATLAS 2026: 24-Hour AI Hackathon"
                      required
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EBEAE5] bg-white text-[#111C2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111C2D] uppercase tracking-wider mb-1.5">
                      Event Summary & Venue Requirement
                    </label>
                    <textarea
                      rows={3}
                      value={clubProposalDesc}
                      onChange={(e) => setClubProposalDesc(e.target.value)}
                      placeholder="Describe target dates, key objectives, and required venue (e.g. Auditorium 213 with PA audio system)."
                      required
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#EBEAE5] bg-white text-[#111C2D]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1E3F30] hover:bg-[#152C22] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Submit Proposal for Approval Pipeline</span>
                  </button>
                </form>
              </div>

              {/* Approval Pipeline Info */}
              <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-base text-[#111C2D]">
                  CampusOne Multi-Stage Approval Pipeline
                </h3>
                <div className="space-y-4 pt-2 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#EAF2EC] text-[#1E3F30] font-bold flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-[#111C2D]">Faculty Review</div>
                      <p className="text-gray-500">Club faculty coordinator reviews event proposal and budget.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#EAF2EC] text-[#1E3F30] font-bold flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-[#111C2D]">Event Admin Review</div>
                      <p className="text-gray-500">Dean of Student Affairs evaluates campus policy compliance.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#EAF2EC] text-[#1E3F30] font-bold flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <div className="font-bold text-[#111C2D]">Space Allocation</div>
                      <p className="text-gray-500">Estate Administrator approves venue allocation with non-overlapping database slots.</p>
                    </div>
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

