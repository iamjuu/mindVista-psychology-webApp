"use client"

import { useState, useEffect } from "react";
import Button from "../../../components/home/button";
import { Plus, Minus } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const faqs = [
  {
    q: "What types of therapy do you offer?",
    a: "We provide individual therapy, couples counseling, family therapy, and group sessions tailored to each client’s needs and goals.",
  },
  {
    q: "Can I schedule an online session?",
    a: "Yes, we offer secure online therapy sessions via video conferencing, so you can receive support from the comfort of your home.",
  },
  {
    q: "How can I know which psychologist is right for me?",
    a: "We offer an initial consultation to understand your needs and match you with a licensed psychologist whose expertise aligns with your goals.",
  },
  {
    q: "Do you provide support for anxiety and stress management?",
    a: "Absolutely. Our psychologists use evidence-based techniques such as CBT, mindfulness, and relaxation strategies to help manage stress and anxiety.",
  },
  {
    q: "Are your services confidential?",
    a: "Yes, all sessions and client information are strictly confidential and comply with professional ethical standards.",
  },
  {
    q: "Can you help with relationship or family issues?",
    a: "Yes, we provide couples and family counseling to improve communication, resolve conflicts, and strengthen relationships.",
  },
  {
    q: "Do you offer mental health assessments?",
    a: "We conduct comprehensive psychological assessments to better understand cognitive, emotional, and behavioral patterns and guide therapy.",
  },
  {
    q: "How quickly can I start therapy sessions?",
    a: "We strive to provide appointments within a few days of your inquiry, depending on availability and urgency.",
  },
  {
    q: "Is there support for workplace stress or burnout?",
    a: "Yes, we offer programs for stress management, resilience building, and emotional wellness in professional settings.",
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
            <h2 className="text-[28px] sm:text-[34px] leading-tight font-semibold text-black mb-4">
              Quick Answers. Clear Guidance.
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-[48ch]">
              Looking for therapy, counseling, or mental health support? Share your concerns, and our team will respond promptly with guidance and next steps.
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
