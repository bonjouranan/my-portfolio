'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; 
import ProjectModal from '../components/ProjectModal';
import BottomGlow from '../components/BottomGlow'; 
import { MdArrowOutward } from "react-icons/md";

// 接收服务器传来的数据
export default function WorksClient({ initialWorks }: { initialWorks: any[] }) {
  const [categories, setCategories] = useState(['ALL']);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [allWorks, setAllWorks] = useState<any[]>(initialWorks); 

  useEffect(() => {
    window.scrollTo(0, 0);
    // 从数据中提取分类
    const allTags = initialWorks.flatMap((p: any) => p.filterCategories);
    const uniqueCats = Array.from(new Set(allTags)).filter(Boolean);
    setCategories(['ALL', ...uniqueCats as string[]]);
  }, [initialWorks]);

  const filteredWorks = activeCategory === 'ALL' 
    ? allWorks 
    : allWorks.filter(item => item.filterCategories && item.filterCategories.includes(activeCategory));

  return (
    <main className="bg-black min-h-screen text-white selection:bg-purple-500 selection:text-white pb-32 overflow-x-hidden w-full relative">
      <BottomGlow />
      <ProjectModal project={selectedProject || {}} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
      
      <div className="pt-24 md:pt-40 px-4 md:px-12 max-w-[1800px] mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          
          {/* 👇 修改点：强制两行显示，leading-none 让行间距更紧凑好看 */}
          <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-none flex-shrink-0">
            ALL<br />WORKS
          </h1>

          <div className="flex flex-wrap gap-4 md:justify-end">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 border rounded-full text-sm font-bold transition-all uppercase
                  ${activeCategory === cat 
                    ? 'bg-white text-black border-white' 
                    : 'bg-transparent text-gray-400 border-white/20 hover:border-white hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          <AnimatePresence mode='popLayout'>
            {filteredWorks.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1, transition: { delay: index * 0.05, duration: 0.4 } }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                className="group cursor-pointer"
                onClick={() => setSelectedProject(item)}
              >
                {/* 使用 Behance 标准比例 808/632 */}
                <div className="relative overflow-hidden aspect-[808/632] mb-4 bg-gray-900 border border-white/10 group-hover:border-white transition-colors duration-300">
                  <Image 
                    src={item.img} 
                    alt={item.title} 
                    fill
                    className="object-cover transition-all duration-500 group-hover:brightness-110 group-hover:scale-[1.02]" 
                  />
                </div>
                <div className="flex justify-between items-end border-b border-white/30 pb-4">
                  <div className="flex-1 mr-4">
                    <h3 className="text-xl font-bold uppercase group-hover:text-purple-500 transition-colors break-words">{item.title}</h3>
                    <span className="text-xs text-gray-500 border border-gray-700 px-2 py-1 rounded inline-block mt-1">{item.category}</span>
                  </div>
                  <div className="w-10 h-10 border border-white/30 rounded-full flex-shrink-0 flex items-center justify-center text-white group-hover:bg-purple-600 group-hover:border-purple-600 group-hover:text-white transition-all duration-300 group-hover:rotate-45">
                      <MdArrowOutward size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
