import React, { useEffect, lazy, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import Navbar from "../../components/navbar";
 import Bgsction from "../landing/Setions/bgSection"
 import BgsectionOne from "../landing/Setions/sectionOne"
 import SectionTwo from "../landing/Setions/sectionTwo/"
 import SectionThree from "../landing/Setions/sectionThree"
 import SectionFour from "../landing/Setions/sectionFour"
import SectionFive from "../landing/Setions/sectionFive"
import SectionSix from "../landing/Setions/sectionSix"
import  SectionSeven from "../landing/Setions/sectionSeven"
import Footer from '../../components/footer'
const Index = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200, // Animation duration in milliseconds
      easing: "ease-in-out", // Easing animation
      once: true, // Whether animation should happen only once
    });
  }, []);

  return (
    <>
        <Navbar />
        <div data-aos="fade-in">
          <Bgsction />
        </div>
        <div data-aos="fade-up">
          <BgsectionOne />
        </div>
        <div data-aos="fade-in">
          <SectionTwo />
        </div>
        <div data-aos="fade-up">
          <SectionThree />
        </div>
        <div data-aos="zoom-in">
          <SectionSeven />
        </div>
        <div data-aos="fade-up">
          <SectionFour />
        </div>
        <div data-aos="fade-down">
          <SectionFive />
        </div>
        <div data-aos="zoom-up">
          <SectionSix />
        </div>
        <div data-aos="fade-in">
          <Footer />
        </div>
    </>
  );
};

export default Index;
