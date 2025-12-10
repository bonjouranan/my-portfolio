'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

const rainbowColors = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#ec4899",
];

export default function PlayfulText({ text, className, isHollow, isTitle = true, delay = 0 }: { text: string, className?: string, isHollow?: boolean, isTitle?: boolean, delay?: number }) {
  const safeText = text || "";
  const words = safeText.split(" ");
  let globalCharCount = 0;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseDist = useMotionValue(0);
  
  // =====================
  // 🔧 参数调整区 (PARAMS)
  // =====================
  
  // 1. 模糊与重影参数
  // 模糊范围：鼠标离远了多糊？[0, 0.8] 表示最大 0.8px 模糊
  const blur = useTransform(mouseDist, [0, 800], [0, isTitle ? 0.8 : 0]);
  // 重影距离：鼠标离远了重影跑多远？[0, 6] 表示最大 6px
  const shadowOffset = useTransform(mouseDist, [0, 800], [0, isTitle ? 6 : 0]);
  
  // 2. 动画节奏参数
  const ENTRANCE_STAGGER = 0.015; // 入场时每个字母的间隔 (越小越快)
  const WAVE_STAGGER = 0.1;       // 呼吸波浪的间隔 (越大波浪感越强)
  const WAVE_DELAY = 2.5;         // 入场后等多久开始呼吸
  const WAVE_REPEAT_DELAY = 8;    // 每一轮呼吸结束后休息多久 (秒)
  
  // 3. 跳动幅度
  const JUMP_HEIGHT = -15;        // 向上跳 15px
  const JUMP_ROTATE = 5;          // 旋转 5度

  // =====================

  const dropShadow = useTransform(shadowOffset, (v) => {
    if (!isTitle || v <= 0.1) return "none";
    return `drop-shadow(${v}px 0px 0px rgba(255,0,0,0.6)) drop-shadow(-${v}px 0px 0px rgba(0,255,255,0.6))`;
  });

  const filterStyle = useTransform(() => {
    if (!isTitle) return "none";
    const b = blur.get();
    const ds = dropShadow.get();
    return `${b ? `blur(${b}px)` : ''} ${ds}`;
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 15 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(normX);
      mouseY.set(normY);

      if (containerRef.current && isTitle) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
        mouseDist.set(dist);
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [isTitle, mouseX, mouseY, mouseDist]);

  return (
    <motion.div 
      ref={containerRef}
      className={`flex flex-wrap gap-x-[0.2em] ${className}`}
      style={{ perspective: 1000, rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          {word.split("").map((char, j) => {
            const currentColor = rainbowColors[globalCharCount % rainbowColors.length];
            
            // 计算延迟
            const staggerDelay = delay + (globalCharCount * ENTRANCE_STAGGER); 
            const waveDelay = WAVE_DELAY + (globalCharCount * WAVE_STAGGER);
            
            globalCharCount++;

            // 动画变量
            const animationY = isTitle ? [0, JUMP_HEIGHT, 0] : 0;
            const animationRotate = isTitle ? [0, JUMP_ROTATE, 0] : 0;
            
            // 颜色变量
            const transparentColor = "rgba(255,255,255,0)";
            const whiteColor = "rgba(255,255,255,1)";

            const colorKeyframes = isTitle 
              ? (isHollow ? [transparentColor, currentColor, transparentColor] : [whiteColor, currentColor, whiteColor])
              : (isHollow ? transparentColor : "inherit");

            const strokeKeyframes = isTitle && isHollow ? "white" : (isHollow ? "white" : undefined);

            return (
              <motion.span
                key={j}
                className={`inline-block cursor-default ${isHollow ? 'text-transparent' : ''}`}
                style={{ 
                  ...(isHollow ? { WebkitTextStroke: '2px white' } : { color: isTitle ? 'white' : 'inherit' }),
                  willChange: "transform, filter, color",
                  filter: filterStyle,
                  color: !isTitle && !isHollow ? 'inherit' : undefined
                }}
                
                initial={{ opacity: 0, y: 20, filter: "blur(8px)", scale: 1.2 }}
                
                // ⚡️ animate 属性控制常态循环 ⚡️
                // 即使 hover 结束，组件也会回到这个状态继续循环
                animate={{ 
                  opacity: 1, scale: 1, filter: "blur(0px)", 
                  y: animationY, 
                  rotate: animationRotate,
                  color: colorKeyframes,
                   ["WebkitTextStrokeColor" as any]: strokeKeyframes,
                }}
                
                transition={{ 
                  // 入场动画
                  opacity: { duration: 0.4, delay: staggerDelay },
                  scale:   { duration: 0.4, delay: staggerDelay },
                  filter:  { duration: 0.4, delay: staggerDelay },
                  
                  // 循环动画 (Wave)
                  y: isTitle ? { duration: 0.8, repeat: Infinity, repeatDelay: WAVE_REPEAT_DELAY, delay: waveDelay, ease: "easeInOut" } : { duration: 0 },
                  rotate: isTitle ? { duration: 0.8, repeat: Infinity, repeatDelay: WAVE_REPEAT_DELAY, delay: waveDelay, ease: "easeInOut" } : { duration: 0 },
                  color: isTitle ? { duration: 0.8, repeat: Infinity, repeatDelay: WAVE_REPEAT_DELAY, delay: waveDelay, ease: "easeInOut", times: [0, 0.5, 1] } : { duration: 0 },
                }}

                whileHover={{ 
                  skewX: isTitle ? -15 : 0, 
                  scaleY: isTitle ? 1.2 : 1, 
                  WebkitTextStrokeColor: isHollow ? "white" : undefined,
                  color: currentColor, 
                  textShadow: isTitle ? "5px 2px 0px #ff0000, -5px -2px 0px #00ffff" : "none",
                  // ⚡️ 悬浮时暂停跳动 (y=0)，移开后自动恢复 animate 里的循环 ⚡️
                  y: 0, rotate: 0,
                  transition: { duration: 0.1, ease: "easeOut" }
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </motion.div>
  );
}
