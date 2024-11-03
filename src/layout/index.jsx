// LandingLayout.js
import React from 'react';
import Navbar from "../components/navbar";
import Footer from '../components/footer';
import { Outlet } from 'react-router-dom';

const LandingLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default LandingLayout;
