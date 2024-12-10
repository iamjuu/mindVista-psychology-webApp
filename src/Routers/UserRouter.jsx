import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy loading components
const Landing = React.lazy(() => import("../pages/landing"));
const About = React.lazy(() => import("../pages/about"));
const Contact = React.lazy(() => import("../pages/contact"));
const ProgramContent = React.lazy(() => import("../pages/programs/sections/sectionOne"));
const UserProfile = React.lazy(()=> import('../pages/profile'))

// Loader component
import Loader from '../common/Loader';

// Mock Data for Props
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

        </Routes>
      </Suspense>
    </Router>
  );
}

export default UserRouter;
