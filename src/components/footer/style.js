import styled from "styled-components";

export const Main = styled.div`
  margin-top: 50px;
  width: 100%;
  max-width: 1300px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 30px;
  justify-content: center;
  color: #c3c7cc;
  gap: 20px;

  .first,
  .second,
  .third,
  .four {
    width: calc(25% - 20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-align: center;

    h1 {
      font-size: 1.2rem;
      font-weight: 700;
      font-family: serif;
    }
  }

  .first img {
    width: 100px;
    border-radius: 50%;
  }

  .icon-div {
    display: flex;
    gap: 15px;
    font-size: 1.5rem;

    svg {
      color: #c3c7cc;
      cursor: pointer;
      transition: transform 0.2s, color 0.2s;

      &:hover {
        transform: scale(1.2);
        color: #d4a373;
      }
    }
  }

  .third ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .four svg {
    font-size: 2.5rem;
    color: #c3c7cc;
    cursor: pointer;
    transition: transform 0.2s, color 0.2s;

    &:hover {
      transform: scale(1.2);
      color: #d4a373;
    }
  }

  @media (max-width: 1024px) {
    .first,
    .second,
    .third,
    .four {
      width: calc(50% - 20px);
    }

    .first img {
      width: 80px;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;

    .first,
    .second,
    .third,
    .four {
      width: 100%;
      text-align: center;
    }

    .first img {
      width: 70px;
    }
  }

  @media (max-width: 480px) {
    .first img {
      width: 50px;
    }

    h1 {
      font-size: 1rem;
    }

    .icon-div svg,
    .four svg {
      font-size: 1.5rem;
    }
  }
`;


