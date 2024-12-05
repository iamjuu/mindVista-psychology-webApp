import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

// Bounce animation for the loader dots
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

// Fade-in animation for the brand name
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled container for the loader
const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

// Styled div for the bouncing dots
const LoaderDots = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

// Styled individual dot
const Dot = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #a57355; /* Update the color to match your branding */
  animation: ${bounce} 1.2s infinite ease-in-out;

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

// Styled brand name with fade-in effect
const BrandName = styled.h1`
  font-size: 2rem;
  color: #a57355; /* Brand color */
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  margin-bottom: 20px;
  animation: ${fadeIn} 2s ease-out; 
`;

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Replace 3000 with your desired timeout duration in milliseconds

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, []);

  if (!isLoading) {
    return null; // Render nothing after the loader disappears

  }

  return (
    <LoaderContainer>
      <BrandName>MindVista</BrandName>
      <LoaderDots>
        <Dot />
        <Dot />
        <Dot />
      </LoaderDots>
    </LoaderContainer>
  );
};

export default Loader;
