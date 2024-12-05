import React, { useEffect, lazy, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import Navbar from "../../navbar";
import Loader from "../../../common/Loader"; // Create a simple Loader component

const Bgsction = lazy(() => import("../landing/Setions/bgSection"));
const BgsectionOne = lazy(() => import("../landing/Setions/sectionOne"));
const SectionTwo = lazy(() => import("../landing/Setions/sectionTwo/"));
const SectionThree = lazy(() => import("../landing/Setions/sectionThree"));
const SectionFour = lazy(() => import("../landing/Setions/sectionFour"));
const SectionFive = lazy(() => import("../landing/Setions/sectionFive"));
const SectionSix = lazy(() => import("../landing/Setions/sectionSix"));
const SectionSeven = lazy(() => import("../landing/Setions/sectionSeven"));
const Footer = lazy(() => import("../../footer"));

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
      <Suspense fallback={<Loader />}>
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
      </Suspense>
    </>
  );
};

export default Index;
