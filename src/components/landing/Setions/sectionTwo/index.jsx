// SectionTwo.js
import React, { useEffect } from "react";
import { Container, ContainerWrap, FreeContainer } from "../../Style";
import { Main } from "./style";
import { sectionTwoData } from "../datas";
import Btn from '../../../core/button';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SectionTwo = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      delay: 200,     
      once: true,    
    });
  }, []);

  return (
    <Container bg={'#1d1614'}>
      <ContainerWrap  >
        <Main>
          <div className="left" >
            <h3 data-aos='fade-up' data-aos-delay="1000">{sectionTwoData.left[0].h3}</h3>
            <h1 data-aos='fade-right' data-aos-delay="1100">{sectionTwoData.left[0].h1}</h1>
            <p data-aos='fade-left' data-aos-delay="1200">{sectionTwoData.left[0].p}</p>
            <Btn     color={'white'} bg={'#a57355'}  fontsize={'.9rem'} btnName={'FIND PROGRAMS'} />
          </div>
          <div className="right" data-aos="fade-left">
          {sectionTwoData.right.map((data, index) => (
  <FreeContainer
    width={'290px'}
    key={data.id}
    data-aos="zoom-in"
    data-aos-delay={index * 200}  // Stagger the delay based on index
  >
    <div className="right-sub" style={{ transition: 'transform 0.3s ease' }}>
      <h3 data-aos="fade-down" data-aos-delay={1500 + index * 200}>
        {data.title}
      </h3>
      <hr
        data-aos="fade-down"
        data-aos-delay={1600 + index * 200}
        style={{ width: '150px', opacity: '50%' }}
      />
      <p data-aos="fade-down" data-aos-delay={1200 + index * 200}>
        {data.p}
      </p>
    </div>
  </FreeContainer>
))}

          </div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default SectionTwo;
