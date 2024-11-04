import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import Regbtn from '../../../core/button/index';
import { Container, ContainerWrap, BgContainer } from "../../Style";
import { Main } from "./style";
import { Data } from '../datas';
import BG from '../../../../assets/landing/vistaBg.jpg';

const BgSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      delay: 200, // Delay before animation starts
      once: true, // Trigger animation only once
    });
  }, []);

  return (
    <Container>
      <BgContainer bg={BG}>
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
