// UserRouter.js
import UserLayout from "../layout/"; // Ensure this is the correct path
import Landing from '../components/landing/';
import About from '../components/pages/about';
import Contact from '../components/pages/contact'; 
import Service from '../components/pages/services';
import { Routes, Route } from 'react-router-dom';

const UserRouter = () => {
  return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service" element={<Service />} />
      </Routes>
  );
}

export default UserRouter;
