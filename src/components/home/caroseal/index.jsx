'use client'

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {PLaceHolderMen, PlaceHolderWomen} from '../../../assets'
import { PageHeader } from '../../core/cardHeader';

const Carousel = ({ items }) => {
  const containerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    AOS.refresh();

    const scrollSpeed = 1; // pixels per frame
    let animationFrame;

    const scroll = () => {
      if (containerRef.current && !isHovering) {
        const container = containerRef.current;

        // If at the end, reset back to start
        if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += scrollSpeed;
        }
      }
      animationFrame = requestAnimationFrame(scroll);
    };

    scroll();

    return () => cancelAnimationFrame(animationFrame);
  }, [isHovering]);

  return (
    <div
      className="overflow-x-auto flex gap-5 py-5 scrollbar-hide"
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-end rounded-xl border border-[#FFCB05] p-5 shadow-sm transition-shadow hover:shadow-md min-w-[350px]"
          data-aos="fade-up"
          data-aos-delay={index * 150}
        >
          <div className="flex flex-col items-center justify-center w-full">
            <img
              className="w-20 h-20 rounded-full object-cover"
              src={PLaceHolderMen}
              alt={`${item.name} - ${item.title}`}
            />
            <PageHeader title={item.name} />
          </div>
          <div className="flex  w-full flex-col gap-2">

            <PageHeader
            title={item.title}
            description={item.description}
            />
            {item.rating && <p className="text-yellow-500">{item.rating}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;

Carousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      rating: PropTypes.string,
    })
  ).isRequired,
};
