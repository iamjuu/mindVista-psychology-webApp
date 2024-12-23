import styled from "styled-components";

export const Main = styled.div`
  padding: 10px;
  max-width: 700px;
  width: 100%;
  display: flex;
  /* background-color: red; */
  flex-direction: column;
 
  gap: 20px;

  p {
    font-size: 1.5rem;
    color: white;
  }

  .btn-container {
    display: flex;
    gap: 20px;

    a {
      text-decoration: none;

      .btn1 {
        background-color: brown;
        color: aliceblue;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 1rem;
        transition: all 0.3s ease;

      }
    }

    .btn2 {
      background-color: aliceblue;
      color: brown;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    .btn1{

    }:hover{
        background-color: #F3EBE6;
    }
  }
  h1{
    font-size: 2rem;
    @media (max-width:768px) {
      font-size: 1.5rem;
      text-align: left;
      display: none;

    }
    
    @media (max-width:425px) {
      font-size: 1rem;
    }
  }
`;
