import React from 'react';
import About from "../../components/landing/about/"
import Contact from "../../components/landing/contect/"
import Service from "../../components/landing/services/"
import Program from "../../components/landing/programs/"
import Landing from "../../components/landing/"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
const index = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/service" element={<Service />} />
      <Route path="/programs" element={<Program />} />
    </Routes>
  </Router>
  );
}

export default index;
