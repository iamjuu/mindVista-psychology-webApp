import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Lazy loading components
const Landing = React.lazy(() => import("./components/pages/landing"));
const About = React.lazy(() => import("./components/pages/about"));
const Contact = React.lazy(() => import("./components/pages/contact"));
const ProgramContent = React.lazy(() => import("./components/pages/programs/sections/sectionOne"));

// Loader component
import Loader from './common/Loader';

// Mock Data for Props
import { ProgramSectionleft, ProgramSectionRight } from "./constant/datas";

function App() {
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
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
