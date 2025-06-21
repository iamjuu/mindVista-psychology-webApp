import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Phone as PhoneIcon, Facebook, Chrome } from 'lucide-react'; // Added PhoneIcon
import { FcGoogle } from "react-icons/fc";

export default function DiprellaLogin() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Signup form states
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  // Google signup states
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Common message state {text: string, type: 'error' | 'success' | ''}
  const [formMessage, setFormMessage] = useState({ text: '', type: '' });

  // Load Google Identity Services
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Google Client ID
          callback: handleGoogleSignup,
        });
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGoogleSignup = async (response) => {
    try {
      setIsGoogleLoading(true);
      setFormMessage({ text: '', type: '' });
      
      // Decode the JWT token to get user info
      const userInfo = JSON.parse(atob(response.credential.split('.')[1]));
      
      // Send Google token to your backend for verification and user creation
      const backendResponse = await axios.post('http://localhost:3000/auth/google', {
        token: response.credential,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture
      });
      
      if (backendResponse.data.token) {
        localStorage.setItem('token', backendResponse.data.token);
      }
      if (backendResponse.data.userId) {
        localStorage.setItem('userId', backendResponse.data.userId);
      }

      setFormMessage({ text: 'Google signup successful! Redirecting...', type: 'success' });
      console.log('Google signup successful:', userInfo);
      
      // Navigate to home page after successful signup
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('Google signup error:', error);
      setFormMessage({ 
        text: error.response?.data?.message || 'Google signup failed. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const triggerGoogleSignup = () => {
    if (window.google && !isGoogleLoading) {
      setIsGoogleLoading(true);
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If prompt doesn't show, try alternative method
          setFormMessage({ 
            text: 'Please allow popups for Google signup or try again.', 
            type: 'error' 
          });
        }
        setIsGoogleLoading(false);
      });
    } else if (!window.google) {
      setFormMessage({ 
        text: 'Google services not available. Please try again later.', 
        type: 'error' 
      });
    }
  };

  const switchForm = () => {
    if (isSwapping) return;
    setIsSwapping(true);
    setFormMessage({ text: '', type: '' }); // Clear messages on form switch

    setTimeout(() => {
      setIsSignUp(!isSignUp);
      // Clear form fields when switching
      setLoginEmail('');
      setLoginPassword('');
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPhone('');
      setSignUpPassword('');
      setSignUpConfirmPassword('');
      
      setTimeout(() => {
        setIsSwapping(false);
      }, 700);
    }, 350);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ text: '', type: '' });
    if (!loginEmail || !loginPassword) {
      setFormMessage({ text: 'Both email and password are required.', type: 'error' });
      return;
    }

    // Admin login check
    if (loginEmail === 'admin@gmail.com' && loginPassword === '123') {
      setFormMessage({ text: 'Admin login successful! Redirecting...', type: 'success' });
      // Store a generic admin token or identifier if needed
      localStorage.setItem('token', 'admin_token'); // Example token for admin
      localStorage.setItem('userId', 'admin'); // Example userId for admin
      console.log('Admin logged in');
      setIsLoginLoading(true); // Show loading state for admin redirection as well
      setTimeout(() => {
        navigate('/admin');
        setIsLoginLoading(false); // Reset loading state after navigation
      }, 1500);
      return; // Stop further execution for admin
    }

    setIsLoginLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/login', { email: loginEmail, password: loginPassword });
      if (response.status === 200) {
        setFormMessage({ text: 'Login successful! Redirecting...', type: 'success' });
        // Assuming token and userId might be in response.data
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        if (response.data.userId) {
          localStorage.setItem('userId', response.data.userId);
        }
        console.log('User logged in:', response.data);
        // Navigate to a dashboard or home page
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setFormMessage({ text: 'Email not registered. Please sign up.', type: 'error' });
      } else {
        setFormMessage({ text: error.response?.data?.message || 'Login failed. Please try again.', type: 'error' });
      }
      console.error('Login error:', error);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ text: '', type: '' });

    if (!signUpName || !signUpEmail || !signUpPhone || !signUpPassword || !signUpConfirmPassword) {
      setFormMessage({ text: 'All fields are required for signup.', type: 'error' });
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setFormMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }
    if (signUpPhone.length !== 10 || !/^\d{10}$/.test(signUpPhone)) {
      setFormMessage({ text: 'Phone number must be exactly 10 digits.', type: 'error' });
      return;
    }
    // Advanced phone validation (e.g., no repetitive numbers)
    const invalidPhonePattern = /^(\d)\1{9}$/;
    if (invalidPhonePattern.test(signUpPhone)) {
        setFormMessage({ text: 'Please enter a valid phone number.', type: 'error' });
        return;
    }

    setIsSignUpLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/signup', {
        username: signUpName,
        email: signUpEmail,
        phone: signUpPhone,
        password: signUpPassword,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.userId) {
        localStorage.setItem('userId', response.data.userId);
      }

      setFormMessage({ text: response.data.message || 'Signup successful! Please sign in.', type: 'success' });
      
      // Clear signup form
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPhone('');
      setSignUpPassword('');
      setSignUpConfirmPassword('');

      // Switch to login form after a short delay
      setTimeout(() => {
        setIsSignUp(false); // Switch to Sign In view
        setFormMessage({ text: 'Signup successful! Please sign in.', type: 'success' }); // Re-set message for login screen
      }, 2000);

    } catch (error) {
      setFormMessage({ text: error.response?.data?.message || 'Signup failed. Please try again.', type: 'error' });
      console.error('Signup error:', error);
    } finally {
      setIsSignUpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex relative overflow-hidden">
      {/* Left Panel - Welcome Section */}
      <div className={`hidden md:flex flex-1 bg-gradient-to-br from-[#A57355] to-[#8C5E4A] flex-col justify-center items-center text-white p-8 relative overflow-hidden transition-all duration-700 ease-in-out transform ${
        isSignUp ? 'order-2' : 'order-1'
      } ${isSwapping ? (isSignUp ? 'translate-x-full scale-95' : '-translate-x-full scale-95') : 'translate-x-0 scale-100'}`}>
        <div className={`absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full transition-all duration-700 ${isSwapping ? 'animate-pulse scale-110' : 'scale-100'}`}></div>
        <div className={`absolute bottom-20 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full transition-all duration-700 ${isSwapping ? 'animate-bounce scale-110' : 'scale-100'}`}></div>
        <div className={`absolute top-1/2 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full transition-all duration-700 ${isSwapping ? 'animate-spin scale-110' : 'scale-100'}`}></div>
        
        <div className={`mb-8 transition-all duration-500 ${isSwapping ? 'opacity-80 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <div className="w-4 h-4 bg-[#A57355] rounded"></div>
            </div>
            <span className="text-xl font-semibold">Diprella</span>
          </div>
        </div>
        
        <div className={`text-center max-w-md transition-all duration-500 ${isSwapping ? 'opacity-80 scale-95' : 'opacity-100 scale-100'}`}>
          <h1 className="text-4xl font-bold mb-4 transition-all duration-500">
            {isSignUp ? 'Welcome Back!' : 'Hello, Friend!'}
          </h1>
          <p className="text-lg mb-8 opacity-90 transition-all duration-500">
            {isSignUp 
              ? 'To keep connected with us please login with your personal info'
              : 'Enter your personal details and start journey with us'
            }
          </p>
          <button 
            className={`px-8 py-3 border-2 border-white rounded-full text-white hover:bg-white hover:text-[#A57355] transition-all duration-300 font-semibold transform ${
              isSwapping ? 'scale-110 rotate-12 shadow-lg' : 'scale-100 rotate-0 shadow'
            }`}
            onClick={switchForm}
            disabled={isSwapping || isLoginLoading || isSignUpLoading}
          >
            {isSignUp ? 'SIGN IN' : 'SIGN UP'}
          </button>
        </div>
      </div>
      
      {/* Right Panel - Form Section */}
      <div className={`flex-1 md:flex-1 bg-white flex flex-col justify-center items-center p-6 md:p-8 transition-all duration-700 ease-in-out transform ${
        isSignUp ? 'md:order-1' : 'md:order-2'
      } ${isSwapping ? (isSignUp ? 'md:-translate-x-full md:scale-95' : 'md:translate-x-full md:scale-95') : 'md:translate-x-0 md:scale-100'}`}>
        
        <div className="md:hidden mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-[#A57355] rounded flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded"></div>
            </div>
            <span className="text-xl font-semibold text-[#A57355]">Diprella</span>
          </div>
        </div>

        <div className={`w-full max-w-md transition-all duration-500 ${isSwapping ? 'opacity-90 scale-95' : 'opacity-100 scale-100'}`}>
          <h2 className="text-3xl font-bold text-[#A57355] text-center mb-8 transition-all duration-500">
            {isSignUp ? 'Create Account' : 'Sign in to Diprella'}
          </h2>
          
          {/* Social Login Buttons - Only show in signup */}
          {isSignUp && (
            <div className={`flex justify-center space-x-4 mb-6 transition-all duration-500 ${isSwapping ? 'scale-90 opacity-80' : 'scale-100 opacity-100'}`}>
              <button aria-label="Signup with Facebook" className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition duration-300">
                <Facebook size={20} className="text-blue-600" />
              </button>
              <button 
                onClick={triggerGoogleSignup}
                disabled={isGoogleLoading || isSwapping}
                aria-label="Signup with Google" 
                className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                ) : (
                  <FcGoogle />
                )}
              </button>
              <button aria-label="Signup with LinkedIn" className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition duration-300">
                <span className="text-blue-700 font-bold">in</span>
              </button>
            </div>
          )}
          
          <div className={`text-center text-gray-500 mb-6 transition-all duration-500 ${isSwapping ? 'opacity-70' : 'opacity-100'}`}>
            {isSignUp ? 'or use your email for registration:' : 'use your email for login:'}
          </div>

          {/* Message Display Area */}
          {formMessage.text && (
            <div className={`mb-4 p-3 rounded-lg text-center text-sm ${
              formMessage.type === 'error' ? 'bg-red-100 text-red-700' : 
              formMessage.type === 'success' ? 'bg-green-100 text-green-700' : ''
            }`}>
              {formMessage.text}
            </div>
          )}
          
          {/* Form: changes based on isSignUp state */}
          {!isSignUp ? (
            // Login Form
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div className={`relative transition-all duration-500 ${isSwapping ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57355] focus:border-transparent transition-all duration-300"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isLoginLoading}
                />
              </div>
              
              <div className={`relative transition-all duration-500 ${isSwapping ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57355] focus:border-transparent transition-all duration-300"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoginLoading}
                />
              </div>
              
              <div className="text-right animate-in slide-in-from-bottom-2 duration-500">
                <a href="#" className="text-gray-500 hover:text-[#A57355] text-sm transition-colors duration-300">
                  Forgot your password?
                </a>
              </div>
              
              <button
                type="submit"
                className={`w-full bg-[#A57355] text-white py-3 rounded-lg font-semibold hover:bg-[#8C5E4A] transition-all duration-300 mt-6 transform ${
                  isSwapping ? 'scale-105 shadow-lg' : 'scale-100 shadow'
                } ${isLoginLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoginLoading || isSwapping}
              >
                {isLoginLoading ? 'Signing In...' : 'SIGN IN'}
              </button>
            </form>
          ) : (
            // Signup Form
            <form className="space-y-4" onSubmit={handleSignUpSubmit}>
              <div className={`relative animate-in slide-in-from-top-2 transition-all duration-500 ${isSwapping ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57355] focus:border-transparent transition-all duration-300"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  disabled={isSignUpLoading}
                />
              </div>
              
              <div className={`relative animate-in slide-in-from-top-2 transition-all duration-500 ${isSwapping ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57355] focus:border-transparent transition-all duration-300"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  disabled={isSignUpLoading}
                />
              </div>

              <div className={`relative animate-in slide-in-from-top-2 transition-all duration-500 ${isSwapping ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57355] focus:border-transparent transition-all duration-300"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  maxLength={10}
                  disabled={isSignUpLoading}
                />
              </div>
              
              <div className={`relative animate-in slide-in-from-top-2 transition-all duration-500 ${isSwapping ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57355] focus:border-transparent transition-all duration-300"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  disabled={isSignUpLoading}
                />
              </div>

              <div className={`relative animate-in slide-in-from-bottom-2 transition-all duration-500 ${isSwapping ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57355] focus:border-transparent transition-all duration-300"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  disabled={isSignUpLoading}
                />
              </div>
              
              <button
                type="submit"
                className={`w-full bg-[#A57355] text-white py-3 rounded-lg font-semibold hover:bg-[#8C5E4A] transition-all duration-300 mt-6 transform ${
                  isSwapping ? 'scale-105 shadow-lg' : 'scale-100 shadow'
                } ${isSignUpLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSignUpLoading || isSwapping}
              >
                {isSignUpLoading ? 'Signing Up...' : 'SIGN UP'}
              </button>
            </form>
          )}

          {/* Mobile Toggle Links */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={switchForm}
                    className="text-[#A57355] hover:text-[#8C5E4A] font-semibold transition-colors duration-300 underline disabled:opacity-50"
                    disabled={isSwapping || isLoginLoading || isSignUpLoading}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={switchForm}
                    className="text-[#A57355] hover:text-[#8C5E4A] font-semibold transition-colors duration-300 underline disabled:opacity-50"
                    disabled={isSwapping || isLoginLoading || isSignUpLoading}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}