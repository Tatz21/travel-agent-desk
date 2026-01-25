import { useEffect, useRef } from "react";

import heroBackground from "@/assets/slider/hero-background.jpg";
import heroVideoFlight from "@/assets/slider/hero-video-flight.mp4";

interface HeroCarouselProps {
  children: React.ReactNode;
}

const HeroCarousel = ({ children }: HeroCarouselProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // autoplay blocked – safe ignore
    });
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background with Enhanced Transitions */}
      <video
        ref={videoRef}
        src={heroVideoFlight}
        poster={heroBackground}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      
      {/* Animated gradient overlay with pulse */}
      <div className="absolute inset-0 bg-gradient-to-b from-hero-overlay/40 via-hero-overlay/60 to-background/95 animate-pulse-slow" />
      
      {/* Main overlay */}
      <div className="absolute inset-0 bg-hero-overlay/60" />

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
