
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {Link} from "react-router-dom";
import Button from "../button";
import { Menu, X, Phone } from "lucide-react"; // Import Lucide icons
// import { Logo } from "../../public/assets";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#solution", label: "Solution" },
  { href: "#project", label: "Projects" },
  { href: "#blog", label: "Blog" },
  { href: "#about", label: "About" },
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
            {/* <Link href="/" className="flex items-center">
              <img
                data-aos="fade-up"
                data-aos-delay={100}
                src={}
                alt="logo"
                className="w-36 h-36"
                width={198}
                height={72}
              />
            </Link> */}
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-[72px]">
            {navLinks.map((link, index) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative text-[14px] font-medium duration-700 delay-200 hover:text-[#FFCB05] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#FFCB05] after:content-[''] after:transition-transform after:duration-300 hover:after:scale-x-100"
                data-aos="flip-down"
                data-aos-delay={index * 400}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Contact Button */}
          <div
            className="hidden md:flex  items-center"
            data-aos="flip-up"
            data-aos-delay={1000}
          >
            <Button
              href="#contact"
              className="flex items-center px-4 py-1  border-[#FFCB05] border rounded-[8px] text-gray-700 hover:[#FFCB05] font-medium transition-all duration-200"
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
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center hover:text-[#FFCB05] space-x-3 px-3 py-2 rounded-md text-[12px] font-medium text-gray-700"
                  data-aos="flip-down"
                  data-aos-delay={index * 100}
                >
                  <span>{link.label}</span>
                </Link>
              ))}
              <Link
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#FFCB05] hover:bg-gray-50 transition-all duration-500 ease-in-out delay-100 hover:scale-105 hover:shadow-sm"
                data-aos="flip-down"
              >
                <Phone color="black" className="w-5 h-5" />
                <span>Contact Us</span>
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
