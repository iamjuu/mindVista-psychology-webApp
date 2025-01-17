import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom'

const FormContainer = styled.form`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    border-color: #4CAF50;
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  &:hover {
    background-color: #45a049;
  }
`;

function SignupForm() {
  const navigate = useNavigate(); // Fixed here
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone:'',
    password: '',
    confirmPassword: '',

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Ensure phone input contains only valid numbers
    if (name === "phone" && value.length > 0) {
      const invalidPhonePattern = /^(\d)\1{9}$/; // Matches repeated digits like "1111111111"
      if (invalidPhonePattern.test(value)) {
        Swal.fire({
          icon: "error",
          title: "മാറിയാദിക് ഫോൺ നമ്പർ അടിക്കു",
          text: "നായിന്റെ മോനെ!",
        });
        return; // Prevent state update for invalid input
      }
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Passwords do not match!",
      });
      return;
    }
  
    // Validate phone number length (assuming 10 digits required)
    if (!formData.phone || formData.phone.length !== 10) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Phone number must be exactly 10 digits!",
      });
      return;
    }
  
    // Sending form data to the server
    try {
      const response = await axios.post("http://localhost:3000/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
      }
  
      Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: response.data.message || "You have signed up successfully!",
      });
  
      // Clear the form
      setFormData({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
  
      // Navigate to login page or home
      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.response?.data?.message || "An error occurred during signup.",
      });
    }
  };
  
  
  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>Signup</h2>

      <FormGroup>
        <Label htmlFor="username">Username:</Label>
        <Input
          type="text"
          id="username"
          name="username"
          value={formData.username}
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
        <Label htmlFor="phone">Phone:</Label>
        <Input
          type="number"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          maxLength={10}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="password">Password:</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="confirmPassword">Confirm Password:</Label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <Button type="submit">Signup</Button>
      <Link to="/login">
      <Label> login </Label>
</Link>
    </FormContainer>
  );
}

export default SignupForm;
