import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import heroB2BPartnership from "@/assets/slider/hero-b2b-partnership.jpg";
import heroGlobalNetwork from "@/assets/slider/hero-global-network.jpg";
import heroTravelOperations from "@/assets/slider/hero-travel-operations.jpg";
import heroBusinessTravel from "@/assets/slider/hero-business-travel.jpg";

const slides = [
  {
    image: heroB2BPartnership,
    alt: "B2B travel business partnership meeting",
  },
  {
    image: heroGlobalNetwork,
    alt: "Global travel network connections",
  },
  {
    image: heroTravelOperations,
    alt: "Travel agency operations center",
  },
  {
    image: heroBusinessTravel,
    alt: "Premium business travel experience",
  },
];

interface HeroCarouselProps {
  children: React.ReactNode;
}

const HeroCarousel = ({ children }: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.image} alt={slide.alt} className="h-full w-full object-cover" />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-background/60" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center pt-20 md:pt-24 pb-32">
        {children}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroCarousel;
