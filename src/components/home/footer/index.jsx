"use client";
import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { Logo } from "../../../assets";


const Footer = () => {
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate newsletter subscription delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setShowToast(true);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    const onToast = (e) => {
      setShowToast(true);
      // Auto-hide after 3s
      const timeoutId = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timeoutId);
    };

    window.addEventListener("app:toast", onToast);
    return () => {
      window.removeEventListener("app:toast", onToast);
    };
  }, []);

  return (
    <>
      <div className="w-full bg-[#ebeee4] text-black mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
          {/* Company Information */}
          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <div className="flex items-center mb-4 sm:mb-6">
              <img src={Logo} alt="Cam Design Logo" className=" w-36" />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <svg
                  className="w-4 h-4 text-secondary mt-1 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="leading-relaxed">
                  Edakked Railway Gate Beach Road, Edakkad, Kannur, Kerala
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-secondary mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>info@zenextechnologies.com</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-secondary mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+971 564 4077 00</span>
              </div>
            </div>
          </div>

          {/* Service */}
          <div className="sm:col-span-1 text-gray-300 lg:col-span-1 xl:col-span-1">
            <h2 className=" font-[500] text-[18px] sm:text-lg mb-3 sm:mb-4">
              Service
            </h2>
            <nav className="space-y-2 text-sm">
              <Link
                to="services"
                spy={true}
                smooth={true}
                duration={500}
                className="block hover:text-secondary transition-colors py-1"
              >
                Labour Camp Wi-Fi
              </Link>
              <Link
                to="services"
                spy={true}
                smooth={true}
                duration={500}
                className="block hover:text-secondary transition-colors py-1"
              >
                Staff Accommodation Wi-Fi
              </Link>
              <Link
                to="services"
                spy={true}
                smooth={true}
                duration={500}
                className="block hover:text-secondary transition-colors py-1"
              >
                Electrical Works
              </Link>
              <Link
                to="services"
                spy={true}
                smooth={true}
                duration={500}
                className="block hover:text-secondary transition-colors py-1"
              >
                Time Attendance
              </Link>
              <Link
                to="services"
                spy={true}
                smooth={true}
                duration={500}
                className="block hover:text-secondary transition-colors py-1"
              >
                Networking & Telephone
              </Link>
              <Link
                to="services"
                spy={true}
                smooth={true}
                duration={500}
                className="block hover:text-secondary transition-colors py-1"
              >
                CCTV & Security
              </Link>
              <Link
                to="services"
                spy={true}
                smooth={true}
                duration={500}
                className="block hover:text-secondary transition-colors py-1"
              >
                Residential Design
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div className="sm:col-span-1 text-gray-300 lg:col-span-1 xl:col-span-1">
            <h2 className="font-[500] text-[18px] sm:text-lg mb-3 sm:mb-4">
              Tab-Deel
            </h2>
            <nav className="space-y-2 text-sm">
              <Link
                to="about"
                spy={true}
                smooth={true}
                duration={500}
                className="block hover:text-secondary transition-colors py-1"
              >
                About Us
              </Link>
              <Link
                to="services"
                spy={true}
                smooth={true}
                duration={500}
                className="block hover:text-secondary transition-colors py-1"
              >
                Our Services
              </Link>
              <Link
                to="doctors"
                spy={true}
                smooth={true}
                duration={500}
                className="block hover:text-secondary transition-colors py-1"
              >
                Our Team
              </Link>
              <Link
                to="about"
                spy={true}
                smooth={true}
                duration={500}
                className="block hover:text-secondary transition-colors py-1"
              >
                Portfolio
              </Link>
              <Link
                to="blogs"
                spy={true}
                smooth={true}
                duration={500}
                className="block hover:text-secondary transition-colors py-1"
              >
                Blog
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                duration={500}
                className="block hover:text-secondary transition-colors py-1"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Our Social Media */}
          <div className="sm:col-span-2 text-gray-300 lg:col-span-1 xl:col-span-1">
            <h2 className="text-gray-300 font-[500] text-[18px] sm:text-lg mb-3 sm:mb-4">
              Our Social Media
            </h2>
            <nav className="space-y-2 text-sm">
              {/* Instagram */}
              <a
                href="/"
                className="flex items-center hover:text-pink-500 transition-colors duration-300 group py-1"
              >
                <svg
                  className="w-4 h-4 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 4.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5-2a1 1 0 1 1 0 2a1 1 0 0 1 0-2z" />
                </svg>
                Instagram
              </a>

              {/* Facebook */}
              <a
                href="/"
                className="flex items-center hover:text-blue-600 transition-colors duration-300 group py-1"
              >
                <svg
                  className="w-4 h-4 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-2.9h2v-2.2c0-2 1.2-3.1 3-3.1c.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2v1.9h2.4l-.4 2.9h-2v7A10 10 0 0 0 22 12z" />
                </svg>
                Facebook
              </a>

              {/* LinkedIn */}
              <a
                href="/"
                className="flex items-center hover:text-blue-700 transition-colors duration-300 group py-1"
              >
                <svg
                  className="w-4 h-4 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-9.5 14v-7H7v7h2.5zm-1.2-8.1c.8 0 1.3-.5 1.3-1.2c0-.7-.5-1.2-1.2-1.2c-.7 0-1.3.5-1.3 1.2c0 .7.5 1.2 1.2 1.2zm9.2 8.1v-3.6c0-1.9-1-2.8-2.4-2.8c-1.1 0-1.6.6-1.9 1.1h-.1V10H11V17h2.4v-3.6c0-.2 0-.5.1-.7c.2-.5.6-.9 1.3-.9c.9 0 1.3.7 1.3 1.7V17H18z" />
                </svg>
                LinkedIn
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/7025715250"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-green-500 transition-colors duration-300 group py-1"
              >
                <svg
                  className="w-4 h-4 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.5 3.5a11.8 11.8 0 0 0-16.7 0a11.8 11.8 0 0 0-2.3 13.4L1 23l6.3-1.6a11.9 11.9 0 0 0 5.8 1.5c6.6 0 12-5.4 12-12c0-3.2-1.2-6.2-3.6-8.4zM12 20.3a9.3 9.3 0 0 1-4.7-1.3l-.3-.2l-3.7 1l1-3.6l-.2-.3a9.3 9.3 0 0 1 1.3-11.7a9.3 9.3 0 0 1 13.2 13.2a9.3 9.3 0 0 1-6.6 2.9zm5.2-6.8c-.3-.2-1.7-.9-2-1s-.5-.2-.7.2c-.2.3-.8 1-.9 1.1s-.3.2-.6 0s-1.2-.4-2.3-1.4c-.8-.7-1.4-1.5-1.6-1.8s0-.4.1-.6s.3-.4.4-.5c.2-.2.3-.3.4-.5s0-.4 0-.5s-.7-1.7-1-2.3c-.3-.7-.6-.6-.8-.6h-.6c-.2 0-.5.1-.7.3s-1 1-1 2.4s1 2.7 1.1 2.9s2.1 3.2 5.1 4.5c.7.3 1.2.5 1.6.6c.7.2 1.3.2 1.8.1c.6-.1 1.7-.7 1.9-1.3c.2-.6.2-1.1.2-1.3c0-.2-.3-.4-.6-.6z" />
                </svg>
                WhatsApp
              </a>
            </nav>
          </div>

          {/* Join a Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <h1 className="text-gray-300 font-[500] text-[18px] sm:text-lg mb-3 sm:mb-4">
              Join a Newsletter
            </h1>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-200 rounded-md h-12 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFCB05]"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-white px-4 py-2.5 rounded hover:bg- bg-gray-400 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-300">
          <p>
            ©  All Copyright 2024 by ZENEX
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-black px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 animate-fadeIn">
          <svg
            className="w-5 h-5 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-sm">Subscribed successfully!</span>
        </div>
      )}
    </>
  );
};

export default Footer;
