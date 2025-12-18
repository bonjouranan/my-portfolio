'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  // ✨ 新增：控制是否隐藏光标的状态
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // 1. 鼠标移动逻辑
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

    // 2. ✨✨✨ 核心修复：监听 Body 类名变化 ✨✨✨
    // 只有这样，当鼠标在 iframe 边缘停止发送事件时，我们依然能通过类名控制光标隐藏
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains('hovering-media')) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    });

    // 开始监听 body 的 class 属性变化
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      observer.disconnect(); // 组件卸载时停止监听
    };
  }, []);

  // 动画变体配置
  const cursorVariants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      height: 20,
      width: 20,
      backgroundColor: "#a855f7",
      opacity: 1, // 正常显示
    },
    hover: {
      x: mousePosition.x - 5,
      y: mousePosition.y - 5,
      height: 10,
      width: 10,
      backgroundColor: "#a855f7",
      opacity: 1,
    },
    hidden: { // ✨ 隐藏状态
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      height: 20,
      width: 20,
      backgroundColor: "#a855f7",
      opacity: 0, // 变透明
    }
  };

  const ringVariants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      height: 20,
      width: 20,
      backgroundColor: "rgba(168, 85, 247, 0)",
      borderColor: "rgba(255, 255, 255, 0)",
      scale: 0.5,
      opacity: 1,
    },
    hover: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      height: 80,
      width: 80,
      backgroundColor: "rgba(168, 85, 247, 0.15)",
      borderColor: "rgba(255, 255, 255, 0.6)",
      scale: 1,
      opacity: 1,
    },
    hidden: { // ✨ 隐藏状态
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      height: 20,
      width: 20,
      opacity: 0, // 变透明
      scale: 0.5,
    }
  };

  return (
    <>
      {/* 1. 核心点 */}
      <motion.div
        className="custom-cursor-part fixed top-0 left-0 rounded-full pointer-events-none z-[999999]"
        animate={isHidden ? "hidden" : (isHovering ? "hover" : "default")}
        variants={cursorVariants}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      
      {/* 2. 扩散指引圈 */}
      <motion.div
        className="custom-cursor-part fixed top-0 left-0 rounded-full pointer-events-none z-[999998]"
        style={{ borderWidth: '1px' }}
        animate={isHidden ? "hidden" : (isHovering ? "hover" : "default")}
        variants={ringVariants}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </>
  );
}
