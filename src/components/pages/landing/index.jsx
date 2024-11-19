import React, { useEffect, lazy, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import Navbar from "../../navbar";
import Loader from "../../../common/Loader"; // Create a simple Loader component

// Lazy load sections
const Bgsction = lazy(() => import("../landing/Setions/bgSection"));
const BgsectionOne = lazy(() => import("../landing/Setions/sectionOne"));
const SectionTwo = lazy(() => import("../landing/Setions/sectionTwo/"));
const SectionThree = lazy(() => import("../landing/Setions/sectionThree"));
const SectionFour = lazy(() => import("../landing/Setions/sectionFour"));
const SectionFive = lazy(() => import("../landing/Setions/sectionFive"));
const SectionSix = lazy(() => import("../landing/Setions/sectionSix"));
const SectionSeven =lazy(()=>import("../landing/Setions/sectionSeven"))
const Footer = lazy(() => import("../../footer"));

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
      <Suspense fallback={<Loader />}>
        <Bgsction />
        <BgsectionOne />
        <SectionTwo />
        <SectionThree />
        <SectionSeven/>
        <SectionFour />
        <SectionFive />
        <SectionSix />
        <Footer />
      </Suspense>
    </>
  );
};

export default Index;
