import React from 'react';
import { BgContainer, Container, ContainerWrap } from '../../Style';
import { Bannar } from '../../../../assets';
import { Main } from './style';
import { SectionFive } from '../../../../constant/datas';

const Index = () => {
  return (
    <Container>
      {/* Background image applied with lazy loading */}
      <BgContainer
        bg={Bannar}
        position="center"
        style={{
          height: '350px',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll', // Prevents large image from impacting performance
        }}
      >
        <ContainerWrap>
          <Main>
            <h1>{SectionFive.h}</h1>
            <h1>{SectionFive.h1}</h1>
            <h1>{SectionFive.h11}</h1>
            <p>{SectionFive.h12}</p>
          </Main>
        </ContainerWrap>
      </BgContainer>
    </Container>
  );
};

export default Index;
