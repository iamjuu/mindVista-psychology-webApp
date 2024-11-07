import React from "react";
import { Container, ContainerWrap } from "../../Style";
import {Main} from './style'
import {sectionThreeData} from "../datas"
const Index = () => {
  return (
    <Container>
      <ContainerWrap bg={"red"}>
        <Main>       
        <div className="first">
          <div style={{display:'flex', justifyContent:'center',  alignItems:'center', gap:'10px'}}>
          <span>
            <hr  className="dot" />
          </span>
          <span>
          <hr  className="line" />
          </span>
          <span>{sectionThreeData[0].span}</span>
          </div>
          <h1>Magical & Inspirational lessons for people seeking help.</h1>
          </div>
        <div className="second"></div>
        <div className="third"></div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default Index;
