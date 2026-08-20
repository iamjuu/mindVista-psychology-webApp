import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getPatientUser, clearPatientSession } from '../../constants/patientAuthStorage';

export default function HeaderNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [patient, setPatient] = useState(null);
  const [doctorToken, setDoctorToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setPatient(getPatientUser());
    setDoctorToken(localStorage.getItem('doctorToken') || localStorage.getItem('token'));
  }, [location.pathname]);

  const handlePatientLogout = () => {
    clearPatientSession();
    setPatient(null);
    navigate('/');
  };

  return (
    <header className="bg-surface/90 backdrop-blur-md font-headline w-full sticky top-0 flex justify-between items-center px-4 sm:px-8 lg:px-16 py-4 z-50 border-b border-surface-variant/40">
      {/* Brand Identity */}
      <Link to="/" className="text-primary font-bold text-2xl tracking-tight">
        MindVista
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          to="/"
          className={`flex items-center gap-2 text-sm font-semibold transition-opacity ${
            location.pathname === '/' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/' ? 'fill-icon' : ''}`}>home</span>
          <span>Home</span>
        </Link>

        <a
          href="/#doctors"
          className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-opacity"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
          <span>Explore</span>
        </a>

        <Link
          to="/profile"
          className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-opacity"
        >
          <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          <span>Appointments</span>
        </Link>
      </nav>

      {/* Trailing Actions */}
      <div className="flex items-center gap-3">
        {patient ? (
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest transition-colors px-4 py-2 rounded-full"
            >
              <div className="w-6 h-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center">
                {patient.name?.charAt(0) || 'P'}
              </div>
              <span className="text-xs font-semibold text-on-surface">{patient.name || 'Profile'}</span>
            </Link>
            <button
              onClick={handlePatientLogout}
              className="text-xs font-semibold text-on-surface-variant hover:text-error transition-colors"
            >
              Logout
            </button>
          </div>
        ) : doctorToken ? (
          <Link
            to="/doctor"
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-full text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">medical_services</span>
            <span>Doctor Portal</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="text-xs font-semibold text-on-surface-variant hover:text-primary px-3 py-2 transition-colors hidden sm:block"
            >
              Patient Login
            </Link>
            <Link
              to="/doctor/login"
              className="text-xs font-semibold text-on-surface-variant hover:text-primary px-3 py-2 transition-colors hidden sm:block"
            >
              Doctor Login
            </Link>
            <a
              href="/#doctors"
              className="bg-secondary text-on-secondary px-5 py-2 rounded-full text-xs font-bold shadow-[0px_4px_12px_rgba(58,102,95,0.2)] hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <span>Book for ₹599</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
        )}

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-full hover:bg-surface-variant/50 text-primary"
        >
          <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-surface-variant px-6 py-4 space-y-3 shadow-lg">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-on-surface"
          >
            Home
          </Link>
          <a
            href="/#doctors"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-on-surface"
          >
            Explore Doctors
          </a>
          <Link
            to="/profile"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-on-surface"
          >
            Appointments & Prescriptions
          </Link>
          <Link
            to="/doctor/login"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-on-surface"
          >
            Doctor Portal
          </Link>
        </div>
      )}
    </header>
  );
}
