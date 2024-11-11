import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import Navbar from "../navbar";
import Footer from "../footer";
import Bgsction from "./Setions/bgSection";
import BgsectionOne from "./Setions/sectionOne";
import SectionTwo from "./Setions/sectionTwo/";
import SectionThree from "./Setions/sectionThree";
import SectionFour from "./Setions/sectionFour";
import SectionFive from './Setions/sectionFive'
const Index = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      delay: 200, 
      once: true, 
    });
  }, []);

  return (
    <div>
      <Navbar />
      <div  >
        <Bgsction />
      </div>
      <div >
        <BgsectionOne />
      </div>
      <div >
        <SectionTwo />
      </div>
      <div >
        <SectionThree />
      </div>
      <div >
        <SectionFour />
      </div>
      <div>
        <SectionFive/>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
