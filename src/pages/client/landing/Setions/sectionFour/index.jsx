import { Container, ContainerWrap } from '../../Style';
import { SectionFour } from '../../../../../constant/datas';
import { Main } from './style';
import Btn from '../../../../../components/core/button';

const Index = () => {


  return (
    <Container>
      <ContainerWrap>
        <Main>
        <div className="second">
            {/* <div className="left">
              <img src={SectionFour.img} alt="" />
            </div> */}
            <div className="right">
              <h5 >{SectionFour.h5}</h5>
              <h1 style={{fontSize:'1.5rem',fontFamily:'Manrope'}}>
                {SectionFour.h1}

              </h1>
              <p style={{fontWeight:'bold'}}>
                {SectionFour.h3}

              </p>
              <p>{SectionFour.p}</p>
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <h4>{SectionFour.h4}</h4>
                <Btn btnName={'Contact '} color={'white'} bg={'#a57355'} width={'130px'} />
              </div>
            </div>
               <div className="left">
              <img src={SectionFour.img} alt="" />
            </div>
          </div>
          <div className="third"></div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default Index;
