// 📍 文件: app/components/TiltedCard.tsx (最终修正：找回了原本的“摆动”物理效果)

'use client';

import type { SpringOptions } from 'framer-motion';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './TiltedCard.css';

interface TiltedCardProps {
  imageSrc: React.ComponentProps<'img'>['src'];
  altText?: string;
  captionText?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showGlow?: boolean;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  scaleOnHover = 1.05,      
  rotateAmplitude = 12,     
  showGlow = true           
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // --- 1. 卡片本身的动画状态 ---
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  // --- 2. 小文案(Tooltip) 的位置状态 (改回无延迟的 MotionValue，响应更灵敏) ---
  const tooltipX = useMotionValue(0);
  const tooltipY = useMotionValue(0);
  
  // --- 3. ✨✨✨ 核心修复：找回“摆动”物理效果 ✨✨✨ ---
  // 用于计算鼠标移动的垂直速度，从而产生倾斜
  const [lastY, setLastY] = useState<number>(0);
  
  // 定义旋转的弹性物理参数 (stiffness: 350, damping: 30 这里的参数决定了摆动的快慢)
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const tooltipOpacity = useSpring(0, { damping: 20, stiffness: 200 });
  const glowOpacity = useSpring(0, { damping: 20, stiffness: 200 });

  // 霓虹光晕位置
  const glow1X = useSpring(useMotionValue(0), springValues);
  const glow1Y = useSpring(useMotionValue(0), springValues);
  const glow2X = useSpring(useMotionValue(0), springValues);
  const glow2Y = useSpring(useMotionValue(0), springValues);

  // --- 鼠标移动事件处理 ---
  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // 计算百分比位置 (用于卡片倾斜)
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    // 1. 更新卡片旋转
    rotateX.set(yPct * -rotateAmplitude);
    rotateY.set(xPct * rotateAmplitude);
    
    // 2. 更新文字提示位置 (直接跟随，不带弹簧延迟，为了配合旋转效果)
    tooltipX.set(mouseX);
    tooltipY.set(mouseY);

    // 3. ✨✨✨ 计算并设置摆动角度 ✨✨✨
    // 计算垂直方向的移动速度 (当前位置 - 上次位置)
    const velocityY = mouseY - lastY;
    // 根据速度设置旋转角度，0.6 是灵敏度系数，负号是为了反向拖拽感
    rotateFigcaption.set(-velocityY * 0.6);
    // 更新上次位置
    setLastY(mouseY);

    // 4. 更新光晕位置
    glow1X.set(xPct * -20); 
    glow1Y.set(yPct * -20);
    glow2X.set(xPct * 20);
    glow2Y.set(yPct * 20);
  };

  // --- 鼠标进入 ---
  const handleMouseEnter = () => {
    scale.set(scaleOnHover);
    tooltipOpacity.set(1);
    glowOpacity.set(1);
  };

  // --- 鼠标离开 ---
  const handleMouseLeave = () => {
    scale.set(1);
    tooltipOpacity.set(0);
    rotateX.set(0);
    rotateY.set(0);
    
    // 复位摆动角度
    rotateFigcaption.set(0);
    
    glowOpacity.set(0);
    glow1X.set(0);
    glow1Y.set(0);
    glow2X.set(0);
    glow2Y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="tilted-card-figure"
    >
      {showGlow && (
        <>
          <motion.div 
            className="tilted-card-glow glow-1"
            style={{ x: glow1X, y: glow1Y, opacity: glowOpacity }}
          />
          <motion.div 
            className="tilted-card-glow glow-2"
            style={{ x: glow2X, y: glow2Y, opacity: glowOpacity }}
          />
        </>
      )}

      <motion.div
        className="tilted-card-inner"
        style={{ rotateX, rotateY, scale }}
      >
        <img src={imageSrc} alt={altText} className="tilted-card-img" />
      </motion.div>

      {captionText && (
        <motion.figcaption
          className="tilted-card-caption"
          style={{ 
            x: tooltipX, 
            y: tooltipY, 
            opacity: tooltipOpacity,
            rotate: rotateFigcaption // 👈 这里绑定了摆动动画
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </div>
  );
}
