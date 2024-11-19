import React, { useEffect } from 'react';
import AOS from 'aos';
import { Container, ContainerWrap } from '../../styles.js';
import {ContectSectionFour } from '../../../../../constant/datas.js';
import { Main } from './style.js';
import Btn from '../../../../core/button';

const Index = () => {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 200,
    });
    AOS.refresh();
  }, []);

  return (
    <Container>
      <ContainerWrap>
        <Main>
          <div className="second" data-aos="fade-up" data-aos-delay="1500">
            <div className="right" data-aos="fade-up" data-aos-delay="500">
              <h5>{ContectSectionFour.h5}</h5>
              <h1>
                {ContectSectionFour.h1}
                <br />
                {ContectSectionFour.h1Break}
              </h1>
              <h3>{ContectSectionFour.h3}</h3>
              <p>{ContectSectionFour.p}</p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                <h4>{ContectSectionFour.h4}</h4>
                <Btn btnName="About" color="white" bg="#a57355" width="130px" />
              </div>
            </div>
            <div className="left" data-aos="fade-down" data-aos-delay="400">
              <img src={ContectSectionFour.img} alt="Section Four" />
            </div>
          </div>
          <div className="third" data-aos="fade-up" data-aos-delay="600"></div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default Index;
