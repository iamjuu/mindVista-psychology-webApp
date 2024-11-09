import styled from "styled-components";
export const Main = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
width: 100%;
.first{
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    span{
        font-size: 1.3rem;
        color: #a57355;
    }
    .dot{
width: 10px;
height: 10px;
 border-radius:50%;
background-color:#a57355;
border: none;

   }
    .line{
width: 100px;
background-color:#a57355;
height: 3px;
border: none;

    }
}
.second{
margin-top: 10px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
}
`