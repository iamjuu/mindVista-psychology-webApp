import styled from "styled-components";

export const Main = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 20px;

  h1 {
    font-family: -moz-initial;
    font-size: 6rem;
    color: #a57355;

    &:nth-child(2),
    &:nth-child(3) {
      color: white;
      font-size: 2.5rem;
    }
  }

  p {
    color: white;
    font-size: 2.5rem;
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    h1 {
      font-size: 4.5rem;
    }
    h1:nth-child(2),
    h1:nth-child(3),
    p {
      font-size: 2rem;
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 3.5rem;
    }
    h1:nth-child(2),
    h1:nth-child(3),
    p {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 2.5rem;
    }
    h1:nth-child(2),
    h1:nth-child(3),
    p {
      font-size: 1.5rem;
    }
  }
`;
