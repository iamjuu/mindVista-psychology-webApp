import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {  PLaceHolderMen, PlaceHolderWomen } from "../../../assets";
import { PageHeader } from "../../core/cardHeader";

const Doctors = () => {
  const data = [
    { img: PLaceHolderMen, name: "Dr. Sarah Williams", specialties: "Interior Design Specialist" },
    { img: PlaceHolderWomen, name: "Dr. Michael Chen", specialties: "Space Planning Expert" },
    { img: PLaceHolderMen, name: "Dr. Emma Thompson", specialties: "Color & Texture Consultant" },
    { img: PlaceHolderWomen, name: "Dr. James Rodriguez", specialties: "Lighting Design Professional" },
    { img: PLaceHolderMen, name: "Dr. Lisa Anderson", specialties: "Furniture & Decor Specialist" },
    { img: PlaceHolderWomen, name: "Dr. David Park", specialties: "Modern Interior Architect" },
  ];

  const slider = useRef(null);

  const settings = {
    accessibility: true,
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true, dots: true } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="py-[130px] flex flex-col lg:px-32 px-5">
      <div className="flex flex-col items-center lg:flex-row justify-between mb-10 lg:mb-0">

        <div className="w-full ">
          <PageHeader
          title="Doctors"
          />

        </div>
        <div className="flex gap-5 mt-4 lg:mt-0">
          <button
            className="border border-gray-300 font-[200] text-black p-3 rounded-full"
            onClick={() => slider.current.slickPrev()}
          >
            <FaArrowLeft size={14} />
          </button>
          <button
            className="border border-gray-300 font-[200] text-black p-3 rounded-full"
            onClick={() => slider.current.slickNext()}
          >
            <FaArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="mt-5  w-full">
        <Slider ref={slider} className="" {...settings}>
          {data.map((e, index) => (
            <div key={index} className="px-2">
              <div className="h-[380px] py-5 flex flex-col text-black rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] cursor-pointer hover:shadow-[rgba(0,_0,_0,_0.35)_0px_5px_15px] transition-all duration-300 bg-white">
                <img
                  src={e.img}
                  alt={e.name}
                  className="h-56 rounded-t-xl w-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="flex flex-col justify-center items-center p-4">
                  <h1 className="font-semibold text-xl pt-2 text-gray-800 text-center">{e.name}</h1>
                  <h3 className="pt-2 text-gray-600 text-center text-sm font-medium">{e.specialties}</h3>
                  <div className="mt-3 w-12 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Doctors;
