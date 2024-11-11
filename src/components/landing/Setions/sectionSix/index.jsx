import React from "react";
import { Main } from "./style";
import {Container,ContainerWrap} from '../../Style'

import {SectionSix} from '../datas'
const index = () => {
  return (
    <Container>
    <ContainerWrap>
    <Main>
      <div style={{display:'flex', flexWrap:'wrap', flexDirection:'row',  justifyContent:'space-around', width:'100%' }}>
      {SectionSix.map((section, index) => (
        <div key={index} style={{borderRight:'2px dotted #A57355', padding:'10px' }}>
          <div className="icon" style={{ fontSize: '3rem', marginBottom: '10px' }}>
            {section.icon}
          </div>
          <h1>{section.h1}</h1>
          <h4>{section.h4}</h4>
          <h5>{section.h5}</h5>
          {section.h5Alt && <h5>{section.h5Alt}</h5>}  {/* Optional second h5 */}
        </div>
      ))}
      </div>

      {/* <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around',  backgroundColor:'red'}}>
        <div className="icon" ><FaGlobeAsia/> </div>
        <div>

        <h1>Visiting here?</h1>
        <h4>1870 Alpaca Way Irvine,</h4>
        <h4>New York, 92614. US</h4>
        </div>
      </div>
      <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around',  backgroundColor:'red'}}>
        <div className="icon" > <MdOutlinePhoneInTalk/></div>
        <div>

        <h1>My Timings</h1>
        <h4>Mon – Fri: (9 am to 6 pm)</h4>
        <h4>Sat – Sun: (10 am to 5 pm)</h4>
        <h4>Sunday: (Closed)</h4>
        </div>
      </div> */}
    </Main>
    </ContainerWrap>
    </Container>
  );
};

export default index;
