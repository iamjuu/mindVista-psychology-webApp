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

          {/* Second Section */}
          <div className="second">
            <h1>Contact Details</h1>
            <div>
              <h3>1870 Alpaca Way Irvine, CA 92614. <br /> United States</h3>
              <h3>
                Phone: +1 921 124 9220 <br />
                Mail: info@psychare.com
              </h3>
              <h3>
                Mon - Fri: (9am - 6pm) <br />
                Sat & Sun: CLOSED
              </h3>
            </div>
          </div>

          {/* Third Section */}
          <div className="third">
            <h1>My Programs</h1>
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
            <h1>Book Appointment</h1>
            <div>
              {/* <SiWhatsapp /> */}
              <div>
                <p>LET'S CHAT</p> <h2>702-571-5250</h2>
              </div>
            </div>
            <div>
              <h3>Contact us now for a quote about</h3>
              <h3>consultation (Available 24/7)</h3>
            </div>
          </div>
        </Main>
   
      </ContainerWrap>
    </Container>
  );
};

export default Index;
