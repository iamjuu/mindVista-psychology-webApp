import React from "react";
import { Container, ContainerWrap } from "../../Style";
import {Main} from './style'
import {ThreeDCardDemo} from '../../../core/cards/3dcards'
import {sectionThreeData} from "../datas"
const Index = () => {
  return (
    <Container>
      <ContainerWrap >
        <Main>       
        <div className="first">
          <div data-aos="fade-down" data-aos-delay='1000' style={{display:'flex', justifyContent:'center',  alignItems:'center', gap:'10px'}}>
          <span>
            <hr  className="dot" />
          </span>
          <span>
          <hr  className="line" />
          </span>
          <span>{sectionThreeData.first[0].span}</span>
          </div>
          <h1  data-aos="fade-up" data-aos-delay='1100'  className="text-4xl">{sectionThreeData.first[0].h1}</h1>
          </div>
        <div className="second">
<ThreeDCardDemo    h1={sectionThreeData.secondCard[0].h1} img={sectionThreeData.secondCard[0].img}  p={sectionThreeData.secondCard[0].p} link={sectionThreeData.secondCard[0].link}/>
<ThreeDCardDemo  h1={sectionThreeData.secondCard[0].h1} img={sectionThreeData.secondCard[0].img}  p={sectionThreeData.secondCard[0].p} link={sectionThreeData.secondCard[0].link}/>
<ThreeDCardDemo  h1={sectionThreeData.secondCard[0].h1} img={sectionThreeData.secondCard[0].img}  p={sectionThreeData.secondCard[0].p} link={sectionThreeData.secondCard[0].link}/>
  
  

        </div>
        <div className="third"></div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default Index;
