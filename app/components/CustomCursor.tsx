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
      {/* 1. 核心点 (加大尺寸) */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        animate={{
          // 默认 20px，悬浮时缩小一点点让位给外圈，或者保持
          x: mousePosition.x - (isHovering ? 5 : 10),
          y: mousePosition.y - (isHovering ? 5 : 10),
          height: isHovering ? 10 : 20, // 悬浮时核心反而变小聚焦，平时大一点方便看
          width: isHovering ? 10 : 20,
          backgroundColor: "#a855f7", // 实心紫
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />

      {/* 2. 扩散指引圈 (有色填充 + 细线描边) */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
        style={{ borderWidth: '1px' }} // 强制细线
        animate={{
          x: mousePosition.x - (isHovering ? 40 : 10),
          y: mousePosition.y - (isHovering ? 40 : 10),
          height: isHovering ? 80 : 20,
          width: isHovering ? 80 : 20,
          
          // 关键修改：有颜色的填充 (紫色半透)
          backgroundColor: isHovering ? "rgba(168, 85, 247, 0.15)" : "rgba(168, 85, 247, 0)",
          // 关键修改：极细的白线描边
          borderColor: isHovering ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0)",
          
          scale: isHovering ? 1 : 0.5,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25
        }}
      />
    </>
  );
}
