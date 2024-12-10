// styles.js
import styled from "styled-components";

export const Main = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: aliceblue;

  h1 {
    font-size: 2.5rem;
    font-family: Georgia, 'Times New Roman', Times, serif;
    text-align: center;
    
    span {
      display: inline-block;
      margin-right: 8px; 
      transition: color 0.3s ease, transform 0.3s ease;

      &:hover {
        color: #d4a373;
        transform: scale(1.1); 
      }
    }
    span:last-child {
      margin-right: 0;
    }
  }
`;
