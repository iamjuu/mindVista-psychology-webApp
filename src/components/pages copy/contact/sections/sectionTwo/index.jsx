import React from "react";
import { Container, ContainerWrap } from "../../styles";
import { Main } from "./style";
import {Bgimg} from '../../../../../assets'
const index = () => {
  return (
    <Container>
      <ContainerWrap>
        <Main>
          <div className="form">
          </div>
          <div className="content">
            <img src={Bgimg} alt="" />
          </div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default index;
