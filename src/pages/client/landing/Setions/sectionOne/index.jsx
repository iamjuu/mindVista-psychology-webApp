import { Container, ContainerWrap } from "../../Style";
import { Main } from "./style";
import { SectionOne } from '../../../../../constant/datas';
import Btn from "../../../../../components/core/button";

const Section1 = () => {
  return (
    <Container>
      <ContainerWrap>
        <Main>
          <div className="first">
            <div className="left">
              <div >
                <h2 style={{fontSize:'1.7rem',fontFamily:'Manrope'}}> {SectionOne.boxOne[0].h2}</h2>
                <p  >{SectionOne.boxOne[0].p}</p>
                <h5>{SectionOne.boxOne[0].h5}</h5>
              </div>
              <div>
                <ul>
                  <li>Family Problems</li>
                  <li>Breakups</li>
                  <li>Business Failure</li>
                  <li>Stress Issues</li>
                  <li>Online Sessions</li>
                </ul>
              </div>
            </div>
            <div className="right">
              <p style={{fontSize:'1.2rem'}}> {SectionOne.boxTwo[0].h1}</p>
              <p>{SectionOne.boxTwo[0].p}</p>
              <hr style={{ width: '170px' }} />
              <div style={{width:'100%', fontSize:'1.3rem',display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                <p style={{color:'#2C1708'}}>{SectionOne.boxTwo[0].h5}</p>
                <p style={{fontSize:'1rem'}}>{SectionOne.boxTwo[0].break}</p>
              </div>
           
            </div>
          </div>

          <div className="second">
            <div className="left">
              <img src={SectionOne.img} alt="" />
            </div>
            <div className="right">
              <h5 >{SectionOne.h5}</h5>
              <h1 style={{fontSize:'1.5rem',fontFamily:'Manrope'}}>
                {SectionOne.h1}

              </h1>
              <p style={{fontWeight:'bold'}}>
                {SectionOne.h3}

              </p>
              <p>{SectionOne.p}</p>
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <h4>{SectionOne.h4}</h4>
                <Btn btnName={'About '} color={'white'} bg={'#a57355'} width={'130px'} />
              </div>
            </div>
          </div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default Section1;
