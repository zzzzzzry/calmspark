import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { currentIndex, slides, nextSlide, prevSlide, setSlide } from '../stores/bgStore';

const base = '/calmspark';

export default function LandingHero() {
  const index = useStore(currentIndex);

  return (
    <div className="relative w-full h-[80vh] flex items-center justify-center select-none overflow-hidden">
      {/* Navigation Zones (Left/Right) - Only visible on Cover/Landing */}
      <div 
        className="absolute top-0 left-[-10vw] w-[20vw] h-full z-20 cursor-w-resize group flex items-center justify-start pl-4"
        onClick={prevSlide}
      >
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover:translate-x-0 bg-black/50 text-white p-3 rounded-full border border-white/20">
           <ChevronLeft size={28} />
        </div>
      </div>

      <div 
        className="absolute top-0 right-[-10vw] w-[20vw] h-full z-20 cursor-e-resize group flex items-center justify-end pr-4"
        onClick={nextSlide}
      >
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 bg-black/50 text-white p-3 rounded-full border border-white/20">
           <ChevronRight size={28} />
        </div>
      </div>

      {/* Content Layer */}
      <div className="z-20 flex flex-col justify-center items-center text-center px-4 w-full">
        <AnimatePresence mode='wait'>
          <motion.div
            key={index}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-4xl space-y-8"
          >
            <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl font-bold text-white tracking-[0.3em] uppercase drop-shadow-md"
            >
              {slides[index].subtitle}
            </motion.h2>
            <motion.h1 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter drop-shadow-2xl"
            >
              {slides[index].title}
            </motion.h1>
          </motion.div>
        </AnimatePresence>
        
        {/* Core Capabilities - 3 Keywords (Static for stability, or dynamic if needed) */}
        {/* <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4, duration: 0.8 }}
           className="mt-12 flex flex-wrap justify-center gap-4 md:gap-8"
        >
            {['全栈开发', 'UI 设计', '用户体验'].map((item, i) => (
                <div key={i} className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium tracking-wide shadow-lg">
                    {item}
                </div>
            ))}
        </motion.div> */}

        {/* CTA Buttons */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 flex flex-col sm:flex-row items-center gap-6"
        >
            <a 
                href={base + '/works'} 
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
                <span>查看代表作品</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a 
                href={base + '/resume'} 
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900/80 hover:bg-black border border-white/30 text-white rounded-full font-medium text-lg transition-all duration-300 hover:scale-105 hover:border-white/60"
            >
                <span>下载简历</span>
            </a>
        </motion.div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex justify-center gap-4 pb-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-500 backdrop-blur-sm ${
              i === index ? 'w-16 bg-white shadow-[0_0_10px_white]' : 'w-8 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
