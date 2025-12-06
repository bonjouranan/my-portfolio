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
                style={isHollow ? { WebkitTextStroke: '2px white' } : {}}
                
                // 1. 初始状态
                initial={{ opacity: 0, y: 40, filter: "blur(10px)", skewX: -20 }}
                
                // 2. 待机动画：幅度加大
                animate={{ 
                  opacity: 1, 
                  skewX: 0, 
                  scaleY: 1, 
                  filter: "blur(0px)",
                  textShadow: "0px 0px 0px transparent",
                  color: isHollow ? "transparent" : "#ffffff",
                  // 修改点：大幅度跳动 + 微微旋转
                  y: [0, -15, 0], 
                  rotate: [0, 5, 0], // 跳起来时歪一下
                }}
                
                transition={{ 
                  // 入场
                  opacity: { duration: 0.8, delay: delay + (i * 0.3) + (j * 0.05) },
                  filter: { duration: 0.8, delay: delay + (i * 0.3) + (j * 0.05) },
                  
                  // 待机循环
                  y: {
                    duration: 0.8, // 动作稍微慢一点点，显得优雅
                    repeat: Infinity, 
                    repeatDelay: 10,  // 每 10 秒循环一次 (稍微调快频次以便观察)
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

                // 3. 悬浮交互
                whileHover={{ 
                  skewX: -15,
                  scaleY: 1.2,
                  filter: "blur(2px)", 
                  color: currentColor,
                  textShadow: [
                    "5px 0px 0px #ff0000, -5px 0px 0px #00ffff", 
                    "-5px 0px 0px #ff0000, 5px 0px 0px #00ffff",
                  ],
                  y: 0, // 悬浮时停止跳动
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
