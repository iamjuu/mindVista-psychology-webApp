import React from "react";
import styled from "styled-components";
import Bg1 from "../../../assets/landing/vistaBg.jpg";
import Bg2 from "../../../assets/landing/about-image-1.jpg";
const Section1 = () => {
  return (
    <Container>
      <div className="container-wrap">
        <div className="first">
          <div className="left">
            <div>
              <h2>How can I help you?</h2>
              <p>
                If you're experiencing any kind of mental illness
                <br />
                or problem in relations.
              </p>
              <p>Explore Programs</p>
            </div>
            <div>
              <ul>
                <li>Family Problems</li>
                <li>Breakups</li>
                <li>Business Failure</li>
                <li>Stress Issues</li>
                <li>Online Sessions</li>
              </ul>
            </div>
          </div>
          <div className="right">
            <h3>Call for Consultation</h3>
            <p>30 minutes free for the first session</p>
            <hr style={{}} />
            <div>
              <p style={{ opacity: "100%" }}>icon</p>
              <p style={{ opacity: "100%" }}>1234567890</p>
            </div>
          </div>
        </div>

        {/* <div className="second">
          <div className="left">
            <img src={Bg2} alt="" />
          </div>
          <div className="right">
            <h2> iam psychologist how can you assist you ?</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
              a corrupti accusantium odit sunt fugiat optio excepturi quo
              aspernatur nam nisi, explicabo eius molestiae soluta perferendis
              repudiandae facilis nulla vitae.
            </p>
            <p>  Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
              a corrupti </p>
          </div>
        </div> */}
      </div>
    </Container>
  );
};

export default Section1;

const Container = styled.div`
  width: 100%;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;

  .container-wrap {
    max-width: 1300px;
    background-color: #ffffff;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .first {
      position: relative;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: -50px;
      gap: 20px;
      width: 100%;

      .left {
        border-radius: 10px;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        gap: 10px;
        width: 50%;

        @media (max-width: 992px) {
          width: 80%;
          flex-direction: column;
          align-items: flex-start;
          /* padding: 20px; */
        }

        & > :nth-child(1) {
          display: flex;
          flex-direction: column;
          gap: 20px;

          @media (max-width: 768px) {
            padding: 15px;
          }

          h1 {
            font-family: "Franklin Gothic Medium", "Arial Narrow", Arial,
              sans-serif;
            font-size: 2.5rem;

            @media (max-width: 768px) {
              font-size: 2rem;
            }

            @media (max-width: 480px) {
              font-size: 1.5rem;
            }
          }
          p {
            color: #6b6b6b;
          }
        }

        & > :nth-child(2) {
          ul {
            list-style: none;
            padding: 10px;
            display: flex;
            flex-direction: column;
            color: #6b6b6b;

            gap: 10px;

            @media (max-width: 992px) {
              /* padding: 0 15px; */
            }
          }
        }
      }
      .right {
        display: flex;
        color: white;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
        border-radius: 10px;
        padding: 20px;
        width: 35%;
        position: relative;
        background-image: linear-gradient(
            rgba(0, 0, 0, 0.6),
            rgba(0, 0, 0, 0.6)
          ),
          url(${Bg1});
        background-repeat: no-repeat;
        background-size: cover;

        @media (max-width: 992px) {
          width: 80%;
          padding: 10px;
        }

        p {
          opacity: 0.7;
        }

        hr {
          width: 290px;
          opacity: 0.2;
          border: none;
          height: 1px;
          background-color: white;

          @media (max-width: 768px) {
            width: 100% !important;
          }
        }

        h3 {
          font-size: 1.5rem;
          text-align: center;

          @media (max-width: 768px) {
            font-size: 1.25rem;
          }
        }

        & > div {
          display: flex;
          align-items: center;
          gap: 10px;
        }
      }
    }

    .second {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
     .left{
      
width: 50%;
background-color: red;
img{

}
     }
     .right{
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 40px;
width: 50%;
background-color: green;
     }
    }
  }
`;
