import React from "react";
import { Container, ContainerWrap } from "../landing/Style";
import { Main } from "./style";
import { SiWhatsapp } from "react-icons/si";
import { LuFacebook } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { Logo } from '../../assets';

const Index = () => {
  return (
    <Container>
      <ContainerWrap>
        <Main>
          <div className="first">
            <div>
              <img src={Logo} alt="MindVista Logo" />
              <h1>mindVista</h1>
            </div>
            <div>
              Being a full-time psychologist, I make my patients feel special so
              they can discuss their problems openly. My goal is to help people
              fighting their fears and life issues.
            </div>
            <div className="icon-div">
              <SiWhatsapp />
              <LuFacebook />
              <FaInstagram />
              <CiLinkedin />
            </div>
          </div>

          <div className="second">
            <div>
            <h1>Contact Details</h1>
            </div>
            <div>
              <h3>1870 Alpaca Way Irvine, CA 92614. <br /> United States</h3>
              <h3>Phone: +1 921 124 9220 <br />
              Mail: info@psychare.com</h3>
              <h3>Mon - Fri: ( 9am - 6pm ) <br />
              Sat & Sun: CLOSED</h3>
            </div>
          </div>
          <div className="third">
            
          </div>
          <div className="four"></div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default Index;
