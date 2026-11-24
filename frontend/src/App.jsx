import React, { useState, useEffect } from 'react';
import LandingPage from './features/landing/LandingPage';
import StudentPortal from './features/student/StudentPortal';
import AdminPortal from './features/admin/AdminPortal';
import LoginModal from './components/auth/LoginModal';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'student-portal' | 'admin-portal'
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState('student'); // 'student' | 'admin'

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campusone_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('campusone_role') || null;
  });

  // Restore authenticated view on load if session exists
  useEffect(() => {
    if (currentUser && currentRole) {
      if (currentRole.includes('SPACE_ADMIN') || currentRole.includes('SUPER_ADMIN')) {
        setView('admin-portal');
      } else {
        setView('student-portal');
      }
    }
  }, []);

  const handleOpenLoginModal = (mode = 'student') => {
    setLoginModalMode(mode);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = ({ token, user, role }) => {
    localStorage.setItem('campusone_jwt', token);
    localStorage.setItem('campusone_user', JSON.stringify(user));
    localStorage.setItem('campusone_role', role);

    setCurrentUser(user);
    setCurrentRole(role);

    if (role.includes('SPACE_ADMIN') || role.includes('SUPER_ADMIN')) {
      setView('admin-portal');
    } else {
      setView('student-portal');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('campusone_jwt');
    localStorage.removeItem('campusone_user');
    localStorage.removeItem('campusone_role');
    setCurrentUser(null);
    setCurrentRole(null);
    setView('landing');
  };

  const handleDirectEnterPortal = (target = 'dashboard') => {
    if (target === 'admin') {
      handleOpenLoginModal('admin');
    } else if (currentUser && currentRole) {
      if (currentRole.includes('SPACE_ADMIN')) {
        setView('admin-portal');
      } else {
        setView('student-portal');
      }
    } else {
      handleOpenLoginModal('student');
    }
  };

  return (
    <>
      {view === 'landing' && (
        <LandingPage
          onEnterPortal={handleDirectEnterPortal}
          onOpenLoginModal={handleOpenLoginModal}
        />
      )}

      {view === 'student-portal' && (
        <StudentPortal
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateLanding={() => setView('landing')}
        />
      )}

      {view === 'admin-portal' && (
        <AdminPortal
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateLanding={() => setView('landing')}
        />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        initialMode={loginModalMode}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
