import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff, Lock, Mail, Brain } from 'lucide-react';
import apiInstance from '../../instance';
import { Button } from '../../components/shadcn/button/button';
import { MainBackgroundImage } from '../../assets';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone number field (password), only allow digits
    if (name === 'password') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in email and phone number');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiInstance.post('/doctor/login', formData);
      
      if (response.data.success) {
        // Check if doctor is approved
        if (!response.data.doctor.isActive) {
          toast.error('Please contact administration to approve your account before logging in.');
          return;
        }
        
        toast.success('Login successful!');
        
        // Store doctor data in localStorage
        localStorage.setItem('doctorData', JSON.stringify(response.data.doctor));
        localStorage.setItem('isDoctorLoggedIn', 'true');
        
        // Navigate to doctor dashboard
        setTimeout(() => {
          navigate(`/doctor?email=${encodeURIComponent(formData.email)}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div 
    style={{
      backgroundImage: `url(${MainBackgroundImage})`,
      backgroundPosition: "top center",
      backgroundSize: "100% auto",
      backgroundRepeat: "repeat-y",
    }}
    className=" h-screen flex items-center justify-center p-4">
      <ToastContainer position="top-right" />
      
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
        
        
          <p className="text-gray-600">
            Sign in using your email and phone number to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your phone number (10 digits)"
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
                <Button
                  type="button"
                  onClick={togglePasswordVisibility}
                  variant="secondary"
                  size="icon"
                  className="absolute inset-y-0 right-0 pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 " />
                  ) : (
                    <Eye className="h-5 w-5 " />
                  )}
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
            >
              Forgot your phone number?
            </a>
          </div>

          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
              >
                Contact admin
              </a>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 MindVista. All rights reserved.</p>
          <p className="mt-1">Professional healthcare platform</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
