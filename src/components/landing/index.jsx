import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import Navbar from "../navbar";
import Footer from "../footer";
import Bgsction from "./Setions/bgSection";
import BgsectionOne from "./Setions/sectionOne";
import SectionTwo from "./Setions/sectionTwo/";
import SectionThree from "./Setions/sectionThree";
const Index = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      delay: 200, // Delay before animation starts
      once: true, // Trigger animation only once
    });
  }, []);

  return (
    <div>
      <Navbar />
      <div data-aos="fade-up">
        <Bgsction />
      </div>
      <div data-aos="fade-up" data-aos-delay="300">
        <BgsectionOne />
      </div>
      <div data-aos="fade-in" data-aos-delay="400">
        <SectionTwo />
      </div>
      <div data-aos="fade-down" data-aos-delay="400">
        <SectionThree />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
