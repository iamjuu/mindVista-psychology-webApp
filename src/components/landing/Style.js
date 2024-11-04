import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ContainerWrap = styled.div`
background-color:${(props)=>props.bg||''} ;
  max-width: 1300px;
  display: flex;
  width: 100%;
`;

export const BgContainer = styled.div`
  width: 100%;
  filter: brightness(50%);
  background-image: url(${(props) => props.bg});
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center;
  height: 700px; 
`;
