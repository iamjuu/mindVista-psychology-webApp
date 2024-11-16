import styled from "styled-components";

export const Main = styled.div`
  width: 100%;
  display: flex;
  padding: 10px;
  justify-content: center;
  /* background-color: beige; */
  flex-wrap: wrap; 
  .book-div {
    display: flex;
    justify-content: center;
    width: 20%;
    position: relative;
    img {
            transition:  transform 0.3s ease, opacity 0.3s  ease-in-out;
          
 
        }
    img:hover {
            transform: scale(1.1); /* Slight zoom effect */
            opacity: 0.8; /* Change opacity */
        }
    @media (max-width: 768px) {
        width: 40%;

      

       
    }
}

  .book-details{
    display: flex;
    justify-content: center;

    position: absolute;
    top: 15%;
    left: 30%;
  }
`;

