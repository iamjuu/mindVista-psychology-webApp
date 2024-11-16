import styled from "styled-components";

export const Main = styled.div`
    margin-top: 50px;
width: 100%;
display: flex;
flex-wrap: wrap;
justify-content: center;
align-items: center;

`
export const Left= styled.div`
display: flex;
flex-direction: column;
gap: 10px;
   h1{
        font-size: 2.1rem;
    font-family: Georgia, 'Times New Roman', Times, serif;
} 
width: 60%;
.first{
    display: flex;
    flex-direction: column;
justify-content: center;
gap: 30px;
padding: 10px;
h1{
    font-size: 2.1rem;
    font-family: Georgia, 'Times New Roman', Times, serif;
}
h5{
    font-size: 1.1rem;
    color: #5F5F5F;
}
p{
    font-size: 1rem;
    color: #5F5F5F;

}
}
.second{
    padding: 10px;
border-bottom: 1px solid #5F5F5F;
    display: flex;
    flex-direction: column;
    gap: 20px;
 
    
    ul{
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
}

.third{
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-wrap: wrap;
    width: 100%;
    border-bottom: 1px solid   #5F5F5F;

 
    .img-content{
        display: flex;
        gap: 20px;
      .img{
        width: 51%;
        @media (max-width:768px) {
            width: 100%;
            
        }
      } 
      .content{
        width: 51%;
        @media (max-width:768px) {
            width: 100%;
            
        }
      } 
    }
}
.four{
    /* background-color: red; */
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 10px;
   margin-bottom:30px ;


}

`;
export const Right = styled.div`
width: 35%;

`
