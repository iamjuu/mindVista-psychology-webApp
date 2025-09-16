import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button, FormContainer, FormGroup, Input, Label, Select } from './style';
import apiInstance from '../../instance';

function Form() {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    location: '',
    age: '5',
    slot: 'morning', // Default slot value updated
    time: '09:00-10:00', // Default time slot
    date: '',
    doctor: '' // New field for doctor selection
  });

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [submitting, setSubmitting] = useState(false); // Add loading state for form submission

  // Fetch all doctors when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const response = await apiInstance.get('/all-docters');
        if (response.data.success) {
          setDoctors(response.data.data || []);
          console.log('Doctors fetched:', response.data.data);
        } else {
          console.error('Failed to fetch doctors:', response.data.message);
          toast.error('Failed to load doctors. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Error loading doctors. Please try again.');
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.number || !formData.location || !formData.date || !formData.doctor) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Validate doctor selection
    if (!formData.doctor) {
      toast.error('Please select a doctor');
      return;
    }
    
    // Validate date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    if (selectedDate < today) {
      toast.error('Please select a future date for your appointment');
      return;
    }
    
    // Validate phone number (basic validation)
    if (formData.number.length !== 10 || !/^\d+$/.test(formData.number)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Validate age
    const age = parseInt(formData.age);
    if (age < 1 || age > 120) {
      toast.error('Please enter a valid age between 1 and 120');
      return;
    }
    
    // Set loading state
    setSubmitting(true);
    
 
    try {
      // Get doctor name for payment page
      const selectedDoctor = doctors.find(doc => doc._id === formData.doctor);
      const doctorName = selectedDoctor ? selectedDoctor.name : 'Selected Doctor';
      
      // Prepare registration data for saving
      const registrationData = {
        ...formData,
        doctorName,
        status: 'pending', // Set initial status as pending
        createdAt: new Date().toISOString(), // Add timestamp
        paymentStatus: 'pending' // Add payment status
      };
      
      // Save registration data to backend immediately using the correct appointment endpoint
      console.log('[RegisterForm] Saving registration data:', registrationData);
      
      const saveResponse = await apiInstance.post('/appointment', registrationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (saveResponse.data.success) {
        console.log('[RegisterForm] Registration saved successfully:', saveResponse.data);
        
        // Prepare appointment data for payment page with saved data
        const appointmentData = {
          ...registrationData,
          id: saveResponse.data.data._id || saveResponse.data.data.id, // Use the saved ID
          registrationId: saveResponse.data.data._id || saveResponse.data.data.id // Store registration ID
        };
        
        // Show success toast and navigate to payment page
        toast.success('Registration saved successfully! Redirecting to payment...');
        
        // Navigate to payment page with saved appointment data
        setTimeout(() => {
          Navigate('/payment', { 
            state: { appointmentData } 
          });
        }, 1500);
        
      } else {
        throw new Error(saveResponse.data.message || 'Failed to save registration');
      }
      
    } catch (error) {
      console.error('Error saving registration:', error);
      
      // Handle different types of errors
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;
        
        switch (status) {
          case 400:
            toast.error(message || 'Invalid form data. Please check all fields.');
            break;
          case 403:
            toast.error(message || 'Access denied. Please use a registered email!');
            break;
          case 404:
            toast.error('Service not available. Proceeding to payment...');
            // Still redirect to payment page even if backend is not available
            setTimeout(() => {
              const appointmentData = {
                ...registrationData,
                id: `temp_${Date.now()}`, // Temporary ID
                registrationId: `temp_${Date.now()}` // Temporary registration ID
              };
              Navigate('/payment', { 
                state: { appointmentData } 
              });
            }, 2000);
            break;
          case 409:
            toast.error('An appointment already exists for this time slot. Please choose another time.');
            break;
          case 500:
            toast.error('Server error. Please try again later.');
            break;
          default:
            toast.error(message || 'Failed to save registration. Please try again!');
        }
      } else if (error.request) {
        // Network error - still allow user to proceed to payment
        toast.error('Network error. Proceeding to payment page...');
        setTimeout(() => {
          const appointmentData = {
            ...registrationData,
            id: `temp_${Date.now()}`, // Temporary ID
            registrationId: `temp_${Date.now()}` // Temporary registration ID
          };
          Navigate('/payment', { 
            state: { appointmentData } 
          });
        }, 2000);
      } else {
        // Other error
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      // Reset loading state
      setSubmitting(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="name">Name:</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">Email:</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="number">Phone Number:</Label>
        <Input
          type="tel"
          id="number"
          name="number"
          maxLength={10}
          value={formData.number}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="doctor">Select Doctor:</Label>
        <Select
          id="doctor"
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
          required
          disabled={loadingDoctors}
        >
          <option value="">-- Select a Doctor --</option>
          {loadingDoctors ? (
            <option value="" disabled>Loading doctors...</option>
          ) : (
            doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} - {doctor.specialization} ({doctor.experience} years exp.)
              </option>
            ))
          )}
        </Select>
        {loadingDoctors && (
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Loading available doctors...
          </div>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="slot">Slot:</Label>
        <Select
          id="slot"
          name="slot"
          value={formData.slot}
          onChange={handleChange}
          required
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="time">Time Slot:</Label>
        <Select
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        >
          <optgroup label="Morning (3 slots)">
            <option value="09:00-10:00">9:00 AM - 10:00 AM</option>
            <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
            <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
          </optgroup>
          <optgroup label="Afternoon (3 slots)">
            <option value="12:00-13:00">12:00 PM - 1:00 PM</option>
            <option value="13:00-14:00">1:00 PM - 2:00 PM</option>
            <option value="14:00-15:00">2:00 PM - 3:00 PM</option>
          </optgroup>
          <optgroup label="Evening (2 slots)">
            <option value="15:00-16:00">3:00 PM - 4:00 PM</option>
            <option value="16:00-17:00">4:00 PM - 5:00 PM</option>
          </optgroup>
          <optgroup label="Night (1 slot)">
            <option value="19:00-22:00">7:00 PM - 10:00 PM</option>
            <option value="22:00-23:00">10:00 PM - 11:00 PM</option>
            <option value="23:00-00:00">11:00 PM - 12:00 AM</option>
            <option value="00:00-01:00">12:00 AM - 1:00 AM</option>
            <option value="01:00-02:00">1:00 AM - 2:00 AM</option>
          </optgroup>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="location">Location:</Label>
        <Input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="age">Age:</Label>
        <Input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="date">Date:</Label>
        <Input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
          required
        />
        <small style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
          Please select a future date for your appointment
        </small>
      </FormGroup>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
  
      </div>
      <ToastContainer />
    </FormContainer>
  );
}

export default Form;