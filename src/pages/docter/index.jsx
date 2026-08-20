import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNav from '../../components/common/HeaderNav';
import Footer from '../../components/common/Footer';
import StatusBadge from '../../components/common/StatusBadge';
import PrescriptionEditorModal from '../../components/prescription/PrescriptionEditorModal';
import PrescriptionModal from '../../components/prescription/PrescriptionModal';
import api from '../../instance';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('TODAY'); // 'TODAY' | 'UPCOMING' | 'COMPLETED'
  const [searchTerm, setSearchTerm] = useState('');

  // Prescription Modal states
  const [selectedApptForPrescription, setSelectedApptForPrescription] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    const storedDoctor = localStorage.getItem('doctorData');
    if (storedDoctor) {
      try {
        const parsed = JSON.parse(storedDoctor);
        setDoctor(parsed);
        fetchDoctorAppointments(parsed._id || parsed.id);
      } catch (err) {
        navigate('/doctor/login');
      }
    } else {
      navigate('/doctor/login');
    }
  }, []);

  const fetchDoctorAppointments = async (doctorId) => {
    setLoading(true);
    try {
      const res = await api.get('/professional/appointments/public', {
        params: { doctorId },
      });
      if (res.data && res.data.data) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = async (appointmentId) => {
    try {
      const res = await api.get(`/professional/appointments/${appointmentId}/join`);
      if (res.data && res.data.joinUrl) {
        window.open(res.data.joinUrl, '_blank');
      } else {
        alert(res.data?.message || 'Could not launch Google Meet.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error joining meeting.');
    }
  };

  const handleMarkCompleted = async (appointmentId) => {
    if (!window.confirm('Mark this consultation as completed?')) return;
    try {
      const res = await api.post(`/professional/appointments/${appointmentId}/complete-public`);
      if (res.data && res.data.success) {
        fetchDoctorAppointments(doctor._id || doctor.id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete appointment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctorData');
    localStorage.removeItem('doctorToken');
    sessionStorage.clear();
    navigate('/doctor/login');
  };

  if (!doctor) return null;

  const isAyurveda =
    doctor.professionalType === 'AYURVEDA_DOCTOR' ||
    (doctor.specialization || '').toLowerCase().includes('ayurved');

  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const upcomingAppointments = appointments.filter(
    (a) => a.date >= todayStr && a.status !== 'COMPLETED' && a.status !== 'completed'
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === 'COMPLETED' || a.status === 'completed'
  );

  const currentDisplayList =
    activeTab === 'TODAY'
      ? todayAppointments
      : activeTab === 'UPCOMING'
      ? upcomingAppointments
      : completedAppointments;

  const filteredAppointments = currentDisplayList.filter((a) => {
    if (!searchTerm.trim()) return true;
    return (
      (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.phone || '').includes(searchTerm)
    );
  });

  return (
    <div className="font-sans bg-surface text-on-surface antialiased min-h-screen flex flex-col relative">
      <HeaderNav />

      <main className="flex-1 max-w-container-max mx-auto w-full px-4 sm:px-8 lg:px-16 py-12">
        
        {/* Doctor Header Banner */}
        <div className="p-8 rounded-3xl bg-primary text-on-primary flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0px_4px_20px_rgba(74,101,78,0.2)] mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isAyurveda ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                }`}
              >
                {isAyurveda ? 'Ayurvedic Practitioner Portal' : 'Psychology Portal'}
              </span>
              <span className="text-xs opacity-80">{doctor.email}</span>
            </div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">{doctor.name}</h1>
            <p className="text-xs opacity-80 mt-1">
              {doctor.specialization} • 45-Min Sessions (₹{doctor.consultation?.price || 599})
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-surface-variant/40">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Today's Sessions</div>
            <div className="font-headline text-3xl font-bold text-on-surface mt-1">{todayAppointments.length}</div>
          </div>
          <div className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-surface-variant/40">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Upcoming Total</div>
            <div className="font-headline text-3xl font-bold text-primary mt-1">{upcomingAppointments.length}</div>
          </div>
          <div className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-surface-variant/40">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Completed Sessions</div>
            <div className="font-headline text-3xl font-bold text-secondary mt-1">{completedAppointments.length}</div>
          </div>
        </div>

        {/* Tab Selection & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-variant pb-3 mb-6">
          <div className="flex gap-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab('TODAY')}
              className={`pb-2 transition-colors ${
                activeTab === 'TODAY'
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Today's Sessions ({todayAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('UPCOMING')}
              className={`pb-2 transition-colors ${
                activeTab === 'UPCOMING'
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Upcoming ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`pb-2 transition-colors ${
                activeTab === 'COMPLETED'
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Completed ({completedAppointments.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient name..."
              className="w-full pl-4 pr-3 py-2 rounded-full border border-outline-variant bg-surface-container-lowest text-xs text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="py-16 text-center text-on-surface-variant">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs">Loading appointments...</span>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-3xl ambient-shadow p-12 text-center text-on-surface-variant max-w-md mx-auto border border-surface-variant/40">
            <span className="material-symbols-outlined text-[36px] text-outline mb-2">event_available</span>
            <p className="font-headline text-sm font-bold text-on-surface">No appointments in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAppointments.map((appt) => (
              <div key={appt._id} className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-surface-variant/40 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-headline text-xl font-bold text-on-surface">{appt.name}</h3>
                      <p className="text-xs text-on-surface-variant">
                        {appt.phone} • {appt.email} • {appt.age} yrs
                      </p>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 text-xs space-y-1.5 my-3 text-on-surface">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                      <span><strong>Date:</strong> {appt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                      <span><strong>Time:</strong> {appt.time} (45 mins)</span>
                    </div>
                    {appt.reasonForConsultation && (
                      <div className="pt-1 text-on-surface-variant italic">
                        "{appt.reasonForConsultation}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-surface-variant">
                  {/* Start Google Meet Video Call */}
                  {appt.status !== 'COMPLETED' && appt.status !== 'completed' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartConsultation(appt._id)}
                        className="flex-1 py-3 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">videocam</span>
                        <span>Start Consultation (Google Meet)</span>
                      </button>

                      <button
                        onClick={() => handleMarkCompleted(appt._id)}
                        className="py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold transition-colors"
                        title="Mark Completed"
                      >
                        <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                      </button>
                    </div>
                  ) : null}

                  {/* Ayurveda Prescription Actions */}
                  {isAyurveda && (
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setSelectedApptForPrescription(appt);
                          setIsEditorOpen(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
                        <span>
                          {appt.prescriptionId ? 'Edit Digital Prescription' : 'Draft Ayurveda Prescription'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Ayurveda Prescription Editor Modal */}
      {selectedApptForPrescription && (
        <PrescriptionEditorModal
          appointment={selectedApptForPrescription}
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setSelectedApptForPrescription(null);
          }}
          onSaveSuccess={() => {
            fetchDoctorAppointments(doctor._id || doctor.id);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
