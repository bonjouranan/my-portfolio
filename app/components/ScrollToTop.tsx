'use client';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { IoArrowUp } from "react-icons/io5";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // 获取页面总高度 和 视口高度
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    
    // 如果页面本身很短（没滚动条），直接不显示
    if (documentHeight <= windowHeight) {
      setIsVisible(false);
      return;
    }

    // 计算滚动百分比 (0 ~ 1)
    const scrollPercentage = (latest + windowHeight) / documentHeight;

    // ⚡️ 只有滚到 85% 以后才显示 (快到底部了)
    if (scrollPercentage > 0.85) {
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
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[999999] w-12 h-12 flex items-center justify-center rounded-full bg-white text-black shadow-2xl hover:bg-purple-500 hover:text-white transition-colors cursor-pointer border border-black/10"
        >
          <IoArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
