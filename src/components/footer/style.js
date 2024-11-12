import styled from "styled-components";
export const Main = styled.div`
width: 100%;
display: flex;
background-color: red;
.first{
width: 23%;
padding: 10px;
display: flex;
gap: 20px;
flex-direction: column;
/* justify-content: space-around; */
img{
    width: 15%;
    border-radius: 50%;
}
h1{
    font-size: 2rem;
}
&>:nth-child(1){
    justify-content: center;
    align-items: center;
    display: flex;
    gap: 20px;
}
.icon-div{
    display: flex;
    justify-content: center;
    gap: 20px;
    font-size: 1.2rem;

}
}
.second{
    width: 23%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap:10px;
&>:nth-child(2){
    display: flex;
    gap: 20px;
    flex-direction: column;
}
}
.third{
    width: 23%;

}
.four{
    width: 23%;

}
`