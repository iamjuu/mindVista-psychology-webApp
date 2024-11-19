// About.js
import React from "react";
import Navbar from "../../navbar";
import Footer from "../../footer/";
import Form from "../../core/registerform";
import { Container, ContainerWrap } from "../landing/Style";
import { Main } from "./styles";
const index = () => {
  return (
    <>
      <Navbar />
      <Container>
        <ContainerWrap>
          <Main>
            <Form />
          </Main>
        </ContainerWrap>
      </Container>
      <Footer />
    </>
  );
};

export default index;
