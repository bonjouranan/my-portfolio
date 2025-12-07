'use client';
import { motion } from 'framer-motion';

const rainbowColors = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#ec4899",
];

export default function PlayfulText({ text, className, isHollow, delay = 0 }: { text: string, className?: string, isHollow?: boolean, delay?: number }) {
  const words = text.split(" ");
  let charGlobalIndex = 0;

  return (
    <div className={`flex flex-wrap gap-x-[0.2em] ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          {word.split("").map((char, j) => {
            const currentColor = rainbowColors[charGlobalIndex % rainbowColors.length];
            charGlobalIndex++;

            return (
              <motion.span
                key={j}
                className={`inline-block cursor-default ${isHollow ? 'text-transparent' : 'text-white'}`}
                style={{ 
                  ...(isHollow ? { WebkitTextStroke: '2px white' } : {}),
                  // ⚡️⚡️ 关键优化：开启 GPU 加速 ⚡️⚡️
                  willChange: "transform, filter, color", 
                  transform: "translateZ(0)" 
                }}
                
                initial={{ opacity: 0, y: 40, filter: "blur(10px)", skewX: -20 }}
                
                animate={{ 
                  opacity: 1, skewX: 0, scaleY: 1, filter: "blur(0px)",
                  textShadow: "0px 0px 0px transparent",
                  color: isHollow ? "transparent" : "#ffffff",
                  y: [0, -15, 0], 
                  rotate: [0, 5, 0], 
                }}
                
                transition={{ 
                  opacity: { duration: 0.8, delay: delay + (i * 0.3) + (j * 0.05) },
                  filter: { duration: 0.8, delay: delay + (i * 0.3) + (j * 0.05) },
                  y: {
                    duration: 0.8,
                    repeat: Infinity, 
                    repeatDelay: 10,
                    delay: delay + (i * 0.3) + (j * 0.05) + 2, 
                    ease: "easeInOut"
                  },
                  rotate: {
                    duration: 0.8,
                    repeat: Infinity,
                    repeatDelay: 10,
                    delay: delay + (i * 0.3) + (j * 0.05) + 2,
                    ease: "easeInOut"
                  }
                }}

                whileHover={{ 
                  skewX: -15,
                  scaleY: 1.2,
                  filter: "blur(2px)", 
                  color: currentColor,
                  textShadow: [
                    "5px 0px 0px #ff0000, -5px 0px 0px #00ffff", 
                    "-5px 0px 0px #ff0000, 5px 0px 0px #00ffff",
                  ],
                  y: 0, 
                  rotate: 0,
                  transition: { duration: 0.4, ease: "easeInOut" }
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
