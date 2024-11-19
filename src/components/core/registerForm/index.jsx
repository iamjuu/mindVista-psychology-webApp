import React, { useState } from "react";
import { Button, Form, FormContainer, Input } from "./style";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.time) {
      alert("Please fill in all the fields");
      return;
    }

    console.log(formData);
    alert("Form submitted successfully!");
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
