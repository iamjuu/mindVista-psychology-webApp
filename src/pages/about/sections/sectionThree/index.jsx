import React from "react";
import { Container, ContainerWrap,  } from "../../styles";
import { Link } from "react-router-dom";
import { AboutSectionThree } from "../../../../constant/datas";
import { Main } from "./style";

const Index = () => {
  return (
    <div>
      <Container>
        <ContainerWrap>
          <Main>
            {AboutSectionThree.map((item) => (
              <div key={item.id} className="book-div">
                <img src={item.book} alt="" />
                <div className="book-details">
                  <p>{item.name}</p>
                  {/* <p>{item.id}</p> */}
                </div>
              </div>
            ))}
          </Main>
        </ContainerWrap>
      </Container>
    </div>
  );
};

export default Index;
