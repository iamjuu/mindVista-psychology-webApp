import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {  PLaceHolderMen, PlaceHolderWomen } from "../../../assets";
import { PageHeader } from "../../core/cardHeader";
import apiInstance from "../../../instance";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const slider = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDoctors = async () => {
      try {
        const res = await apiInstance.get("/doctors");
        if (isMounted) {
          setDoctors(Array.isArray(res?.data?.doctors) ? res.data.doctors : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || "Failed to load doctors");
          console.error("Error fetching doctors:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDoctors();
    return () => {
      isMounted = false;
    };
  }, []);

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
    <div className="pt-[130px] flex flex-col lg:px-32 px-5">
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
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading doctors...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : doctors.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No doctors available right now.</div>
        ) : (
          <Slider ref={slider} className="" {...settings}>
            {doctors.map((e, index) => {
              const imageUrl = e?.profilePicture
                ? `${apiInstance.defaults.baseURL}/${e.profilePicture.replace(/^\//, "")}`
                : null;
              const fallbackImg = e?.gender?.toLowerCase() === "female" ? PlaceHolderWomen : PLaceHolderMen;
              return (
                <div key={index} className="px-2">
                  <div className="h-[380px] py-5 flex flex-col text-black rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] cursor-pointer hover:shadow-[rgba(0,_0,_0,_0.35)_0px_5px_15px] transition-all duration-300 bg-white">
                    <img
                      src={imageUrl || fallbackImg}
                      alt={e?.name || "Doctor"}
                      className="h-56 rounded-t-xl w-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(evt) => {
                        evt.currentTarget.src = fallbackImg;
                      }}
                    />
                    <div className="flex flex-col justify-center items-center p-4">
                      <h1 className="font-semibold text-xl pt-2 text-gray-800 text-center">{e?.name || "Unnamed Doctor"}</h1>
                      <h3 className="pt-2 text-gray-600 text-center text-sm font-medium">{e?.specialization || "General"}</h3>
                      <div className="mt-3 w-12 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default Doctors;
