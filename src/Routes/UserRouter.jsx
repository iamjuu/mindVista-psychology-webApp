import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy loading components
const Landing = React.lazy(() => import("../components/pages/landing"));
const About = React.lazy(() => import("../components/pages/about"));
const Contact = React.lazy(() => import("../components/pages/contact"));
const ProgramContent = React.lazy(() => import("../components/pages/programs/sections/sectionOne"));
const Regitser = React.lazy(() => import('../components/pages/register'));
import Loader from '../common/Loader.jsx';  // Importing the Loader component
import { ProgramSectionleft, ProgramSectionRight } from "../constant/datas";

const UserRouter = () => {
  return (
    <Suspense fallback={<Loader />}> {/* Added the missing closing '>' */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Regitser />} />
        <Route
          path="/programs/:programId"
          element={
            <ProgramContent
              ProgramSectionleft={ProgramSectionleft}
              ProgramSectionRight={ProgramSectionRight}
            />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default UserRouter;
