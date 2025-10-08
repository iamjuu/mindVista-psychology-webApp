  import { AnimatedTestimonials } from "../../ui/home/card/card";
  import {Pic1,Pic2,Pic3,Ajmal} from "../../../assets"
  export function AnimatedTestimonialsDemo() {
    const testimonials = [
      {
        quote: "Develop this platform to solve mental health challenges and provide accessible psychological support.",
        name: "Muhammed Ajmal CC",
        designation: "Founder",
        
        src: Ajmal,
      },
      {
        quote:
          " Reliable Wi-Fi solutions for staff housing with 99.9% uptime, modern equipment, and cost-effective digital access systems.",
        name: "Staff Accommodation Wi-Fi",
        designation: "Staff Accommodation Wi-Fi Smart Connectivity",
        src: Pic3,
          },
      {
        quote:
          "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
        name: "Emily Watson",
        designation: "Operations Director at CloudScale",
        src: Pic2, 
        },
      {
        quote:
          "HV & LV electrical installations and maintenance for commercial, industrial, and residential projects — safe, compliant, and reliable across the UAE.",
        name: "Electrical Works",
        designation: "Smart Infrastructure",
        src: Pic1,    },
      {
        quote:
          " 24/7 surveillance and advanced access control systems to keep your people, property, and assets secure.",
        name: "CCTV & Security",
        designation: "Smart Protection",
        src: Pic2,    },
        {
          quote:
            " Structured cabling, VoIP, and telephone solutions that keep your business connected without interruptions.",
          name: "Networking & Telephone",
          designation: "Smart Connectivity",
          src: Pic3,    },
    ];
    return <AnimatedTestimonials testimonials={testimonials} />;
  }
