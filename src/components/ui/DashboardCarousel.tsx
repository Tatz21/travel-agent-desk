import React, { useEffect, useState } from "react";

const DashboardCarousel: React.FC = () => {
  const slides = [
    "/k.jpg",
    "/k2.jpg",
    "/goa.jpg",
    "/rajasthan.jpg",
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="relative w-full mx-auto overflow-hidden rounded-lg shadow-lg">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Prev button */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-800/60 hover:bg-gray-800 text-white px-3 py-2 rounded-full"
      >
        ‹
      </button>

      {/* Next button */}
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-800/60 hover:bg-gray-800 text-white px-3 py-2 rounded-full"
      >
        ›
      </button>

    </div>
  );
};

export default DashboardCarousel;

