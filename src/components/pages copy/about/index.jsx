import React, { useEffect } from "react";
import Navbar from "../../navbar";
import Footer from "../../footer";
import Bgsection from "./sections/sectionBg";
import SectionOne from "./sections/sectionOne";
import SectionTwo from "./sections/sectiontwo";
import SectionThree from "./sections/sectionThree";
import SectionFour from "./sections/sectionFour";

const Index = () => {
  useEffect(() => {
    // Initialize animations here if using a library like AOS
    // AOS.init({
    //   duration: 1200,
    //   easing: "ease-in-out",
    //   once: true,
    // });
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <Bgsection />
      </div>
      <div data-aos="fade-in">
        <SectionOne />
      </div>
      <div data-aos="fade-up">
        <SectionTwo />
      </div>
      <div data-aos="fade-in">
        <SectionThree />
      </div>
      <div data-aos="zoom-in">
        <SectionFour />
      </div>
      <Footer />
    </>
  );
};

export default Index;
