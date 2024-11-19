import React, { useEffect } from "react";
import AOS from "aos";
import { Container, ContainerWrap } from "../pages/landing/Style";
import { Main, FloatingNav } from "./style";
import { SiWhatsapp } from "react-icons/si";
import { LuFacebook } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { Logo } from "../../assets";
import {FloatingDockDemo} from '../../components/navbar/floatingNav'
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const DashBoard =()=>{
    navigate('/dashboard')
  }
  useEffect(() => {
    AOS.init({
      duration: 1000,
      delay: 200,
      once: true,
    });
  }, []);
  return (
    <Container bg={"#151110"}>
      <ContainerWrap direction="column">
        <Main>
          <div className="first">
            <div>
              <img 
                data-aos="fade-up"
                data-aos-delay="1000"
                src={Logo}
                alt="MindVista Logo"
              />
              <h1 data-aos="fade-down" data-aos-delay="1000">
                mindVista
              </h1>
            </div>
            <div>
              Being a full-time psychologist, I make my patients feel special so
              they can discuss their problems openly. My goal is to help people
              fighting their fears and life issues.
            </div>
            <div className="icon-div">
              <SiWhatsapp data-aos="fade-up" data-aos-delay="1000" />
              <LuFacebook data-aos="fade-down" data-aos-delay="1200" />
              <FaInstagram data-aos="fade-up" data-aos-delay="1300" />
              <CiLinkedin data-aos="fade-down" data-aos-delay="1400" />
            </div>
          </div>

          <div className="second">
            <div>
              <h1 data-aos="fade-up" data-aos-delay="1000">
                Contact Details
              </h1>
            </div>
            <div>
              <h3 data-aos="fade-down" data-aos-delay="1100">
                1870 Alpaca Way Irvine, CA 92614. <br /> United States
              </h3>
              <h3 data-aos="fade-down" data-aos-delay="1300">
                Phone: +1 921 124 9220 <br />
                Mail: info@psychare.com
              </h3>
              <h3 data-aos="fade-down" data-aos-delay="1400">
                Mon - Fri: ( 9am - 6pm ) <br />
                Sat & Sun: CLOSED
              </h3>
            </div>
          </div>
          <div className="third">
            <div>
              <h1 data-aos="fade-down" data-aos-delay="1000">
                My Programs
              </h1>
            </div>
            <div>
              <ul data-aos="fade-down" data-aos-delay="1200">
                <li>Dating & Relationship</li>
                <li>Grief & Loss Counseling</li>
                <li>Self Esteem Therapy</li>
                <li>Kids & Family</li>
                <li>Life & Future Planning</li>
                <li>Old Age Therapy</li>
              </ul>
            </div>
          </div>
          <div className="four">
            <div>
              <h1 data-aos="fade-down" data-aos-delay="1000">
                Book Appointment
              </h1>
            </div>
            <div data-aos="fade-down" data-aos-delay="1200">
              <div>
                <h3 data-aos="fade-down" data-aos-delay="1100">
                  <SiWhatsapp />
                </h3>
              </div>
              <div>
                <p>LET'S CHAT</p> <h2>702-571-5250</h2>
              </div>
            </div>
            <div>
              <h3 data-aos="fade-up" data-aos-delay="1400">
                Contact us now for a quote about
              </h3>
              <h3 data-aos="fade-up" data-aos-delay="1500">
                consultation ( Available 24/7 )
              </h3>
            </div>
          </div>
        </Main>
        <FloatingNav >
          <ContainerWrap>

      {/* <FloatingDockDemo/> */}
          </ContainerWrap>
        </FloatingNav>
      </ContainerWrap>
    </Container>
  );
};

export default Index;
