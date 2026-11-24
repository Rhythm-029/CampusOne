import React, { useState } from 'react';
import { CalendarDays, Users, CheckCircle2, SlidersHorizontal, Plus, Info } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function RoomCatalogPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rooms = [
    {
      id: '101',
      name: 'Room 101',
      block: 'Floor 1',
      capacity: 60,
      type: 'Classroom',
      equipment: ['Laser Projector', 'Whiteboard', 'Wi-Fi 6'],
      status: 'available',
    },
    {
      id: '112',
      name: 'Room 112',
      block: 'Floor 1',
      capacity: 60,
      type: 'Classroom',
      equipment: ['Laser Projector', 'Whiteboard', 'Wi-Fi 6'],
      status: 'available',
    },
    {
      id: '113',
      name: 'Room 113',
      block: 'Floor 1',
      capacity: 60,
      type: 'Classroom',
      equipment: ['Laser Projector', 'Whiteboard', 'Wi-Fi 6'],
      status: 'available',
    },
    {
      id: '205',
      name: 'Room 205',
      block: 'Floor 2',
      capacity: 60,
      type: 'Classroom',
      equipment: ['Interactive Smartboard', 'Soundbar', 'Wi-Fi 6'],
      status: 'available',
    },
    {
      id: '213',
      name: 'Room 213 (Special Auditorium)',
      block: 'Floor 2',
      capacity: 200,
      type: 'Auditorium',
      equipment: ['Dual Laser Projectors', 'PA Audio System', 'Podium Mic', 'Stage Lighting'],
      status: 'available',
    },
    {
      id: '313',
      name: 'Room 313 (Special Auditorium)',
      block: 'Floor 3',
      capacity: 200,
      type: 'Auditorium',
      equipment: ['Dual Laser Projectors', 'PA Audio System', 'Podium Mic', 'Stage Lighting'],
      status: 'available',
    },
    {
      id: '701',
      name: 'Room 701 (Floor 7 Executive Suite)',
      block: 'Floor 7 (Last Floor)',
      capacity: 60,
      type: 'Conference',
      equipment: ['Telepresence System', 'Dual Microphones', 'Motorized Screen'],
      status: 'available',
    },
    {
      id: '712',
      name: 'Room 712 (Floor 7 Capstone Room)',
      block: 'Floor 7 (Last Floor)',
      capacity: 60,
      type: 'Conference',
      equipment: ['Workstations', 'Display Screen', 'Wi-Fi 6'],
      status: 'available',
    },
  ];

  const categories = ['All', 'Discussion', 'Classroom', 'Lab', 'Auditorium', 'Conference'];

  const filteredRooms = selectedFilter === 'All'
    ? rooms
    : rooms.filter((r) => r.type === selectedFilter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy-900 tracking-tight">
            Campus Spaces & Facilities
          </h1>
          <p className="text-sm text-navy-500 mt-0.5">
            View room specifications, check live schedules, and submit reservation requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
            Request Room Allocation
          </Button>
        </div>
      </div>

      {/* Automated Allocation Callout */}
      <div className="p-4 rounded-xl bg-canvas-alt border border-border flex items-start gap-3">
        <Info className="w-5 h-5 text-forest shrink-0 mt-0.5" />
        <div className="text-xs text-navy-700 leading-relaxed">
          <span className="font-semibold text-navy-900">Automated Room Allocation: </span>
          Booking requests sharing the same target timeslot are automatically matched against physically available rooms satisfying capacity and equipment constraints. Confirmed allocations enforce database-level unique locks to eliminate overlapping bookings.
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === cat
                ? 'bg-forest text-white shadow-sm'
                : 'bg-surface text-navy-700 border border-border hover:bg-canvas-alt'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="flex flex-col justify-between" hover>
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-navy-400 uppercase tracking-wider">{room.id}</span>
                  <h3 className="font-display font-bold text-base text-navy-900 mt-0.5">{room.name}</h3>
                  <p className="text-xs text-navy-500 mt-0.5">{room.block}</p>
                </div>
                <Badge variant={room.status}>
                  {room.status === 'available' ? 'Available' : 'Reserved'}
                </Badge>
              </div>

              <div className="mt-4 pt-3 border-t border-border/80 space-y-2">
                <div className="flex items-center gap-2 text-xs text-navy-700">
                  <Users className="w-4 h-4 text-forest" />
                  <span>Maximum Capacity: <strong className="text-navy-900">{room.capacity} attendees</strong></span>
                </div>

                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-1.5">
                    Installed Equipment
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {room.equipment.map((eq, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] bg-canvas-alt text-navy-700 border border-border"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-navy-400 font-medium">Timeslot: 08:00 – 18:00</span>
              <Button
                variant={room.status === 'available' ? 'outline' : 'subtle'}
                size="sm"
                disabled={room.status !== 'available'}
                onClick={() => setIsModalOpen(true)}
              >
                {room.status === 'available' ? 'Select Space' : 'Occupied'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Booking Request Modal Shell */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-navy-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl border border-border max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-display font-bold text-navy-900">Request Room Allocation</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-navy-400 hover:text-navy-900 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Allocation request submitted for automated room matching.');
                setIsModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-navy-800 mb-1">Purpose / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., AI Club Workshop or Faculty Seminar"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-canvas focus:bg-surface focus:outline-none focus:ring-1 focus:ring-forest text-navy-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy-800 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    defaultValue="2026-02-20"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-canvas focus:bg-surface focus:outline-none focus:ring-1 focus:ring-forest text-navy-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-navy-800 mb-1">Timeslot</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-border bg-canvas focus:bg-surface focus:outline-none focus:ring-1 focus:ring-forest text-navy-900">
                    <option>09:00 AM – 11:00 AM</option>
                    <option>11:00 AM – 01:00 PM</option>
                    <option>02:00 PM – 04:00 PM</option>
                    <option>04:00 PM – 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy-800 mb-1">Expected Attendees</label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    defaultValue="25"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-canvas focus:bg-surface focus:outline-none focus:ring-1 focus:ring-forest text-navy-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-navy-800 mb-1">Preferred Room Type</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-border bg-canvas focus:bg-surface focus:outline-none focus:ring-1 focus:ring-forest text-navy-900">
                    <option>Any Compatible</option>
                    <option>Discussion</option>
                    <option>Classroom</option>
                    <option>Lab</option>
                    <option>Auditorium</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-canvas-alt rounded-lg border border-border text-[11px] text-navy-500">
                Requests are evaluated by the automated allocation system. You will receive confirmation on your dashboard once room assignment is approved.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

