import React from "react";
import AOS from "aos";
import { Container, ContainerWrap } from "../../pages/landing/Style";
import { Main,  } from "./style";
import { SiWhatsapp } from "react-icons/si";
import { LuFacebook } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { Logo } from "../../assets";

const Index = () => {

  React.useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);



  return (
    <Container bg={"#151110"}>
      <ContainerWrap direction="column">
        <Main>
          {/* First Section */}
          <div className="first">
            <div>
              <img
                data-aos="fade-up"
                data-aos-delay="1000"
                src={Logo}
                alt="MindVista Logo"
              />
              <h1 data-aos="fade-down" data-aos-delay="1000">mindVista</h1>
            </div>
            <div>
              <p style={{fontSize:'.9rem'}}>
              Being a full-time psychologist, I make my patients feel special so
              they can discuss their problems openly. My goal is to help people
              fighting their fears and life issues.
              </p>
        
            </div>
            <div className="icon-div">
              <SiWhatsapp />
              <LuFacebook />
              <FaInstagram />
              <CiLinkedin />
            </div>
          </div>

          {/* Second Section */}
          <div className="second">
            <h1>Contact Details</h1>
            <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
              <p>1870 Alpaca Way Irvine, CA 92614. <br /> United States</p>
              <p>
                Phone: +1 921 124 9220 <br />
                Mail: info@psychare.com
              </p>
              <p>
                Mon - Fri: (9am - 6pm) <br />
                Sat & Sun: CLOSED
              </p>
            </div>
          </div>

          {/* Third Section */}
          <div className="third">
            <h3>My Programs</h3>
            <ul>
              <li>Dating & Relationship</li>
              <li>Grief & Loss Counseling</li>
              <li>Self Esteem Therapy</li>
              <li>Kids & Family</li>
              <li>Life & Future Planning</li>
              <li>Old Age Therapy</li>
            </ul>
          </div>

          {/* Fourth Section */}
          <div className="four">
            <p>Book Appointment</p>
            <div>
              {/* <SiWhatsapp /> */}
              <div>
                <p>LET'S CHAT</p> <p>702-571-5250</p>
              </div>
            </div>
            <div>
              <p>Contact us now for a quote about</p>
              <p>consultation (Available 24/7)</p>
            </div>
          </div>
        </Main>
   
      </ContainerWrap>
    </Container>
  );
};

export default Index;
