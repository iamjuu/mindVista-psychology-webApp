
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
        <p>{Data.p}</p>
<h1 style={{color:'white' ,fontFamily:"monospace"}}>{Data.h1} </h1>
<div className="btn-container">
  <Regbtn className='btn1'  btnName={'Book Now'} />
  <Regbtn btnName={'About me'} />

</div>
       </Main>
        </ContainerWrap>
      </BgContainer>
    </Container>
  );
};

export default BgSection;


