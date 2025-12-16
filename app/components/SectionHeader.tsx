'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  rightContent?: React.ReactNode;
  fullWidth?: boolean;
}

export default function SectionHeader({ title, rightContent, fullWidth = true }: SectionHeaderProps) {
  
  const letters = title.split("");

  return (
    <div className={`relative mb-24 ${fullWidth ? 'w-full' : ''}`}>
      
      <div className="flex items-end justify-between pb-4">
        
        <h2 className="leading-none flex">
          {letters.map((char, index) => (
            // 1. “遮罩” span 结构：这是实现可靠裁剪动画的基石
            <span
              key={index}
              className="inline-block overflow-hidden"
              style={{
                // 2. 将字体样式放在“遮罩”上，给它一个稳定的高度
                fontSize: "clamp(36px, 5vw, 60px)", 
                fontWeight: 700,
                lineHeight: 1, // 强制高度等于字体大小，极其重要！
                color: "#ffffff",
              }}
            >
              <motion.span
                className="inline-block"
                // 👇 【最终的核心修正】
                // 我们保留 y 轴的位移，但移除初始的 rotate
                // 这让字母可以垂直、干净地滑入，避免被旋转后的“包围盒”裁切
                initial={{ y: "100%", opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.05
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            </span>
          ))}
        </h2>

        {rightContent && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="uppercase pb-1 text-[#9ca3af] text-sm font-normal tracking-[0.1em]"
          >
            {rightContent}
          </motion.div>
        )}
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-white/20"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
      />
    </div>
  );
}
