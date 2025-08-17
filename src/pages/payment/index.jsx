import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'qr'
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  // UPI Payment Details
  const UPI_ID = '7025715250@ybl';
  const PAYMENT_AMOUNT = 500;
  const MERCHANT_NAME = 'MindVista Psychology';

  // Generate UPI QR Code URL
  const generateUPIQRCode = () => {
    const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${PAYMENT_AMOUNT}&cu=INR&tn=${encodeURIComponent('Appointment Payment - MindVista')}`;
    
    // Using QR Server API to generate QR code
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
  };

  useEffect(() => {
    // Get appointment data from location state
    if (location.state?.appointmentData) {
      setAppointmentData(location.state.appointmentData);
    } else {
      // If no data, redirect back to registration
      toast.error('No appointment data found. Please register again.');
      navigate('/register');
    }
  }, [location, navigate]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!appointmentData) {
      toast.error('Appointment data not found');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      
      if (!res) {
        toast.error('Razorpay SDK failed to load');
        setLoading(false);
        return;
      }

      // Create order on your backend
      const orderResponse = await fetch('http://localhost:3000/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 50000, // ₹500 in paise
          currency: 'INR',
          appointmentData: appointmentData
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay payment
      const options = {
        key: 'rzp_test_R6TXpHwdckbvvZ', // Your Razorpay test key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MindVista Psychology',
        description: `Appointment with Dr. ${appointmentData.doctorName || 'Doctor'}`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Verify payment on your backend
            const verifyResponse = await fetch('http://localhost:3000/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentData: appointmentData
              }),
            });

            if (verifyResponse.ok) {
              toast.success('Payment successful! Your appointment is confirmed.');
              setTimeout(() => {
                navigate('/about');
              }, 2000);
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: appointmentData.name,
          email: appointmentData.email,
          contact: appointmentData.number
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Something went wrong with payment. Please try again.');
      setLoading(false);
    }
  };

  const handleQRCodePayment = () => {
    setShowQRCode(true);
    setPaymentMethod('qr');
    toast.info('Please scan the QR code to complete your payment');
  };

  const handleBackToPaymentMethods = () => {
    setShowQRCode(false);
    setPaymentMethod('razorpay');
  };

  const handlePaymentSuccess = () => {
    toast.success('Payment successful! Your appointment is confirmed.');
    setTimeout(() => {
      navigate('/about');
    }, 2000);
  };

  // Copy UPI ID to clipboard
  const copyUPIId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      toast.success('UPI ID copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy UPI ID');
    }
  };

  // Handle receipt file selection
  const handleReceiptFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type (only allow images and PDFs)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid file type (JPEG, PNG, GIF, or PDF)');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      setReceiptFile(file);
      setReceiptFileName(file.name);
    }
  };

  // Handle receipt upload
  const handleReceiptUpload = async () => {
    if (!receiptFile) {
      toast.error('Please select a receipt file first');
      return;
    }

    setUploadingReceipt(true);
    
    try {
      const formData = new FormData();
      formData.append('receipt', receiptFile);
      formData.append('appointmentId', appointmentData.id || 'unknown');
      formData.append('patientName', appointmentData.name);
      formData.append('patientEmail', appointmentData.email);

      const response = await fetch('http://localhost:3000/api/upload-receipt', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Receipt uploaded successfully!');
        setReceiptFile(null);
        setReceiptFileName('');
        // Reset file input
        const fileInput = document.getElementById('receipt-file-input');
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error('Failed to upload receipt');
      }
    } catch (error) {
      console.error('Receipt upload error:', error);
      toast.error('Failed to upload receipt. Please try again.');
    } finally {
      setUploadingReceipt(false);
    }
  };

  // Remove selected receipt file
  const removeReceiptFile = () => {
    setReceiptFile(null);
    setReceiptFileName('');
    const fileInput = document.getElementById('receipt-file-input');
    if (fileInput) fileInput.value = '';
  };

  if (!appointmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  // QR Code Payment View
  if (showQRCode) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-green-600 px-6 py-4">
              <h1 className="text-xl font-semibold text-white text-center">
                QR Code Payment
              </h1>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {/* QR Code */}
              <div className="text-center mb-6">
                <div className="bg-gray-100 p-4 rounded-lg inline-block">
                  <div className="w-52 h-52 bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={generateUPIQRCode()}
                      alt="UPI QR Code for 7025715250@ybl"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback if QR code fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full flex items-center justify-center text-center" style={{display: 'none'}}>
                      <div>
                        <div className="text-4xl mb-2">📱</div>
                        <p className="text-sm text-gray-600">QR Code</p>
                        <p className="text-xs text-gray-500 mt-1">Error loading QR</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Scan with any UPI payment app</p>
              </div>

              {/* UPI ID Display */}
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <div className="text-center">
                  <p className="text-sm text-blue-700 font-medium">UPI ID:</p>
                  <button 
                    onClick={copyUPIId}
                    className="text-lg font-mono font-bold text-blue-800 hover:text-blue-900 cursor-pointer transition-colors"
                    title="Click to copy UPI ID"
                  >
                    {UPI_ID}
                  </button>
                  <p className="text-xs text-blue-600 mt-1">👆 Tap to copy</p>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Instructions:</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">1.</span>
                    <span>Open any UPI app (Google Pay, PhonePe, Paytm, BHIM, etc.)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">2.</span>
                    <span>Scan the QR code above OR use the UPI ID: <strong>{UPI_ID}</strong></span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">3.</span>
                    <span>Enter amount: <strong>₹{PAYMENT_AMOUNT}</strong></span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">4.</span>
                    <span>Add note: "Appointment Payment - MindVista"</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">5.</span>
                    <span>Complete the payment</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">6.</span>
                    <span>Click "Payment Completed" below after successful payment</span>
                  </div>
                </div>
              </div>

              {/* Receipt Upload Section for QR Payment */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Payment Receipt:</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    id="receipt-file-input-qr"
                    accept=".jpg, .jpeg, .png, .gif, .pdf"
                    onChange={handleReceiptFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="receipt-file-input-qr"
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-md font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors cursor-pointer"
                  >
                    {receiptFile ? `Selected File: ${receiptFileName}` : 'Choose Receipt File (PDF, JPG, PNG)'}
                  </label>
                  {receiptFile && (
                    <button
                      onClick={removeReceiptFile}
                      className="bg-red-500 text-white py-2 px-4 rounded-md font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      Remove File
                    </button>
                  )}
                </div>
                {receiptFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected file: <strong>{receiptFileName}</strong>
                  </p>
                )}
                {receiptFile && (
                  <button
                    onClick={handleReceiptUpload}
                    disabled={uploadingReceipt}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors mt-3"
                  >
                    {uploadingReceipt ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </div>
                    ) : (
                      'Upload Receipt'
                    )}
                  </button>
                )}
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Amount to Pay:</p>
                  <p className="text-3xl font-bold text-green-600">₹{PAYMENT_AMOUNT}</p>
                  <p className="text-sm text-gray-700 mt-1 font-medium">To: {MERCHANT_NAME}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handlePaymentSuccess}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors mb-3"
              >
                ✓ Payment Completed
              </button>

              <button
                onClick={handleBackToPaymentMethods}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                ← Back to Payment Methods
              </button>

              {/* Payment Apps */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 mb-2">Supported UPI Apps:</p>
                <div className="flex justify-center space-x-3 text-2xl">
                  <span title="Google Pay">💳</span>
                  <span title="PhonePe">📱</span>
                  <span title="Paytm">💰</span>
                  <span title="BHIM UPI">🏦</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-xl font-semibold text-white text-center">
              Complete Your Payment
            </h1>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Appointment Summary */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Appointment Summary</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="font-medium">{appointmentData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Doctor:</span>
                  <span className="font-medium">{appointmentData.doctorName || 'Selected Doctor'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{appointmentData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{appointmentData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Slot:</span>
                  <span className="font-medium capitalize">{appointmentData.slot}</span>
                </div>
              </div>
            </div>

            {/* Payment Amount */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">₹{PAYMENT_AMOUNT}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">* Consultation fee for one session</p>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Choose Payment Method:</h3>
              
              {/* Razorpay Option */}
              <div className="mb-3">
                <button
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    paymentMethod === 'razorpay' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      paymentMethod === 'razorpay' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'razorpay' && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Online Payment (Razorpay)</div>
                      <div className="text-sm text-gray-500">Credit/Debit cards, Net Banking, UPI</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* QR Code Option */}
              <div className="mb-3">
                <button
                  onClick={() => setPaymentMethod('qr')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    paymentMethod === 'qr' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      paymentMethod === 'qr' 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'qr' && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">QR Code Payment</div>
                      <div className="text-sm text-gray-500">Scan with UPI apps (Google Pay, PhonePe, Paytm)</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Receipt Upload Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Receipt:</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  id="receipt-file-input"
                  accept=".jpg, .jpeg, .png, .gif, .pdf"
                  onChange={handleReceiptFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="receipt-file-input"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer"
                >
                  {receiptFile ? `Selected File: ${receiptFileName}` : 'Choose Receipt File (PDF, JPG, PNG)'}
                </label>
                {receiptFile && (
                  <button
                    onClick={removeReceiptFile}
                    className="bg-red-500 text-white py-2 px-4 rounded-md font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    Remove File
                  </button>
                )}
              </div>
              {receiptFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected file: <strong>{receiptFileName}</strong>
                </p>
              )}
              {receiptFile && (
                <button
                  onClick={handleReceiptUpload}
                  disabled={uploadingReceipt}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors mt-3"
                >
                  {uploadingReceipt ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </div>
                  ) : (
                    'Upload Receipt'
                  )}
                </button>
              )}
            </div>

            {/* Payment Button */}
            {paymentMethod === 'razorpay' ? (
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay ₹${PAYMENT_AMOUNT} with Razorpay`
                )}
              </button>
            ) : (
              <button
                onClick={handleQRCodePayment}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                📱 Show QR Code
              </button>
            )}

            {/* Back Button */}
            <button
              onClick={() => navigate('/register')}
              className="w-full mt-3 bg-gray-200 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              ← Back to Registration
            </button>

            {/* Payment Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                🔒 Secure payment options available
              </p>
              <div className="flex justify-center items-center space-x-4 mt-2">
                <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="h-6 w-auto opacity-60" />
                <div className="text-green-600 font-medium text-sm">UPI QR</div>
                <div className="text-blue-600 text-xs">SSL Secured</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PaymentPage;