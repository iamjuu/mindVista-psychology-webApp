import styled from "styled-components";

export const Button = styled.button`
  padding: ${(props) => props.padding || '10px'};
  font-size: ${(props) => props.fontsize || '1rem'};
  border: none;
  border-radius: ${(props) => props.borderRadius || '5px'};
  background-color: ${(props) => props.bg || '#007BFF'};
  color: ${(props) => props.color || '#fff'};
  width: ${(props) => props.width || 'auto'};
  border: ${(props) => props.border || "none"};
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  
 
  :hover {
    background-color: red;
  }
`;
