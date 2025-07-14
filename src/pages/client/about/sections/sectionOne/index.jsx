    import {Container,ContainerWrap} from'../../styles'
    import {AboutSectionOne} from '../../../../constant/datas'
    import {Main} from './style'
    import Btn from "../../../../components/core/button";
    
    const index = () => {
      return (
        <Container>
        <ContainerWrap>
          <Main>
            <div className="second"  data-aos-delay="1500">
              <div className="right" data-aos="fade-up" data-aos-delay="500">
                <h5>{AboutSectionOne.h5}</h5>
                <h1>{AboutSectionOne.h1}<br />{AboutSectionOne.h1Break}</h1>
                <h3>{AboutSectionOne.h3}</h3>
                <p>{AboutSectionOne.p}</p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                  <h4>{AboutSectionOne.h4}</h4>
                  <Btn btnName={'About '}  color={'white'} bg={'#a57355'} width={'130px'} />
                </div>
              </div>
              <div className="left" data-aos="fade-down" data-aos-delay="400">
                <img src={AboutSectionOne.img} alt="" />
              </div>
            </div>
    
            <div className="third" data-aos="fade-up" data-aos-delay="600"></div>
          </Main>
        </ContainerWrap>
      </Container>
      );
    }
    
    export default index;
