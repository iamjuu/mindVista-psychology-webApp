import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../components/pages/landing";
import About from "../components/pages/about";
import Contact from "../components/pages/contact";
import Programs from "../components/pages/programs"; // Your Programs component
import { ProgramSectionleft, ProgramSectionRight } from "../constant/datas";
import ProgramContent from "../components/pages/programs/sections/sectionOne";

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      {/* <Route path="/programs" element={<Programs />} />     */}
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
  );
};

export default UserRouter;
