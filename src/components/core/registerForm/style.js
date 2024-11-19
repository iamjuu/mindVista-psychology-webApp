import styled from 'styled-components';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 350px;
  gap: 15px;
  padding: 20px;
  /* border: 1px solid #ccc; */
  border-radius: 10px;
  background-color: #f9f9f9;
`;

export const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  /* border: 1px solid #ccc; */
  font-size: 1rem;
`;

export const Button = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #4CAF50;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;
