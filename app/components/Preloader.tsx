'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // 1. 锁死滚动，防止用户乱动
    document.body.style.overflow = 'hidden';

    // 2. 启动计时器
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // 加载完成！延迟 500ms 让用户看清 100%，然后退场
          setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = 'unset'; // 解锁滚动
          }, 500);
          
          return 100;
        }
        return prev + 1;
      });
    }, 20); // 20ms * 100 = 2秒加载时间

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode='wait'>
      {isLoading && (
        <motion.div
          // 退场动画：向上滑开 (y: -100%)
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black text-white cursor-wait"
        >
          {/* 巨大的数字显示 */}
          <div className="relative flex items-end overflow-hidden">
            <span className="text-[15vw] md:text-9xl font-black tracking-tighter leading-none">
              {counter}
            </span>
            <span className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-purple-500">%</span>
          </div>

          {/* 底部进度条 */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-white/10">
            <motion.div 
              className="h-full bg-purple-600"
              initial={{ width: "0%" }}
              animate={{ width: `${counter}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
