import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy loading components
const Landing = React.lazy(() => import("../pages/landing"));
const About = React.lazy(() => import("../pages/about"));
const Contact = React.lazy(() => import("../pages/contact"));
const ProgramContent = React.lazy(() =>import("../pages/programs/sections/sectionOne"));
const UserProfile = React.lazy(() => import("../pages/profile"));
import RegisterForm from "../components/registerForm";
import Signup from "../pages/signup";
import Login from "../pages/login"
import Loader from "../common/Loader";
import DetailsPage from "../pages/details page"
import { ProgramSectionleft, ProgramSectionRight } from "../constant/datas";

function UserRouter() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
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
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/details" element={<DetailsPage />} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default UserRouter;
