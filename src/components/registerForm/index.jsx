import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { MainBackgroundImage } from "../../../src/assets";
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
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

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
      } catch (error) {
        console.error('Error loading doctors:', error);
        toast.error('Error loading doctors. Please try again.');
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Function to fetch available time slots
  const fetchAvailableTimeSlots = async (doctorId, date, slot) => {
    if (!doctorId || !date) {
      setAvailableTimeSlots([]);
      setBookedSlots([]);
      return;
    }

    setLoadingSlots(true);
    try {
      const params = { doctorId, date };
      if (slot) {
        params.slot = slot;
      }
      
      const response = await apiInstance.get('/available-slots', { params });
      
      if (response.data.success) {
        const data = response.data.data;
        setAvailableTimeSlots(data.availableSlots || []);
        setBookedSlots(data.bookedTimeSlots || []);
      } else {
        toast.error('Failed to load available time slots');
        setAvailableTimeSlots([]);
        setBookedSlots([]);
      }
    } catch (err) {
      console.error('Error fetching time slots:', err);
      toast.error('Error loading available time slots');
      setAvailableTimeSlots([]);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // If doctor, date, or slot changes, fetch available time slots
    if (name === 'doctor' || name === 'date' || name === 'slot') {
      // Reset time selection when changing doctor, date, or slot
      if (name !== 'time') {
        newFormData.time = '';
      }
      
      // Fetch available slots if we have doctor and date (slot is optional)
      if (newFormData.doctor && newFormData.date) {
        fetchAvailableTimeSlots(newFormData.doctor, newFormData.date, newFormData.slot);
      } else {
        setAvailableTimeSlots([]);
        setBookedSlots([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.number || !formData.location || !formData.date || !formData.doctor || !formData.time) {
      toast.error('Please fill in all required fields including time slot');
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
    
    // Check if selected time slot is still available
    if (!availableTimeSlots.some(slot => slot.value === formData.time)) {
      toast.error('Selected time slot is no longer available. Please choose another slot.');
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
    } catch (error) {
      console.error('Error submitting appointment:', error);
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
        style={{ backgroundImage: `url(${MainBackgroundImage})` }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl w-full p-6 rounded-2xl space-y-6 bg-white/30 backdrop-blur-md shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Book an Appointment
          </h2>

          {/* Name, Email, Phone */}
          <div className="w-full grid !text-gray-800  grid-cols-1 md:grid-cols-3 gap-6 rounded-xl">
            <div className="flex flex-col">
              <label htmlFor="name" className="font-medium mb-1">
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
              <label htmlFor="email" className=" font-medium mb-1">
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
              <label htmlFor="number" className=" font-medium mb-1">
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
              <label htmlFor="doctor" className=" font-medium mb-1">
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
              <label htmlFor="slot" className=" font-medium mb-1">
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

        

          {/* Location, Age, Date */}
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl'>
            <div className="flex flex-col">
              <label htmlFor="location" className="font-medium mb-1">
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
              <label htmlFor="age" className=" font-medium mb-1">
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
              <label htmlFor="date" className="font-medium mb-1">
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
              <p className="text-xs  mt-1">
                Please select a future date for your appointment
              </p>
            </div>
          </div>
  {/* Time Slot */}
  <div className="flex flex-col">
            <label htmlFor="time" className=" font-medium mb-1">
              Time Slot
            </label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              disabled={!formData.doctor || !formData.date || loadingSlots}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {!formData.doctor || !formData.date ? (
                <option value="">Please select doctor and date first</option>
              ) : loadingSlots ? (
                <option value="" disabled>Loading available slots...</option>
              ) : availableTimeSlots.length === 0 ? (
                <option value="" disabled>No available slots for this date</option>
              ) : (
                <>
                  <option value="">-- Select a Time Slot --</option>
                  {availableTimeSlots.map((timeSlot) => (
                    <option key={timeSlot.value} value={timeSlot.value}>
                      {timeSlot.label}
                    </option>
                  ))}
                </>
              )}
            </select>
            {formData.doctor && formData.date && !loadingSlots && (
              <div className="mt-2 text-sm text-gray-600">
                {availableTimeSlots.length > 0 ? (
                  <span className="text-green-600">
                    {availableTimeSlots.length} slot{availableTimeSlots.length !== 1 ? 's' : ''} available
                    {formData.slot && ` for ${formData.slot}`}
                  </span>
                ) : (
                  <span className="text-red-600">
                    No slots available for {formData.slot || 'any slot'} on {new Date(formData.date).toLocaleDateString()}
                  </span>
                )}
                {bookedSlots.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500">
                    Booked slots: {bookedSlots.join(', ')}
                  </div>
                )}
              </div>
            )}
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
