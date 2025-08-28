import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiInstance from '../../instance';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showUPIId, setShowUPIId] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('qr'); // 'qr' or 'upi'
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState('');


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

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'qr') {
      setShowQRCode(true);
      setShowUPIId(false);
    } else if (method === 'upi') {
      setShowUPIId(true);
      setShowQRCode(false);
    }
  };

  // Handle QR Code Payment
  const handleQRCodePayment = () => {
    setShowQRCode(true);
    setShowUPIId(false);
    setPaymentMethod('qr');
    toast.info('Please scan the QR code to complete your payment');
  };

  // Handle UPI ID Payment
  const handleUPIIdPayment = () => {
    setShowUPIId(true);
    setShowQRCode(false);
    setPaymentMethod('upi');
    toast.info('Please use the UPI ID to complete your payment');
  };

  // Handle back to payment methods
  const handleBackToPaymentMethods = () => {
    setShowQRCode(false);
    setShowUPIId(false);
    setPaymentMethod('qr');
  };

  // Handle payment success and create appointment
  const handlePaymentSuccess = async () => {
    if (!receiptFile) {
      toast.error('Please upload your payment receipt first');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare appointment data with payment confirmation
      const appointmentDataWithPayment = {
        ...appointmentData,
        paymentStatus: 'completed',
        status: 'confirmed',
        paymentCompletedAt: new Date().toISOString(),
        receiptUploaded: true
      };

      // Create FormData to send both appointment data and receipt file
      const formData = new FormData();
      
      // Append the receipt file
      formData.append('receipt', receiptFile);
      
      // Append all appointment data as JSON string
      formData.append('appointmentData', JSON.stringify(appointmentDataWithPayment));

      // Call the appointment API directly with receipt and data
      const response = await apiInstance.post('/appointment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Appointment confirmed! Your session is scheduled.');
        
        // Reset file state
        setReceiptFile(null);
        setReceiptFileName('');
        
        // Reset all file inputs
        const fileInput = document.getElementById('receipt-file-input');
        const fileInputQR = document.getElementById('receipt-file-input-qr');
        const fileInputUPI = document.getElementById('receipt-file-input-upi');
        if (fileInput) fileInput.value = '';
        if (fileInputQR) fileInputQR.value = '';
        if (fileInputUPI) fileInputUPI.value = '';
        
        // Navigate to about page after success
        setTimeout(() => {
          navigate('/about');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Payment completion error:', error);
      if (error.response && error.response.status === 403) {
        toast.error(error.response.data.message || 'Please use a registered email!');
      } else if (error.response && error.response.status === 409) {
        toast.error('An appointment already exists for this time slot. Please choose another time.');
      } else {
        toast.error('Failed to complete payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Copy UPI ID to clipboard
  const copyUPIId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      toast.success('UPI ID copied to clipboard!');
    } catch {
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

  // Remove selected receipt file
  const removeReceiptFile = () => {
    setReceiptFile(null);
    setReceiptFileName('');
    // Reset all file inputs
    const fileInput = document.getElementById('receipt-file-input');
    const fileInputQR = document.getElementById('receipt-file-input-qr');
    const fileInputUPI = document.getElementById('receipt-file-input-upi');
    if (fileInput) fileInput.value = '';
    if (fileInputQR) fileInputQR.value = '';
    if (fileInputUPI) fileInputUPI.value = '';
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
                    <span>Add note: &quot;Appointment Payment - MindVista&quot;</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">5.</span>
                    <span>Complete the payment</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">6.</span>
                    <span>Click &quot;Payment Completed&quot; below after successful payment</span>
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
                disabled={!receiptFile || loading}
                className={`w-full py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors mb-3 ${
                  receiptFile && !loading
                    ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  '✓ Payment Completed & Confirm Appointment'
                )}
              </button>

              {!receiptFile && (
                <p className="text-sm text-orange-600 text-center mb-3">
                  ⚠️ Please upload your payment receipt first to enable the Payment Completed button.
                </p>
              )}
              {receiptFile && (
                <p className="text-sm text-green-600 text-center mb-3">
                  ✅ Receipt uploaded! You can now mark payment as completed.
                </p>
              )}

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

  // UPI ID Payment View
  if (showUPIId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4">
              <h1 className="text-xl font-semibold text-white text-center">
                UPI ID Payment
              </h1>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {/* UPI ID Display */}
              <div className="bg-blue-50 p-6 rounded-lg mb-6 text-center">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-sm text-blue-700 font-medium mb-2">UPI ID:</p>
                <button 
                  onClick={copyUPIId}
                  className="text-2xl font-mono font-bold text-blue-800 hover:text-blue-900 cursor-pointer transition-colors mb-2"
                  title="Click to copy UPI ID"
                >
                  {UPI_ID}
                </button>
                <p className="text-xs text-blue-600">👆 Tap to copy</p>
              </div>

              {/* Payment Instructions */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Instructions:</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">1.</span>
                    <span>Open any UPI app (Google Pay, PhonePe, Paytm, BHIM, etc.)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">2.</span>
                    <span>Click on &quot;Send Money&quot; or &quot;Pay&quot;</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">3.</span>
                    <span>Enter UPI ID: <strong>{UPI_ID}</strong></span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">4.</span>
                    <span>Enter amount: <strong>₹{PAYMENT_AMOUNT}</strong></span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">5.</span>
                    <span>Add note: &quot;Appointment Payment - MindVista&quot;</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">6.</span>
                    <span>Complete the payment</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">7.</span>
                    <span>Click &quot;Payment Completed&quot; below after successful payment</span>
                  </div>
                </div>
              </div>

              {/* Receipt Upload Section for UPI Payment */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Payment Receipt:</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    id="receipt-file-input-upi"
                    accept=".jpg, .jpeg, .png, .gif, .pdf"
                    onChange={handleReceiptFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="receipt-file-input-upi"
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

              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Amount to Pay:</p>
                  <p className="text-3xl font-bold text-blue-600">₹{PAYMENT_AMOUNT}</p>
                  <p className="text-sm text-gray-700 mt-1 font-medium">To: {MERCHANT_NAME}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handlePaymentSuccess}
                disabled={!receiptFile || loading}
                className={`w-full py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors mb-3 ${
                  receiptFile && !loading
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  '✓ Payment Completed & Confirm Appointment'
                )}
              </button>

              {!receiptFile && (
                <p className="text-sm text-orange-600 text-center mb-3">
                  ⚠️ Please upload your payment receipt first to enable the Payment Completed button.
                </p>
              )}
              {receiptFile && (
                <p className="text-sm text-green-600 text-center mb-3">
                  ✅ Receipt uploaded! You can now mark payment as completed.
                </p>
              )}

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
              
              {/* QR Code Option - Recommended */}
              <div className="mb-3">
                <button
                  onClick={() => handlePaymentMethodSelect('qr')}
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
                      <div className="text-sm text-gray-500">Scan with UPI apps (Google Pay, PhonePe, Paytm) - Recommended</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* UPI ID Option */}
              <div className="mb-3">
                <button
                  onClick={() => handlePaymentMethodSelect('upi')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    paymentMethod === 'upi' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      paymentMethod === 'upi' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'upi' && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">UPI ID Payment</div>
                      <div className="text-sm text-gray-500">Use UPI ID directly in payment apps</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Receipt Upload Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Receipt:</h3>
              <p className="text-sm text-gray-600 mb-3">
                After completing payment, upload your receipt to confirm your appointment. Your appointment will only be confirmed after receipt verification.
              </p>
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

            </div>

            {/* Payment Button */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3 text-center">
                💡 <strong>Choose your preferred payment method above</strong>
              </p>
              
              {paymentMethod === 'qr' && (
                <button
                  onClick={handleQRCodePayment}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  📱 Show QR Code & Pay ₹{PAYMENT_AMOUNT}
                </button>
              )}
              
              {paymentMethod === 'upi' && (
                <button
                  onClick={handleUPIIdPayment}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  💳 Show UPI ID & Pay ₹{PAYMENT_AMOUNT}
                </button>
              )}
            </div>

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
                <div className="text-green-600 font-medium text-sm">UPI QR</div>
                <div className="text-blue-600 text-xs">UPI ID</div>
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