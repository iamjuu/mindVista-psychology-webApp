import { Consulting, Medition, Psychologist } from "../../../assets";

const Index = () => {
  return (
    <div className="  pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Title - Centered */}
        <div className="text-center mb-12 lg:mb-16" data-aos="fade-down"></div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <div
            className="flex flex-col justify-center space-y-6 lg:space-y-8"
            data-aos="fade-down"
          >
            <>
              <h1 className="text-4xl">
              Rooted in care, powered by connection.

              </h1>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed">
            In Kerala, wellness has always been more than just
                health — it’s harmony of the body, mind, and spirit. At Sthithi,
                we reimagine that harmony for today’s world — blending
                traditional values of empathy with modern psychological science.
              </p>
            <h1 className="text-2xl text-blue-400">   How It Works?</h1>
            <p className="text-gray-600">Three steps to your calm.</p>
            <ul className="space-y-4  text-gray-600  sm:text-lg">
              <li  className="text-xl">
                <strong className="text-gray-800 ">Explore</strong> – Choose from verified psychologists trained in emotional, behavioral, and mindfulness therapy.
              </li>
              <li className="text-xl">
                <strong className="text-gray-800">Book</strong> – Schedule your online session at your time, in your language.
              </li>
              <li className="text-xl">
                <strong className="text-gray-800">Begin</strong> – A confidential video or audio talk — where you can finally let your thoughts flow.
              </li>
            </ul>
            </>
          </div>

          {/* Right Content - Images Grid */}
          <div className="relative " data-aos="fade-up">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {/* Large Image Left (2 rows) */}
              <div className="row-span-2 col-span-1">
                <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-500 aspect-[4/5]">
                  <img
                    src={Consulting}
                    alt="Modern exterior design with contemporary architecture"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Right Column - 2 stacked images */}
              <div className="col-span-1 flex flex-col gap-3 sm:gap-4 lg:gap-6">
                {/* Top Right */}
                <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-500 flex-1 aspect-[16/9]">
                  <img
                    src={Medition}
                    alt="Elegant bedroom interior design"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>

                {/* Bottom Right */}
                <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-500 flex-1 aspect-[16/9]">
                  <img
                    src={Psychologist}
                    alt="Modern living room interior design"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-red-100 w-full">
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
