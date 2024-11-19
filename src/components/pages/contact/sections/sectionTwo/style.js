import styled from "styled-components";

export const Main = styled.div`
 width: 100%;
 max-width: 1300px;
  background-color: #E3E3E3;
  border-radius: 10px;
  display: flex;
  position: relative;
  justify-content: center;
  opacity: 90%;
  flex-wrap: wrap;
  margin-bottom: 20px;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #E3E3E3;
    filter: blur(8px); 
    z-index: -1; 
  }
  .form{
width: 50%;
padding: 10px;
@media (max-width:768px) {
width:100% ;
}
}
.content{
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    img{
filter: brightness(80%);
    }
    @media (max-width:768px) {
width:80% ;
}
}
`