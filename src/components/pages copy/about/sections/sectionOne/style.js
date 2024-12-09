import styled from "styled-components";

export const Main = styled.div`
/* margin-top: 100px; */
  font-family: sans-serif;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .first {
    margin-top: -70px;
    position: relative;
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 1300px;
    width: 100%;
    .left {
      border-radius: 15px;
      background-color: white;
      /* padding: 10px; */
      gap: 5px;
      width: 60%;
      flex-wrap: wrap;
      display: flex;

      & > :nth-child(1) {
        font-size: 1.2rem;
        text-align: left;
        display: flex;
        width: 70%;
        display: flex;
        flex-direction: column;
        gap: 25px;
      }
      & > :nth-child(2) {
        width: 29%;
        ul > li {
          line-height: 30px;
          list-style: none;
        }
      }
      @media (max-width:1024px) {
        width: 80%;
        
      }
      @media (max-width: 768px) {
        width: 80%;
        & > :nth-child(1) {
          width: 100%;
          font-size: 0.9rem;
          justify-content: center;
          display: flex;
          align-items: center;
        }
        & > :nth-child(2) {
          width: 100%;
          font-size: 0.9rem;
        }
      }
    }
    .right {
      border-radius: 15px;
      width: 30%;
      background-color: #F3EBE6;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 10px;
      font-size: 1.2rem;
      @media (max-width: 1024px) {
width: 80%;
    }

      @media (max-width: 768px) {
width: 80%;
    }
      @media (max-width: 485px) {
        font-size: 0.9rem;
      }
      @media (max-width: 425px) {
        font-size: 0.8rem;
      }


      h1{
        font-size: 1.4rem;
      }
      p{
        font-size: 1rem;

      }
    }


  }
  /* ..........second..........  */
  .second {
    margin-top: 70px;
    display: flex;
    justify-content: center;
    gap: 20px;
    width: 100%;
    flex-wrap: nowrap; 
}

.left{
    padding: 30px;
    width: 50%; 
    display: flex;
    justify-content: center;
    align-items: center;
} .right {
    /* background-color: red; */
    width: 50%; 
    padding: 10px;
    justify-content: center;
    gap: 30px;
    display: flex;

    flex-direction: column;
    align-items: center;
    h5{
        font-size: 1rem;
    }
    p{
        line-height: 25px;
        color: #6b6b6b;
font-size: 1.1rem;
    }
    h3{
        line-height: 25px;
    }
}

.left img {
    width: 70%;
    height: auto;
    object-fit: cover;
}

/* Responsive adjustments */

@media (max-width: 768px) {
    .second {
        flex-wrap: wrap; 
    }

    .left, .right {
        width: 100%; 
    }
}

@media (max-width: 425px) {
    .left, .right {
        width: 100%; 
    }
}
`  