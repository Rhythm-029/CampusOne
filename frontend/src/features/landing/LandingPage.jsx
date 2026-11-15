import React from 'react';
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
} from 'lucide-react';

export default function LandingPage({ onEnterPortal }) {
  return (
    <div className="min-h-screen bg-white text-[#111C2D] flex flex-col font-sans selection:bg-[#1E3F30] selection:text-white">
      {/* =========================================================================
          TOP NAVBAR: LOGO, ATLAS DIVIDER, NAV LINKS, & ENTER PORTAL
          ========================================================================= */}
      <header className="w-full bg-white border-b border-[#EBEAE5] sticky top-0 z-40 px-6 sm:px-10 lg:px-14 py-4 flex items-center justify-between">
        {/* Brand Left: Graduation Cap + CampusOne | ATLAS SkillTech University */}
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
          <a
            href="#home"
            className="font-bold text-[#111C2D] border-b-2 border-[#1E3F30] pb-1"
          >
            Home
          </a>
          <button
            onClick={() => onEnterPortal('allocation')}
            className="font-medium text-gray-600 hover:text-[#1E3F30] transition-colors"
          >
            Book Spaces
          </button>
          <button
            onClick={() => onEnterPortal('lostfound')}
            className="font-medium text-gray-600 hover:text-[#1E3F30] transition-colors"
          >
            Lost & Found
          </button>
          <a
            href="#features"
            className="font-medium text-gray-600 hover:text-[#1E3F30] transition-colors"
          >
            About Campus
          </a>
          <a
            href="#how-it-works"
            className="font-medium text-gray-600 hover:text-[#1E3F30] transition-colors"
          >
            How It Works
          </a>
        </nav>

        {/* Right CTA: Enter Portal Button */}
        <div>
          <button
            onClick={() => onEnterPortal('dashboard')}
            className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#1E3F30] text-white hover:bg-[#152C22] shadow-sm transition-all flex items-center gap-2 active:scale-95"
          >
            <UserCheck className="w-4 h-4" />
            <span>Enter Portal</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          HERO MAIN SECTION: REAL ATLAS PHOTO WITH SOFT LEFT BLUR & FADE
          ========================================================================= */}
      <section id="home" className="relative flex-1 bg-white overflow-hidden flex flex-col justify-between">
        <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-14 pt-10 pb-14 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Headlines, Subtitle & Action Buttons */}
          <div className="lg:col-span-6 space-y-7 z-20">
            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-[66px] text-[#111C2D] leading-[1.08] tracking-[-0.03em]">
              Your Campus,<br />
              <span className="text-[#1E3F30]">Connected</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#4B5565] max-w-lg leading-relaxed font-normal">
              Book academic spaces, manage campus resources, and report or recover lost belongings — all in one place.
            </p>

            {/* Action Buttons (Matching Inspo) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary Button: Book a Space */}
              <button
                onClick={() => onEnterPortal('allocation')}
                className="group px-6 py-3.5 rounded-xl bg-[#1E3F30] text-white font-semibold text-sm hover:bg-[#152C22] shadow-sm hover:shadow-md transition-all flex items-center gap-3 active:translate-y-px"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Book a Space</span>
                <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Button: Lost & Found */}
              <button
                onClick={() => onEnterPortal('lostfound')}
                className="group px-6 py-3.5 rounded-xl bg-white text-[#111C2D] font-semibold text-sm border-2 border-[#111C2D] hover:bg-gray-50 transition-all flex items-center gap-3 active:translate-y-px"
              >
                <Tag className="w-4 h-4 text-[#111C2D]" />
                <span>Lost & Found</span>
                <ArrowRight className="w-4 h-4 text-[#111C2D]/70 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Real College Photo with Soft Blur Fade */}
          <div className="lg:col-span-6 relative w-full h-[380px] sm:h-[440px] lg:h-[500px] flex items-center justify-end">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm">
              {/* Real College Photograph */}
              <img
                src="/assets/real-campus.jpg"
                alt="ATLAS SkillTech University Campus Real Photo"
                className="w-full h-full object-cover object-[70%_center] scale-100"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.15) 15%, rgba(0, 0, 0, 0.75) 35%, black 55%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.15) 15%, rgba(0, 0, 0, 0.75) 35%, black 55%)',
                }}
              />

              {/* Multi-stage Feathered Blur & Gradient Overlay on the Left Edge */}
              <div className="absolute inset-y-0 left-0 w-36 sm:w-48 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 left-0 w-24 sm:w-32 backdrop-blur-[6px] mask-gradient pointer-events-none" />

              {/* Soft bottom vignette for rich depth */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM STRIP: 3 PILLARS WITH DIVIDERS & BOTTOM ACCENT BAR
            ========================================================================= */}
        <div className="w-full bg-[#FAF9F6] border-t border-[#EBEAE5]">
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

          {/* Bottom Accent Line (Deep Green from Mockup) */}
          <div className="h-2 bg-[#1E3F30] w-full" />
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 (BELOW FOLD): INTERACTIVE FEATURE CARDS FOR QUICK PORTAL ENTRY
          ========================================================================= */}
      <section id="features" className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-20 bg-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EBEAE5]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E3F30]">
              Campus Modules
            </span>
            <h2 className="text-3xl font-display font-bold text-[#111C2D] mt-1">
              Explore Academic Services
            </h2>
          </div>
          <button
            onClick={() => onEnterPortal('dashboard')}
            className="text-xs font-semibold text-[#1E3F30] hover:underline flex items-center gap-1"
          >
            <span>Open Student Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card A: Room Allocation */}
          <div
            onClick={() => onEnterPortal('allocation')}
            className="group p-8 rounded-2xl bg-[#FAF9F6] border border-[#EBEAE5] hover:border-[#1E3F30] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EAF2EC] text-[#1E3F30] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl text-[#111C2D] group-hover:text-[#1E3F30] transition-colors">
                Space & Room Reservations
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Check live room availability, inspect installed equipment (projectors, workstations, PA systems), and submit reservations for class reviews, seminars, and club activities.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EBEAE5] flex items-center justify-between text-xs font-bold text-[#1E3F30]">
              <span>View 18 Campus Rooms →</span>
              <span className="text-gray-400 font-normal">Real-time scheduling</span>
            </div>
          </div>

          {/* Card B: Lost & Found */}
          <div
            onClick={() => onEnterPortal('lostfound')}
            className="group p-8 rounded-2xl bg-[#FAF9F6] border border-[#EBEAE5] hover:border-[#1E3F30] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] text-[#3A332A] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <PackageSearch className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl text-[#111C2D] group-hover:text-[#1E3F30] transition-colors">
                Lost & Found Desk
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Report misplaced items, register belongings turned into the security desk, and search reports instantly with prefix autocomplete search.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EBEAE5] flex items-center justify-between text-xs font-bold text-[#1E3F30]">
              <span>Search Lost & Found Reports →</span>
              <span className="text-gray-400 font-normal">Verified campus returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#FAF9F6] border-t border-[#EBEAE5] py-8 px-6 text-center text-xs text-gray-500">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-[1440px] mx-auto gap-4">
          <div className="flex items-center gap-2 font-medium text-[#111C2D]">
            <GraduationCap className="w-4 h-4 text-[#1E3F30]" />
            <span>CampusOne — ATLAS SkillTech University</span>
          </div>
          <div>Continuous Internal Assessment 03 • Advanced Algorithms Project</div>
        </div>
      </footer>
    </div>
  );
}
