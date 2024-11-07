import React from 'react';
import About from "../../components/pages/about";
import Contact from "../../components/pages/contect";
import Service from "../../components/landing/services/";
import Program from "../../components/landing/programs/";
import Landing from "../../components/landing/";
import LandingLayout from "../../components/landing/layout/";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Index = () => {
  return (
    <Router>
      <LandingLayout>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Landing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/service" element={<Service />} />
          <Route path="/programs" element={<Program />} />
        </Routes>
      </LandingLayout>
    </Router>
  );
}

export default Index;
