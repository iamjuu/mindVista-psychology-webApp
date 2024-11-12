import styled from "styled-components"


export const Main = styled.div`
padding: 10px;
width: 100%;
display: flex;
flex-direction: column;
justify-content: center;
gap: 20px;
p{
    font-size: 1.5rem;
    color: white;
   
}
.btn-container {
    display: flex;
    gap: 20px;

    & > :nth-child(1) {
        background-color: brown;
        color: aliceblue;

        &:hover {
            background-color: aliceblue;
            color: brown;
        }
    }

    & > :nth-child(2) {
        background-color: aliceblue;
        color: brown;

        &:hover {
            background-color: brown;
            color: aliceblue;
        }
    }
}

`