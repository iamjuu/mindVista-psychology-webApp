import styled from "styled-components";

export const Main = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px;

  .form {
    flex: 1;
    max-width: 600px;
    min-width: 300px; /* Ensures form doesn't shrink too much */
  }

  .content {
    flex: 1;
    text-align: center;

    img {
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%; /* Ensures image scales to its container */
      max-width: 400px; /* Sets a max-width to prevent it from becoming too large */
      height: auto;
    }
  }

  /* Media query for screens smaller than 768px (mobile and tablet) */
  @media (max-width: 768px) {
    flex-direction: column; /* Stacks form and image vertically */
    align-items: center;

    .form,
    .content {
      flex: none;
      width: 100%; /* Takes up full width on smaller screens */
    }

    .content img {
      max-width: 300px; /* Adjusts max-width for smaller devices */
    }
  }
`;

export const FormContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px; /* Keeps the form container compact on larger screens */
  margin: 0 auto; /* Centers the form on small screens */
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const FormLabel = styled.label`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
`;

export const FormInput = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;

  &:focus {
    border-color: #a57355;
    box-shadow: 0 0 3px rgba(165, 115, 85, 0.5);
  }

  &[as="textarea"] {
    resize: none;
  }
`;

export const FormButton = styled.button`
  background-color: #a57355;
  color: white;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #8b6344;
  }
`;
