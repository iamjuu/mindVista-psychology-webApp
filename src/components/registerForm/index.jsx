import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { 
  Button, 
  FormContainer, 
  FormGroup, 
  Input, 
  Label, 
  Select, 
  LoadingIndicator, 
  FormHeader, 
  FieldGroup, 
  FieldGroupThree,
  RequiredNote,
  TextArea
} from './style';
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
    doctor: '',
    emergencyContact: '',
    preferredLanguage: 'english',
    additionalNotes: ''
  });

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

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
    
    // Validate doctor selection
    if (!formData.doctor) {
      toast.error('Please select a doctor');
      return;
    }
    
    console.log('[RegisterForm] Submitting slot:', formData.slot);
    console.log('[RegisterForm] Submitting time:', formData.time);
    console.log('[RegisterForm] Submitting doctor:', formData.doctor);
    
    try {
      const response = await apiInstance.post('/appointment', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Show success toast
      toast.success('Form submitted successfully!');
      
      console.log('Form submitted successfully:', response.data);
      
      // Navigate to about page after a short delay
      setTimeout(() => {
        Navigate('/about');
      }, 1500);
      
    } catch (error) {
      // Handle error responses
      if (error.response && error.response.status === 403) {
        toast.error(error.response.data.message || 'Please use a registered email!');
      } else {
        toast.error('Something went wrong. Please try again!');
      }
  
      console.error('Error during form submission:', error);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormHeader>
        <h2>Book Your Appointment</h2>
        <p>Fill out the form below to schedule your consultation with our expert psychologists</p>
      </FormHeader>

      <FormGroup>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          required
        />
      </FormGroup>

      <FieldGroup>
        <FormGroup>
          <Label htmlFor="number">Phone Number</Label>
          <Input
            type="tel"
            id="number"
            name="number"
            maxLength={10}
            value={formData.number}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="age">Age</Label>
          <Input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="1"
            max="120"
            required
          />
        </FormGroup>
      </FieldGroup>

      <FieldGroup>
        <FormGroup>
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input
            type="tel"
            id="emergencyContact"
            name="emergencyContact"
            maxLength={10}
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Emergency contact number"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="preferredLanguage">Preferred Language</Label>
          <Select
            id="preferredLanguage"
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleChange}
            required
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="gujarati">Gujarati</option>
            <option value="marathi">Marathi</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>
      </FieldGroup>

      <FormGroup>
        <Label htmlFor="doctor">Select Doctor</Label>
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
        {loadingDoctors && <LoadingIndicator>Loading available doctors...</LoadingIndicator>}
      </FormGroup>

      <FieldGroupThree>
        <FormGroup>
          <Label htmlFor="slot">Preferred Time Slot</Label>
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
          <Label htmlFor="time">Specific Time</Label>
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
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="date">Preferred Date</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </FormGroup>
      </FieldGroupThree>

      <FormGroup>
        <Label htmlFor="location">Location</Label>
        <Input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter your city or location"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
        <TextArea
          id="additionalNotes"
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleChange}
          placeholder="Any specific concerns, preferences, or additional information you'd like to share..."
          rows="3"
        />
      </FormGroup>

      <RequiredNote>
        * Required fields must be completed to book your appointment
      </RequiredNote>

      <Button type="submit">Book Appointment</Button>
      <ToastContainer />
    </FormContainer>
  );
}

export default Form;