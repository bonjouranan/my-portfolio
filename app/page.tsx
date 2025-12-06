'use client';
import { useState, useRef, useEffect } from 'react'; // 引入 useEffect
import { motion } from 'framer-motion';
import Link from 'next/link';
import ParticleScene from './components/ParticleScene';
import PlayfulText from './components/PlayfulText';
import ProjectModal from './components/ProjectModal';
import { FaBehance, FaBilibili, FaPlay, FaPause } from "react-icons/fa6";
import { SiXiaohongshu, SiGmail } from "react-icons/si";
import { IoArrowDown } from "react-icons/io5";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  // 状态：是否跳过开场动画
  const [skipIntro, setSkipIntro] = useState(false);

  useEffect(() => {
    // 检查 URL 是否包含 hash (例如 #work)
    if (window.location.hash) {
      setSkipIntro(true); // 如果有锚点，说明是返回回来的，跳过动画
    }
  }, []);

  const allProjects = [
    { type: 'video', title: 'VIDEO TEST', category: '动态演示', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', poster: '/p1.png', year: '2024' },
    { type: 'image', title: 'GLITCH GIF', category: 'GIF 实验', img: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzZ6NHZ6NHZ6NHZ6NHZ6NHZ6NHZ6NHZ6/3o7qE1YN7aQSOxvjwA/giphy.gif', year: '2023' },
    { type: 'image', title: 'VOID SYSTEM',   category: '品牌官网', img: '/p3.png', year: '2023' },
    { type: 'image', title: 'CYBER LIFE',    category: '周边',     img: '/p4.png', year: '2024' },
    { type: 'image', title: 'FUTURE MOTO',   category: 'CMF',      img: '/p1.png', year: '2024' },
    { type: 'image', title: 'DATA VISUAL',   category: '展会',     img: '/p2.png', year: '2023' },
    { type: 'image', title: 'GLASS UI',      category: '品牌官网', img: '/p3.png', year: '2024' },
    { type: 'image', title: 'MECHANIC',      category: 'CGI',      img: '/p4.png', year: '2023' },
  ];

  const [visibleCount, setVisibleCount] = useState(4);
  const visibleProjects = allProjects.slice(0, visibleCount);

  // 动态计算延迟：如果跳过，延迟为 0；否则为 2.5s
  const START_DELAY = skipIntro ? 0 : 2.5; 

  return (
    <main className="bg-black min-h-screen text-white overflow-x-hidden selection:bg-purple-500 selection:text-white">
      
      <ProjectModal project={selectedProject || {}} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />

      {/* 1. Hero 区域 */}
      <section className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
        
        <div className="relative z-20 text-center pointer-events-auto mix-blend-difference">
          <motion.div 
            initial={{ scaleX: 0 }} 
            animate={{ scaleX: 1 }} 
            transition={{ delay: START_DELAY + 0.2, duration: 1, ease: "circOut" }}
            className="h-[1px] w-24 bg-gray-600 mx-auto mb-6 origin-center"
            whileHover={{ width: 100, height: 2, background: "linear-gradient(90deg, #ff0000, #00ff00, #0000ff)" }}
          ></motion.div>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: START_DELAY + 1 }} 
            className="text-sm md:text-base tracking-[0.5em] mb-4 text-gray-400"
          >
            PORTFOLIO 2025
          </motion.p>
          
          <div className="text-[10vw] leading-[0.9] font-black tracking-tighter cursor-default flex flex-col items-center">
            <PlayfulText text="Anan's" delay={START_DELAY + 0.2} />
            <PlayfulText text="PORTFOLIO" isHollow={true} delay={START_DELAY + 0.6} />
          </div>

          <motion.div 
            initial={{ scaleX: 0 }} 
            animate={{ scaleX: 1 }} 
            transition={{ delay: START_DELAY + 0.2, duration: 1, ease: "circOut" }}
            className="h-[1px] w-24 bg-gray-600 mx-auto mt-6 origin-center"
            whileHover={{ width: 100, height: 2, background: "linear-gradient(90deg, #00ffff, #ff00ff, #ffff00)" }}
          ></motion.div>
        </div>
        
        <div className="absolute inset-0 z-0 opacity-80"><ParticleScene /></div>
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: START_DELAY + 1.5 }} 
          className="absolute bottom-12 flex flex-col items-center gap-2 text-xs tracking-widest animate-bounce z-20"
        >
          <span>SCROLL TO EXPLORE</span>
          <IoArrowDown size={20} />
        </motion.div>
      </section>

      {/* 2. Selected Works */}
      {/* id="work" 锚点在这里 */}
      <section id="work" className="py-32 px-4 md:px-12 max-w-[1600px] mx-auto z-20 relative">
        <FadeIn delay={skipIntro ? 0 : 0}> {/* 如果跳过，这里也不延迟 */}
          <div className="flex items-end justify-between mb-24 border-b border-white/20 pb-4">
            <h2 className="text-4xl font-bold">SELECTED WORKS</h2>
            <span className="text-sm text-gray-400">({visibleCount} / {allProjects.length})</span>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32">
          <div className="flex flex-col gap-24 md:gap-48">
            {visibleProjects.filter((_, i) => i % 2 === 0).map((item, index) => (
               <FadeIn key={index} delay={skipIntro ? 0 : index * 0.1}>
                 <ProjectCard item={item} onClick={() => setSelectedProject(item)} />
               </FadeIn>
            ))}
          </div>
          <div className="flex flex-col gap-24 md:gap-48 md:pt-48">
            {visibleProjects.filter((_, i) => i % 2 !== 0).map((item, index) => (
               <FadeIn key={index} delay={skipIntro ? 0 : index * 0.1}>
                 <ProjectCard item={item} onClick={() => setSelectedProject(item)} />
               </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn>
          <div className="mt-32 flex flex-col items-center justify-center gap-6 w-full max-w-md mx-auto">
              {visibleCount < allProjects.length && (
                <button 
                  onClick={() => setVisibleCount(prev => prev + 4)}
                  className="w-full px-12 py-4 bg-white text-black hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest text-sm font-bold"
                >
                  Load More Work
                </button>
              )}
              <Link href="/works" className="w-full">
                <button className="w-full px-12 py-4 bg-white text-black hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest text-sm font-bold">
                   View All Archive
                </button>
              </Link>
          </div>
        </FadeIn>
      </section>

      {/* 3. About Me */}
      <section id="about" className="py-32 px-4 md:px-12 max-w-4xl mx-auto z-20 relative text-center">
        <FadeIn>
          <p className="text-purple-400 font-bold tracking-widest mb-8">WHO IS ANAN?</p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-12">
            I'm Anan, a digital designer crafting meaningful experiences.
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed mb-12">
            With a background in both visual design and creative coding, I bridge the gap between aesthetics and functionality. 
            I believe that great design should not only look good but also feel alive.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['UI/UX', 'CGI', 'WebGL', 'Branding', 'Motion'].map(skill => (
              <span key={skill} className="px-6 py-2 border border-white/20 rounded-full text-sm hover:bg-white hover:text-black transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* 4. Contact */}
      <section id="contact" className="h-[60vh] flex flex-col items-center justify-center bg-neutral-900 border-t border-white/10 mt-20 relative">
        <FadeIn>
          <div className="flex flex-col items-center">
            <p className="text-purple-400 tracking-widest mb-8">GOT A PROJECT?</p>
            <h2 className="text-[6vw] font-black hover:text-purple-500 transition-colors cursor-pointer leading-none">
              LET'S TALK
            </h2>
            <div className="flex gap-8 mt-12">
              <SocialIcon href="mailto:hello@alex.design" icon={<SiGmail size={20} />} label="Email" />
              <SocialIcon href="https://www.xiaohongshu.com" icon={<SiXiaohongshu size={20} />} label="小红书" />
              <SocialIcon href="https://www.bilibili.com" icon={<FaBilibili size={20} />} label="Bilibili" />
              <SocialIcon href="https://www.behance.net/Anannn" icon={<FaBehance size={20} />} label="Behance" />
            </div>
          </div>
        </FadeIn>
        <div className="absolute bottom-8 flex w-full justify-between px-8 text-xs text-gray-600 uppercase">
           <span>© 2025 Anan Design</span>
        </div>
      </section>
    </main>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function SocialIcon({ href, icon, label }: any) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="group flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
    >
      <div className="p-3 border border-white/20 rounded-full group-hover:bg-white group-hover:text-black transition-all duration-300">
        {icon}
      </div>
    </a>
  );
}

function ProjectCard({ item, onClick }: { item: any, onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div 
      className="group cursor-pointer relative"
      onClick={onClick}
    >
      <div className="relative mb-6">
        {/* 故障风背景 */}
        <div className="absolute inset-0 bg-[#ff0055] scale-100 translate-x-0 translate-y-0 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-200 z-0 opacity-0 group-hover:opacity-80 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[#00fff2] scale-100 translate-x-0 translate-y-0 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-200 z-0 opacity-0 group-hover:opacity-80 mix-blend-screen"></div>

        {/* 主容器 */}
        <div className="relative z-10 overflow-hidden aspect-[3/4] bg-gray-900 rounded-none border border-transparent group-hover:border-white transition-colors duration-300">
          
          {item.type === 'video' ? (
            <>
              <video
                ref={videoRef}
                src={item.video}
                poster={item.poster}
                autoPlay muted loop playsInline
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <button 
                onClick={togglePlay}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-600 hover:border-purple-600 z-20"
              >
                {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
              </button>
            </>
          ) : (
            <motion.img 
              src={item.img} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
            />
          )}

          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
        </div>
      </div>
      
      <div className="flex justify-between items-end border-b border-white/30 pb-4">
        <div>
           <p className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-1">{item.category}</p>
           <h3 className="text-3xl font-black uppercase italic group-hover:translate-x-2 transition-transform duration-300">{item.title}</h3>
        </div>
      </div>
    </motion.div>
  );
}
