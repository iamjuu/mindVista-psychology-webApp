import styled from "styled-components";


export const Main = styled.div`
margin-top: 30px;
display: flex;
justify-content: center;
flex-wrap: wrap;
gap: 30px;
width: 100%;
&>:nth-child(1){
    width: 31%;
    align-items: center;
    flex-direction: column;
display: flex;
justify-content: center;
}
&>:nth-child(2){
    flex-direction: column;
    align-items: center;  
      border-right: 3px dotted #A57355;
    display: flex;
justify-content: center;
    width: 31%;
}
&>:nth-child(3){
    flex-direction: column;
    align-items: center;  
    display: flex;
justify-content: center;
    width: 31%;

}
.icon {
    font-size: 3rem;
    animation: icon 6s ease-in-out;
    transition: transform 0.5s ease, color 0.5s ease; /* Smooth transition for transform and color */
    transition-delay: 0.2s; /* Adds a delay before the transition starts */
}

.icon:hover {
    transform: scale(1.2) rotate(10deg); /* Scales the icon and rotates it slightly on hover */
    color: #A57355; /* Change this to any color you prefer */
}

`