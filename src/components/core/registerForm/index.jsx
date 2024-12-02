import React, { useState } from "react";
import { Button, Form, FormContainer, Input } from "./style";
import Swal from 'sweetalert2';
import axios from 'axios'; // Import Axios for making HTTP requests

const Index = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '10:00 AM',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to send form data to the backend
  const submitting = async (data) => {
    try {
      const response = await axios.post('/registration', data);
      return response.data;
    } catch (error) {
      console.error('Error submitting the form:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.time) {
      alert("Please fill in all the fields");
      return;
    }

    try {
      // Send the form data to the backend
      const result = await submitting(formData);

      console.log(result); // Log the response from the backend (optional)

      // Show SweetAlert success message
      Swal.fire({
        title: 'Thank You!',
        text: 'Your slot booking is confirmed.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Reset the form after successful submission (optional)
      setFormData({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '10:00 AM',
      });

    } catch (error) {
      Swal.fire({
        title: 'Oops!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const convertTo12HourFormat = (hour) => {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:00 ${suffix}`;
  };

  const generateTimeSlots = () => {
    let slots = [];
    for (let hour = 10; hour <= 19; hour++) {
      slots.push(convertTo12HourFormat(hour));
    }
    return slots;
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <h2>Book a Slot</h2>

        <Input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          type="tel"
          name="phone"
          placeholder="Your Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <Input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        {/* Time Slot Dropdown */}
        <Input
          as="select"
          name="time"
          value={formData.time}
          onChange={handleChange}
        >
          {generateTimeSlots().map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </Input>

        <Button type="submit">Submit</Button>
      </Form>
    </FormContainer>
  );
};

export default Index;
