'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 👇 引入 Context
import { useLoader } from '../context/LoaderContext';

export default function Preloader() {
  // 👇 改用 Context 控制
  const { shouldPlayIntro, resetIntro } = useLoader();
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // 只有当 shouldPlayIntro 为 true 时才运行
    if (shouldPlayIntro) {
      document.body.style.overflow = 'hidden';
      setCounter(0); // 重置计数器

      const interval = setInterval(() => {
        setCounter((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            
            setTimeout(() => {
              resetIntro(); // 告诉 Context：我播完了，可以关了
              document.body.style.overflow = 'unset';
            }, 500);
            
            return 100;
          }
          return prev + 1;
        });
      }, 20); // 20ms * 100 = 2秒

      return () => clearInterval(interval);
    }
  }, [shouldPlayIntro]); // 监听变化

  return (
    <AnimatePresence mode='wait'>
      {shouldPlayIntro && (
        <motion.div
          key="preloader" // 确保每次都能重新渲染
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black text-white cursor-wait"
        >
          <div className="relative flex items-end overflow-hidden">
            <span className="text-[15vw] md:text-9xl font-black tracking-tighter leading-none">
              {counter}
            </span>
            <span className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-purple-500">%</span>
          </div>
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
