import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button, FormContainer, FormGroup, Input, Label, Select } from './style';

function Form() {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    location: '',
    age: '5',
    slot: '10:00 AM', // Default slot value
    date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3000/register', formData, {
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
        <Label htmlFor="slot">Slot:</Label>
        <Select
          id="slot"
          name="slot"
          value={formData.slot}
          onChange={handleChange}
          required
        >
          <option value="10:00 AM">10:00 AM</option>
          <option value="11:00 AM">11:00 AM</option>
          <option value="12:00 PM">12:00 PM</option>
          <option value="01:00 PM">01:00 PM</option>
          <option value="02:00 PM">02:00 PM</option>
          <option value="03:00 PM">03:00 PM</option>
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
          required
        />
      </FormGroup>

      <Button type="submit">Submit</Button>
      <ToastContainer />
    </FormContainer>
  );
}

export default Form;