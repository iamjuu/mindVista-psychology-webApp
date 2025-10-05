import React from "react";
import { Pic1,Pic2,Pic3} from "../../../assets";

const index = () => {
  return (
    <div className="min-h-screen  py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Title - Centered */}
        <div
          className="text-center mb-12 lg:mb-16"
          data-aos="fade-down"
        ></div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <div
            className="flex flex-col justify-center space-y-6 lg:space-y-8"
            data-aos="fade-down"
          >
            <>

            <h1 className="text-[24px]">
            Support
Future-Driven Solutions
For Smarter, Safer Businesses
            </h1>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed">
                At Tabdeel, we go beyond solutions — shaping smarter, safer, and
                more connected spaces across the UAE. With affordable
                innovation, certified engineers, and faster service, we empower
                homes and businesses with electrical works, CCTV security, home
                automation, networking, and time-attendance systems. Our
                UAE-wide presence makes us the trusted partner for clients in
                Dubai, Sharjah, Abu Dhabi, and beyond.
              </p>
          
            </>
          </div>

          {/* Right Content - Images Grid */}
          <div className="relative" data-aos="fade-up">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 h-80 sm:h-96 lg:h-[28rem] xl:h-[32rem]">
              {/* Large Exterior Design Image - Bottom Left (spans 2 rows) */}
              <div className="row-span-2 col-span-1">
                <div className="relative h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-500">
                  <img
                    src={Pic1}
                    alt="Modern exterior design with contemporary architecture"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Bedroom Image - Top Right */}
              <div className="col-span-1">
                <div className="relative h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-500">
                  <img
                    src={Pic2}
                    alt="Elegant bedroom interior design"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Living Room Interior Design Image - Bottom Right */}
              <div className="col-span-1">
                <div className="relative h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-500">
                  <img
                    src={Pic3}
                    alt="Modern living room interior design"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
