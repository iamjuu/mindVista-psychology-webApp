import { Container, ContainerWrap } from "../../Style";
import { Main } from "./style";
import {SectionOne} from '../datas'
import Btn from '../../../core/button/'
const Section1 = () => {
  return (
    <Container>
      <ContainerWrap>
        <Main>
          <div className="first">
          <div className="left">
  <div>
    <h2>{SectionOne.boxOne[0].h2}</h2>
    <p>{SectionOne.boxOne[0].p}</p>
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
            
              <h1>{SectionOne.boxTwo[0].h1}</h1>
              <p>{SectionOne.boxTwo[0].p}</p>
              <hr  style={{width:'170px'}}/>
              <h5>
               {SectionOne.boxTwo[0].h5 } <br /> {SectionOne.boxTwo[0].break}
              </h5>
            </div>
          </div>

          <div className="second">
            <div className="left"> <img src={SectionOne.img} alt="" /></div>
            <div className="right"> 
              <h5>{SectionOne.h5}</h5>
              {SectionOne.h1} <br /> {SectionOne.h1Break}
              <h3>{SectionOne.h3}</h3>
              <p>{SectionOne.p}</p>
              <div style={{display:'flex', gap:'20px', justifyContent:'center',  alignItems:'center'}}>
              <h4>{SectionOne.h4}</h4>
              <Btn  btnName={'About '} width={'130px'} />
              </div>
               </div>
          </div>


          <div className="third"></div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default Section1;
