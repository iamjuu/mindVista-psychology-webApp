// Programs.jsx
import React from 'react';
import{Main} from './style'
import { Container,BgContainer,ContainerWrap } from '../../styles';
import { Psychologist } from "../../../../constant/datas";


const index = () => {
  const text = "Being a full-time psychologist, I help solving issues to heal mental problems for people.";

  return (
    <>
    <Container>
      <BgContainer bg={Psychologist}>
        <ContainerWrap>
          <Main>
            <h1>
              {text.split(" ").map((word, index) => (
                <span key={index}>{word}</span>
              ))}
            </h1>
          </Main>
        </ContainerWrap>
      </BgContainer>
    </Container>
  </>
  );
};

export default index;
