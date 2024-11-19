import React from "react";
import Navbar from "../../navbar";
import Footer from "../../footer/"
import Bgsection from './sections/bgsection'
import SectionOne from './sections/sectionOne'
import SectionTwo from './sections/sectionTwo'
const index = () => {
  return (
    <>
      <Navbar />
<Bgsection/>
<SectionOne/>
<SectionTwo/>
      <Footer/>
    </>
  );
};

export default index;
