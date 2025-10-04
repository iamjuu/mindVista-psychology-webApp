import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Bannar } from "../../../src/assets";
import apiInstance from '../../instance';

function Form() {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    location: '',
    age: '5',
    slot: 'morning',
    time: '09:00-10:00',
    date: '',
    doctor: ''
  });

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const response = await apiInstance.get('/all-docters');
        if (response.data.success) {
          setDoctors(response.data.data || []);
        } else {
          toast.error('Failed to load doctors. Please try again.');
        }
      } catch (err) {
        toast.error('Error loading doctors. Please try again.');
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.number || !formData.location || !formData.date || !formData.doctor) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.number.length !== 10 || !/^\d+$/.test(formData.number)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    const age = parseInt(formData.age);
    if (age < 1 || age > 120) {
      toast.error('Please enter a valid age between 1 and 120');
      return;
    }
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error('Please select a future date');
      return;
    }

    setSubmitting(true);

    try {
      const selectedDoctor = doctors.find(doc => doc._id === formData.doctor);
      const doctorName = selectedDoctor ? selectedDoctor.name : 'Selected Doctor';

      const registrationData = {
        ...formData,
        doctorName,
        status: 'pending',
        createdAt: new Date().toISOString(),
        paymentStatus: 'pending'
      };

      // Debug logging
      console.log('=== REGISTRATION FORM DEBUG ===');
      console.log('Form data:', formData);
      console.log('Selected doctor:', selectedDoctor);
      console.log('Registration data:', registrationData);
      console.log('Doctor field check:', {
        doctor: formData.doctor,
        doctorExists: !!formData.doctor,
        doctorType: typeof formData.doctor
      });

      const saveResponse = await apiInstance.post('/appointment', registrationData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (saveResponse.data.success) {
        const appointmentData = {
          ...registrationData,
          id: saveResponse.data.data._id || saveResponse.data.data.id,
          registrationId: saveResponse.data.data._id || saveResponse.data.data.id
        };
        toast.success('Registration saved successfully! Redirecting...');
        setTimeout(() => {
          Navigate('/payment', { state: { appointmentData } });
        }, 1500);
      } else {
        throw new Error(saveResponse.data.message || 'Failed to save registration');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: `url(${Bannar})` }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl w-full p-6 rounded-2xl space-y-6 bg-white/30 backdrop-blur-md shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-100 text-center">
            Book an Appointment
          </h2>

          {/* Name, Email, Phone */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-gray-400 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-400 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="number" className="text-gray-400 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="number"
                name="number"
                maxLength={10}
                value={formData.number}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Doctor & Slot */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl">
            <div className="flex flex-col">
              <label htmlFor="doctor" className="text-gray-400 font-medium mb-1">
                Select Doctor
              </label>
              <select
                id="doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
                disabled={loadingDoctors}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Select a Doctor --</option>
                {loadingDoctors ? (
                  <option value="" disabled>Loading doctors...</option>
                ) : (
                  doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.specialization} ({doctor.experience} yrs)
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="slot" className="text-gray-400 font-medium mb-1">
                Slot
              </label>
              <select
                id="slot"
                name="slot"
                value={formData.slot}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>
          </div>

          {/* Time Slot */}
          <div className="flex flex-col">
            <label htmlFor="time" className="text-gray-400 font-medium mb-1">
              Time Slot
            </label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <optgroup label="Morning">
                <option value="09:00-10:00">9:00 AM - 10:00 AM</option>
                <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
                <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
              </optgroup>
              <optgroup label="Afternoon">
                <option value="12:00-13:00">12:00 PM - 1:00 PM</option>
                <option value="13:00-14:00">1:00 PM - 2:00 PM</option>
                <option value="14:00-15:00">2:00 PM - 3:00 PM</option>
              </optgroup>
              <optgroup label="Evening">
                <option value="15:00-16:00">3:00 PM - 4:00 PM</option>
                <option value="16:00-17:00">4:00 PM - 5:00 PM</option>
              </optgroup>
              <optgroup label="Night">
                <option value="19:00-22:00">7:00 PM - 10:00 PM</option>
                <option value="22:00-23:00">10:00 PM - 11:00 PM</option>
                <option value="23:00-00:00">11:00 PM - 12:00 AM</option>
                <option value="00:00-01:00">12:00 AM - 1:00 AM</option>
                <option value="01:00-02:00">1:00 AM - 2:00 AM</option>
              </optgroup>
            </select>
          </div>

          {/* Location, Age, Date */}
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl'>
            <div className="flex flex-col">
              <label htmlFor="location" className="text-gray-400 font-medium mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="age" className="text-gray-400 font-medium mb-1">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="date" className="text-gray-400 font-medium mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-white mt-1">
                Please select a future date for your appointment
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          <ToastContainer />
        </form>
      </div>
    </div>
  );
}

export default Form;
