import { useEffect, useState } from "react";
import {  PLaceHolderMen, PlaceHolderWomen } from "../../../assets";
import apiInstance from "../../../instance";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50 lg:px-32 px-5">
      <div className="mb-12">
        <h2 className="text-xl lg:text-xl font-bold text-gray-900 ">Our Doctors</h2>
        <p className="text-gray-600 text-md">Meet our experienced team of healthcare professionals</p>
      </div>

      <div className="w-full">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading doctors...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : doctors.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No doctors available right now.</div>
        ) : (
          <div className="max-h-[1000px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {doctors.map((e, index) => {
                const imageUrl = e?.profilePicture
                  ? `${apiInstance.defaults.baseURL}/${e.profilePicture.replace(/^\//, "")}`
                  : null;
                const fallbackImg = e?.gender?.toLowerCase() === "female" ? PlaceHolderWomen : PLaceHolderMen;
                return (
                  <div key={index} className="w-full  flex items-center justify-center">
                    <div className="h-[280px] flex flex-col text-black rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden group">
                      <div className="h-56  overflow-hidden flex items-center justify-center">
                        <img
                          src={imageUrl || fallbackImg}
                          alt={e?.name || "Doctor"}
                          className="w-36 object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(evt) => {
                            evt.currentTarget.src = fallbackImg;
                          }}
                        />
                      </div>
                      <div className="flex flex-col justify-center items-center p-6 flex-1">
                        <h1 className="font-bold text-xl text-gray-900 text-center">{e?.name || "Unnamed Doctor"}</h1>
                        <h3 className="pt-3 text-gray-600 text-center text-base font-medium">{e?.specialization || "General"}</h3>
                        <div className="mt-4 w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
