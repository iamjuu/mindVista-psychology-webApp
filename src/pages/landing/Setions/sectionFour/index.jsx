import React, { useEffect } from 'react';
import AOS from 'aos';
import { Container, ContainerWrap } from '../../Style';
import { SectionFour } from '../../../../constant/datas';
import { Main } from './style';
import Btn from '../../../../components/core/button';

const Index = () => {


  return (
    <Container>
      <ContainerWrap>
        <Main>
          <div className="second" >
            <div className="right" >
              <h5>{SectionFour.h5}</h5>
              <h1>
                {SectionFour.h1}
                <br />
                {SectionFour.h1Break}
              </h1>
              <h3>{SectionFour.h3}</h3>
              <p>{SectionFour.p}</p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                <h4>{SectionFour.h4}</h4>
                <Btn btnName="About" color="white" bg="#a57355" width="130px" />
              </div>
            </div>
            <div className="left" >
              <img src={SectionFour.img} alt="Section Four" />
            </div>
          </div>
          <div className="third"></div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default Index;
