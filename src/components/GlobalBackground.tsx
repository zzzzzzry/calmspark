import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { currentIndex, slides, nextSlide, isPaused } from '../stores/bgStore';

export default function GlobalBackground() {
  const index = useStore(currentIndex);
  const paused = useStore(isPaused);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused) {
        nextSlide();
      }
    }, 60000); // Slower for global bg
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div className="fixed inset-0 w-full h-full -z-50 bg-black select-none pointer-events-none">
      <AnimatePresence initial={false} mode='wait'>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={slides[index].image}
            alt="Background"
            className="w-full h-full object-cover"
            style={{ objectPosition: slides[index].position }}
          />
          {/* Global Overlay - Adjust opacity as needed */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
