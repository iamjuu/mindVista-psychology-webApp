
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import apiInstance from "../../instance"; // your axios instance

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Get appointment data from navigation state
  const appointmentData = location.state?.appointmentData;
  
  console.log('Location state:', location.state);
  console.log('Appointment data:', appointmentData);
  
  // If no appointment data, redirect back to registration
  if (!appointmentData) {
    console.log('No appointment data found, redirecting to registration');
    navigate('/register');
    return null;
  }

  // Load Razorpay script dynamically (safe way)
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Check your internet.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create order on backend
      const { data: order } = await apiInstance.post("/create-order", {
        amount: 50000, // ₹500 in paise (500 * 100)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        appointmentData: appointmentData
      });

      // Step 2: Open Razorpay Checkout
      const options = {
        key: "rzp_test_RMhvZDD0dxSGn0", // Razorpay test key
        amount: order.order.amount,
        currency: order.order.currency,
        name: "MindVista Psychology",
        description: "Appointment Payment",
        order_id: order.order.id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment
            const appointmentId = appointmentData?._id || appointmentData?.id;
            console.log('Payment verification - appointmentId:', appointmentId);
            console.log('Payment verification - response:', response);
            
            const verifyRes = await apiInstance.post("/verify-payment", {
              ...response,
              appointmentId: appointmentId
            });

            if (verifyRes.data.success) {
              toast.success("Payment successful! Appointment confirmed.");
              navigate("/");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Something went wrong verifying payment.");
          }
        },
        prefill: {
          name: appointmentData?.name || "Guest",
          email: appointmentData?.email || "guest@example.com",
          contact: appointmentData?.number || "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment initiation failed.");
    }

    setLoading(false);
  };

  return (
    <div 
    
    className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      {/* Title */}
      <h1 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
        Confirm Your Appointment
      </h1>
  
      {/* Details */}
      <div className="space-y-3 text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium">Name:</span>
          <span>{appointmentData?.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Email:</span>
          <span>{appointmentData?.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Phone:</span>
          <span>{appointmentData?.number}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Location:</span>
          <span>{appointmentData?.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Age:</span>
          <span>{appointmentData?.age}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Doctor:</span>
          <span>{appointmentData?.doctorName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Date:</span>
          <span>{appointmentData?.date ? new Date(appointmentData.date).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Time Slot:</span>
          <span>{appointmentData?.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Slot:</span>
          <span className="capitalize">{appointmentData?.slot}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
          <span>Fee:</span>
          <span>₹500</span>
        </div>
      </div>
  
      {/* Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="mt-6 w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Pay with Razorpay"}
      </button>
    </div>
  </div>
  
  );
};

export default PaymentPage;
