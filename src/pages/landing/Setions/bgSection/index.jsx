import React from 'react';
import { Link } from 'react-router-dom';
import { Container, ContainerWrap, BgContainer } from "../../Style";
import { Main } from "./style";
import { Data } from '../../../../constant/datas';
import { Bgimg } from '../../../../assets';
import Regbtn from '../../../../components/core/button'; 
import {useNavigate} from 'react-router-dom'

const BgSection = () => {
  const Navigate = useNavigate

   const Register = ()=>{
    Navigate('/register')
    console.log('dsgsd');
    
   }
  return (
    <Container>
      <BgContainer>
        <img 
          src={Bgimg} 
          alt="Background" 
          loading="lazy" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
          width="1920" 
          height="1080" 
        />
        <ContainerWrap>
          <Main>
            <p>{Data.p}</p>
            <h1 style={{ color: 'white', fontFamily: "monospace" }}>
              {Data.h1}
            </h1>
            <div className="btn-container">
              <Link to="/register">
                <Regbtn bg="white" color="brown" hoverBg="pink"  onClick={Register} btnName="Book Now" />
              </Link>
              <Regbtn bg="brown" color="white" hoverBg="pink" btnName="About me" />
            </div>
          </Main>
        </ContainerWrap>
      </BgContainer>
    </Container>
  );
};

export default BgSection;
