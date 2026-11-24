import React, { useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  Tag,
  ArrowRight,
  UserCheck,
  Landmark,
  Search,
  Users,
  PackageSearch,
  ChevronRight,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

export default function LandingPage({ onEnterPortal, onOpenLoginModal }) {
  // Clear any hash from the URL on load so the page always starts smoothly at the top
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111C2D] flex flex-col font-sans selection:bg-[#1E3F30] selection:text-white">
      {/* =========================================================================
          TOP NAVBAR
          ========================================================================= */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#EBEAE5] sticky top-0 z-50 px-6 sm:px-10 lg:px-14 py-4 flex items-center justify-between">
        {/* Brand Left */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onEnterPortal('dashboard')}
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-[#1E3F30] stroke-[1.75]" />
            <span className="font-display font-extrabold text-2xl tracking-tight text-[#111C2D]">
              Campus<span className="text-[#1E3F30]">One</span>
            </span>
          </div>

          <div className="h-5 w-px bg-gray-300 hidden sm:block" />

          <span className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:inline">
            ATLAS SkillTech University
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-bold text-[#111C2D] border-b-2 border-[#1E3F30] pb-1 cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => onEnterPortal('allocation')}
            className="font-medium text-gray-600 hover:text-[#1E3F30] transition-colors cursor-pointer"
          >
            Book Spaces
          </button>
          <button
            onClick={() => onEnterPortal('lostfound')}
            className="font-medium text-gray-600 hover:text-[#1E3F30] transition-colors cursor-pointer"
          >
            Lost & Found
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="font-medium text-gray-600 hover:text-[#1E3F30] transition-colors cursor-pointer"
          >
            About Campus
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="font-medium text-gray-600 hover:text-[#1E3F30] transition-colors cursor-pointer"
          >
            How It Works
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => (onOpenLoginModal ? onOpenLoginModal('admin') : onEnterPortal('admin'))}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-100 transition-all hidden sm:flex items-center gap-1.5 cursor-pointer border border-gray-200"
            title="Administrator direct password access"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gray-700" />
            <span>Admin Access</span>
          </button>

          <button
            onClick={() => (onOpenLoginModal ? onOpenLoginModal('student') : onEnterPortal('dashboard'))}
            className="px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#1E3F30] text-white hover:bg-[#152C22] shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Sign In / Enter Portal</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION: 100% FULL-WIDTH SEAMLESS PHOTOGRAPHIC BLEND (ZERO CUTOFF LINES)
          ========================================================================= */}
      <section className="relative w-full bg-white overflow-hidden flex flex-col justify-between border-b border-[#EBEAE5]">
        {/* Full-width image covering 100% of the container */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          <img
            src="/assets/real-campus.jpg"
            alt="ATLAS SkillTech University Campus Building"
            className="w-full h-full object-cover object-[80%_center]"
          />

          {/* Smooth, continuous white gradient from left to right (eliminated all mask lines) */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background:
                'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 38%, rgba(255,255,255,0.92) 48%, rgba(255,255,255,0.65) 60%, rgba(255,255,255,0.2) 75%, transparent 100%)',
            }}
          />
        </div>

        {/* Foreground Content on Left */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-14 py-16 sm:py-24 lg:py-28">
          <div className="max-w-xl space-y-7">
            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-[68px] text-[#111C2D] leading-[1.06] tracking-[-0.03em]">
              Your Campus,<br />
              <span className="text-[#1E3F30]">Connected</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#4B5565] max-w-lg leading-relaxed font-normal">
              Book academic spaces, manage campus resources, and report or recover lost belongings — all in one place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => (onOpenLoginModal ? onOpenLoginModal('student') : onEnterPortal('allocation'))}
                className="group px-6 py-3.5 rounded-xl bg-[#1E3F30] text-white font-semibold text-sm hover:bg-[#152C22] shadow-sm hover:shadow-md transition-all flex items-center gap-3 active:translate-y-px cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Book a Space</span>
                <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => (onOpenLoginModal ? onOpenLoginModal('admin') : onEnterPortal('admin'))}
                className="group px-6 py-3.5 rounded-xl bg-white text-[#111C2D] font-semibold text-sm border-2 border-[#111C2D] hover:bg-gray-50 transition-all flex items-center gap-3 active:translate-y-px cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-[#111C2D]" />
                <span>Admin Login (Password Only)</span>
                <ArrowRight className="w-4 h-4 text-[#111C2D]/70 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="text-xs text-gray-500 pt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Official @atlasskilltech.university student accounts • Direct Estate Officer access</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM STRIP: 3 PILLARS WITH SUBTLE INTEGRATION (NO HARSH LINE)
            ========================================================================= */}
        <div className="relative z-10 w-full bg-[#FAF9F6]/95 backdrop-blur-sm border-t border-[#EBEAE5]">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-7 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
            
            {/* Pillar 1: Reserve & Manage */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EBEAE5] text-[#1E3F30] flex items-center justify-center shrink-0 shadow-sm">
                <Landmark className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#111C2D] tracking-tight">
                  Reserve & Manage
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Classrooms, labs, and seminar halls
                </p>
              </div>
            </div>

            {/* Pillar 2: Report & Search */}
            <div className="flex items-center gap-4 md:border-l md:border-[#EBEAE5] md:pl-8">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EBEAE5] text-[#1E3F30] flex items-center justify-center shrink-0 shadow-sm">
                <Search className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#111C2D] tracking-tight">
                  Report & Search
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Lost and found items on campus
                </p>
              </div>
            </div>

            {/* Pillar 3: Built for Campus */}
            <div className="flex items-center gap-4 md:border-l md:border-[#EBEAE5] md:pl-8">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EBEAE5] text-[#1E3F30] flex items-center justify-center shrink-0 shadow-sm">
                <Users className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#111C2D] tracking-tight">
                  Built for Campus
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  For students, faculty, and staff
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CAMPUS SERVICES (CLEAN EDITORIAL CARDS)
          ========================================================================= */}
      <section id="features" className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-20 bg-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pb-5 border-b border-[#EBEAE5]">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#1E3F30] mb-1">
              Campus Modules
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#111C2D] tracking-tight">
              Explore Academic Services
            </h2>
          </div>
          <button
            onClick={() => onEnterPortal('dashboard')}
            className="text-xs font-bold text-[#1E3F30] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Student Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Module 1: Space & Room Reservations */}
          <div
            onClick={() => onEnterPortal('allocation')}
            className="group p-8 rounded-2xl bg-[#FAF9F6] border border-[#EBEAE5] hover:border-[#1E3F30] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#EAF2EC] text-[#1E3F30] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Calendar className="w-6 h-6 stroke-[1.75]" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#EBEAE5] text-[#111C2D]">
                  Module A
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl text-[#111C2D] group-hover:text-[#1E3F30] transition-colors">
                Space & Room Reservations
              </h3>
              <p className="text-sm text-[#4B5565] mt-2.5 leading-relaxed">
                Check live room availability, inspect installed equipment (projectors, workstations, PA systems), and submit reservations for class reviews, seminars, and club activities.
              </p>

              <div className="mt-6 space-y-2.5 pt-6 border-t border-[#EBEAE5]">
                <div className="flex items-center gap-2 text-xs text-[#111C2D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E3F30]" />
                  <span>Discussion Rooms, Smart Classrooms & Auditoriums</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#111C2D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E3F30]" />
                  <span>Equipment compatibility filtering (AV, Projectors, Linux PCs)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#111C2D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E3F30]" />
                  <span>Instant slot availability verification</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#EBEAE5] flex items-center justify-between text-xs font-bold text-[#1E3F30]">
              <span>View 18 Campus Rooms →</span>
              <span className="text-gray-400 font-normal">Real-time scheduling</span>
            </div>
          </div>

          {/* Module 2: Lost & Found */}
          <div
            onClick={() => onEnterPortal('lostfound')}
            className="group p-8 rounded-2xl bg-[#FAF9F6] border border-[#EBEAE5] hover:border-[#1E3F30] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] text-[#3A332A] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <PackageSearch className="w-6 h-6 stroke-[1.75]" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#EBEAE5] text-[#111C2D]">
                  Module B
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl text-[#111C2D] group-hover:text-[#1E3F30] transition-colors">
                Lost & Found Desk
              </h3>
              <p className="text-sm text-[#4B5565] mt-2.5 leading-relaxed">
                Report misplaced items, register belongings turned into the security desk, and search reports instantly with prefix autocomplete search.
              </p>

              <div className="mt-6 space-y-2.5 pt-6 border-t border-[#EBEAE5]">
                <div className="flex items-center gap-2 text-xs text-[#111C2D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C2B092]" />
                  <span>Prefix-based autocomplete keyword search</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#111C2D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C2B092]" />
                  <span>Categorized by Electronics, Bags, Student IDs & Accessories</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#111C2D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C2B092]" />
                  <span>Verified ownership claim submission and security check</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#EBEAE5] flex items-center justify-between text-xs font-bold text-[#1E3F30]">
              <span>Search Lost & Found Reports →</span>
              <span className="text-gray-400 font-normal">Verified campus returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: HOW IT WORKS
          ========================================================================= */}
      <section id="how-it-works" className="bg-[#FAF9F6] border-t border-[#EBEAE5] py-20 px-6 sm:px-10 lg:px-14">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#1E3F30]">
              Operational Workflow
            </div>
            <h2 className="text-3xl font-display font-extrabold text-[#111C2D] tracking-tight">
              Built Specifically for Campus Life
            </h2>
            <p className="text-sm text-[#4B5565]">
              Seamless university resource coordination from initial request to confirmed recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] text-[#1E3F30] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h4 className="font-display font-bold text-lg text-[#111C2D]">
                Verify with University Email
              </h4>
              <p className="text-xs text-[#4B5565] leading-relaxed">
                Log in securely using your official ATLAS SkillTech email domain. Student and faculty profiles are automatically verified.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] text-[#3A332A] flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h4 className="font-display font-bold text-lg text-[#111C2D]">
                Submit Space or Item Requests
              </h4>
              <p className="text-xs text-[#4B5565] leading-relaxed">
                Select your required room capacity, equipment and timeslot, or file item reports with recognizable marks and photos.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-[#EBEAE5] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] text-[#1E3F30] flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h4 className="font-display font-bold text-lg text-[#111C2D]">
                Confirmed Allocations & Recovery
              </h4>
              <p className="text-xs text-[#4B5565] leading-relaxed">
                Receive non-overlapping room confirmations directly on your dashboard, and trace claims until recovered items are returned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="w-full bg-white border-t border-[#EBEAE5] py-8 px-6 text-xs text-gray-500">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-[1440px] mx-auto gap-4">
          <div className="flex items-center gap-2 font-medium text-[#111C2D]">
            <GraduationCap className="w-4 h-4 text-[#1E3F30]" />
            <span>CampusOne — ATLAS SkillTech University</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => (onOpenLoginModal ? onOpenLoginModal('student') : onEnterPortal('dashboard'))}
              className="text-[#1E3F30] hover:underline cursor-pointer"
            >
              Student Portal (@atlasskilltech.university)
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => (onOpenLoginModal ? onOpenLoginModal('admin') : onEnterPortal('admin'))}
              className="text-gray-700 hover:text-black hover:underline cursor-pointer"
            >
              Admin Terminal (Password Only)
            </button>
          </div>

          <div>Continuous Internal Assessment 03 • Advanced Algorithms Project</div>
        </div>
      </footer>
    </div>
  );
}
