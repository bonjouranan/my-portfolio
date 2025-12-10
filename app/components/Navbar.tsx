'use client';

import { useState, useEffect } from 'react'; // 👈 记得引入 useEffect
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IoArrowBack } from "react-icons/io5";

export default function Navbar() {
  const pathname = usePathname();
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

  // ⚡️ 增强版：处理从外部页面跳回来的定位问题 (例如 works -> home#about)
  useEffect(() => {
    // 只有在首页且 URL 带有 #hash 时才触发
    if (isHomePage && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      
      if (element) {
        // 延时 500ms：确保移动端图片/布局完全加载后再滚动
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, [isHomePage]); // 只在“是否是首页”变化时触发一次

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      window.location.href = `/#${id}`;
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      // 1. 立即滚一次 (让用户觉得反应很快)
      element.scrollIntoView({ behavior: 'smooth' });
      
      // 2. 延时 300ms 再滚一次 (作为“修正”，防止移动端高度没撑开滚错位置)
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
        <Link href="/#about" className="flex items-center gap-2 text-xs md:text-sm font-bold hover:text-purple-400 transition-colors">
          <IoArrowBack size={14} />
          BACK
        </Link>
      )}

      {/* 分隔线 (手机端隐藏) */}
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
            ARCHIVE
          </div>
        )}
      </div>
    </motion.nav>
  );
}
