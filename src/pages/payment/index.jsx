import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import HeaderNav from '../../components/common/HeaderNav';
import Footer from '../../components/common/Footer';
import apiInstance from '../../instance';
import { savePatientProfileAfterPayment } from '../../constants/patientProfileStorage';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const appointmentData = location.state?.appointmentData;

  if (!appointmentData) {
    navigate('/#experts');
    return null;
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Razorpay SDK failed to load. Check your internet connection.');
      setLoading(false);
      return;
    }

    try {
      const orderRes = await apiInstance.post('/payments/order', {
        doctorId: appointmentData.doctorId || appointmentData.doctor?._id,
        appointmentId: appointmentData._id || appointmentData.id,
      });

      const { order, key_id } = orderRes.data;

      const options = {
        key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SN3KWXr3ClAEo8',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'MindVista Telehealth',
        description: '45-Min Video Consultation',
        order_id: order.id,
        handler: async function (response) {
          try {
            setLoading(true);
            const appointmentId = appointmentData?._id || appointmentData?.id;

            const verifyRes = await apiInstance.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              appointmentId,
            });

            if (verifyRes.data && verifyRes.data.success) {
              savePatientProfileAfterPayment(appointmentData, appointmentId);
              toast.success('Consultation confirmed! Redirecting to your dashboard...');
              setTimeout(() => {
                navigate('/profile');
              }, 1200);
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            toast.error('Error verifying payment.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: appointmentData?.name || '',
          email: appointmentData?.email || '',
          contact: appointmentData?.phone || appointmentData?.number || '',
        },
        theme: {
          color: '#4a654e',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error?.description || 'Transaction declined'}`);
        setLoading(false);
      });
      paymentObject.open();
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment initiation failed.');
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-surface text-on-surface antialiased min-h-screen flex flex-col relative">
      <HeaderNav />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl ambient-shadow border border-surface-variant/50 p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">payments</span>
            </div>
            <h1 className="font-headline text-2xl font-bold text-on-surface">Confirm Consultation</h1>
            <p className="text-xs text-on-surface-variant">
              Review session details before proceeding to 100% secure Razorpay checkout.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 text-xs space-y-2 text-on-surface">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Patient Name:</span>
              <span className="font-bold">{appointmentData?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Email:</span>
              <span className="font-bold">{appointmentData?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Contact:</span>
              <span className="font-bold">{appointmentData?.phone || appointmentData?.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Scheduled Date:</span>
              <span className="font-bold">{appointmentData?.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Time Slot:</span>
              <span className="font-bold">{appointmentData?.time} (45 mins)</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
              <span className="font-bold text-on-surface">Standard Consultation Fee:</span>
              <span className="font-headline text-xl font-bold text-primary">₹599</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Initiating Payment...</span>
            ) : (
              <>
                <span>Pay ₹599 & Confirm Booking</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </>
            )}
          </button>

          <div className="text-center text-[11px] text-on-surface-variant flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-secondary">lock</span>
            <span>Secured with 256-bit SSL encryption</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
