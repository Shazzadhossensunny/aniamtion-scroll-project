import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const clients = [
  'DRAKE', 'BAD BUNNY', 'LINKIN PARK', 'PESO PLUMA', 'KENDRICK LAMAR',
  'EVERYTHING ALWAYS', 'RAUW ALEJANDRO', 'TRAVIS SCOTT', 'BABY KEEM',
  'REDBULL', 'ROSALIA', 'BACARDI'
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Start at index 0
  const controls = useAnimation();
  const containerRef = useRef(null);

  // Ensure 0th index is selected on load
  useEffect(() => {
    setCurrentIndex(0);
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { top, height } = containerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY + window.innerHeight;
      const containerStart = window.scrollY + top;
      const containerEnd = containerStart + height;

      // Calculate scroll progress relative to the container
      const scrollProgress = Math.min(
        (scrollY - containerStart) / (containerEnd - containerStart),
        1
      );

      // Determine the new index based on scroll progress
      const newIndex = Math.floor(scrollProgress * clients.length);

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < clients.length) {
        setCurrentIndex(newIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentIndex]);

  // Handle animations
  useEffect(() => {
    controls.start(i => {
      const offset = i - currentIndex;
      const isCurrent = offset === 0;
      const isVisible = offset >= -2 && offset <= 2; // Show current and nearby clients
      const shouldHide = i < currentIndex - 2 || i > currentIndex + 2; // Hide clients outside range

      return {
        opacity: shouldHide ? 0 : 1,
        y: offset * 60, // Adjust vertical spacing for visibility
        scale: isCurrent ? 1.2 : 1, // Scale the current client slightly larger
        color: isCurrent ? '#000' : '#999', // Dark color for current, lighter for others
        transition: { duration: 0.5, ease: 'easeInOut' }
      };
    });
  }, [currentIndex, controls]);

  return (
    <div ref={containerRef} className="min-h-[400vh] w-full bg-gray-100 relative">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4">
        {/* Header */}
        <h2 className="absolute top-8 left-1/2 transform -translate-x-1/2 text-sm md:text-lg uppercase">
          ▼ Featured Clients
        </h2>

        {/* Arrows for design */}
        <ChevronLeft className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

        {/* Clients list */}
        <div className="relative w-full max-w-2xl h-60 md:h-96 flex items-center justify-center">
          {clients.map((client, i) => (
            <motion.div
              key={client}
              custom={i}
              animate={controls}
              className="absolute text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold uppercase text-center w-full"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              {client}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
