import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import { Container, ContainerWrap } from "../../Style";
import { Main } from "./style";
import { SectionOne } from '../../Setions/datas';
import Btn from "../../../../core/button";

const Section1 = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      delay: 200,     
      once: true,    
    });
  }, []);

  return (
    <Container>
      <ContainerWrap>
        <Main>
          <div className="first" data-aos="fade-up">
            <div className="left" data-aos="fade-down" data-aos-delay="100">
              <div data-aos='fade-up' data-aos-delay="800">
                <h2  data-aos='fade-up' data-aos-delay="1800">{SectionOne.boxOne[0].h2}</h2>
                <p data-aos='fade-up' data-aos-delay="1900">{SectionOne.boxOne[0].p}</p>
                <h5 data-aos='fade-up' data-aos-delay="2300">{SectionOne.boxOne[0].h5}</h5>
              </div>
              <div data-aos='fade-up' data-aos-delay="600">
                <ul>
                  <li data-aos='fade-up' data-aos-delay="2000">Family Problems</li>
                  <li data-aos='fade-up' data-aos-delay="2100">Breakups</li>
                  <li data-aos='fade-up' data-aos-delay="2200">Business Failure</li>
                  <li data-aos='fade-up' data-aos-delay="2300">Stress Issues</li>
                  <li data-aos='fade-up' data-aos-delay="2400">Online Sessions</li>
                </ul>
              </div>
            </div>
            <div className="right" data-aos="fade-down" data-aos-delay="1000">
              <h1 data-aos='fade-up' data-aos-delay="2000">{SectionOne.boxTwo[0].h1}</h1>
              <p  data-aos='fade-down' data-aos-delay="2000">{SectionOne.boxTwo[0].p}</p>
              <hr data-aos='fade-uo' data-aos-delay="2000" style={{ width: '170px' }} />
              <h5  data-aos='fade-down' data-aos-delay="2000">
                {SectionOne.boxTwo[0].h5} <br /> {SectionOne.boxTwo[0].break}
              </h5>
            </div>
          </div>

          <div className="second"  data-aos-delay="1500">
            <div className="left" data-aos="fade-down" data-aos-delay="400">
              <img src={SectionOne.img} alt="" />
            </div>
            <div className="right" data-aos="fade-up" data-aos-delay="500">
              <h5>{SectionOne.h5}</h5>
              <h1>{SectionOne.h1}<br />{SectionOne.h1Break}</h1>
              <h3>{SectionOne.h3}</h3>
              <p>{SectionOne.p}</p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                <h4>{SectionOne.h4}</h4>
                <Btn btnName={'About '}  color={'white'} bg={'#a57355'} width={'130px'} />
              </div>
            </div>
          </div>

          <div className="third" data-aos="fade-up" data-aos-delay="600"></div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default Section1;
