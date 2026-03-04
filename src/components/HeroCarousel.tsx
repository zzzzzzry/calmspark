import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroImage {
  src: string;
  position?: string;
}

interface HeroCarouselProps {
  images: (string | HeroImage)[];
  autoplay?: boolean;
  interval?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ images, autoplay = true, interval = 5000 }) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to get image source
  const getImageSrc = (img: string | HeroImage) => typeof img === 'string' ? img : img.src;
  
  // Helper to get image position
  const getImagePos = (img: string | HeroImage) => typeof img === 'string' ? 'center' : (img.position || 'center');

  // Preload next image only (Performance Optimization)
  useEffect(() => {
    const nextIndex = (index + 1) % images.length;
    const img = new Image();
    img.src = getImageSrc(images[nextIndex]);
  }, [index, images]);

  // Visibility Detection (Stop autoplay when scrolled away)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // Autoplay Logic
  useEffect(() => {
    if (!autoplay || isPaused || !isVisible) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, images.length, isPaused, isVisible]);

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImg = images[index];

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden z-0 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Images */}
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
           <img 
             src={getImageSrc(currentImg)} 
             alt="Hero Background" 
             className="w-full h-full object-cover"
             style={{ objectPosition: getImagePos(currentImg) }}
           />
        </motion.div>
      </AnimatePresence>

      {/* Overlay for text readability - Adjust opacity as needed */}
      <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-[1px] transition-colors duration-500" />

      {/* Navigation Zones */}
      {/* Left Zone - 25% width */}
      <div 
        className="absolute top-0 left-0 w-1/4 h-full cursor-w-resize group flex items-center justify-start pl-6 z-10"
        onClick={prev}
        aria-label="Previous image"
      >
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover:translate-x-0 bg-white/10 dark:bg-black/30 text-primary-900 dark:text-white p-3 rounded-full backdrop-blur-md border border-white/20">
           <ChevronLeft size={28} />
        </div>
      </div>

      {/* Right Zone - 25% width */}
      <div 
        className="absolute top-0 right-0 w-1/4 h-full cursor-e-resize group flex items-center justify-end pr-6 z-10"
        onClick={next}
        aria-label="Next image"
      >
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 bg-white/10 dark:bg-black/30 text-primary-900 dark:text-white p-3 rounded-full backdrop-blur-md border border-white/20">
           <ChevronRight size={28} />
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index 
                ? 'w-8 bg-primary-600 dark:bg-white' 
                : 'w-2 bg-primary-300/50 dark:bg-white/30 hover:bg-primary-500/50 dark:hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
