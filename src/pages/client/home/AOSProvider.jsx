"use client"

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AOSProvider({ children }) {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    })
    // Refresh on mount to ensure correct initial positions
    AOS.refresh()
  }, [])

  return children
}


