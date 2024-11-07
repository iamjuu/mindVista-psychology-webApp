// style.js
import styled from "styled-components";

export const Main = styled.div`
  display: flex;
  width: 100%;
  padding: 5px;
  gap: 10px;
  font-family: sans-serif;

  justify-content: center;
  /* background-color: #1d1614; */

  /* align-items: center; */
  flex-wrap: wrap;
  color: white;
.left{
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  color: #6B6B6B;
  justify-content: center;
  align-items: center;
  width: 48%;
  h3{
font-size: 1.2rem;
  }
  h1{
font-size: 1.9rem;
  }
  p{
font-size: 1.2rem;
  }
}
.right{
  width: 48%;
  display: flex;
  color: #6B6B6B;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  .right-sub{
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px;
  }
}
`;
