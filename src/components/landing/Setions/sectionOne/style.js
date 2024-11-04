import styled from "styled-components";

export const Main = styled.div`
  font-family: sans-serif;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .first {
    margin-top: -70px;
    position: relative;
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 1300px;
    width: 100%;
    .left {
      border-radius: 15px;
      background-color: aliceblue;
      padding: 10px;
      gap: 5px;
      flex-wrap: wrap;
      align-items: center;
      display: flex;

      width: 48%;
      & > :nth-child(1) {
        font-size: 1.2rem;
        width: 70%;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      & > :nth-child(2) {
        width: 29%;
        ul > li {
            line-height: 30px;
          list-style: none;
        }
      }
      @media (max-width:768px) {

          & > :nth-child(1) {
            width: 100%;
        font-size: .9rem;
        justify-content: center;
        display: flex;
        align-items: center;
      }
      & > :nth-child(2) {
            width: 100%;
        font-size: .9rem;
     
      }
      
      }
    }
    .right {
      border-radius: 15px;
      width: 48%;
      background-color: aliceblue;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 10px;
      font-size: 1.2rem;
      @media (max-width:485px) {
        font-size: .9rem;
      }
      @media (max-width:425px) {
        font-size: .8rem;
      }
    
    }
  }
`;
