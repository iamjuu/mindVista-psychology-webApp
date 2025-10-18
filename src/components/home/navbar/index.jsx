
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
// Removed react-router Link for in-page hash navigation
import Button from "../button";
import { Menu, X, Phone } from "lucide-react"; // Import Lucide icons
import { MindvistaLogo } from "../../../assets";
import { Link } from "react-router-dom";

const ButtonBorderColor="300-primary"

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#Doctors", label: "Doctors" },
  { href: "#Services", label: "Services" },
  { href: "#Reviews", label: "Reviews" },
  { href: "https://wa.me/7025715250", label: "Contect" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);

  return (
    <header className=" z-50 w-full bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex">
            <Link href="/" className="flex items-center">
              <img
                data-aos="fade-up"
                data-aos-delay={100}
                src={MindvistaLogo}
                alt="logo"
                className="w-20 "
                width={198}
                height={72}
              />
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-[72px]">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="relative text-[14px] font-medium duration-700 delay-200 hover:text-primary-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-primary-300 after:content-[''] after:transition-transform after:duration-300 hover:after:scale-x-100"
                data-aos="flip-down"
                data-aos-delay={index * 400}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Contact Button */}
          <div
            className="hidden md:flex  items-center"
            data-aos="flip-up"
            data-aos-delay={1000}
          >
            <Button
              as="a"
              href="https://wa.me/7025715250"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center px-4 py-1 border border-primary-300 rounded-[8px] text-gray-700 hover:text-white font-medium transition-all duration-200`}
            >
              Contact Us
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-[8px] text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X color="black" className="h-6 w-6" />
              ) : (
                <Menu color="black" className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop overlay with blur */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="md:hidden bg-white border-t border-gray-100 fixed top-4 left-0 w-full shadow-lg z-50">
            {/* Close button at the top */}
            <div className="flex justify-end border-b border-gray-100">
              <Button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-[8px] text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <X color="black" className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-2 px-4 pt-2 pb-4">
              {navLinks.map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center hover:text-primary-300 space-x-3 px-3 py-2 rounded-md text-[12px] font-medium text-gray-700"
                  data-aos="flip-down"
                  data-aos-delay={index * 100}
                >
                  <span>{link.label}</span>
                </a>
              ))}
              <a
                href="https://wa.me/7025715250"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-300 hover:bg-gray-50 transition-all duration-500 ease-in-out delay-100 hover:scale-105 hover:shadow-sm"
                data-aos="flip-down"
              >
                <Phone color="black" className="w-5 h-5" />
                <span>Contact Us</span>
              </a>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
