import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
  UserPlus,
  LogIn,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onSuccess, initialMode = 'student' }) {
  const [roleMode, setRoleMode] = useState(initialMode); // 'student' | 'admin'
  const [actionTab, setActionTab] = useState('login'); // 'login' | 'register' (for student)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('ananya.student@atlasskilltech.university');
  const [loginPassword, setLoginPassword] = useState('Password123!');
  const [adminEmail, setAdminEmail] = useState('admin@atlasskilltech.university');
  const [adminPassword, setAdminPassword] = useState('Password123!');

  // Register form state (Real-time student registration)
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Science (Semester V)');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Real-time Student / Admin Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const targetEmail = roleMode === 'student' ? loginEmail.trim() : adminEmail.trim();
    const targetPassword = roleMode === 'student' ? loginPassword : adminPassword;

    if (!targetEmail) {
      setError('Please enter your university email address');
      return;
    }
    if (!targetPassword) {
      setError('Please enter your account password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPassword }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.token) {
        onSuccess({
          token: data.token,
          user: {
            id: data.id,
            email: data.email,
            fullName: data.fullName,
            department: data.department,
          },
          role: Array.isArray(data.roles) && data.roles.length > 0 ? data.roles[0] : (roleMode === 'admin' ? 'ROLE_SPACE_ADMIN' : 'ROLE_STUDENT'),
        });
        onClose();
        return;
      } else {
        setError(data.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch {
      setError('Unable to reach the campus authentication server. Ensure backend is running on port 8080.');
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time Student Account Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regFullName.trim()) {
      setError('Full name is required');
      return;
    }

    const emailTrimmed = regEmail.trim();
    if (!emailTrimmed) {
      setError('University email is required');
      return;
    }

    if (!emailTrimmed.includes('@atlasskilltech.university') && !emailTrimmed.includes('@atlasuniversity.edu.in')) {
      setError('Student accounts must use an official @atlasskilltech.university domain.');
      return;
    }

    if (!regPassword || regPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName.trim(),
          email: emailTrimmed,
          department: regDepartment,
          password: regPassword,
          requestedRoles: ['ROLE_STUDENT'],
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.token) {
        setSuccessMsg(`Welcome, ${data.fullName}! Your official university account was created.`);
        setTimeout(() => {
          onSuccess({
            token: data.token,
            user: {
              id: data.id,
              email: data.email,
              fullName: data.fullName,
              department: data.department,
            },
            role: 'ROLE_STUDENT',
          });
          onClose();
        }, 800);
      } else {
        setError(data.error || 'Registration failed. This email may already be registered.');
      }
    } catch {
      setError('Failed to connect to authentication server. Please verify backend connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillStudentDemo = () => {
    setRoleMode('student');
    setActionTab('login');
    setLoginEmail('ananya.student@atlasskilltech.university');
    setLoginPassword('Password123!');
    setError('');
  };

  const handleFillAdminDemo = () => {
    setRoleMode('admin');
    setActionTab('login');
    setAdminEmail('admin@atlasskilltech.university');
    setAdminPassword('Password123!');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-200/50 overflow-hidden my-8">
        
        {/* =========================================================================
            HEADER: SLEEK ROYAL PURPLE TO INDIGO GRADIENT BANNER
            ========================================================================= */}
        <div className="relative px-7 pt-7 pb-6 bg-gradient-to-r from-slate-950 via-[#1E1135] to-[#2E1065] text-white flex items-center justify-between overflow-hidden">
          {/* Ambient blur glows */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 left-1/4 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-900/50 border border-white/20">
              <GraduationCap className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-xl tracking-tight text-white leading-tight">
                  Campus<span className="text-purple-400">One</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-purple-500/20 border border-purple-400/30 text-purple-200">
                  Live Authentication
                </span>
              </div>
              <p className="text-xs text-purple-200/80 font-medium mt-0.5">
                ATLAS SkillTech University Central Authentication
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 p-2 rounded-xl text-purple-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================================================
            TOP ROLE SELECTOR: STUDENT vs ADMIN
            ========================================================================= */}
        <div className="px-6 pt-5 bg-[#FAF9F6] border-b border-gray-200/80">
          <div className="p-1 bg-gray-200/80 rounded-2xl grid grid-cols-2 gap-1 border border-gray-300/50">
            <button
              type="button"
              onClick={() => {
                setRoleMode('student');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                roleMode === 'student'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${roleMode === 'student' ? 'text-purple-700' : 'text-gray-400'}`} />
              <span>Student Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleMode('admin');
                setActionTab('login');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                roleMode === 'admin'
                  ? 'bg-gradient-to-r from-purple-900 to-indigo-950 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${roleMode === 'admin' ? 'text-purple-300' : 'text-gray-400'}`} />
              <span>Admin Console</span>
            </button>
          </div>

          {/* Student Sub-Tabs: Sign In vs Real-Time Register */}
          {roleMode === 'student' && (
            <div className="flex items-center gap-4 mt-4 text-xs font-bold border-b border-gray-200 -mb-px">
              <button
                type="button"
                onClick={() => {
                  setActionTab('login');
                  setError('');
                }}
                className={`pb-3 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  actionTab === 'login'
                    ? 'border-purple-600 text-purple-900'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Student Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActionTab('register');
                  setError('');
                }}
                className={`pb-3 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  actionTab === 'register'
                    ? 'border-purple-600 text-purple-900'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Student Account</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                  New
                </span>
              </button>
            </div>
          )}
        </div>

        {/* =========================================================================
            FORM BODY
            ========================================================================= */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 leading-relaxed font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800 leading-relaxed font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. STUDENT LOGIN FORM */}
          {roleMode === 'student' && actionTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  University Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student.name@atlasskilltech.university"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300/80 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your student password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300/80 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-sm shadow-md shadow-purple-900/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating with University Node...</span>
                ) : (
                  <>
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActionTab('register')}
                  className="text-xs text-purple-700 hover:text-purple-900 font-semibold cursor-pointer hover:underline"
                >
                  Don't have an account yet? <strong>Register your student account</strong> →
                </button>
              </div>
            </form>
          )}

          {/* 2. REAL-TIME STUDENT REGISTRATION FORM */}
          {roleMode === 'student' && actionTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Rhythm Singhal"
                    required
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-300/80 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Official University Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. rhythm.singhal@atlasskilltech.university"
                    required
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-300/80 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Department / Degree Program
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="e.g. Computer Science (Semester V)"
                    required
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-300/80 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Password (Min 8)
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300/80 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300/80 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-600 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Registering Student Account in Database...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create & Activate Student Account</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActionTab('login')}
                  className="text-xs text-purple-700 hover:text-purple-900 font-semibold cursor-pointer hover:underline"
                >
                  Already have an account? <strong>Sign In here</strong> →
                </button>
              </div>
            </form>
          )}

          {/* 3. ADMIN LOGIN FORM */}
          {roleMode === 'admin' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Administrative Node Authentication:</strong> Estate & Space Operations Officers log in with their university administrator credentials.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@atlasskilltech.university"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300/80 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin security password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300/80 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-purple-900/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating Administrator...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-purple-300" />
                    <span>Enter Estate & Operations Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick-fill helper for viva demonstration */}
          <div className="mt-5 pt-4 border-t border-gray-200/80 flex flex-wrap items-center justify-between text-[11px] text-gray-500 gap-2">
            <span className="flex items-center gap-1 font-semibold text-gray-600">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Demo Fill:</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFillStudentDemo}
                className="px-2 py-1 rounded-md bg-purple-50 text-purple-800 hover:bg-purple-100 font-medium cursor-pointer transition-colors border border-purple-200/60"
              >
                Student: Ananya (Password123!)
              </button>
              <button
                type="button"
                onClick={handleFillAdminDemo}
                className="px-2 py-1 rounded-md bg-slate-100 text-slate-800 hover:bg-slate-200 font-medium cursor-pointer transition-colors border border-slate-300"
              >
                Admin (Password123!)
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Atlas SkillTech University Live Authentication Service</span>
          </span>
          <span className="font-semibold text-purple-900">BCrypt + HMAC-SHA512</span>
        </div>
      </div>
    </div>
  );
}
