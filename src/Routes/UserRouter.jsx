import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../components/pages/landing';
import About from '../components/pages/about';
import Contact from '../components/pages/contact'; 
import Programs from '../components/pages/programs'; // Your Programs component

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      {/* Redirect /programs to /programs/dating as default */}
      <Route path="/programs/:program" element={<Programs />} />    
      <Route path="/programs" element={<Navigate to="/programs/dating" replace />} />
    </Routes>
  );
};

export default UserRouter;
