import { useState, useRef, useEffect } from "react";
import { PLaceHolderMen } from "../../../assets";

const Carousel = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const containerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const openModal = (item) => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);

  // Duplicate items for seamless infinite effect
  const extendedItems = [...items, ...items, ...items];
  const middleIndex = items.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const itemWidth = container.scrollWidth / extendedItems.length;
    container.scrollLeft = itemWidth * middleIndex;

    let scrollSpeed = 0.5; // adjust speed here
    let animationFrameId;

    const autoScroll = () => {
      if (!isHovering) {
        container.scrollLeft += scrollSpeed;
        // Reset to middle for infinite effect
        if (
          container.scrollLeft >=
          container.scrollWidth - itemWidth * (middleIndex + 1)
        ) {
          container.scrollLeft = itemWidth * middleIndex;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovering, items.length]);

  return (
    <>
      <div
        ref={containerRef}
        className="overflow-x-auto max-w-3xl mx-auto flex gap-5 py-5 scrollbar-hide"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {extendedItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between rounded-xl border border-[#FFCB05] p-5 shadow-sm transition-shadow hover:shadow-md min-w-[350px]"
            data-aos="fade-up"
            data-aos-delay={index * 150}
          >
            {/* ---- Card Header ---- */}
            <div className="flex flex-col items-center gap-2 justify-center w-full">
              <img
                className="w-16 h-16 rounded-full object-cover"
                src={PLaceHolderMen}
                alt={`${item.name} - ${item.title}`}
              />
              <p className="font-semibold text-gray-800">{item.name}</p>
            </div>

            {/* ---- Card Body ---- */}
            <div className="flex flex-col gap-2 mt-2 flex-grow">
              <p className="text-gray-600 text-sm line-clamp-4 whitespace-pre-line">
                {item.description}
              </p>

              {item.description?.length > 100 && (
                <button
                  onClick={() => openModal(item)}
                  className="text-[#FFCB05] text-sm font-medium hover:underline self-start"
                >
                  See more
                </button>
              )}
            </div>

            {/* ---- Card Footer (Rating) ---- */}
            {item.rating && (
              <div className="mt-auto flex justify-end items-center text-yellow-500">
                <span className="text-lg">{item.rating}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ---- Modal ---- */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4">
          <div className="bg-white max-w-3xl w-full max-h-[500px] overflow-y-auto rounded-t-2xl shadow-2xl p-6 relative animate-slide-up">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
            >
              &times;
            </button>

            <div className="flex flex-col items-center justify-center mb-5">
              <img
                className="w-24 h-24 rounded-full object-cover mb-3"
                src={PLaceHolderMen}
                alt={selectedItem.name}
              />
              <h2 className="text-2xl font-semibold text-[#FFCB05]">
                {selectedItem.name}
              </h2>
              <p className="text-gray-600">{selectedItem.title}</p>
            </div>

            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {selectedItem.description}
            </p>

            {selectedItem.rating && (
              <p className="text-yellow-500 font-medium mt-4">
                Rating: {selectedItem.rating}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Carousel;
