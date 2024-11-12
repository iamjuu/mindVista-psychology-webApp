// About.js
import React from "react";
import styled from "styled-components";
import Navbar from "../../navbar";
import Footer from "../../footer";
import { Container, ContainerWrap ,BgContainer} from "../../pages/landing/Style";
import BG from "../../../assets/landing/about-image-1 (1).jpg";
const About = () => {
  return (
    <>
      <Navbar />
      <Container>
        <BgContainer bg={BG}>
          <ContainerWrap>
            <h1>
        fgf
            </h1>
          </ContainerWrap>
        </BgContainer>
      </Container>

      <Footer />
    </>
  );
};

export default About;

