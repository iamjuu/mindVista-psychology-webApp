import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy loading components
const Landing = React.lazy(() => import("../pages/client/landing"));
const About = React.lazy(() => import("../pages/client/about"));
const Contact = React.lazy(() => import("../pages/client/contact"));
const ProgramContent = React.lazy(() =>import("../pages/client/programs/sections/sectionOne"));
const UserProfile = React.lazy(() => import("../pages/client/profile"));
import RegisterForm from "../components/registerForm";
import {CustomSpinner}from "../common/Loader";
import DetailsPage from "../pages/client/details page"
import { ProgramSectionleft, ProgramSectionRight } from "../constant/datas";
import ScannerPage from "../pages/scanner"
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
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/programs/:programId"
            element={
              <ProgramContent
                ProgramSectionleft={ProgramSectionleft}
                ProgramSectionRight={ProgramSectionRight}
              />
            }
          />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/details/:id" element={<DetailsPage />} />
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
