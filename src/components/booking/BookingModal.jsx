import React, { useState, useEffect } from 'react';
import SlotPicker from './SlotPicker';
import api from '../../instance';
import { getPatientUser } from '../../constants/patientAuthStorage';

// Dynamically load Razorpay SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookingModal({ doctor, isOpen, onClose, onBookingSuccess }) {
  const [step, setStep] = useState(1); // 1: Slot, 2: Details, 3: Review & Pay, 4: Confirmed
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [holdData, setHoldData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedData, setConfirmedData] = useState(null);

  const loggedInPatient = getPatientUser();
  const [formData, setFormData] = useState({
    name: loggedInPatient?.name || '',
    email: loggedInPatient?.email || '',
    phone: loggedInPatient?.phone || '',
    age: '25',
    reasonForConsultation: '',
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedSlot(null);
      setHoldData(null);
      setErrorMessage('');
      setConfirmedData(null);
      const user = getPatientUser();
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
        }));
      }
    }
  }, [isOpen]);

  if (!isOpen || !doctor) return null;

  const price = doctor.consultation?.price || 599;
  const duration = doctor.consultation?.durationMinutes || 45;
  const isAyurveda =
    doctor.professionalType === 'AYURVEDA_DOCTOR' ||
    (doctor.specialization || '').toLowerCase().includes('ayurved');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToDetails = () => {
    if (!selectedSlot?.date || !selectedSlot?.time) {
      setErrorMessage('Please select a consultation date and time slot.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleProceedToPayment = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please provide your Name, Email, and Phone number.');
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  const handlePayAndConfirm = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // 1. Create Pending Booking
      const bookingRes = await api.post('/appointments/booking', {
        doctorId: doctor._id,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        age: parseInt(formData.age, 10) || 25,
        date: selectedSlot.date,
        time: selectedSlot.time,
        durationMinutes: duration,
        reasonForConsultation: formData.reasonForConsultation || '',
        holdToken: holdData?.holdToken || null,
      });

      const appointmentId = bookingRes.data?.data?.appointmentId || bookingRes.data?.data?._id;

      // 2. Create Server-Enforced Order (₹599)
      const orderRes = await api.post('/payments/order', {
        doctorId: doctor._id,
        appointmentId,
        holdToken: holdData?.holdToken || null,
      });

      const { order, key_id } = orderRes.data;

      // 3. Open Razorpay Checkout Dialog
      const options = {
        key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SN3KWXr3ClAEo8',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'MindVista',
        description: `45-min Consultation with ${doctor.name}`,
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#4a654e',
        },
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              appointmentId,
              holdToken: holdData?.holdToken || null,
            });

            if (verifyRes.data && verifyRes.data.success) {
              setConfirmedData({
                appointmentId,
                doctorName: doctor.name,
                professionalType: doctor.professionalType,
                date: selectedSlot.date,
                time: selectedSlot.time,
                amount: price,
                meeting: verifyRes.data.data?.meeting,
              });
              setStep(4);
              if (onBookingSuccess) onBookingSuccess();
            } else {
              throw new Error(verifyRes.data?.message || 'Payment verification failed');
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            setErrorMessage('Payment received, but verification is finalizing. Please check your dashboard.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setErrorMessage(`Payment failed: ${response.error.description || 'Transaction declined'}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error('[handlePayAndConfirm] Error:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to initiate checkout.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-surface rounded-[32px] shadow-2xl border border-surface-variant overflow-hidden my-8 animate-fadeInUp">
        
        {/* Header */}
        <div className="bg-primary text-on-primary p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
              {isAyurveda ? 'Ayurvedic Healing' : 'Psychology & Counseling'}
            </span>
            <span className="text-xs text-primary-fixed">
              ₹{price} • {duration} Minutes
            </span>
          </div>

          <h2 className="font-headline text-2xl font-bold tracking-tight">
            Consultation with {doctor.name}
          </h2>

          {/* Stepper Progress */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/15 text-xs">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-white font-bold' : 'text-white/50'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-white text-on-primary-container' : 'bg-primary-container text-white'}`}>1</span>
              <span>Slot</span>
            </div>
            <div className="h-0.5 flex-1 bg-white/20 mx-2" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-white font-bold' : 'text-white/50'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-white text-on-primary-container' : 'bg-primary-container text-white'}`}>2</span>
              <span>Details</span>
            </div>
            <div className="h-0.5 flex-1 bg-white/20 mx-2" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-white font-bold' : 'text-white/50'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-white text-on-primary-container' : 'bg-primary-container text-white'}`}>3</span>
              <span>Payment</span>
            </div>
            <div className="h-0.5 flex-1 bg-white/20 mx-2" />
            <div className={`flex items-center gap-1.5 ${step === 4 ? 'text-white font-bold' : 'text-white/50'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 4 ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-primary-container text-white'}`}>4</span>
              <span>Done</span>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-error-container text-on-error-container text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {/* Step 1: Slot Picker */}
          {step === 1 && (
            <div className="space-y-6">
              <SlotPicker
                doctor={doctor}
                selectedSlot={selectedSlot}
                onSlotSelected={setSelectedSlot}
                onHoldCreated={setHoldData}
              />

              {selectedSlot && (
                <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant text-xs text-on-surface flex items-center justify-between">
                  <div>
                    <span className="font-bold text-primary">Selected:</span> {selectedSlot.date} at {selectedSlot.time}
                  </div>
                  <span className="font-headline font-bold text-primary text-sm">₹{price}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={handleProceedToDetails}
                  className="py-3 px-8 rounded-full bg-secondary text-on-secondary font-bold text-xs shadow-[0px_4px_12px_rgba(58,102,95,0.2)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                >
                  <span>Continue to Details</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Patient Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="1"
                    max="120"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Reason for Consultation (Optional)
                </label>
                <textarea
                  name="reasonForConsultation"
                  rows="3"
                  value={formData.reasonForConsultation}
                  onChange={handleInputChange}
                  placeholder="Briefly describe what you'd like to discuss with the practitioner..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest resize-none"
                />
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-surface-variant">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-full text-on-surface-variant hover:bg-surface-container text-xs font-bold transition-colors"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="py-3 px-8 rounded-full bg-secondary text-on-secondary font-bold text-xs shadow-[0px_4px_12px_rgba(58,102,95,0.2)] hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <span>Review & Pay ₹{price}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Pay */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-variant space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-surface-variant">
                  <span className="text-on-surface-variant">Practitioner:</span>
                  <span className="font-bold text-on-surface">{doctor.name} ({isAyurveda ? 'Ayurveda' : 'Psychology'})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-surface-variant">
                  <span className="text-on-surface-variant">Scheduled Time:</span>
                  <span className="font-bold text-on-surface">{selectedSlot?.date} at {selectedSlot?.time}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-surface-variant">
                  <span className="text-on-surface-variant">Session Format:</span>
                  <span className="font-bold text-on-surface">{duration} Minutes (Private Google Meet)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-surface-variant">
                  <span className="text-on-surface-variant">Patient:</span>
                  <span className="font-bold text-on-surface">{formData.name} ({formData.phone})</span>
                </div>
                <div className="flex justify-between items-center pt-1 text-sm font-headline">
                  <span className="font-bold text-on-surface">Consultation Fee:</span>
                  <span className="font-bold text-primary text-base">₹{price}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant text-xs text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
                <span>100% Secure Razorpay payment. Google Meet link provisioned immediately.</span>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-surface-variant">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStep(2)}
                  className="py-2.5 px-4 rounded-full text-on-surface-variant hover:bg-surface-container text-xs font-bold transition-colors"
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handlePayAndConfirm}
                  className="py-3 px-8 rounded-full bg-secondary text-on-secondary font-bold text-xs shadow-[0px_4px_12px_rgba(58,102,95,0.2)] hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Pay ₹{price} & Confirm</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmed */}
          {step === 4 && confirmedData && (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container mx-auto flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>

              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface">Appointment Confirmed!</h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Your 45-minute private consultation is confirmed.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-variant text-left text-xs space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Doctor:</span>
                  <span className="font-bold text-on-surface">{confirmedData.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Date & Time:</span>
                  <span className="font-bold text-on-surface">{confirmedData.date} at {confirmedData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Platform:</span>
                  <span className="font-bold text-primary">Google Meet (Private)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Paid:</span>
                  <span className="font-bold text-primary">₹{confirmedData.amount} (Confirmed)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.href = '/profile';
                  }}
                  className="w-full py-3 px-6 rounded-full bg-primary text-on-primary font-bold text-xs shadow-sm hover:opacity-90 transition-all"
                >
                  View in My Consultations
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
