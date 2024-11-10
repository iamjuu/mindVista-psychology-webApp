// datas.js
import SectionImg from "../../../assets/landing/about-image-1 (1).jpg";
import Brain from "../../../assets/bannar/brain.avif"
import Breakup from "../../../assets/bannar/Brackup.avif"
import Introvert from "../../../assets/bannar/introvert.jpg"
import Smoking from "../../../assets/bannar/smoking.jpg"
import Youth from "../../../assets/bannar/youth.avif"
import Cardimg1 from "../../../assets/landing/about-image-1 (1).jpg"
import {Logo } from '../../../assets/index'
export const Data = {
  p: "Best psychologist",
  h1: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, esse nobis reprehenderit aut cumque labore sapiente tempora eveniet veniam quaerat, distinctio minima est voluptatum, error tempore. Minima, totam. Ratione, ullam?",
};

export const SectionOne = {
  boxOne:[{
h2:'How can I help you?',
p:'   If you’re experiencing any kind of mental illness or problem in relations',
h5:'Explore Programs'
  }],
  boxTwo:[{
    h1:'Call for Consultation',
    p:"30 minutes free for the first session.",
    h5:"  DIAL NOW ",
    break:'  921-124-9220'
  }],
  img: SectionImg,
  h5: "Let me introduce",
  h1: "I’m Dr. Vishnu priya – Expert Psychologist from India.",
  // h1Break: "Vishnu priya from New York.",
  h3: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua minim veniam.",
  p: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Diam nascetur ad varius curabitur ante donec de proin auctor felis hendrerit.",
  h4: "Susan Lopez – Founder",
};
export const sectionTwoData={ 
  left:[
{
  h3:'My Practice',
  h1:'Personal & Individual therapy sessions.',
  p:'Venenatis dignissim montes commodo interdum semper magna Diam nascetur ad varius curabitur ante donec de proin auctor felishendrerit tortor morbi vehicula.'
}
  ],
  right:[
    {
      id:1,
      title:"Adult",
      p:'Life changing session for adults, no matters what age  group  they belong to.'
    },
    {
      id:2,
      title:"Chlidren",
      p:'A special session for your kids regarding personal problems and study.'
    },
    {
      id:3,
      title:"Families",
      p:'Join me with your family and we’ll dicuss your issues to make your bonds better.'
    },
    {
      id:4,
      title:"Businesses",
      p:'Arrange a business session for your organization to boost the outcome.'
    }
  ]
}

export const sectionThreeData={
  first:[{
    span:'Program Offerings',
    h1:'Magical & Inspirational lessons for people seeking help.'
  }],
  secondCard:[{
   h1: 'heading',
   img:Cardimg1,
   p:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor',
   link:'/about'
  },
  {
    h1: 'heading1',
    img:Cardimg1,
    p:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor',
    link:'/about'
   },
   {
    h1: 'heading',
    img:Cardimg1,
    p:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor',
    link:'/about'
   },
],
third:[{
  h1:'Open for Appointments',
  p:'Have a look at my schedule to book a session.',
  icon:Logo
}]

}
