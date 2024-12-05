import { AnimatedTestimonials } from "../../ui/clickingDev";
import {Pic1,Pic2,Pic3} from '../../../assets'
export function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
    `In the development of MindVista, Muhammed Ajmalcc played a key role in integrating video conferencing, live chat, and an AI-powered chatbot to enhance user experience and provide instant mental health support. `,
      designation: "software   developer",
      src: Pic3,
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "muhammed ajmalcc",
      designation: "CTO at InnovateSphere",
      src: Pic2,
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  
  
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
