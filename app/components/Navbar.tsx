'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { IoArrowBack } from "react-icons/io5";
// 👇 引入 Context
import { useLoader } from '../context/LoaderContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  // 👇 获取触发器
  const { triggerIntro } = useLoader();

  const isHomePage = pathname === '/';
  
  const homeLinks = [
    { name: 'WORK', id: 'work' },
    { name: 'ABOUT', id: 'about' },
    { name: 'CONTACT', id: 'contact' }
  ];

  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // 处理返回首页的逻辑
  const handleBackToHome = () => {
    triggerIntro(); // 1. 先触发动画 (此时屏幕会变黑加载)
    
    // 2. 稍微延迟一点点再跳转，让动画先出来
    setTimeout(() => {
      router.push('/'); 
    }, 10);
  };

  useEffect(() => {
    if (isHomePage && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, [isHomePage]);

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      // 如果不在首页，点击导航链接也是一种“回首页”
      triggerIntro();
      setTimeout(() => {
        window.location.href = `/#${id}`;
      }, 10);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
         element.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <motion.nav 
      variants={{
        visible: { y: 0, opacity: 1, x: "-50%" },
        hidden: { y: -100, opacity: 0, x: "-50%" },
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed z-50 flex items-center justify-between md:justify-start gap-4 md:gap-8 
                  top-6 md:top-8 
                  left-1/2 -translate-x-1/2 
                  w-[90%] md:w-max 
                  px-5 py-3 md:px-8 md:py-3 
                  rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white shadow-2xl"
    >
      {/* 左侧：Logo 或 Back */}
      {isHomePage ? (
        <div 
          className="text-base md:text-lg font-black tracking-tighter cursor-pointer hover:text-purple-400 transition-colors" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}
        >
          AN.
        </div>
      ) : (
        // 👇 修改：使用 handleBackToHome
        <button 
          onClick={handleBackToHome} 
          className="flex items-center gap-2 text-xs md:text-sm font-bold hover:text-purple-400 transition-colors"
        >
          <IoArrowBack size={14} />
          BACK
        </button>
      )}

      {/* 分隔线 */}
      <div className="hidden md:block w-[1px] h-4 bg-white/20"></div>

      {/* 右侧：菜单 */}
      <div className="flex gap-4 md:gap-6 text-[10px] md:text-sm font-bold tracking-widest">
        {isHomePage ? (
          homeLinks.map((link) => (
            <div key={link.name} className="relative group overflow-hidden cursor-pointer px-2 py-1" onClick={() => scrollToSection(link.id)}>
              <span className="absolute inset-0 bg-white/5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"></span>
              <span className="relative block z-10 group-hover:text-purple-300 transition-colors duration-300">
                {link.name}
              </span>
            </div>
          ))
        ) : (
          <div className="text-gray-400 cursor-default px-2 py-1 text-[10px] md:text-sm font-bold tracking-widest">
            AN.
          </div>
        )}
      </div>
    </motion.nav>
  );
}
