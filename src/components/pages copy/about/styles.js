import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  background-color:${(props)=>props.bg||''} ;
  justify-content: center;
  align-items: center;
`;

export const ContainerWrap = styled.div`
background-color:${(props)=>props.bg||''} ;
/* flex-direction: column; */
  max-width: 1300px;
  display: flex;
  justify-content: center;
  align-items: center;
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
  background-position:${(props)=>props.position||'center'};
  height: 700px; 
`;
export const FreeContainer =styled.div`
width:  ${(props)=>props.width||''};
background-color: ${(props)=> props.bg||''};
height: ${(props)=>props.height||''};
display: flex;
justify-content: center;
flex-direction: column;
align-items: center;
`
export const FreeBgContainer= styled.div`
width:  ${(props)=>props.width||''};
background-image: url(${(props) => props.bg});
background-position:${(props)=>props.position||'center'};
height: ${(props)=>props.height||''};

background-size: cover;


`