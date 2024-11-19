import React, { useEffect } from 'react';
import AOS from 'aos';
import Regbtn from '../../../../core/button'; // Import the Button component
import { Link } from 'react-router-dom';
import { Container, ContainerWrap, BgContainer } from "../../Style";
import { Main } from "./style";
import { Data } from '../../../../../constant/datas';
import { Bgimg } from '../../../../../assets';

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
      <BgContainer data-aos="fade-up" data-aos-delay="600">
        {/* Lazy-loaded background image */}
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
        />
        <ContainerWrap>
          <Main data-aos="fade-up">
            <p data-aos="fade-up" data-aos-delay="100">{Data.p}</p>
            <h1 style={{ color: 'white', fontFamily: "monospace" }} data-aos="fade-up" data-aos-delay="200">
              {Data.h1}
            </h1>
            <div className="btn-container" data-aos="fade-up" data-aos-delay="300">
              <Link to="/register">
                <Regbtn bg="white" color="brown" hoverBg="pink" btnName="Book Now" />
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
