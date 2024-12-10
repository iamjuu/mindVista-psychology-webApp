// style.js
import styled from "styled-components";

export const Main = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 1300px;
  align-items: center;
  width: 100%;
  padding: 5px;
  gap: 10px;
  font-family: sans-serif;
  justify-content: center;
  color: white;

  .left {
    padding: 5px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    color: #6B6B6B;
    justify-content: center;
    align-items: flex-start;
    width: 48%;
    
    h3 {
      font-size: 1.2rem;
      @media (max-width: 768px) {
        font-size: 1rem;
      }
      @media (max-width: 425px) {
        font-size: 0.9rem;
      }
    }
    
    h1 {
      font-size: 1.9rem;
      @media (max-width: 768px) {
        font-size: 1.5rem;
      }
      @media (max-width: 425px) {
        font-size: 1.2rem;
      }
    }
    
    p {
      font-size: 1.2rem;
      @media (max-width: 768px) {
        font-size: 1rem;
      }
      @media (max-width: 425px) {
        font-size: 0.9rem;
      }
    }

    @media (max-width: 768px) {
      width: 100%;
      align-items: center;
    }
    
    @media (max-width: 425px) {
      width: 100%;
      align-items: center;
    }
  }

  .right {
    width: 48%;
    display: flex;
    color: #6B6B6B;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    
    .right-sub {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 10px;
      text-align: center;

      h3 {
        font-size: 1.1rem;
        @media (max-width: 768px) {
          font-size: 1rem;
        }
        @media (max-width: 425px) {
          font-size: 0.9rem;
        }
      }

      p {
        font-size: 1rem;
        @media (max-width: 768px) {
          font-size: 0.9rem;
        }
        @media (max-width: 425px) {
          font-size: 0.8rem;
        }
      }

      hr {
        width: 150px;
        opacity: 50%;
        margin: 0 auto;
        @media (max-width: 768px) {
          width: 120px;
        }
        @media (max-width: 425px) {
          width: 100px;
        }
      }
    }

    @media (max-width: 768px) {
      width: 100%;
    }

    @media (max-width: 425px) {
      width: 100%;
    }
  }
`;
