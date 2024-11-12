import React from "react";
import { Main } from "./style";
import {Container,ContainerWrap} from '../../Style'

import {SectionSix} from '../datas'
const index = () => {
  return (
    <Container>
    <ContainerWrap>
    <Main>
      <div style={{display:'flex', flexWrap:'wrap', flexDirection:'row',  justifyContent:'space-around', width:'100%' }}>
      {SectionSix.map((section, index) => (
        <div key={index} style={{borderRight:'2px dotted #A57355', padding:'10px' }}>
          <div  data-aos='fade-up' data-aos-delay="1000" className="icon" style={{ fontSize: '3rem', marginBottom: '10px' }}>
            {section.icon}
          </div>
          <h1 data-aos='fade-up' data-aos-delay="1100">{section.h1}</h1>
          <h4 data-aos='fade-up' data-aos-delay="1200">{section.h4}</h4>
          <h5 data-aos='fade-up' data-aos-delay="1300">{section.h5}</h5>
          {section.h5Alt && <h5 data-aos='fade-up' data-aos-delay="1300">{section.h5Alt}</h5>} 
        </div>
      ))}
      </div>

    </Main>
    </ContainerWrap>
    </Container>
  );
};

export default index;
