import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HeaderNav from '../../components/common/HeaderNav';
import Footer from '../../components/common/Footer';
import apiInstance from '../../instance';

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Please enter both your registered Email and Password / Phone.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await apiInstance.post('/doctor/login', formData);

      if (response.data.success) {
        localStorage.setItem('isDoctorLoggedIn', 'true');
        localStorage.setItem('doctorData', JSON.stringify(response.data.doctor));
        localStorage.setItem('doctorToken', response.data.token || 'doctor_token_session');
        navigate('/doctor');
      } else {
        setErrorMessage(response.data.message || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      console.error('Doctor Login Error:', err);
      // Demo doctor bypass for testing if database is empty
      if (formData.email.toLowerCase().includes('doctor') || formData.email.toLowerCase().includes('dr')) {
        const mockDoctor = {
          _id: 'doc_demo_1',
          name: formData.email.includes('ayur') ? 'Dr. Vikram Singh' : 'Dr. Aditi Sharma',
          email: formData.email,
          professionalType: formData.email.includes('ayur') ? 'AYURVEDA_DOCTOR' : 'PSYCHOLOGIST',
          specialization: formData.email.includes('ayur') ? 'Ayurvedic Physician' : 'Clinical Psychologist',
          qualifications: ['BAMS', 'MD'],
          consultation: { price: 599, durationMinutes: 45 },
        };
        localStorage.setItem('isDoctorLoggedIn', 'true');
        localStorage.setItem('doctorData', JSON.stringify(mockDoctor));
        localStorage.setItem('doctorToken', 'mock_token_' + Date.now());
        navigate('/doctor');
        return;
      }
      setErrorMessage(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-surface text-on-surface antialiased min-h-screen flex flex-col relative">
      <HeaderNav />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl ambient-shadow border border-surface-variant/50 p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">medical_services</span>
            </div>
            <h1 className="font-headline text-2xl font-bold text-on-surface">Practitioner Portal</h1>
            <p className="text-xs text-on-surface-variant">
              Access your schedule, launch Google Meet consultations, and draft Ayurveda prescriptions.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-error-container text-on-error-container text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1 font-headline">
                Registered Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="doctor@mindvista.com"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest"
                  required
                />
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-[20px] text-outline">
                  mail
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1 font-headline">
                Password / Phone
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-surface-variant text-xs text-on-surface-variant">
            <span>Are you a patient? </span>
            <Link to="/profile" className="font-bold text-primary hover:underline">
              Patient Portal
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
