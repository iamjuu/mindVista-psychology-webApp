import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Swal from 'sweetalert2'; // SweetAlert2 for feedback
import { useNavigate } from 'react-router-dom';

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
    const Navigate = useNavigate
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match!',
      });
      return;
    }

    // Sending form data to the server
    try {
      const response = await axios.post('http://localhost:3000/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Signup Successful',
        text: response.data.message || 'You have signed up successfully!',
      });

      // Clear the form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      
      Navigate('/login')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: error.response?.data?.message || 'An error occurred during signup.',
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
    </FormContainer>
  );
}

export default SignupForm;
