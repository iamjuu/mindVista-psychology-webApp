import React, { useState, useEffect } from 'react';
import api from '../../instance';

export default function PrescriptionEditorModal({ appointment, isOpen, onClose, onSaveSuccess }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [assessment, setAssessment] = useState('');
  const [dietAdvice, setDietAdvice] = useState('');
  const [lifestyleAdvice, setLifestyleAdvice] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '1 tablet', frequency: 'Twice daily after food', duration: '14 days', instructions: 'With warm water' },
  ]);

  useEffect(() => {
    if (isOpen && appointment?._id) {
      setErrorMessage('');
      setSuccessMessage('');
      fetchExistingPrescription();
    }
  }, [isOpen, appointment?._id]);

  const fetchExistingPrescription = async () => {
    setFetching(true);
    try {
      const res = await api.get(`/appointments/${appointment._id}/prescription`);
      if (res.data && res.data.data) {
        const p = res.data.data;
        setAssessment(p.assessment || '');
        setDietAdvice(p.dietAdvice || '');
        setLifestyleAdvice(p.lifestyleAdvice || '');
        setAdditionalInstructions(p.additionalInstructions || '');
        setFollowUpDate(p.followUpDate || '');
        if (p.medicines && p.medicines.length > 0) {
          setMedicines(p.medicines);
        }
      }
    } catch (err) {
      // Keep blank defaults
    } finally {
      setFetching(false);
    }
  };

  if (!isOpen || !appointment) return null;

  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      { name: '', dosage: '1 tablet', frequency: 'Twice daily after food', duration: '14 days', instructions: '' },
    ]);
  };

  const handleRemoveMedicine = (idx) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMedicineChange = (idx, field, val) => {
    setMedicines((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      return updated;
    });
  };

  const handleSave = async (statusToSet = 'DRAFT') => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const validMedicines = medicines.filter((m) => m.name.trim().length > 0);

    try {
      const res = await api.post(`/professional/appointments/${appointment._id}/prescription`, {
        assessment,
        dietAdvice,
        lifestyleAdvice,
        additionalInstructions,
        followUpDate,
        medicines: validMedicines,
        status: statusToSet,
      });

      if (res.data && res.data.success) {
        setSuccessMessage(
          statusToSet === 'PUBLISHED'
            ? 'Prescription published successfully to patient!'
            : 'Draft saved successfully.'
        );
        if (onSaveSuccess) onSaveSuccess();
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to save prescription:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to save prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface rounded-[32px] shadow-2xl border border-surface-variant overflow-hidden my-8 animate-fadeInUp">
        
        {/* Header */}
        <div className="bg-primary text-on-primary p-6 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
              Ayurveda Clinical Prescription
            </span>
            <h2 className="font-headline text-2xl font-bold tracking-tight mt-1">
              Prescription for {appointment.name}
            </h2>
            <p className="text-xs text-primary-fixed">
              Consultation Date: {appointment.date} ({appointment.time})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-error-container text-on-error-container text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-secondary-container text-on-secondary-container text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs text-on-surface">
          {fetching ? (
            <div className="py-12 flex justify-center items-center text-on-surface-variant gap-2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Loading prescription details...</span>
            </div>
          ) : (
            <>
              {/* 1. Clinical Assessment */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5 font-headline">
                  1. Clinical Assessment / Diagnosis
                </label>
                <textarea
                  rows="3"
                  value={assessment}
                  onChange={(e) => setAssessment(e.target.value)}
                  placeholder="e.g. Vata-Pitta imbalance, chronic digestive issues, stress-induced fatigue..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-outline-variant focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-lowest"
                />
              </div>

              {/* 2. Medicines */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-on-surface font-headline">
                    2. Prescribed Ayurvedic Medicines (Rx)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-bold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {medicines.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-surface-container-lowest border border-surface-variant grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                          placeholder="Medicine name (e.g. Ashwagandha Churna)"
                          className="w-full px-3 py-1.5 rounded-xl border border-outline-variant text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={m.dosage}
                          onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                          placeholder="Dosage (e.g. 1 tsp / 1 tab)"
                          className="w-full px-3 py-1.5 rounded-xl border border-outline-variant text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={m.frequency}
                          onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                          placeholder="Frequency (e.g. Twice daily)"
                          className="w-full px-3 py-1.5 rounded-xl border border-outline-variant text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={m.duration}
                          onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                          placeholder="Duration (14 days)"
                          className="w-full px-3 py-1.5 rounded-xl border border-outline-variant text-xs"
                        />
                        {medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(idx)}
                            className="p-1.5 rounded-lg text-outline hover:text-error"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Guidelines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 font-headline">
                    Diet Advice (Pathya)
                  </label>
                  <textarea
                    rows="3"
                    value={dietAdvice}
                    onChange={(e) => setDietAdvice(e.target.value)}
                    placeholder="e.g. Warm cooked meals, avoid cold/spicy foods, drink warm ginger water..."
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-outline-variant focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-lowest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 font-headline">
                    Lifestyle Advice (Dinacharya)
                  </label>
                  <textarea
                    rows="3"
                    value={lifestyleAdvice}
                    onChange={(e) => setLifestyleAdvice(e.target.value)}
                    placeholder="e.g. Daily 15-min Pranayama, sleep by 10 PM, mild morning walk..."
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-outline-variant focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-lowest"
                  />
                </div>
              </div>

              {/* 4. Follow-Up */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1 font-headline">
                  Recommended Follow-up
                </label>
                <input
                  type="text"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  placeholder="e.g. After 14 days"
                  className="w-full sm:w-1/2 px-3.5 py-2.5 rounded-2xl border border-outline-variant focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-lowest"
                />
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 bg-surface-container-low border-t border-surface-variant flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-full text-on-surface-variant hover:bg-surface-container text-xs font-bold transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave('DRAFT')}
              className="py-2.5 px-5 rounded-full border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface font-bold text-xs shadow-sm transition-all"
            >
              Save Draft
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave('PUBLISHED')}
              className="py-2.5 px-6 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Publish to Patient</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
