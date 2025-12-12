'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useAnimation, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import ParticleScene from './components/ParticleScene';
import PlayfulText from './components/PlayfulText';
import ProjectModal from './components/ProjectModal';
import SectionHeader from './components/SectionHeader'; // 👈 确保这个组件已存在
import BottomGlow from './components/BottomGlow';     // 👈 确保这个组件已存在(如果你没建, 后面代码有备用)
import { FaBehance, FaBilibili, FaPlay, FaPause, FaWeixin } from "react-icons/fa6";
import { SiXiaohongshu, SiGmail } from "react-icons/si";
import { IoArrowDown, IoClose } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

// =====================================================================
// 🎛️ 全局样式配置中心 (THEME CONFIG)
// =====================================================================
const THEME_CONFIG = {
  sectionTitle: {
    color: "#ffffff",
    mobileSize: "36px",
    desktopSize: "60px",
    weight: 700,
    italic: false,
    letterSpacing: "0em",
  },
  sectionSub: {
    color: "#9ca3af",
    size: "0.875rem",
    weight: 400,
    spacing: "0.1em",
  },
  about: {
    subHeadlineColor: "#9435e9",
    subHeadlineSize: "0.8rem",
    subHeadlineWeight: 700,
    nameColor: "#ffffff",
    nameSize: "60px",
    nameWeight: 900,
    roleColor: "#ffffff",
    roleSize: "60px",
    roleWeight: 900,
    bodyColor: "#a3a3a3",
    bodySize: "1.5rem",
    bodyWeight: 300,
    skillColor: "#cacaca",
    skillBorder: "#383838ff",
    skillBorderWidth: "1px", 
    skillHoverBg: "#ffffff",
    skillHoverText: "#000000",
    skillWeight: 600,
  }
};

const FOOTER_TEXT = "© 2025 ANAN DESIGN. ALL RIGHTS RESERVED.";

