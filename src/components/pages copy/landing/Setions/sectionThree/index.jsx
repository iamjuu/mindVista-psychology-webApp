import React, { useEffect } from 'react';
import AOS from 'aos';
import { Container, ContainerWrap } from "../../Style";
import {
  Main,
  SectionTitle,
  CardWrapper,
  InfoSection,
  LeftSection,
  RightSection,
} from "./style";
import { ThreeDCardDemo } from "../../../../core/cards/3dcards";
import { sectionThreeData } from '../../../../../constant/datas';
import Btn from "../../../../core/button";

const Index = () => {

  return (
    <Container>
      <ContainerWrap>
        <Main>
          <div className="first">
            <SectionTitle >
              <span>
                <hr className="dot" />
              </span>
              <span>
                <hr className="line" />
              </span>
              <span>{sectionThreeData.first[0].span}</span>
            </SectionTitle>
            <h1 className="text-4xl">
              {sectionThreeData.first[0].h1}
            </h1>
          </div>

          <CardWrapper className="second">
            {sectionThreeData.secondCard.map((card, index) => (
              <ThreeDCardDemo
                key={index}
                h1={card.h1}
                img={card.img}
                p={card.p}
                link={card.link}
              />
            ))}
          </CardWrapper>

          <InfoSection className="third">
            <LeftSection>
              <img
                src={sectionThreeData.third[0].icon}
                alt=""
              />
              <div>
                <h1 >
                  {sectionThreeData.third[0].h1}
                </h1>
                <p >
                  {sectionThreeData.third[0].p}
                </p>
              </div>
            </LeftSection>
            <RightSection >
              <Btn
                btnName="Book Now"
                width="150px"
                fontSize="1.2rem"
                color="white"
                bg="#a57355"
              />
              <Btn
                btnName="All programs"
                width="150px"
                fontSize="1.2rem"
                color="#a57355"
                bg="transparent"
                border="1px solid #a57355"
              />
            </RightSection>
          </InfoSection>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default Index;
