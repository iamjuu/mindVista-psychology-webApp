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
    time: '',
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

  // Function to fetch doctor's actual available slots
  const fetchDoctorAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) {
      setAvailableTimeSlots([]);
      setBookedSlots([]);
      return;
    }

    setLoadingSlots(true);
    try {
      // First, get the doctor's available slots for the selected date
      const doctorResponse = await apiInstance.get(`/doctors/${doctorId}/available-slots/${date}`);
      
      if (doctorResponse.data.success) {
        const doctorSlots = doctorResponse.data.slots || [];
        
        // Get booked appointments for this doctor and date
        const bookedResponse = await apiInstance.get('/available-slots', { 
          params: { doctorId, date } 
        });
        
        let bookedTimeSlots = [];
        if (bookedResponse.data.success) {
          bookedTimeSlots = bookedResponse.data.data?.bookedTimeSlots || [];
        }
        
        // Convert doctor's slots to the format expected by the form
        const availableSlots = doctorSlots
          .filter(slot => slot.isAvailable)
          .map(slot => ({
            value: `${slot.startTime}-${slot.endTime}`,
            label: `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`
          }))
          .filter(slot => !bookedTimeSlots.includes(slot.value));
        
        setAvailableTimeSlots(availableSlots);
        setBookedSlots(bookedTimeSlots);
      } else {
        // No slots available for this doctor on this date
        setAvailableTimeSlots([]);
        setBookedSlots([]);
      }
    } catch (err) {
      console.error('Error fetching doctor slots:', err);
      toast.error('Error loading doctor available slots');
      setAvailableTimeSlots([]);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    
    // Reset dependent fields when doctor or date changes
    if (name === 'doctor') {
      newFormData.time = '';
      setAvailableTimeSlots([]);
      setBookedSlots([]);
    }
    
    // Reset time when date changes
    if (name === 'date') {
      newFormData.time = '';
    }
    
    setFormData(newFormData);

    // If doctor or date changes, fetch doctor's available slots
    if (name === 'doctor' || name === 'date') {
      // Fetch available slots if we have doctor and date
      if (newFormData.doctor && newFormData.date) {
        fetchDoctorAvailableSlots(newFormData.doctor, newFormData.date);
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
      toast.error('Please fill in all required fields including doctor and time slot');
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

          {/* Doctor Selection */}
          <div className="w-full flex flex-col">
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base"
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
              <p className="text-xs text-gray-600 mt-1">
                Select a doctor to see their available time slots
              </p>
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
              Select an available time
            </label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              disabled={!formData.doctor || !formData.date || loadingSlots}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {!formData.doctor ? (
                <option value="">Select a doctor first</option>
              ) : !formData.date ? (
                <option value="">Select a date for the appointment</option>
              ) : loadingSlots ? (
                <option value="" disabled>Loading available times...</option>
              ) : availableTimeSlots.length === 0 ? (
                <option value="" disabled>No times available for this doctor on the selected date</option>
              ) : (
                <>
                  <option value="">-- Choose a time --</option>
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
                    {availableTimeSlots.length} time{availableTimeSlots.length !== 1 ? 's' : ''} available on {new Date(formData.date).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-red-600">
                    No times available on {new Date(formData.date).toLocaleDateString()}
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
