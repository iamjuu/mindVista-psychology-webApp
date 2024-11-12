import React, { useEffect } from 'react';
import AOS from 'aos';
import Regbtn from '../../../../core/button';
import { Container, ContainerWrap, BgContainer } from "../../Style";
import { Main } from "./style";
import { Data } from '../../../../../constant/datas';
import {Bgimg} from '../../../../../assets'

const BgSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      delay: 200, 
      once: true, 
    });
  }, []);

  return (
    <Container>
      <BgContainer data-aos="fade-up" data-aos-delay="600" bg={Bgimg}>
        <ContainerWrap>
          <Main data-aos="fade-up">
            <p data-aos="fade-up" data-aos-delay="100">{Data.p}</p>
            <h1 style={{ color: 'white', fontFamily: "monospace" }} data-aos="fade-up" data-aos-delay="200">
              {Data.h1}
            </h1>
            <div className="btn-container" data-aos="fade-up" data-aos-delay="300">
              <Regbtn className='btn1' btnName={'Book Now'} />
              <Regbtn btnName={'About me'} />
            </div>
          </Main>
        </ContainerWrap>
      </BgContainer>
    </Container>
  );
};

export default BgSection;
