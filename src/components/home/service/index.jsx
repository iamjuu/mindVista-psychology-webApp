"use client";
import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import {AnimatedTestimonialsDemo} from "../../../components/home/card"
const index = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: false })
    AOS.refresh()
  }, [])
  return (
    <div data-aos="fade-up" data-aos-delay={0}>
      <div data-aos="fade-up" data-aos-delay={150}>
        <AnimatedTestimonialsDemo/>
      </div>
    </div>
  )
}

export default index
