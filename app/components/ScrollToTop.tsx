'use client';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { IoArrowUp } from "react-icons/io5";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // 获取页面高度信息
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    
    // 计算滚动进度 (0 到 1)
    // 当 (滚动距离 + 屏幕高度) 接近 文档总高度时，说明到底部了
    const scrollProgress = (latest + windowHeight) / documentHeight;

    // 只有当滚动超过 85% 时才显示按钮
    if (scrollProgress > 0.85) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          // 样式保持不变：白底黑字圆形
          className="fixed bottom-8 right-8 z-[90] p-4 rounded-full bg-white text-black shadow-lg hover:bg-purple-500 hover:text-white transition-colors duration-300"
        >
          <IoArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
