'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;       // 例如 "@WORKS"
  rightContent?: React.ReactNode; // 右侧的内容，例如 "(4/8)" 或 "LINK"
  fullWidth?: boolean; // 是否撑满宽度
}

export default function SectionHeader({ title, rightContent, fullWidth = true }: SectionHeaderProps) {
  
  // 文字拆分逻辑：把 "@WORKS" 拆成 ["@", "W", "O", "R", "K", "S"]
  const letters = title.split("");

  return (
    <div className={`relative mb-24 ${fullWidth ? 'w-full' : ''}`}>
      
      {/* 上半部分：标题 和 右侧文字 */}
      <div className="flex items-end justify-between pb-4 overflow-hidden">
        
        {/* 左侧：炫酷的标题动画 */}
        <h2 className="leading-none overflow-hidden flex">
          {letters.map((char, index) => (
            <motion.span
              key={index}
              className="inline-block origin-bottom"
              style={{ 
                color: "#ffffff",
                // 这里用了 clamp 保证响应式，和原来的样式保持一致
                fontSize: "clamp(36px, 5vw, 60px)", 
                fontWeight: 700 
              }}
              initial={{ y: "100%", opacity: 0, rotate: 5 }} // 初始状态：沉下去、透明、微歪
              whileInView={{ y: 0, opacity: 1, rotate: 0 }}   // 出现状态：浮上来、不透明、回正
              viewport={{ once: true, margin: "-10%" }}       // 视口设置：只播一次
              transition={{ 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1], // 这种贝塞尔曲线更有“高级感”
                delay: index * 0.05       // 每个字母延迟 0.05秒，形成错峰效果
              }}
            >
              {/* 如果是空格，需要特殊处理，否则会塌陷 */}
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h2>

        {/* 右侧：副标题/计数 (淡入效果) */}
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

      {/* 下半部分：线条从左向右划线 */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-white/20"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }} // 持续1.5秒，慢速划过
      />
    </div>
  );
}
