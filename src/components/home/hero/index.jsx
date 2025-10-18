import { useState, useRef } from "react";
import { BrainImage,BackgroundImage, Manstha } from "../../../assets";
import AnimationText from "../../../animation/text";
import Button from "../button";
import { Link } from "react-router-dom";

const Index = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Move opposite to cursor direction
    const rawX = (centerX - relativeX) / 10;
    const rawY = (centerY - relativeY) / 10;

    // Clamp movement to avoid extreme shifts
    const x = Math.max(-30, Math.min(30, rawX));
    const y = Math.max(-30, Math.min(30, rawY));

    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
    // style={
    //   {
    //     backgroundImage: `url(${BackgroundImage})`,
    //     backgroundPosition: "center",
    //     backgroundSize: "cover",
    //     backgroundRepeat: "no-repeat",
    //     backgroundAttachment: "fixed",
    //   }
    // }
    className="flex justify-center w-full">
      <div className="max-w-7xl flex flex-col md:flex-row">
        {/* Left Side - Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <div className="text-left p-6 md:p-8">
            <AnimationText
              text="Find your balance within."
              delay={150}
              animateBy="words"
              direction="top"
              className="text-xl sm:text-2xl md:text-4xl mb-6 md:mb-8"
            />
            <AnimationText
              text="Kerala’s trusted online therapy platform — connecting you to certified psychologists in English and Malayalam.Healing begins with one conversation."
              delay={80}
              animateBy="words"
              direction="top"
              className="text-base md:text-lg text-gray-600"
            />
          </div>

          <div className="w-full flex gap-5">
            <Link to="/register">
              <Button className="bg-primary-300 text-white">Register</Button>
            </Link>
            <Button
              as="a"
              href="https://wa.me/7025715250"
              target="_blank"
              className="border border-primary-300"
            >
              Contact Us
            </Button>
          </div>
        </div>

        {/* Right Side - Floating Image */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full md:w-1/2 flex items-center justify-center relative"
        >
          {!imageLoaded && (
            <div className="absolute inset-0 m-0 rounded-lg bg-gray-200 animate-pulse" />
          )}
          <img
            src={Manstha}
            alt="Background"
            onLoad={() => setImageLoaded(true)}
            className={`object-contain w-[350px]  transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
              transition: "transform 60ms linear",
              willChange: "transform",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
