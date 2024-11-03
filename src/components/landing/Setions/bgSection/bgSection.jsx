
import React from "react";
import Regbtn from '../../../core/button/index';
import { Container, ContainerWrap, BgContainer } from "../../Style";
import {Main} from "./style"
import Data from '../datas'
import BG from '../../../../assets/landing/vistaBg.jpg';

const BgSection = () => {
  

  return (
    <Container>
      <BgContainer bg={BG}> 
        <ContainerWrap>
       <Main>
<h1>{Data.h1} </h1>
       </Main>
        </ContainerWrap>
      </BgContainer>
    </Container>
  );
};

export default BgSection;






