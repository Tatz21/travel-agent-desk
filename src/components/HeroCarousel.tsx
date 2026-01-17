import { useState, useEffect, useCallback } from "react";

import heroHome from "@/assets/slider/hero-home.jpg";
import heroPartnershipnew from "@/assets/slider/hero-partnership-new.jpg";
import heroServiceDetail from "@/assets/slider/hero-service-detail.jpg";
import heroNetworkNew from "@/assets/slider/hero-network-new.jpg";
import heroOperationsNew from "@/assets/slider/hero-operations-new.jpg";

const slides = [
  {
    image: heroHome,
    alt: "Scenic travel destination with mountains and lake",
  },
  {
    image: heroOperationsNew,
    alt: "Efficient travel operations management",
  },
  {
    image: heroPartnershipnew,
    alt: "B2B travel business partnership meeting",
  },
  {
    image: heroServiceDetail,
    alt: "Personalized travel service details",
  },
  {
    image: heroNetworkNew,
    alt: "Expansive travel network map",
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
