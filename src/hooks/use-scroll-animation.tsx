import { useEffect, useRef, useState, useCallback } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = "0px", once = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
};

// Hook for multiple refs with staggered animations
export const useStaggeredAnimation = (itemCount: number, options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = "0px" } = options;
  const containerRef = useRef<HTMLElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the visibility of each item
          visibleItems.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, index * 100);
          });
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, itemCount]);

  return { containerRef, visibleItems };
};

// Animation class helper for staggered children
export const getStaggeredDelay = (index: number, baseDelay = 100) => ({
  transitionDelay: `${index * baseDelay}ms`,
});

// Enhanced animation classes with more variety
export const animationClasses = {
  // Basic animations
  fadeUp: (isVisible: boolean) =>
    `transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
  fadeDown: (isVisible: boolean) =>
    `transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`,
  fadeIn: (isVisible: boolean) =>
    `transition-all duration-700 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`,
  scaleIn: (isVisible: boolean) =>
    `transition-all duration-500 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`,
  scaleUp: (isVisible: boolean) =>
    `transition-all duration-600 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`,
  
  // Slide animations
  slideInLeft: (isVisible: boolean) =>
    `transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`,
  slideInRight: (isVisible: boolean) =>
    `transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`,
  
  // Blur animations
  blurIn: (isVisible: boolean) =>
    `transition-all duration-700 ease-out ${isVisible ? "opacity-100 blur-0" : "opacity-0 blur-sm"}`,
  blurUp: (isVisible: boolean) =>
    `transition-all duration-700 ease-out ${isVisible ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-sm translate-y-6"}`,
  
  // Rotation animations
  rotateIn: (isVisible: boolean) =>
    `transition-all duration-700 ease-out ${isVisible ? "opacity-100 rotate-0" : "opacity-0 rotate-6"}`,
  flipIn: (isVisible: boolean) =>
    `transition-all duration-700 ease-out ${isVisible ? "opacity-100 rotateX-0" : "opacity-0 rotateX-90"}`,
  
  // Combined animations
  zoomFade: (isVisible: boolean) =>
    `transition-all duration-800 ease-out ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`,
  slideBlur: (isVisible: boolean) =>
    `transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-x-0 blur-0" : "opacity-0 -translate-x-8 blur-[2px]"}`,
  popIn: (isVisible: boolean) =>
    `transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`,
  
  // Bounce effect
  bounceIn: (isVisible: boolean) =>
    `transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`,
};

// Utility to combine animation classes
export const combineAnimations = (...classes: string[]) => classes.join(" ");

// Get animation variant based on index for variety
export const getVariedAnimation = (index: number, isVisible: boolean) => {
  const variants = [
    animationClasses.fadeUp,
    animationClasses.blurUp,
    animationClasses.scaleIn,
    animationClasses.zoomFade,
  ];
  return variants[index % variants.length](isVisible);
};
