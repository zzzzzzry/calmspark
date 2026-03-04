import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, ArrowRight, Image as ImageIcon, BookOpen, Code, Coffee, PenTool } from 'lucide-react';

// Types
interface WorkItem {
  id: string;
  type: 'blog' | 'gallery';
  title: string;
  desc: string;
  image: string;
  category: string; // 'tech', 'life', 'writing', 'photo'
  date?: Date;
  link?: string;
  tags?: string[];
  size?: 'normal' | 'wide' | 'tall' | 'large'; // Bento Grid sizes
}

interface WorksGridProps {
  items: WorkItem[];
}

const CATEGORIES = [
  { id: 'all', label: '全部', icon: BookOpen },
  { id: 'tech', label: '技术', icon: Code },
  { id: 'life', label: '生活', icon: Coffee },
  { id: 'writing', label: '文案', icon: PenTool },
  { id: 'photo', label: '摄影', icon: ImageIcon },
];

export const WorksGrid: React.FC<WorksGridProps> = ({ items }) => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return items;
    return items.filter(item => item.category === activeTab);
  }, [items, activeTab]);

  // Chunk items into groups of 4 for the layout pattern
  const chunks = useMemo(() => {
    const result = [];
    for (let i = 0; i < filteredItems.length; i += 4) {
      result.push(filteredItems.slice(i, i + 4));
    }
    return result;
  }, [filteredItems]);

  // Helper to determine class based on index in chunk (0-3)
  const getItemClass = (indexInChunk: number) => {
    // 0: Large Square (Left) -> col-span-2 row-span-2
    // 1: Small Square (Right Top Left) -> col-span-1 row-span-1
    // 2: Small Square (Right Top Right) -> col-span-1 row-span-1
    // 3: Wide Rectangle (Right Bottom) -> col-span-2 row-span-1
    
    // Mobile: All col-span-1 aspect-square (or tailored)
    // Desktop:
    switch (indexInChunk) {
      case 0: return 'md:col-span-2 md:row-span-2 aspect-square md:aspect-square';
      case 1: return 'md:col-span-1 md:row-span-1 aspect-square';
      case 2: return 'md:col-span-1 md:row-span-1 aspect-square';
      case 3: return 'md:col-span-2 md:row-span-1 aspect-[2/1]';
      default: return 'col-span-1 aspect-square';
    }
  };

  return (
    <div className="w-full space-y-24">
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`
                relative px-5 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white border border-white/20'
                }
              `}
            >
              <Icon size={16} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid Chunks */}
      <div className="flex flex-col gap-32">
        <AnimatePresence mode="popLayout">
          {chunks.map((chunk, chunkIndex) => (
            <motion.div
              key={chunkIndex}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-[1400px] mx-auto"
            >
              {chunk.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={`
                    group relative overflow-hidden rounded-3xl bg-neutral-900/50 shadow-2xl
                    ${getItemClass(index)}
                  `}
                >
                  {/* Link Overlay */}
                  {item.link && (
                    <a 
                      href={item.link}
                      className="absolute inset-0 z-30"
                      aria-label={`View ${item.title}`}
                    />
                  )}

                  {/* Image - Full Bleed */}
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="flex items-center gap-3 text-white/70 text-xs font-medium mb-2 uppercase tracking-wider">
                         <span>{CATEGORIES.find(c => c.id === item.category)?.label || item.category}</span>
                      </div>
                      <h3 className="font-bold text-xl md:text-2xl leading-tight text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
