"use client"

import { useState, useEffect } from "react";
import Button from "../../../components/home/button";
import { Plus, Minus } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const faqs = [
  {
    q: "Can you improve weak WiFi signals in multi-floor buildings?",
    a: "Yes. We design and deploy heat‑mapped WiFi with proper access point placement, structured cabling, and signal optimization for seamless coverage across floors.",
  },
  {
    q: "Do you provide CCTV installation and maintenance?",
    a: "We handle end‑to‑end CCTV solutions including site survey, installation, remote monitoring setup, and ongoing maintenance contracts.",
  },
  {
    q: "Can Tabdeel handle both residential and commercial projects?",
    a: "Absolutely. Our team executes residential villas, retail, hospitality, warehouses, and mixed‑use projects across the UAE.",
  },
  {
    q: "How quickly can your engineers respond to service requests?",
    a: "Standard response within the same business day, with 24/7 priority support available under AMC.",
  },
  {
    q: "Do you offer UAE‑wide coverage (Dubai, Abu Dhabi, Sharjah, etc.)?",
    a: "Yes, we cover all emirates and mobilize teams based on project scope and SLAs.",
  },
  {
    q: "What certifications do your engineers and services comply with?",
    a: "Projects adhere to local authority guidelines; engineers hold vendor and safety certifications relevant to scope.",
  },
  {
    q: "Do you provide AMC (Annual Maintenance Contracts) for IT and security systems?",
    a: "Yes. Flexible AMC packages include preventive visits, remote monitoring, and on‑call support.",
  },
  {
    q: "How does Tabdeel help businesses reduce costs?",
    a: "By optimizing infrastructure, preventing downtime, and right‑sizing solutions for current and future needs.",
  },
  {
    q: "Can your services scale as my business grows?",
    a: "Our designs are modular and scalable so you can expand capacity without rework.",
  },
];

export default function QuickAnswer() {
  const [openIndex, setOpenIndex] = useState(null);
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    AOS.refresh();
  }, []);

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faqs" className="w-full text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left column: Heading and CTA */}
          <div data-aos="fade-up" data-aos-delay={0}>
            <p className="text-sm text-gray-600 mb-2">Frequently Asked Questions</p>
            <h2 className="text-[28px] sm:text-[34px] leading-tight font-semibold text-[#FFCB05] mb-4">
              Quick Answers. Clear Solutions.
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-[48ch]">
              Looking for electrical, security, or automation solutions? Tell us about your
              project, and our team will respond quickly with the next steps.
            </p>

            <div className="mt-10">
              <p className="text-red-600 text-[12px] mb-3">Didn’t find your question?</p>
              <Button as="a" href="#contact" className=" border border-[#FFCB05] text-black hover:bg-[#FFCB05]/90">
                Contact Us Now
              </Button>
            </div>
          </div>

          {/* Right column: Accordions */}
          <div
            className="space-y-3 max-h-[400px] overflow-y-auto pr-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            data-aos="fade-up"
            data-aos-delay={100}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                  data-aos="fade-up"
                  data-aos-delay={150 + idx * 100}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between text-left px-4 sm:px-5 py-4 hover:bg-gray-50"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-medium text-gray-900">
                      {item.q}
                    </span>
                    <span className="ml-4 flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 text-gray-700">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 pt-0 text-sm text-gray-600 bg-white">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


