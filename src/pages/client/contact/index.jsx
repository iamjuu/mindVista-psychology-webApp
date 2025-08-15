import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
// import Bgsection from "../../../components/sections/bgsection";
import Bgsection from "./sections/bgsection";
import SectionOne from "./sections/sectionOne";
import SectionTwo from "./sections/sectionTwo";

const Index = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      easing: "ease-in-out", // Easing function
      once: true, // Animate only once
    });
  }, []);

  return (
    <>
      <Navbar />
      <div data-aos="fade-in">
        <Bgsection />
      </div>
      <div data-aos="fade-up">
        <SectionOne />
      </div>
      <div data-aos="zoom-in">
        <SectionTwo />
      </div>
      <Footer />
    </>
  );
};

export default Index;
