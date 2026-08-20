import React, { useState, useEffect } from 'react';
import HeaderNav from '../../../components/common/HeaderNav';
import Footer from '../../../components/common/Footer';
import StatusBadge from '../../../components/common/StatusBadge';
import PrescriptionModal from '../../../components/prescription/PrescriptionModal';
import api from '../../../instance';
import { getPatientUser, getPatientToken, setPatientSession, clearPatientSession } from '../../../constants/patientAuthStorage';

export default function PatientProfilePage() {
  const [patient, setPatient] = useState(getPatientUser());
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('UPCOMING'); // 'UPCOMING' | 'COMPLETED' | 'PRESCRIPTIONS'
  const [loading, setLoading] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  // Login / Lookup
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (patient?.email || patient?.phone || getPatientToken()) {
      fetchPatientData();
    }
  }, [patient]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      // 1. Fetch appointments
      const apptRes = await api.get('/patient/appointments/public', {
        params: { email: patient?.email, phone: patient?.phone },
      });
      if (apptRes.data && apptRes.data.data) {
        setAppointments(apptRes.data.data);
      }

      // 2. Fetch prescriptions
      const rxRes = await api.get('/patient/prescriptions/public', {
        params: { email: patient?.email, phone: patient?.phone },
      });
      if (rxRes.data && rxRes.data.data) {
        setPrescriptions(rxRes.data.data);
      }
    } catch (err) {
      console.warn('Error fetching patient records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLookupLogin = async (e) => {
    e.preventDefault();
    if (!lookupEmail.trim() && !lookupPhone.trim()) {
      setLoginError('Please enter your email or phone number.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    try {
      const user = {
        name: lookupEmail.split('@')[0] || 'Patient',
        email: lookupEmail.toLowerCase().trim(),
        phone: lookupPhone.trim(),
      };
      setPatientSession('guest_token_' + Date.now(), user);
      setPatient(user);
    } catch (err) {
      setLoginError('Failed to access profile. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearPatientSession();
    setPatient(null);
    setAppointments([]);
    setPrescriptions([]);
  };

  const handleJoinConsultation = async (appointmentId) => {
    try {
      const res = await api.get(`/appointments/${appointmentId}/join`);
      if (res.data && res.data.joinUrl) {
        window.open(res.data.joinUrl, '_blank');
      } else if (res.data?.message) {
        alert(res.data.message);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Cannot join consultation at this time.';
      alert(msg);
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status !== 'COMPLETED' && a.status !== 'completed' && a.status !== 'CANCELLED'
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === 'COMPLETED' || a.status === 'completed'
  );

  return (
    <div className="font-sans bg-surface text-on-surface antialiased min-h-screen flex flex-col relative">
      <HeaderNav />

      <main className="flex-1 max-w-container-max mx-auto w-full px-4 sm:px-8 lg:px-16 py-12">
        
        {/* If Patient Not Logged In */}
        {!patient ? (
          <div className="max-w-md mx-auto my-12 bg-surface-container-lowest rounded-3xl ambient-shadow border border-surface-variant/50 p-8 text-center space-y-6 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">account_circle</span>
            </div>

            <div>
              <h2 className="font-headline text-2xl font-bold text-on-surface">Patient Portal</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Enter your booking email or phone to view scheduled sessions, join Google Meet calls, and download prescriptions.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-2xl bg-error-container text-on-error-container text-xs flex items-center gap-2 text-left">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLookupLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {loginLoading ? <span>Accessing...</span> : <span>View My Consultations</span>}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Patient Header Banner */}
            <div className="p-8 rounded-3xl bg-primary text-on-primary flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0px_4px_20px_rgba(74,101,78,0.2)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
                    Patient Profile
                  </span>
                  <span className="text-xs opacity-80">{patient.email || patient.phone}</span>
                </div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">
                  Welcome, {patient.name || 'Patient'}
                </h1>
                <p className="text-xs opacity-80 mt-1">
                  Manage your upcoming consultations, join video calls, and access digital prescriptions.
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
              >
                Switch Account
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-surface-variant gap-6 text-sm font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('UPCOMING')}
                className={`pb-3 relative transition-colors ${
                  activeTab === 'UPCOMING'
                    ? 'text-primary border-b-2 border-primary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Upcoming Sessions ({upcomingAppointments.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('COMPLETED')}
                className={`pb-3 relative transition-colors ${
                  activeTab === 'COMPLETED'
                    ? 'text-primary border-b-2 border-primary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Past Consultations ({completedAppointments.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('PRESCRIPTIONS')}
                className={`pb-3 relative transition-colors ${
                  activeTab === 'PRESCRIPTIONS'
                    ? 'text-primary border-b-2 border-primary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                My Prescriptions ({prescriptions.length})
              </button>
            </div>

            {/* TAB 1: UPCOMING CONSULTATIONS */}
            {activeTab === 'UPCOMING' && (
              <div>
                {loading ? (
                  <div className="py-16 text-center text-on-surface-variant">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span className="text-xs">Loading appointments...</span>
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="bg-surface-container-lowest rounded-3xl ambient-shadow p-12 text-center text-on-surface-variant max-w-md mx-auto border border-surface-variant/40">
                    <span className="material-symbols-outlined text-[36px] text-outline mb-2">calendar_month</span>
                    <h3 className="font-headline text-lg font-bold text-on-surface">No Upcoming Consultations</h3>
                    <p className="text-xs text-on-surface-variant mt-1 mb-4">
                      You do not have any scheduled consultations at the moment.
                    </p>
                    <a
                      href="/#experts"
                      className="inline-block py-2.5 px-6 rounded-full bg-primary text-on-primary font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
                    >
                      Book a Session for ₹599
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingAppointments.map((appt) => {
                      const doctor = appt.doctor || {};
                      const isAyurveda =
                        appt.professionalType === 'AYURVEDA_DOCTOR' ||
                        doctor.professionalType === 'AYURVEDA_DOCTOR';

                      return (
                        <div key={appt._id} className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-surface-variant/40 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-3">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                  isAyurveda
                                    ? 'bg-primary-fixed text-on-primary-fixed-variant'
                                    : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                                }`}
                              >
                                {isAyurveda ? 'Ayurveda' : 'Psychology'}
                              </span>
                              <StatusBadge status={appt.status} />
                            </div>

                            <h3 className="font-headline text-xl font-bold text-on-surface">
                              {doctor.name || appt.doctorName || 'Practitioner'}
                            </h3>
                            <p className="text-xs text-on-surface-variant">{doctor.specialization || 'Clinical Specialist'}</p>

                            <div className="my-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 text-xs space-y-1.5 text-on-surface">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                                <span><strong>Date:</strong> {appt.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                                <span><strong>Time:</strong> {appt.time} (45 mins)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary text-[18px]">payments</span>
                                <span><strong>Fee:</strong> ₹{appt.amount || 599} (Confirmed)</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <button
                              onClick={() => handleJoinConsultation(appt._id)}
                              className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[18px]">videocam</span>
                              <span>Join Google Meet Consultation</span>
                            </button>
                            <p className="text-[11px] text-on-surface-variant text-center">
                              * Activates 10 minutes prior to scheduled start time
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PAST CONSULTATIONS */}
            {activeTab === 'COMPLETED' && (
              <div>
                {completedAppointments.length === 0 ? (
                  <div className="bg-surface-container-lowest rounded-3xl ambient-shadow p-12 text-center text-on-surface-variant max-w-md mx-auto border border-surface-variant/40">
                    <p className="text-sm font-bold">No past consultations found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedAppointments.map((appt) => (
                      <div key={appt._id} className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-surface-variant/40 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-headline text-lg font-bold text-on-surface">
                              {appt.doctor?.name || appt.doctorName || 'Practitioner'}
                            </h3>
                            <StatusBadge status="COMPLETED" />
                          </div>
                          <p className="text-xs text-on-surface-variant mb-3">
                            Session on {appt.date} at {appt.time}
                          </p>
                        </div>

                        {appt.prescriptionId && (
                          <div className="pt-3 border-t border-surface-variant">
                            <button
                              onClick={() => {
                                setSelectedPrescription(appt.prescriptionId);
                                setIsPrescriptionModalOpen(true);
                              }}
                              className="w-full py-2.5 px-4 rounded-xl bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
                              <span>View Digital Prescription</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MY PRESCRIPTIONS */}
            {activeTab === 'PRESCRIPTIONS' && (
              <div>
                {prescriptions.length === 0 ? (
                  <div className="bg-surface-container-lowest rounded-3xl ambient-shadow p-12 text-center text-on-surface-variant max-w-md mx-auto border border-surface-variant/40">
                    <span className="material-symbols-outlined text-[36px] text-outline mb-2">description</span>
                    <h3 className="font-headline text-lg font-bold text-on-surface">No Prescriptions Issued Yet</h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Ayurveda digital prescriptions will appear here once published by your doctor.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prescriptions.map((p) => (
                      <div key={p._id} className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-surface-variant/40 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                              Ayurveda Rx
                            </span>
                            <span className="text-xs text-on-surface-variant">
                              {new Date(p.publishedAt || p.createdAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>

                          <h3 className="font-headline text-lg font-bold text-on-surface">{p.doctorName}</h3>
                          <p className="text-xs text-on-surface-variant">
                            {(p.doctorQualifications || []).join(', ') || 'Ayurvedic Specialist'}
                          </p>

                          <div className="mt-3 p-3 rounded-2xl bg-surface-container-low text-xs text-on-surface">
                            <div className="font-bold text-on-surface mb-1">
                              {p.medicines?.length || 0} Medicines Prescribed
                            </div>
                            <p className="text-on-surface-variant line-clamp-2">
                              {p.assessment || p.dietAdvice || 'Ayurvedic prescription instructions available.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => {
                              setSelectedPrescription(p);
                              setIsPrescriptionModalOpen(true);
                            }}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            <span>View Details</span>
                          </button>

                          <a
                            href={`http://localhost:3000/api/patient/prescriptions/${p._id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold transition-colors flex items-center"
                            title="Download PDF"
                          >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          isOpen={isPrescriptionModalOpen}
          onClose={() => {
            setIsPrescriptionModalOpen(false);
            setSelectedPrescription(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
