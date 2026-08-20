import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#14261C] text-[#C3DFD1] pt-16 pb-12 border-t border-[#233D29]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#233D29]/60">
          
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-headline text-2xl font-bold text-white tracking-tight">MindVista</span>
            </div>
            <p className="text-xs text-[#96C6AF] leading-relaxed">
              Personalized psychological care rooted in Ayurvedic principles and modern clinical excellence.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B3627] border border-[#2D6A4F] text-[#86EFAC] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>₹599 Fixed Consultation</span>
            </div>
          </div>

          {/* Consultations */}
          <div>
            <h4 className="font-headline text-sm font-bold text-white uppercase tracking-wider mb-4">
              Consultations
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C3DFD1]">
              <li>
                <a href="/#experts" className="hover:text-white transition-colors">
                  Psychology &amp; CBT Counseling
                </a>
              </li>
              <li>
                <a href="/#experts" className="hover:text-white transition-colors">
                  Ayurvedic Teleconsultation
                </a>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  My Prescriptions &amp; Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="font-headline text-sm font-bold text-white uppercase tracking-wider mb-4">
              Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C3DFD1]">
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Patient Dashboard
                </Link>
              </li>
              <li>
                <Link to="/doctor/login" className="hover:text-white transition-colors">
                  Practitioner Portal
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/917025715250"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#86EFAC]">support_agent</span>
                  <span>WhatsApp Support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Security & Confidentiality */}
          <div className="space-y-3">
            <h4 className="font-headline text-sm font-bold text-white uppercase tracking-wider mb-4">
              Confidentiality
            </h4>
            <div className="flex items-start gap-2 text-xs text-[#96C6AF]">
              <span className="material-symbols-outlined text-[#86EFAC] text-[18px] shrink-0">lock</span>
              <span>Google Meet private video sessions with host-admitted entry.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#96C6AF]">
              <span className="material-symbols-outlined text-[#86EFAC] text-[18px] shrink-0">clinical_notes</span>
              <span>Digital Ayurveda prescriptions published with official practitioner credentials.</span>
            </div>
          </div>
        </div>

        {/* Emergency Disclaimer */}
        <div className="mt-8 p-4 rounded-2xl bg-[#1B3627]/60 border border-[#2D6A4F]/40 text-xs text-[#96C6AF] leading-relaxed">
          <strong className="text-white">Medical Disclaimer:</strong> MindVista provides scheduled teleconsultations. If you or someone you know is facing a life-threatening crisis or acute medical emergency, please visit your nearest hospital emergency department immediately.
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#96C6AF] gap-4">
          <p>© {new Date().getFullYear()} MindVista. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Harmonizing ancient wisdom &amp; modern science</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
