'use client';
import type { SpringOptions } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './TiltedCard.css';

interface TiltedCardProps {
  imageSrc: string; // 仍然作为封面图传入
  videoSrc?: string | null; // 新增：视频链接
  isVideo?: boolean;        // 新增：是否为视频模式
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
  videoSrc,
  isVideo = false,
  altText = 'Tilted card image',
  captionText = '',
  scaleOnHover = 1.05,      
  rotateAmplitude = 12,     
  showGlow = true           
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const tooltipX = useMotionValue(0);
  const tooltipY = useMotionValue(0);
  
  const [lastY, setLastY] = useState<number>(0);
  const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const tooltipOpacity = useSpring(0, { damping: 20, stiffness: 200 });
  const glowOpacity = useSpring(0, { damping: 20, stiffness: 200 });

  const glow1X = useSpring(useMotionValue(0), springValues);
  const glow1Y = useSpring(useMotionValue(0), springValues);
  const glow2X = useSpring(useMotionValue(0), springValues);
  const glow2Y = useSpring(useMotionValue(0), springValues);

  // 确保视频加载
  useEffect(() => {
    if (isVideo && videoRef.current && videoSrc) {
      videoRef.current.load();
    }
  }, [isVideo, videoSrc]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    rotateX.set(yPct * -rotateAmplitude);
    rotateY.set(xPct * rotateAmplitude);
    
    tooltipX.set(mouseX);
    tooltipY.set(mouseY);

    const velocityY = mouseY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(mouseY);

    glow1X.set(xPct * -20); 
    glow1Y.set(yPct * -20);
    glow2X.set(xPct * 20);
    glow2Y.set(yPct * 20);
  };

  const handleMouseEnter = () => {
    scale.set(scaleOnHover);
    tooltipOpacity.set(1);
    glowOpacity.set(1);
    // 鼠标悬浮时尝试播放（双重保险）
    if (isVideo && videoRef.current) videoRef.current.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    scale.set(1);
    tooltipOpacity.set(0);
    rotateX.set(0);
    rotateY.set(0);
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
      className="tilted-card-figure relative" // relative needed for video layout
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
        {isVideo && videoSrc ? (
          // 渲染视频
          <video
            ref={videoRef}
            src={videoSrc}
            poster={imageSrc} // 加载前显示封面图
            className="tilted-card-img object-cover w-full h-full"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          // 渲染图片
          <img src={imageSrc} alt={altText} className="tilted-card-img" />
        )}
      </motion.div>

      {captionText && (
        <motion.figcaption
          className="tilted-card-caption"
          style={{ 
            x: tooltipX, 
            y: tooltipY, 
            opacity: tooltipOpacity,
            rotate: rotateFigcaption 
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </div>
  );
}
