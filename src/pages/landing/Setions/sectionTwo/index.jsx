// SectionTwo.js
import { Container, ContainerWrap, FreeContainer } from "../../Style";
import { Main } from "./style";
import { sectionTwoData } from '../../../../constant/datas'
import Btn from '../../../../components/core/button';

const SectionTwo = () => {


  return (
    <Container bg={'#1d1614'}>
      <ContainerWrap  >
        <Main>
          <div className="left" >
            <h3 >{sectionTwoData.left[0].h3}</h3>
            <h1 >{sectionTwoData.left[0].h1}</h1>
            <p >{sectionTwoData.left[0].p}</p>
            <Btn     color={'white'} bg={'#a57355'}  fontsize={'.9rem'} btnName={'FIND PROGRAMS'} />
          </div>
          <div className="right" >
          {sectionTwoData.right.map((data) => (
  <FreeContainer
    width={'290px'}
    key={data.id}
  >
    <div className="right-sub" style={{ transition: 'transform 0.3s ease' }}>
      <h3 data-aos="fade-down" >
        {data.title}
      </h3>
      <hr
        style={{ width: '150px', opacity: '50%' }}
      />
      <p >
        {data.p}
      </p>
    </div>
  </FreeContainer>
))}

          </div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default SectionTwo;
