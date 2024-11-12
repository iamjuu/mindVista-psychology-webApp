import styled from "styled-components";

export const Main = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 30px;
  justify-content: center;
  color: #c3c7cc;

  .first, .second, .third, .four {
    width: 23%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    box-sizing: border-box;

    h1 {
      font-size: 1.2rem;
      font-weight: 700;
      font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    }
  }

  .first {
    img {
      width: 15%;
      border-radius: 50%;
    }

    .icon-div {
      display: flex;
      justify-content: center;
      gap: 20px;
      font-size: 1.5rem;

      svg {
        transition: transform 0.3s ease, color 0.3s ease;
        color: #c3c7cc;
        cursor: pointer;

        &:hover {
          transform: scale(1.2);
          color: #d4a373;
        }
      }
    }
  }

  .second, .third {
    h1 {
      font-size: 1.2rem;
      font-weight: 700;
    }

    & > :nth-child(2) {
      display: flex;
      gap: 20px;
      flex-direction: column;
    }
  }

  .third ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .four {
    & > :nth-child(2) {
      display: flex;
      justify-content: center;
      background-color: #211d1c;
      padding: 20px;
      align-items: center;
      gap: 20px;

      svg {
        font-size: 2.5rem;
        transition: transform 0.3s ease, color 0.3s ease;
        color: #c3c7cc;
        cursor: pointer;

        &:hover {
          transform: scale(1.2);
          color: #d4a373;
        }
      }
    }
  }

  @media (max-width: 1024px) {
    .first, .second, .third, .four {
      width: 45%;
    }

    .first img {
      width: 25%;
    }

    .icon-div {
      font-size: 1.3rem;
    }

    .four svg {
      font-size: 2rem;
    }
  }

  @media (max-width: 768px) {
    .first, .second, .third, .four {
      width: 100%;
    }

    .first img {
      width: 30%;
    }

    h1 {
      font-size: 1.5rem;
    }

    .icon-div {
      font-size: 1.2rem;
    }

    .four svg {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 480px) {
    .first img {
      width: 35%;
    }

    h1 {
      font-size: 1.2rem;
    }

    .icon-div {
      font-size: 1rem;
    }

    .four svg {
      font-size: 1.5rem;
    }
  }
`;
