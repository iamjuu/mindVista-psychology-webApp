import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import Navbar from "../../navbar";
import Footer from "../../footer";
import Bgsction from "../landing/Setions/bgSection";
import BgsectionOne from "../landing/Setions/sectionOne";
import SectionTwo from "../landing/Setions/sectionTwo/";
import SectionThree from "../landing/Setions/sectionThree";
import SectionFour from "../landing/Setions/sectionFour";
import SectionFive from "../landing/Setions/sectionFive";
import SectionSix from "../landing/Setions/sectionSix";
const Index = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      delay: 200,
      once: true,
    });
  }, []);

  return (
    <>
      <Navbar />
      <Bgsction />
      <BgsectionOne />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <SectionFive />
      <SectionSix />
      <Footer />
    </>
  );
};

export default Index;
