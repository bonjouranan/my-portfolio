'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useAnimation, useMotionValueEvent } from 'framer-motion';

export default function BottomGlow() {
  const { scrollYProgress } = useScroll();
  const controls = useAnimation();
  const fadeTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartY = useRef<number>(0);

  const GLOW_CONFIG = {
    baseColor: "#4c1d95", // violet-900
    coreColor: "#c846efff", // fuchsia-500
    highlightColor: "#e879f9", // fuchsia-400
    durationIn: 0.2,
    durationOut: 1.5
  };

  const triggerGlow = () => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    controls.start({
      opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
      transition: { duration: GLOW_CONFIG.durationIn, ease: "easeOut" }
    });
    
    fadeTimer.current = setTimeout(() => {
      controls.start({
        opacity: 0, scale: 1.1, y: 10, filter: "blur(20px)",
        transition: { duration: GLOW_CONFIG.durationOut, ease: "easeOut" }
      });
    }, 200);
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const previous = scrollYProgress.getPrevious() || 0;
    if (latest > 0.99 && latest > previous) {
      triggerGlow();
    }
  });

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!document.scrollingElement) return;
      const { scrollTop, scrollHeight, clientHeight } = document.scrollingElement;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
      if (isAtBottom && e.deltaY > 0) triggerGlow();
    };
    const handleTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      if (!document.scrollingElement) return;
      const { scrollTop, scrollHeight, clientHeight } = document.scrollingElement;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
      const deltaY = touchStartY.current - e.touches[0].clientY;
      if (isAtBottom && deltaY > 10) { triggerGlow(); touchStartY.current = e.touches[0].clientY; }
    };
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={controls}
      className="fixed bottom-0 left-0 w-full h-[50vh] pointer-events-none z-50 flex justify-center items-end mix-blend-screen overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to top, black 20%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 100%)'
      }}
    >
      <div className="relative flex justify-center 
        w-full max-w-[800px] h-[150px] translate-y-[90%]
        md:w-full md:max-w-none md:h-[80px] md:translate-y-[120%]
      ">
        <div className="absolute bottom-0 rounded-[100%] opacity-60 w-[120%] h-[200px] blur-[80px] md:w-[200%] md:h-[180px] md:blur-[120px]" style={{ background: GLOW_CONFIG.baseColor }}></div>
        <div className="absolute bottom-0 rounded-[100%] opacity-80 w-[80%] h-[150px] blur-[50px] md:w-[120%] md:h-[100px] md:blur-[80px]" style={{ background: GLOW_CONFIG.coreColor }}></div>
        <div className="absolute rounded-[100%] opacity-90 bottom-[-20px] w-[60%] h-[100px] blur-[30px] md:bottom-[-30px] md:w-[80%] md:h-[60px] md:blur-[50px]" style={{ background: `radial-gradient(circle at center, ${GLOW_CONFIG.highlightColor}, transparent 70%)` }}></div>
      </div>
    </motion.div>
  );
}
