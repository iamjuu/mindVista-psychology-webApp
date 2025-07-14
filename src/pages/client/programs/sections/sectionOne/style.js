import styled from "styled-components";

export const Main = styled.div`
  margin-top: 120px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* align-items: center; */
`;
export const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  h1 {
    font-size: 2.1rem;
    font-family: Georgia, "Times New Roman", Times, serif;
  }
  width: 60%;
  .first {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 30px;
    padding: 10px;
    h1 {
      font-size: 2.1rem;
      font-family: Georgia, "Times New Roman", Times, serif;
    }
    h5 {
      font-size: 1.1rem;
      color: #5f5f5f;
    }
    p {
      font-size: 1rem;
      color: #5f5f5f;
    }
  }
  .second {
    padding: 10px;
    border-bottom: 2px solid #f7f7f7;
    display: flex;
    flex-direction: column;
    gap: 20px;

    ul {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }

  .third {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-wrap: wrap;
    width: 100%;
    border-bottom: 1px solid #f7f7f7;

    .img-content {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      gap: 10px;
      .img {
        width: 100%;

        @media (max-width: 768px) {
          width: 100%;
        }
      }

      .content {
        width: 49%;
        @media (max-width: 768px) {
          width: 100%;
        }
      }
    }
  }
  .four {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 10px;
    margin-bottom: 30px;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;
// ***********************************
export const Right = styled.div`
  display: flex;
  gap: 130px;    
  /* background-color: red; */
  flex-direction: column;
  width: 35%;
  .first {
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 30px;
    border: 1px solid #f7f7f7;
    h1 {
      font-size: 1.5rem;
      font-family: Georgia, "Times New Roman", Times, serif;
      font-weight: 200;
      font-weight: bold;
    }
    ul {
      display: flex;
      /* padding: 10px; */
      flex-direction: column;
      gap: 10px;
    }
    ul li {
      padding: 15px;
      background-color: #f9f7f7;
    }
    :hover {
      color: #a57355;
    }
  }
  .second {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 20px;
    gap: 30px;

    h1{
        font-size: 1.3rem;
        font-weight: bold;
        font-family: 'Times New Roman', Times, serif;
        border-bottom: 2px solid #a57355 ;
        /* border-radius: 10%; */
    }
&>:nth-child(1){
    display: flex;
    padding: 10px;
    /* background-color: red; */
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
}

    & > :nth-child(2) {
      display: flex;
      gap: 20px;
      flex-direction: column;
      input {
        padding: 10px;
        border-radius: 7px;
        border: 2px solid  #f7f7f7;
      }
    }
  }
  .third{
    border: 1px solid   #f7f7f7;
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    &>:nth-child(1){
        width: 70%;
    }
  }

  @media (max-width: 768px) {
    width: 80%;
  }
`;
