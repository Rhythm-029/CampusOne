import React from 'react';
import { CalendarDays, PackageSearch, Clock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function DashboardOverview({ onNavigate }) {
  const upcomingBooking = {
    title: 'Project Discussion & Review',
    date: 'Tuesday, 20 Feb 2026',
    time: '02:00 PM – 04:00 PM',
    room: 'Room 205 (Smart Classroom, Floor 2)',
    status: 'available',
    statusLabel: 'Approved',
  };

  const roomStatusList = [
    { name: 'Room 205', type: 'Smart Classroom', capacity: 60, status: 'available', label: 'Available' },
    { name: 'Room 101', type: 'Smart Classroom', capacity: 60, status: 'available', label: 'Available' },
    { name: 'Room 213', type: 'Special Auditorium', capacity: 200, status: 'booked', label: 'Booked' },
    { name: 'Room 701', type: 'Academic Executive', capacity: 60, status: 'available', label: 'Available' },
  ];

  const recentReports = [
    {
      title: 'Blue Water Bottle',
      location: 'Found near Room 112, Floor 1',
      type: 'found',
      time: '2 hours ago',
    },
    {
      title: 'Wireless Earbuds (Black)',
      location: 'Lost in Room 105, Floor 1',
      type: 'lost',
      time: 'Yesterday',
    },
    {
      title: 'Student ID Card',
      location: 'Found near Room 113, Floor 1',
      type: 'found',
      time: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Editorial Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy-900 tracking-tight">
            Good afternoon, Ananya
          </h1>
          <p className="text-sm text-navy-500 mt-1">
            Here's what's happening on campus today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => onNavigate('allocation')}>
            <CalendarDays className="w-4 h-4" />
            Book a Space
          </Button>
        </div>
      </div>

      {/* Main Dual Quick-Action Cards (Matching Inspo bottom-left) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Action 1: Book a Space */}
        <div
          onClick={() => onNavigate('allocation')}
          className="group relative bg-surface rounded-xl border border-border hover:border-forest/40 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-lg bg-forest-light text-forest flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
              <CalendarDays className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-navy-400 group-hover:text-forest group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-navy-900 group-hover:text-forest transition-colors">
              Book a Space
            </h2>
            <p className="text-sm text-navy-500 mt-1 leading-relaxed">
              Reserve a room, lab or facility for your class, event or group activity.
            </p>
          </div>
        </div>

        {/* Action 2: Lost & Found */}
        <div
          onClick={() => onNavigate('lostfound')}
          className="group relative bg-surface rounded-xl border border-border hover:border-sand p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-lg bg-sand-light text-navy-800 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
              <PackageSearch className="w-6 h-6 text-navy-800" />
            </div>
            <ArrowRight className="w-5 h-5 text-navy-400 group-hover:text-navy-900 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-navy-900 group-hover:text-navy-800 transition-colors">
              Lost & Found
            </h2>
            <p className="text-sm text-navy-500 mt-1 leading-relaxed">
              Report a lost item, submit a found item, or search campus reports.
            </p>
          </div>
        </div>
      </div>

      {/* Tri-Column Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Upcoming Confirmed Booking */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">Your Upcoming Booking</span>
              <Badge variant="available">Approved</Badge>
            </div>
            <div className="mt-4 space-y-3">
              <h3 className="font-display font-bold text-base text-navy-900">{upcomingBooking.title}</h3>
              <div className="space-y-1.5 text-xs text-navy-500">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-navy-400" />
                  <span>{upcomingBooking.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-navy-400" />
                  <span>{upcomingBooking.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-navy-400" />
                  <span>{upcomingBooking.room}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-border mt-6">
            <button
              onClick={() => onNavigate('allocation')}
              className="text-xs font-semibold text-forest hover:underline flex items-center justify-between w-full"
            >
              <span>View All Bookings →</span>
            </button>
          </div>
        </Card>

        {/* Column 2: Today's Room Status */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">Room Availability (Today)</span>
              <button onClick={() => onNavigate('allocation')} className="text-xs font-semibold text-forest hover:underline">
                View All →
              </button>
            </div>
            <div className="mt-3 divide-y divide-border/60">
              {roomStatusList.map((room, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-navy-900">{room.name}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${room.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className={`text-xs font-medium ${room.status === 'available' ? 'text-forest font-semibold' : 'text-amber-800'}`}>
                      {room.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-border mt-3 text-[11px] text-navy-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            <span>Real-time campus room schedules</span>
          </div>
        </Card>

        {/* Column 3: Recent Lost & Found Feed */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">Recent Lost & Found Reports</span>
              <button onClick={() => onNavigate('lostfound')} className="text-xs font-semibold text-forest hover:underline">
                View All →
              </button>
            </div>
            <div className="mt-3 divide-y divide-border/60">
              {recentReports.map((report, idx) => (
                <div key={idx} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="font-medium text-navy-900 leading-snug">{report.title}</div>
                    <div className="text-[11px] text-navy-400 mt-0.5">{report.location}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant={report.type}>{report.type === 'found' ? 'Found' : 'Lost'}</Badge>
                    <span className="text-[10px] text-navy-400">{report.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-border mt-3">
            <Button variant="secondary" size="sm" className="w-full text-xs" onClick={() => onNavigate('lostfound')}>
              Search Reports
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
