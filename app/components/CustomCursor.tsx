'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('.cursor-pointer') !== null
      );
    };
    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  return (
    <>
      {/* 1. 核心点 (hidden md:block 手机端隐藏) */}
      <motion.div
        className="hidden md:block fixed top-0 left-0 rounded-full pointer-events-none z-[999999]"
        animate={{
          x: mousePosition.x - (isHovering ? 5 : 10),
          y: mousePosition.y - (isHovering ? 5 : 10),
          height: isHovering ? 10 : 20,
          width: isHovering ? 10 : 20,
          backgroundColor: "#a855f7",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />

      {/* 2. 扩散指引圈 (hidden md:block 手机端隐藏) */}
      <motion.div
        className="hidden md:block fixed top-0 left-0 rounded-full pointer-events-none z-[999998]"
        style={{ borderWidth: '1px' }}
        animate={{
          x: mousePosition.x - (isHovering ? 40 : 10),
          y: mousePosition.y - (isHovering ? 40 : 10),
          height: isHovering ? 80 : 20,
          width: isHovering ? 80 : 20,
          backgroundColor: isHovering ? "rgba(168, 85, 247, 0.15)" : "rgba(168, 85, 247, 0)",
          borderColor: isHovering ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0)",
          scale: isHovering ? 1 : 0.5,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </>
  );
}
