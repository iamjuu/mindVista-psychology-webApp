// About.js
import React from "react";
import Navbar from "../../navbar";
import Footer from "../../footer/";
import { Container, ContainerWrap } from "../landing/Style";
import { Main } from "./styles";
// import Index from "../../core/registerform";
const index = () => {
  return (
    <>
      <Navbar />
      <Container>
        <ContainerWrap>
          <Main>
            {/* <Index /> */}
          </Main>
        </ContainerWrap>
      </Container>
      <Footer />
    </>
  );
};

export default index;
