import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy loading components

const UserProfile = React.lazy(() => import("../pages/client/profile"));
import RegisterForm from "../components/registerForm";
import {CustomSpinner}from "../common/Loader";

import { ProgramSectionleft, ProgramSectionRight } from "../constant/datas";

import PaymentPage from "../pages/payment"
// ***************  admin  *************
import DashbaordHome from '../pages/admin/Dashboard/home'
import TodayAppointments from '../pages/admin/Dashboard/TodayAppointments'
// ***************  docter  *************
import Docter from '../pages/docter'
import DoctorLogin from '../pages/docter/login'
// ***************  video call  *************
import VideoCallRoom from '../pages/videocall/VideoCallRoom'
// ***************  theme context  *************
import HomePage from "../pages/client/home"

import { ThemeProvider } from '../contexts/ThemeContext'

function UserRouter() {
  return (
    <Router>
      <Suspense fallback={<CustomSpinner />}>
        <Routes>
        <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/payment" element={<PaymentPage />} />
{/* ************************** */}
<Route path="/admin/dashboard" element={
  <ThemeProvider>
    <DashbaordHome/>
  </ThemeProvider>
} />
<Route path="/admin/today-appointments" element={
  <ThemeProvider>
    <TodayAppointments />
  </ThemeProvider>
} />
{/* **************************** */}
<Route path="/doctor" element={<Docter />} />
<Route path="/doctor/login" element={<DoctorLogin />} />
{/* **************************** */}
<Route path="/video-call/:videoCallId" element={<VideoCallRoom />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default UserRouter;
