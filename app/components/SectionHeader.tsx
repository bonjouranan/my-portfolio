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
      
      {/* 👇 修改点：改为 flex-col (移动端竖排) md:flex-row (电脑端横排)，增加 gap 防止贴脸 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 gap-6">
        
        {/* 👇 修改点：增加 flex-shrink-0 防止标题被压缩 */}
        <h2 className="leading-none flex flex-shrink-0">
          {letters.map((char, index) => (
            <span
              key={index}
              className="inline-block overflow-hidden"
              style={{
                fontSize: "clamp(36px, 5vw, 60px)", 
                fontWeight: 700,
                lineHeight: 1, 
                color: "#ffffff",
              }}
            >
              <motion.span
                className="inline-block"
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
