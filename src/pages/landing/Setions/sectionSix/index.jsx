import { Main } from './style';
import { Container, ContainerWrap } from '../../Style';
import { SectionSix } from '../../../../constant/datas';

const Index = () => {



  return (
    <Container>
      <ContainerWrap>
        <Main>
          <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
            {SectionSix.map((section, index) => (
              <div key={index} style={{ display:'flex',flexDirection:'column',gap:'10px' , padding: '10px' }}>
                <div  className="icon" style={{ fontSize: '3rem', marginBottom: '10px' }}>
                  {section.icon}
                </div>
                <h3 >{section.h1}</h3>
                <p >{section.h4}</p>
                <p style={{fontSize:'15px'}}>{section.h5}</p>
                {section.h5Alt && <h5 >{section.h5Alt}</h5>}
              </div>
            ))}
          </div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default Index;
