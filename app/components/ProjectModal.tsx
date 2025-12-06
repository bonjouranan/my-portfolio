'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from "react-icons/io5";

export default function ProjectModal({ project, isOpen, onClose }: { project: any, isOpen: boolean, onClose: () => void }) {
  
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. 关闭按钮：完全独立于滚动容器，Fixed定位 */}
          <motion.button 
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} 
            className="fixed top-6 right-6 md:top-10 md:right-10 text-white z-[9999] p-3 border border-white/20 rounded-full bg-black/80 hover:bg-white hover:text-black transition-colors backdrop-blur-md cursor-pointer"
          >
            <IoClose size={32} />
          </motion.button>

          {/* 2. 滚动容器 */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-y-auto no-scrollbar"
          >
            <div className="max-w-6xl mx-auto px-4 py-32">
               <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-16">
                  <p className="text-purple-400 font-bold tracking-[0.2em] mb-4 text-lg">{project.category} — {project.year}</p>
                  <h1 className="text-5xl md:text-8xl font-black uppercase leading-none">{project.title}</h1>
               </motion.div>

               {/* 静态展示，无悬浮交互 */}
               <motion.img initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
                 src={project.img} className="w-full mb-20 shadow-2xl shadow-purple-900/20 rounded-sm" 
               />

               {/* 多图展示测试 (静态) */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                  <img src={project.img} className="w-full aspect-video object-cover" />
                  <img src={project.img} className="w-full aspect-video object-cover" />
                  <img src={project.img} className="w-full aspect-square object-cover md:col-span-2" />
               </div>

               <div className="max-w-3xl mx-auto text-gray-300 leading-relaxed text-lg space-y-8 mb-32">
                 <h3 className="text-3xl font-bold text-white">Concept</h3>
                 <p>This project explores the visual boundary between digital noise and meaningful signal.</p>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
