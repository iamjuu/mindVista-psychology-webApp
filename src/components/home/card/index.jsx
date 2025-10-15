import React,{useState,useEffect} from "react";

import { AnimatedTestimonials } from "../../ui/home/card/card";
import {Pic1,Pic2,Pic3,Ajmal,PLaceHolderMen,PlaceHolderWomen} from "../../../assets"
import apiInstance from "../../../instance";


export function AnimatedTestimonialsDemo() {
const [docters,setDocters] = useState([])
useEffect(()=>{
  const fetchDocters = async () => {
    try {
      const { data } = await apiInstance.get("/doctors");
      setDocters(data.docters || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDocters([]);
    }
  }
  fetchDocters();
},[])

    // Don't render if no doctors yet
    if (!docters || docters.length === 0) {
      return <div className="mx-auto max-w-sm px-4 py-20 text-center">Loading doctors...</div>;
    }

    const testimonials = docters.map((docter)=>{
      // Determine placeholder image based on gender
      let placeholderImage = PLaceHolderMen; // default to men
      if (docter.gender && docter.gender.toLowerCase() === 'female') {
        placeholderImage = PlaceHolderWomen;
      }
      
      return {
        quote: docter.quote || "No quote available",
        name: docter.name || "Unknown",
        designation: docter.designation || "Doctor",
        src: docter.profilePicture || placeholderImage,
      }
    })
    
    // const testimonials = [
    //   {
    //     quote: "Develop this platform to solve mental health challenges and provide accessible psychological support.",
    //     name: "Muhammed Ajmal CC",
    //     designation: "Founder",
        
    //     src: Ajmal,
    //   },
    //   {
    //     quote:
    //       " Reliable Wi-Fi solutions for staff housing with 99.9% uptime, modern equipment, and cost-effective digital access systems.",
    //     name: "Staff Accommodation Wi-Fi",
    //     designation: "Staff Accommodation Wi-Fi Smart Connectivity",
    //     src: Pic3,
    //       },
    //   {
    //     quote:
    //       "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
    //     name: "Emily Watson",
    //     designation: "Operations Director at CloudScale",
    //     src: Pic2, 
    //     },
    //   {
    //     quote:
    //       "HV & LV electrical installations and maintenance for commercial, industrial, and residential projects — safe, compliant, and reliable across the UAE.",
    //     name: "Electrical Works",
    //     designation: "Smart Infrastructure",
    //     src: Pic1,    },
    //   {
    //     quote:
    //       " 24/7 surveillance and advanced access control systems to keep your people, property, and assets secure.",
    //     name: "CCTV & Security",
    //     designation: "Smart Protection",
    //     src: Pic2,    },
    //     {
    //       quote:
    //         " Structured cabling, VoIP, and telephone solutions that keep your business connected without interruptions.",
    //       name: "Networking & Telephone",
    //       designation: "Smart Connectivity",
    //       src: Pic3,    },
    // ];
    return <AnimatedTestimonials testimonials={testimonials} />;
  }
