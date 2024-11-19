import { Routes, Route, Navigate } from "react-router-dom";
import DashBoard from '../components/Dashboard/pages/home'

const AdminRouter = () => {

  return (

          <Routes>
            <Route path="/dashboard" element={<DashBoard />} />

          </Routes>
     

  );
}

export default AdminRouter;