// 辅助函数：手动构建文件 URL
const getFileUrl = (ref: string, projectId: string, dataset: string) => {
  if (!ref) return null;
  const parts = ref.split('-');
  if (parts.length < 3) return null;
  const id = parts[1];
  const format = parts[parts.length - 1];
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${format}`;
};

// =====================================================================

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [skipIntro, setSkipIntro] = useState(false);
  const [showWechat, setShowWechat] = useState(false); 
  
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [heroConfig, setHeroConfig] = useState<any>(null);
  const [particleStart, setParticleStart] = useState(false);
  const [isIpad, setIsIpad] = useState(false);

  useEffect(() => {
    const checkIsIpad = () => {
      if (typeof navigator === 'undefined') return false;
      return /iPad/.test(navigator.userAgent) || 
             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    };
    setIsIpad(checkIsIpad());
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      setSkipIntro(true);
      setParticleStart(true); 
    } else {
      setTimeout(() => {
        setParticleStart(true);
      }, 2500);
    }

    const fetchData = async () => {
      const projectsData = await client.fetch(`*[_type == "project" && showOnHome == true] | order(order asc) {
        title, category, "img": mainImage, year, type, videoUrl, coverVideoFile, content
      }`);
      
      const profileData = await client.fetch(`*[_type == "profile"][0] {
        name, role, about, skills, socials, subHeadline
      }`);
      const heroData = await client.fetch(`*[_type == "hero"][0] {
        topSmallText, line1, line2, heroStyle
      }`);

      const { projectId, dataset } = client.config();

      const formattedProjects = projectsData.map((item: any) => {
        let videoSrc = item.videoUrl;
        if (item.coverVideoFile?.asset?._ref && projectId && dataset) {
           videoSrc = getFileUrl(item.coverVideoFile.asset._ref, projectId, dataset);
        }
        return {
          ...item,
          img: item.img ? urlFor(item.img).url() : null,
          video: videoSrc, 
          poster: item.img ? urlFor(item.img).url() : null,
        };
      });

      setAllProjects(formattedProjects);
      setProfile(profileData);
      setHeroConfig(heroData);
    };

    fetchData();
  }, []);

  const [visibleCount, setVisibleCount] = useState(4);
  const visibleProjects = allProjects.slice(0, Math.min(visibleCount, 8));
  
  const START_DELAY = skipIntro ? 0 : 2.5; 
  const wechatQrUrl = profile?.socials?.wechatQr ? urlFor(profile.socials.wechatQr).url() : null;

  return (
    <main className={`bg-black min-h-screen text-white overflow-x-hidden selection:bg-purple-500 selection:text-white relative ${isIpad ? 'cursor-none' : ''}`}>
      
      {/* 如果你已经创建了 app/components/BottomGlow.tsx，请确保上面 import 了它 */}
      {/* 如果没创建，这里也不会报错，只是不显示光晕 */}
      <BottomGlow />

      {wechatQrUrl && <img src={wechatQrUrl} alt="preload" className="hidden" />}

      <ProjectModal project={selectedProject || {}} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />

      <AnimatePresence>
        {showWechat && wechatQrUrl && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl cursor-auto"
            onClick={() => setShowWechat(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative bg-neutral-900 p-12 rounded-2xl border border-white/10 flex flex-col items-center shadow-2xl max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowWechat(false)} className="absolute top-4 right-4 p-2 border border-white/20 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors">
                <IoClose size={20} />
              </button>
              <h3 className="text-2xl font-black mb-8 text-purple-400 tracking-widest">SCAN TO CHAT</h3>
              <div className="p-2 bg-white rounded-xl">
                 <img src={wechatQrUrl} alt="Wechat QR" className="w-64 h-64 object-contain" />
              </div>
              <p className="text-sm text-gray-500 tracking-widest mt-6 uppercase">ID: {profile?.name || 'ANAN'}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Hero */}
      <section className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
        <div className="relative z-20 text-center pointer-events-auto mix-blend-difference">
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: START_DELAY + 0.2, duration: 1, ease: "circOut" }} className="h-[1px] w-24 bg-gray-600 mx-auto mb-6 origin-center" whileHover={{ width: 100, height: 2, background: "linear-gradient(90deg, #ff0000, #00ff00, #0000ff)" }}></motion.div>
          
          <div className="mb-4">
            <PlayfulText 
              text={heroConfig?.topSmallText || "@Ver.1.03    2024-2025  "} 
              delay={START_DELAY + 0.6} 
              className="text-sm md:text-base tracking-[0.5em] text-gray-400 justify-center"
              isHollow={false}
              isTitle={false} 
            />
          </div>
          
          <div className="text-[14vw] md:text-[10vw] leading-[0.9] font-black tracking-tighter cursor-default flex flex-col items-center">
            <PlayfulText text={heroConfig?.line1 || "ANAN’S"} delay={START_DELAY + 0.2} isTitle={true} />
            <PlayfulText 
              text={heroConfig?.line2 || "Portfolio"} 
              isHollow={heroConfig?.heroStyle === 'hollow'} 
              delay={START_DELAY + 0.6} 
              isTitle={true}
            />
          </div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: START_DELAY + 0.2, duration: 1, ease: "circOut" }} className="h-[1px] w-24 bg-gray-600 mx-auto mt-6 origin-center" whileHover={{ width: 100, height: 2, background: "linear-gradient(90deg, #00ffff, #ff00ff, #ffff00)" }}></motion.div>
        </div>
        
        <div className="absolute inset-0 z-0 opacity-80">
          <ParticleScene start={particleStart} />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: START_DELAY + 1.5 }} className="absolute bottom-12 flex flex-col items-center gap-2 text-xs tracking-widest animate-bounce z-20"><span>SCROLL TO EXPLORE</span><IoArrowDown size={20} /></motion.div>
      </section>

      {/* 2. Selected Works */}
      <section id="work" className="py-32 px-4 md:px-12 max-w-[1600px] mx-auto z-20 relative">
        <FadeIn forceShow={skipIntro}>
          {/* ✅ 替换：使用 SectionHeader */}
          <SectionHeader 
            title="@WORKS" 
            rightContent={`(${visibleCount} / ${Math.min(allProjects.length, 8)})`} 
          />
        </FadeIn>

        {allProjects.length === 0 ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">Loading selected projects...</div>
        ) : (
          <>
            <div className="flex flex-col gap-24 md:hidden">
              {visibleProjects.map((item, index) => (
                <FadeIn key={`mobile-${index}`} delay={index * 0.1} forceShow={skipIntro}>
                  <ProjectCard item={item} onClick={() => setSelectedProject(item)} />
                </FadeIn>
              ))}
            </div>
            
            <div className="hidden md:grid md:grid-cols-2 gap-12 md:gap-32">
              <div className="flex flex-col gap-24 md:gap-48">
                {visibleProjects.filter((_, i) => i % 2 === 0).map((item, index) => (
                   <FadeIn key={`desktop-left-${index}`} delay={index * 0.1} forceShow={skipIntro}><ProjectCard item={item} onClick={() => setSelectedProject(item)} /></FadeIn>
                ))}
              </div>
              <div className="flex flex-col gap-24 md:gap-48 md:pt-48">
                {visibleProjects.filter((_, i) => i % 2 !== 0).map((item, index) => (
                   <FadeIn key={`desktop-right-${index}`} delay={index * 0.1} forceShow={skipIntro}><ProjectCard item={item} onClick={() => setSelectedProject(item)} /></FadeIn>
                ))}
              </div>
            </div>
          </>
        )}

        <FadeIn forceShow={skipIntro}>
          <div className="mt-32 flex flex-col items-center justify-center gap-6 w-full max-w-md mx-auto">
              {visibleCount < allProjects.length && visibleCount < 8 && (
                <button onClick={() => setVisibleCount(prev => Math.min(prev + 4, 8))} className="w-full px-12 py-4 bg-white text-black hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest text-sm font-bold">Load More丨加载更多</button>
              )}
              
              <Link href="/works" className="w-full">
                <button className="w-full px-12 py-4 bg-white text-black hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest text-sm font-bold">View All丨全部作品</button>
              </Link>
          </div>
        </FadeIn>
      </section>

      {/* 3. About Me */}
      <section id="about" className="py-32 px-4 md:px-12 max-w-[1600px] mx-auto z-20 relative">
        <FadeIn forceShow={skipIntro}>
          {/* ✅ 替换：使用 SectionHeader */}
          <SectionHeader 
            title="@ABOUT" 
            rightContent={profile?.subHeadline || "WHO IS ANAN?"} 
          />
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="leading-tight mb-12">
              <h2 className="block mb-2" style={{ color: THEME_CONFIG.about.nameColor, fontSize: `clamp(32px, 5vw, ${THEME_CONFIG.about.nameSize})`, fontWeight: THEME_CONFIG.about.nameWeight }}>{profile?.name || "Anan 安安"}</h2>
              <h3 className="block" style={{ color: THEME_CONFIG.about.roleColor, fontSize: `clamp(32px, 5vw, ${THEME_CONFIG.about.roleSize})`, fontWeight: THEME_CONFIG.about.roleWeight }}>{profile?.role || "L视觉设计师"}</h3>
            </div>
            
            <p className="leading-relaxed mb-12 whitespace-pre-wrap" style={{ color: THEME_CONFIG.about.bodyColor, fontSize: THEME_CONFIG.about.bodySize, fontWeight: THEME_CONFIG.about.bodyWeight }}>{profile?.about || "Loading bio..."}</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.skills?.map((skill: string) => (
                <span 
                  key={skill} 
                  className="px-6 py-2 border rounded-full transition-all cursor-default skill-tag" 
                  style={{ 
                    color: THEME_CONFIG.about.skillColor, 
                    borderColor: THEME_CONFIG.about.skillBorder, 
                    borderWidth: THEME_CONFIG.about.skillBorderWidth, 
                    fontWeight: THEME_CONFIG.about.skillWeight, 
                    '--hover-bg': THEME_CONFIG.about.skillHoverBg, 
                    '--hover-text': THEME_CONFIG.about.skillHoverText 
                  } as any} 
                  
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.backgroundColor = THEME_CONFIG.about.skillHoverBg; 
                    e.currentTarget.style.color = THEME_CONFIG.about.skillHoverText; 
                    e.currentTarget.style.borderColor = THEME_CONFIG.about.skillHoverBg; 
                  }} 
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.backgroundColor = 'transparent'; 
                    e.currentTarget.style.color = THEME_CONFIG.about.skillColor; 
                    e.currentTarget.style.borderColor = THEME_CONFIG.about.skillBorder; 
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 4. Contact */}
      <section id="contact" className="pt-32 pb-64 md:pb-48 px-4 md:px-12 max-w-[1600px] mx-auto flex flex-col justify-center relative">
        <FadeIn forceShow={skipIntro}>
          {/* ✅ 替换：使用 SectionHeader */}
          <SectionHeader 
            title="@CONTACT" 
            rightContent="LINK." 
          />
          
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {wechatQrUrl && (
                <button onClick={() => setShowWechat(true)} className="group flex flex-col items-center gap-3">
                  <div className="relative p-5 border border-white/20 rounded-full bg-black group-hover:scale-110 group-hover:border-[#07c160] group-hover:text-[#07c160] transition-all duration-300">
                    <div className="absolute inset-0 rounded-full bg-[#07c160] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <FaWeixin size={40} className="relative z-10" />
                  </div>
                  <span className="text-[10px] tracking-widest text-gray-500 uppercase group-hover:text-white transition-colors">Wechat</span>
                </button>
              )}
              {profile?.socials?.behance && <SocialIcon href={profile.socials.behance} icon={<FaBehance size={40} />} label="Behance" hoverColor="#1769ff" />}
              {profile?.socials?.xiaohongshu && <SocialIcon href={profile.socials.xiaohongshu} icon={<SiXiaohongshu size={40} />} label="Red" hoverColor="#ff2442" />}
              {profile?.socials?.bilibili && <SocialIcon href={profile.socials.bilibili} icon={<FaBilibili size={40} />} label="Bilibili" hoverColor="#fb7299" />}
              {profile?.socials?.email && <SocialIcon href={`mailto:${profile.socials.email}`} icon={<SiGmail size={40} />} label="Email" hoverColor="#ffffff" />}
            </div>
          </div>
        </FadeIn>
        
        {/* 底部三行文案 - 完美居中 */}
        <div className="absolute bottom-8 left-0 w-full flex flex-col items-center justify-center gap-2 px-4 text-center z-20 pointer-events-none">
          <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-medium">
            © 2025 ANAN DESIGN. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[10px] md:text-xs text-gray-600 uppercase tracking-widest opacity-80">
            POWERED BY GOOGLE GEMINI 3.0 PRO
          </p>
          <p className="text-[9px] md:text-[10px] text-gray-600 uppercase tracking-widest opacity-60">
            ver.1.14051211
          </p>
        </div>
      </section>
    </main>
  );
}

function FadeIn({ children, delay = 0, forceShow = false }: { children: React.ReactNode, delay?: number, forceShow?: boolean }) {
  if (forceShow) return <div className="opacity-100">{children}</div>;
  return <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, ease: "easeOut", delay }}>{children}</motion.div>;
}

function SocialIcon({ href, icon, label, hoverColor }: any) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3">
      <div className="relative p-5 border border-white/20 rounded-full bg-black group-hover:scale-110 transition-all duration-300" style={{ color: 'white' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = hoverColor; e.currentTarget.style.color = hoverColor; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white'; }}>
        <div className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" style={{ backgroundColor: hoverColor }}></div>
        <div className="relative z-10">{icon}</div>
      </div>
      <span className="text-[10px] tracking-widest text-gray-500 uppercase group-hover:text-white transition-colors">{label}</span>
    </a>
  );
}

function ProjectCard({ item, onClick }: { item: any, onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div className="group cursor-pointer relative" onClick={onClick}>
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#ff0055] scale-100 translate-x-0 translate-y-0 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-200 z-0 opacity-0 group-hover:opacity-80 mix-blend-screen blur-md"></div>
        <div className="absolute inset-0 bg-[#00fff2] scale-100 translate-x-0 translate-y-0 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-200 z-0 opacity-0 group-hover:opacity-80 mix-blend-screen blur-md"></div>
        
        <div className="relative z-10 overflow-hidden aspect-[3/4] bg-gray-900 rounded-none border border-transparent group-hover:border-white transition-colors duration-300">
          {item.type === 'video' ? (
            <>
              <video ref={videoRef} src={item.video} poster={item.poster} autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
              <button onClick={togglePlay} className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-600 hover:border-purple-600 z-20">
                {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
              </button>
            </>
          ) : (
            <motion.img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:brightness-110" />
          )}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
        </div>
      </div>
      
      <div className="flex justify-between items-end border-b border-white/30 pb-4">
        <div>
           <p className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-1">{item.category}</p>
           <h3 className="text-3xl font-black uppercase italic group-hover:translate-x-2 transition-transform duration-300">{item.title}</h3>
        </div>
        <div className="flex-shrink-0 w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white group-hover:bg-purple-600 group-hover:border-purple-600 group-hover:text-white transition-all duration-300 group-hover:rotate-45">
           <MdArrowOutward size={24} />
        </div>
      </div>
    </motion.div>
  );
}
