import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // Import Axios
import { Link, useNavigate } from 'react-router-dom';

const LoginWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  }
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  margin-top: 10px;
  text-align: center;
  color: ${({ error }) => (error ? 'red' : 'green')};
`;

const Login = () => {
  const navigate = useNavigate(); // Correctly call useNavigate hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setMessage('Both fields are required!');
      setIsError(true);
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3000/login', { email, password });
  
      if (response.status === 200) {
        console.log('success');
        
        navigate('/register')
        setMessage('Login successful!');
        setIsError(false);
        console.log('User logged in:', response.data);
        // Redirect to the dashboard or home page
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('fail');
        
        setMessage('Email not registered. Redirecting to signup...');
        setIsError(true);
  
        // Redirect to the signup page after a delay
        setTimeout(() => {
          window.location.href = '/signup'; // Adjust the path as needed
        }, 2000);
      } else {
        setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        setIsError(true);
      }
    }
  };
  

  return (
    <LoginWrapper>
      <Title>Login</Title>
      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <Label>Email:</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputWrapper>
        <InputWrapper>
          <Label>Password:</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputWrapper>
        <Button type="submit">Login</Button>
<Link to="/signup">
      <Label> signup </Label>
</Link>
      </Form>
      {message && <Message error={isError}>{message}</Message>}
    </LoginWrapper>
  );
};
export default Login;


// import React from 'react'
// import styled from 'styled-components'
// const index = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default index

// const Container = styled.div`
// background-color:red;

// `