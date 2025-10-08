"use client";
import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { MindvistaLogo } from "../../../assets";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const onToast = () => {
      setShowToast(true);
      const timeoutId = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timeoutId);
    };
    window.addEventListener("app:toast", onToast);
    return () => window.removeEventListener("app:toast", onToast);
  }, []);

  return (
    <>
      <div className="w-full bg-white text-black mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">

          {/* Company Information */}
          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <div className="flex items-center justify-center sm:mb-6">
              <img src={MindvistaLogo} alt="MindEase Logo" className="w-20" />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <svg className="w-4 h-4 text-secondary mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>123 Serenity Avenue, Kannur, Kerala, India</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-secondary mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>support@mindtherapy.com</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-secondary mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="sm:col-span-1 text-black lg:col-span-1 xl:col-span-1">
            <h2 className="font-[500] text-[18px] sm:text-lg mb-3 sm:mb-4">Services</h2>
            <nav className="space-y-2 text-sm">
              <Link to="services" smooth duration={500} className="block hover:text-secondary transition-colors py-1">
                Online Therapy
              </Link>
              <Link to="services" smooth duration={500} className="block hover:text-secondary transition-colors py-1">
                Child Counseling
              </Link>
              <Link to="services" smooth duration={500} className="block hover:text-secondary transition-colors py-1">
                Relationship Therapy
              </Link>
              <Link to="services" smooth duration={500} className="block hover:text-secondary transition-colors py-1">
                Stress Management
              </Link>
              <Link to="services" smooth duration={500} className="block hover:text-secondary transition-colors py-1">
                Career Guidance
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div className="sm:col-span-1 text-black lg:col-span-1 xl:col-span-1">
            <h2 className="font-[500] text-[18px] sm:text-lg mb-3 sm:mb-4">MindEase</h2>
            <nav className="space-y-2 text-sm">
              <Link to="about" smooth duration={500} className="block hover:text-secondary transition-colors py-1">
                About Us
              </Link>
              <Link to="therapists" smooth duration={500} className="block hover:text-secondary transition-colors py-1">
                Our Therapists
              </Link>
              <Link to="blogs" smooth duration={500} className="block hover:text-secondary transition-colors py-1">
                Mental Health Blog
              </Link>
              <Link to="contact" smooth duration={500} className="block hover:text-secondary transition-colors py-1">
                Contact Us
              </Link>
            </nav>
          </div>

      {/* Social Media */}
<div className="sm:col-span-2 text-black lg:col-span-1 xl:col-span-1">
  <h2 className="text-black font-[500] text-[18px] sm:text-lg mb-3 sm:mb-4">Follow Us</h2>
  <nav className="space-y-2 text-sm">
    <a href="/" className="flex items-center hover:text-pink-500 transition-colors duration-300 group py-1">
      <Instagram className="w-4 h-4 mr-3" />
      Instagram
    </a>
    <a href="/" className="flex items-center hover:text-blue-600 transition-colors duration-300 group py-1">
      <Facebook className="w-4 h-4 mr-3" />
      Facebook
    </a>
    <a href="/" className="flex items-center hover:text-blue-700 transition-colors duration-300 group py-1">
      <Linkedin className="w-4 h-4 mr-3" />
      LinkedIn
    </a>
  </nav>
</div>


          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <h1 className="text-black font-[500] text-[18px] sm:text-lg mb-3 sm:mb-4">Join Our Newsletter</h1>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-black mb-2">Your Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-200 rounded-md h-12 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFCB05]"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-black border  px-4 py-2.5 rounded-xl hover:bg-gray-400 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
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
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-black">
          <p>© 2024 Mindvista. All Rights Reserved.</p>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-black px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 animate-fadeIn">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm">Subscribed successfully!</span>
        </div>
      )}
    </>
  );
};

export default Footer;
