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
// ***************  admin  *************
import DashbaordHome from '../pages/admin/Dashboard/home'
// ***************  docter  *************
import Docter from '../pages/docter'

function UserRouter() {
  return (
    <Router>
      <Suspense fallback={<CustomSpinner />}>
        <Routes>
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
          <Route path="/details/:id" element={<DetailsPage />} />
{/* ************************** */}
<Route path="/Dashboard" element={< DashbaordHome/>} />
{/* **************************** */}
<Route path="/docter" element={<Docter />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default UserRouter;
