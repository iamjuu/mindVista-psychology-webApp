
import { useState, useRef } from "react";
import { BrainImage } from "../../../assets";
import AnimationText from "../../../animation/text";
import Button from "../button";
import { Link } from "react-router-dom";

const Index = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef(null);

  const handleMouseMove = (event) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rawDeltaX = (centerX - relativeX) / 10; // move opposite to cursor X
    const rawDeltaY = (centerY - relativeY) / 10; // move opposite to cursor Y
    const clampedX = Math.max(-30, Math.min(30, rawDeltaX));
    const clampedY = Math.max(-30, Math.min(30, rawDeltaY));
    setOffsetX(clampedX);
    setOffsetY(clampedY);
  };

  const handleMouseLeave = () => {
    setOffsetX(0);
    setOffsetY(0);
  };
  return (
    <div className="flex pb-10 w-full">
      <div className="max-w-7xl flex flex-col md:flex-row mx-auto">
        {/* Left Side - Text */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <div className="text-left p-6 md:p-8">
            <AnimationText
              text="AMC Contract For IT & Security Solutions."
              delay={150}
              animateBy="words"
              direction="top"
              className="text-xl sm:text-2xl md:text-3xl mb-6 md:mb-8"
            />
            <AnimationText
              text="Proffessionly optimize interdepent intellectual interoparable connect best practices. Progressively fabricate done."
              delay={80}
              animateBy="words"
              direction="top"
              className="text-base md:text-lg text-gray-600"
            />
          </div>

          <div className="w-full gap-5 flex">
            <Link to="/register">
              <Button className="bg-[#FFCB05] text-white">Register</Button>
            </Link>
            <Button className=" border border-[#FFCB05]">Contect us</Button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-0 relative"
        >
          {!imageLoaded && (
            <div className="absolute inset-0 m-0 rounded-lg bg-gray-200 animate-pulse" />
          )}
          <img
            src={BrainImage}
            alt="Background"
            onLoad={() => setImageLoaded(true)}
            className={`object-cover w-full h-auto max-h-[400px] md:max-h-full transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`, transition: "transform 60ms linear", willChange: "transform" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
