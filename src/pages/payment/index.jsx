
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiInstance from "../../instance"; // your axios instance
import PropTypes from "prop-types";

const PaymentPage = ({ appointmentData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
        receipt: `receipt_${Date.now()}`
      });

      // Step 2: Open Razorpay Checkout
      const options = {
        key: "rzp_test_RMhvZDD0dxSGn0", // Razorpay test key
        amount: order.amount,
        currency: order.currency,
        name: "MindVista Psychology",
        description: "Appointment Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment
            const verifyRes = await apiInstance.post("/verify-payment", response);

            if (verifyRes.data.success) {
              toast.success("Payment successful! Appointment confirmed.");
              navigate("/about");
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
          contact: appointmentData?.phone || "9999999999",
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Confirm Your Appointment</h1>
        <p className="text-gray-700 mb-2">Name: {appointmentData?.name}</p>
        <p className="text-gray-700 mb-2">Email: {appointmentData?.email}</p>
        <p className="text-gray-700 mb-2">Phone: {appointmentData?.phone}</p>
        <p className="text-gray-700 mb-4">Fee: ₹500</p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay with Razorpay"}
        </button>
      </div>
    </div>
  );
};

PaymentPage.propTypes = {
  appointmentData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }),
};

export default PaymentPage;
