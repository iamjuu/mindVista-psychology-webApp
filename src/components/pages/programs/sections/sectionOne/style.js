import styled from "styled-components";

export const Main = styled.div`
    margin-top: 120px;
width: 100%;
display: flex;
flex-wrap: wrap;
justify-content: center;
/* align-items: center; */


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
        flex-wrap: wrap;
        width: 100%;
        gap: 10px;
      .img{
        width: 49%;
        @media (max-width:768px) {
            width: 100%;
            
        }
      } 
      .content{
        width: 49%;
        @media (max-width:768px) {
            width: 100%;
            
        }
      } 
    }
}
.four{
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 10px;
   margin-bottom:30px ;


}
@media (max-width:768px) {
    width: 100%;
    
}

`;
// ***********************************
export const Right = styled.div`
display: flex;
/* justify-content: center; */
flex-direction: column;
width: 35%;
.first{
   /* background-color :red ; */
   display: flex;
   flex-direction: column;
   padding:20px;
   gap: 30px;
h1{
    font-size: 1.5rem;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-weight: 200;
        font-weight: bold;

}
   border: 1px solid #F7F7F7;
   ul{
    display: flex;
    /* padding: 10px; */
    flex-direction: column;
    gap: 10px;
   }
   ul li{
    padding: 15px;
    background-color: #F9F7F7;
   }:hover{
   color: #F7F7F7;
   }
}
.second{

}

@media (max-width:768px) {
    width: 70%;
}

`
