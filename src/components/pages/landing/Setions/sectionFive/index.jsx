import React, { useEffect } from 'react';
import AOS from 'aos';
import { BgContainer, Container, ContainerWrap } from '../../Style';
import { Bannar } from '../../../../../assets';
import { Main } from './style';
import { SectionFive } from '../../../../../constant/datas';


const Index = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      delay: 200,     
      once: true,    
    });
  }, []);
  return (
    <Container>
      <BgContainer  data-aos="fade-up" data-aos-delay="900" bg={Bannar} position="center" style={{ height: '350px' }}>
        <ContainerWrap>
          <Main data-aos="fade-down" data-aos-delay="600">
            <h1>{SectionFive.h}</h1>
            <h1>{SectionFive.h1}</h1>
            <h1>{SectionFive.h11}</h1>
            <p>{SectionFive.h12}</p>
          </Main>
        </ContainerWrap>
      </BgContainer>
    </Container>
  );
};

export default Index;
