'use client';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IoArrowBack } from "react-icons/io5";

export default function Navbar() {
  const pathname = usePathname();
  // 判断：如果路径只有 "/"，那就是首页；否则就是二级页
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

  const scrollToSection = (id: string) => {
    // 如果在二级页点了菜单(虽然逻辑上应该不显示菜单)，强制回首页
    if (!isHomePage) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
      className="fixed top-8 left-1/2 z-50 flex items-center gap-8 px-8 py-3 rounded-full bg-black/30 backdrop-blur-md border-2 border-white/20 text-white shadow-lg w-max"
    >
      {/* 左侧逻辑 */}
      {isHomePage ? (
        <div 
          className="text-lg font-black tracking-tighter cursor-pointer hover:text-purple-400 transition-colors" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}
        >
          ANAN.
        </div>
      ) : (
        // 二级页显示 BACK 按钮
        <Link href="/#work" className="flex items-center gap-2 text-sm font-bold hover:text-purple-400 transition-colors">
          <IoArrowBack size={16} />
          BACK
        </Link>
      )}

      <div className="w-[1px] h-4 bg-white/20"></div>

      {/* 右侧逻辑 */}
      <div className="flex gap-6 text-xs md:text-sm font-bold tracking-widest">
        {isHomePage ? (
          homeLinks.map((link) => (
            <div key={link.name} className="relative group overflow-hidden cursor-pointer px-2 py-1" onClick={() => scrollToSection(link.id)}>
              <span className="absolute inset-0 bg-white/5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative block z-10 group-hover:text-purple-300 transition-colors duration-300">
                {link.name}
              </span>
            </div>
          ))
        ) : (
          // 二级页显示标题
          <div className="text-gray-400 cursor-default px-2 py-1">
            ARCHIVE 2025
          </div>
        )}
      </div>
    </motion.nav>
  );
}
