'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectModal from '../components/ProjectModal';
import { MdArrowOutward } from "react-icons/md";
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

export default function WorksPage() {
  const [categories, setCategories] = useState(['ALL']);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [allWorks, setAllWorks] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      // ⚡️ 查询语句升级：同时取 mainImage 和 secondaryImage
      const data = await client.fetch(`*[_type == "project"] | order(order desc) {
        title, category, 
        "img": mainImage, 
        "img2": secondaryImage, 
        year, type, videoUrl, content
      }`);

      const formatted = data.map((item: any) => ({
        ...item,
        id: item.title,
        // ⚡️ 逻辑升级：优先用 img2 (二级页封面)，没有则回退到 img (首页封面)
        img: item.img2 ? urlFor(item.img2).url() : (item.img ? urlFor(item.img).url() : null),
        video: item.videoUrl,
        poster: item.img ? urlFor(item.img).url() : null,
      }));

      setAllWorks(formatted);
      const uniqueCats = Array.from(new Set(formatted.map((i: any) => i.category))).filter(Boolean);
      setCategories(['ALL', ...uniqueCats as string[]]);
    };
    fetchData();
  }, []);

  const filteredWorks = activeCategory === 'ALL' ? allWorks : allWorks.filter(item => item.category === activeCategory);

  return (
    // 🔧 [修复1] 增加 overflow-x-hidden 防止整个页面左右晃动
    <main className="bg-black min-h-screen text-white selection:bg-purple-500 selection:text-white pb-32 overflow-x-hidden w-full">
      
      <ProjectModal project={selectedProject || {}} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
      
      {/* 🔧 [修复2] 调整顶部 padding：手机端 pt-24，电脑端 pt-40 (原本手机也也是40太高了) */}
      <div className="pt-24 md:pt-40 px-4 md:px-12 max-w-[1800px] mx-auto">
        
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          {/* 
             🔧 [修复3 - 核心] 标题适配
             1. text-4xl: 手机端改小一点 (原本 text-6xl 容易撑破)
             2. md:text-8xl: 电脑端保持霸气的大字
             3. break-words: 强制长单词换行，防止撑开宽度
             4. max-w-full: 限制最大宽度
          */}
          <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter break-words max-w-full">
            ALL ARCHIVE
          </h1>

          <div className="flex flex-wrap gap-4">
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
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { delay: index * 0.05, duration: 0.4 } 
                }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                className="group cursor-pointer"
                onClick={() => setSelectedProject(item)}
              >
                {/* 这里的 aspect-[4/3] 可以根据二级页封面的实际比例调整 */}
                <div className="relative overflow-hidden aspect-[4/3] mb-4 bg-gray-900 border border-white/10 group-hover:border-white transition-colors duration-300">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110 group-hover:scale-[1.02]" 
                  />
                </div>
                <div className="flex justify-between items-end border-b border-white/30 pb-4">
                  <div className="flex-1 mr-4"> {/* 🔧 [修复4] 增加 flex-1 和 mr-4 防止文字和箭头撞在一起 */}
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
