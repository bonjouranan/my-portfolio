'use client';
import { useState, useEffect } from 'react'; // 引入 useEffect
import { motion, AnimatePresence } from 'framer-motion';
import ProjectModal from '../components/ProjectModal';

export default function WorksPage() {
  const categories = ['ALL', 'CGI', '平面设计', 'CMF', '品牌官网', '展会', '周边'];
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // 确保进入二级页时，滚动到顶部 (解决从首页底部跳过来位置不对的问题)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allWorks = [
    { id: 1, title: 'PROJECT ALPHA', category: 'CGI', img: '/p1.png', year: '2023' },
    { id: 2, title: 'NEON DREAMS',   category: '平面设计', img: '/p2.png', year: '2024' },
    { id: 3, title: 'VOID SYSTEM',   category: '品牌官网', img: '/p3.png', year: '2023' },
    { id: 4, title: 'CYBER LIFE',    category: '周边',     img: '/p4.png', year: '2024' },
    { id: 5, title: 'FUTURE MOTO',   category: 'CMF',      img: '/p1.png', year: '2024' },
    { id: 6, title: 'EXPO 2025',     category: '展会',     img: '/p2.png', year: '2023' },
    { id: 7, title: 'GLASS UI',      category: '品牌官网', img: '/p3.png', year: '2024' },
    { id: 8, title: 'MECHA SUIT',    category: 'CGI',      img: '/p4.png', year: '2023' },
    { id: 9, title: 'POSTER ART',    category: '平面设计', img: '/p1.png', year: '2024' },
  ];

  const filteredWorks = activeCategory === 'ALL' ? allWorks : allWorks.filter(item => item.category === activeCategory);

  return (
    <main className="bg-black min-h-screen text-white selection:bg-purple-500 selection:text-white pb-32">
      
      <ProjectModal project={selectedProject || {}} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
      
      {/* ❌ 删除了原来的 <header>...</header> ❌ */}
      
      {/* 头部留白，给悬浮导航栏腾位置 */}
      <div className="pt-40 px-4 md:px-12 max-w-[1800px] mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">
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
          <AnimatePresence>
            {filteredWorks.map((item) => (
              <motion.div
                layout
                key={item.id}
                // 滚动渐显
                initial={{ opacity: 0, scale: 0.9, y: 50 }} 
                whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }}
                exit={{ opacity: 0, scale: 0.9 }} 
                transition={{ duration: 0.5 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(item)}
              >
                {/* 简约交互：仅边框变白 + 亮度微升 */}
                <div className="relative overflow-hidden aspect-[4/3] mb-4 bg-gray-900 border border-white/10 group-hover:border-white transition-colors duration-300">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110 group-hover:scale-[1.02]" 
                  />
                </div>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xl font-bold uppercase group-hover:text-purple-500 transition-colors">{item.title}</h3>
                  <span className="text-xs text-gray-500 border border-gray-700 px-2 py-1 rounded">{item.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
