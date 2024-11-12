import styled from 'styled-components';

export const Main = styled.div`
  margin: 50px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
  width: 100%;

  & > :nth-child(1) {
    width: 31%;
    align-items: center;
    flex-direction: column;
    display: flex;
    justify-content: center;
  }

  .icon {
    font-size: 3rem;
    animation: icon 6s ease-in-out;
    transition: transform 0.5s ease, color 0.5s ease;
    transition-delay: 0.2s;
  }

  .icon:hover {
    transform: scale(1.2) rotate(10deg);
    color: #a57355;
  }

  @media (max-width: 768px) {
    & > :nth-child(1) {
      width: 100%; 
    }

    .icon {
      font-size: 2.5rem; 
    }
  }

  @media (max-width: 480px) {
    margin: 20px; 
    gap: 15px; 
  }
`;
