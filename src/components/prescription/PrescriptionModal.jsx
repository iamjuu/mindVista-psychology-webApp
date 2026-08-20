import React from 'react';
import { API_BASE_URL } from '../../config/api';

export default function PrescriptionModal({ prescription, isOpen, onClose }) {
  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    const printUrl = `${API_BASE_URL}/patient/prescriptions/${prescription._id}/pdf`;
    window.open(printUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface rounded-[32px] shadow-2xl border border-surface-variant overflow-hidden my-8 animate-fadeInUp">
        
        {/* Header */}
        <div className="bg-primary text-on-primary p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
                Official Digital Prescription
              </span>
            </div>
            <h2 className="font-headline text-2xl font-bold tracking-tight">MindVista Ayurveda Teleconsultation</h2>
            <p className="text-xs text-primary-fixed mt-0.5">
              Prescribed by {prescription.doctorName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Print or Save PDF"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Prescription Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs text-on-surface">
          
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 text-xs">
            <div>
              <div className="text-on-surface-variant font-bold uppercase text-[10px]">Patient Information</div>
              <div className="font-bold text-on-surface text-sm mt-0.5">{prescription.patientName}</div>
              <div className="text-on-surface-variant">Consultation Date: {prescription.appointmentDate}</div>
            </div>

            <div>
              <div className="text-on-surface-variant font-bold uppercase text-[10px]">Practitioner</div>
              <div className="font-bold text-on-surface text-sm mt-0.5">{prescription.doctorName}</div>
              <div className="text-on-surface-variant">
                {(prescription.doctorQualifications || []).join(', ') || 'BAMS Specialist'}
                {prescription.doctorRegistrationNumber ? ` • Reg: ${prescription.doctorRegistrationNumber}` : ''}
              </div>
            </div>
          </div>

          {/* Assessment */}
          {prescription.assessment && (
            <div>
              <h4 className="font-headline text-xs font-bold text-on-surface uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>Clinical Assessment</span>
              </h4>
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-variant text-xs text-on-surface leading-relaxed">
                {prescription.assessment}
              </div>
            </div>
          )}

          {/* Prescribed Medicines */}
          <div>
            <h4 className="font-headline text-xs font-bold text-on-surface uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>Prescribed Ayurvedic Medicines (Rx)</span>
            </h4>

            <div className="border border-surface-variant rounded-2xl overflow-hidden bg-surface-container-lowest">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container-high text-on-surface font-bold border-b border-surface-variant">
                    <th className="p-3">Medicine</th>
                    <th className="p-3">Dosage</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant">
                  {(prescription.medicines || []).map((m, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low">
                      <td className="p-3 font-bold text-on-surface">{m.name}</td>
                      <td className="p-3 text-on-surface">{m.dosage}</td>
                      <td className="p-3 text-on-surface">{m.frequency}</td>
                      <td className="p-3 text-on-surface">{m.duration}</td>
                      <td className="p-3 text-on-surface-variant">{m.instructions || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Diet & Lifestyle Advice */}
          {(prescription.dietAdvice || prescription.lifestyleAdvice) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prescription.dietAdvice && (
                <div>
                  <h4 className="font-headline text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                    Dietary Guidelines (Pathya)
                  </h4>
                  <div className="p-3.5 rounded-2xl bg-secondary-container/40 border border-secondary-container text-xs text-on-secondary-container leading-relaxed">
                    {prescription.dietAdvice}
                  </div>
                </div>
              )}

              {prescription.lifestyleAdvice && (
                <div>
                  <h4 className="font-headline text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                    Lifestyle Advice (Dinacharya)
                  </h4>
                  <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant text-xs text-on-surface leading-relaxed">
                    {prescription.lifestyleAdvice}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Follow-up Note */}
          {prescription.followUpDate && (
            <div className="p-3.5 rounded-2xl bg-primary-fixed/50 border border-primary-fixed text-xs font-bold text-on-primary-fixed-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Recommended Follow-up Consultation: {prescription.followUpDate}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-low border-t border-surface-variant flex justify-between items-center text-xs">
          <div className="text-on-surface-variant">
            Issued: {new Date(prescription.publishedAt || prescription.createdAt).toLocaleDateString('en-IN')}
          </div>
          <button
            onClick={handlePrint}
            className="py-2.5 px-6 rounded-full bg-primary text-on-primary font-bold flex items-center gap-2 shadow-sm hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
