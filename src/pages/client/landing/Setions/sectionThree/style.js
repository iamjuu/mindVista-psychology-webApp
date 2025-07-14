import styled from "styled-components";

export const Main = styled.div`
  display: flex;
  margin-top: 50px;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  width: 100%;

  .first {
    display: flex;
    gap: 20px;
    padding: 5px;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    span {
      font-size: 1.3rem;
      color: #a57355;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #a57355;
      border: none;
    }

    .line {
      width: 100px;
      background-color: #a57355;
      height: 3px;
      border: none;
    }
  }

  .second {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .third {
    /* max-width: 1300px; */
    width: 100%;
    border-top: 1px solid #F4F3F2;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    /* padding: 20px; */

    h1 {
      font-size: 1.6rem;
      font-family: "Times New Roman", Times, serif;
      font-weight: 300;
    }
  }
`;

export const SectionTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

export const CardWrapper = styled.div`
  display: flex;
  /* background-color: red; */
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;

export const InfoSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
`;

export const LeftSection = styled.div`
  width: 49%;
  justify-content: center;
  padding: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
  }
  img{
    width: 10%;
  }
`;

export const RightSection = styled.div`
  width: 49%;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }

`;
