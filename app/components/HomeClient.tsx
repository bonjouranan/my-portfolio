'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLoader } from '../context/LoaderContext'; 
import TiltedCard from './TiltedCard';
import ColorBends from './ColorBends';
import ParticleScene from './ParticleScene';
import PlayfulText from './PlayfulText';
import ProjectModal from './ProjectModal';
import SectionHeader from './SectionHeader';
import BottomGlow from './BottomGlow';
import { FaBehance, FaBilibili, FaWeixin } from "react-icons/fa6";
import { SiXiaohongshu, SiGmail } from "react-icons/si";
import { IoArrowDown, IoClose } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";
// 引入 sanity client 配置以获取 projectId (如果不想引入 client，可以直接硬编码 projectId)
import { client } from '@/sanity/lib/client';

// --- 辅助函数：解析 Sanity 文件 URL ---
const getFileUrl = (ref: string) => {
  if (!ref) return null;
  // 格式如: file-123456...-mp4
  const parts = ref.split('-');
  if (parts.length < 3) return null;
  const id = parts[1]; 
  const format = parts[parts.length - 1];
  const config = client.config();
  const projectId = config.projectId;
  const dataset = config.dataset || 'production';
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${format}`;
};

// ... (THEME_CONFIG 保持不变)
const THEME_CONFIG = {
  sectionTitle: { color: "#ffffff", mobileSize: "36px", desktopSize: "60px", weight: 700, italic: false, letterSpacing: "0em" },
  sectionSub: { color: "#9ca3af", size: "0.875rem", weight: 400, spacing: "0.1em" },
  about: {
    subHeadlineColor: "#9435e9", subHeadlineSize: "0.8rem", subHeadlineWeight: 700,
    nameColor: "#ffffff", nameSize: "60px", nameWeight: 900,
    roleColor: "#ffffffff", roleSize: "60px", roleWeight: 900,
    bodyColor: "#cececeff", bodySize: "1.4rem", bodyWeight: 400,
    skillColor: "#dadadaff", skillBorder: "#383838ff", skillBorderWidth: "1px",
    skillHoverBg: "#ffffff", skillHoverText: "#000000", skillWeight: 400,
  }
};

export default function HomeClient({ allProjects, profile, heroConfig }: any) {
  // ... (状态管理代码保持不变) ...
  const router = useRouter();
  const { triggerIntro } = useLoader();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [skipIntro, setSkipIntro] = useState(false);
  const [showWechat, setShowWechat] = useState(false);
  const [particleStart, setParticleStart] = useState(false);
  const [isIpad, setIsIpad] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const checkIsIpad = () => {
      if (typeof navigator === 'undefined') return false;
      return /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
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
  }, []);

  const handleViewAll = () => {
    triggerIntro();
    setTimeout(() => {
      router.push('/works');
    }, 100);
  };

  const START_DELAY = skipIntro ? 0 : 2.5;
  const wechatQrUrl = profile?.socials?.wechatQr || null;
  const visibleProjects = allProjects.slice(0, Math.min(visibleCount, 8));

  return (
    <main className={`bg-black min-h-screen text-white overflow-x-hidden selection:bg-purple-500 selection:text-white relative ${isIpad ? 'cursor-none' : ''}`}>
      
      {/* 背景组件 */}
      <div className="fixed inset-0 z-0">
        <ColorBends 
          brightness={0.2} speed={0.25} scale={0.6} frequency={1.01}
          warpStrength={1.01} noise={0.4} rotation={0} autoRotate={5}
          mouseInfluence={0.5} parallax={0.1}
        />
      </div>
      <div className="absolute top-[100vh] inset-x-0 z-[5] pointer-events-none bg-gradient-to-b from-black to-transparent h-[150vh]" />

      <BottomGlow />
      {wechatQrUrl && <div className="hidden"><Image src={wechatQrUrl} alt="preload" width={1} height={1} /></div>}
      
      {/* 弹窗组件 */}
      <ProjectModal project={selectedProject || {}} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />

      {/* 微信二维码弹窗 (保持不变) */}
      <AnimatePresence>
        {showWechat && wechatQrUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl cursor-auto" onClick={() => setShowWechat(false)}>
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-neutral-900 p-12 rounded-2xl border border-white/10 flex flex-col items-center shadow-2xl max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowWechat(false)} className="absolute top-4 right-4 p-2 border border-white/20 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors"><IoClose size={20} /></button>
              <h3 className="text-2xl font-black mb-8 text-purple-400 tracking-widest">SCAN TO CHAT</h3>
              <div className="p-2 bg-white rounded-xl relative w-64 h-64">
                <Image src={wechatQrUrl} alt="Wechat QR" fill className="object-contain" />
              </div>
              <p className="text-sm text-gray-500 tracking-widest mt-6 uppercase">ID: {profile?.name || 'ANAN'}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section (保持不变) */}
      <section className="h-screen w-full relative z-10 bg-black flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
        <div className="relative z-20 text-center pointer-events-auto mix-blend-difference">
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: START_DELAY + 0.2, duration: 1, ease: "circOut" }} className="h-[1px] w-24 bg-gray-600 mx-auto mb-6 origin-center" whileHover={{ width: 100, height: 2, background: "linear-gradient(90deg, #ff0000, #00ff00, #0000ff)" }}></motion.div>
          <div className="mb-4">
            <PlayfulText text={heroConfig?.topSmallText || "@Ver.1.05      2024-2025   "} delay={START_DELAY + 0.6} className="text-sm md:text-base tracking-[0.5em] text-gray-400 justify-center" isHollow={false} isTitle={false} />
          </div>
          <div className="text-[14vw] md:text-[10vw] leading-[0.9] font-black tracking-tighter cursor-default flex flex-col items-center">
            <PlayfulText text={heroConfig?.line1 || "ANAN’S"} delay={START_DELAY + 0.2} isTitle={true} />
            <PlayfulText text={heroConfig?.line2 || "Portfolio"} isHollow={heroConfig?.heroStyle === 'hollow'} delay={START_DELAY + 0.6} isTitle={true} />
          </div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: START_DELAY + 0.2, duration: 1, ease: "circOut" }} className="h-[1px] w-24 bg-gray-600 mx-auto mt-6 origin-center" whileHover={{ width: 100, height: 2, background: "linear-gradient(90deg, #00ffff, #ff00ff, #ffff00)" }}></motion.div>
        </div>
        <div className="absolute inset-0 z-0 opacity-80"><ParticleScene start={particleStart} /></div>
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: START_DELAY + 1.5 }} className="absolute bottom-12 flex flex-col items-center gap-2 text-xs tracking-widest animate-bounce z-20"><span>SCROLL TO EXPLORE</span><IoArrowDown size={20} /></motion.div>
      </section>

      {/* WORKS Section */}
      <section id="work" className="py-32 px-4 md:px-12 max-w-[1600px] mx-auto relative z-10">
        <FadeIn forceShow={skipIntro}>
          <SectionHeader title="@WORKS" rightContent={`(${visibleCount} / ${Math.min(allProjects.length, 8)})`} />
        </FadeIn>
        {allProjects.length === 0 ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">Loading selected projects...</div>
        ) : (
          <>
            <div className="flex flex-col gap-24 md:hidden">
              {visibleProjects.map((item: any, index: number) => (
                <FadeIn key={`mobile-${index}`} delay={index * 0.1} forceShow={skipIntro}><ProjectCard item={item} onClick={() => setSelectedProject(item)} /></FadeIn>
              ))}
            </div>
            <div className="hidden md:grid md:grid-cols-2 gap-12 md:gap-32">
              <div className="flex flex-col gap-24 md:gap-48">
                {visibleProjects.filter((_: any, i: number) => i % 2 === 0).map((item: any, index: number) => (
                  <FadeIn key={`desktop-left-${index}`} delay={index * 0.1} forceShow={skipIntro}><ProjectCard item={item} onClick={() => setSelectedProject(item)} /></FadeIn>
                ))}
              </div>
              <div className="flex flex-col gap-24 md:gap-48 md:pt-48">
                {visibleProjects.filter((_: any, i: number) => i % 2 !== 0).map((item: any, index: number) => (
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
            <div className="w-full">
               <button onClick={handleViewAll} className="w-full px-12 py-4 bg-white text-black hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest text-sm font-bold">View All丨全部作品</button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ABOUT Section 修改版 */}
      <section id="about" className="py-24 px-4 md:px-12 max-w-[1600px] mx-auto relative z-10">
           {/* 1. 标题单独触发 */}
           <FadeIn forceShow={skipIntro}>
             <SectionHeader title="@ABOUT" rightContent={profile?.subHeadline || "AN?"} />
           </FadeIn>

           <div className="max-w-4xl mx-auto text-center">
             
             {/* 2. 名字和职位单独触发，并加一点延迟 */}
             <FadeIn forceShow={skipIntro} delay={0.1}>
               <div className="leading-tight mb-12">
                 <h2 className="block mb-2" style={{ color: THEME_CONFIG.about.nameColor, fontSize: `clamp(32px, 5vw, ${THEME_CONFIG.about.nameSize})`, fontWeight: THEME_CONFIG.about.nameWeight }}>{profile?.name || "Anan 安安"}</h2>
                 <h3 className="block" style={{ color: THEME_CONFIG.about.roleColor, fontSize: `clamp(32px, 5vw, ${THEME_CONFIG.about.roleSize})`, fontWeight: THEME_CONFIG.about.roleWeight }}>{profile?.role || "L视觉设计师"}</h3>
               </div>
             </FadeIn>

             {/* 3. 正文文案重点！单独触发，用户滚到这里才浮现 */}
             <FadeIn forceShow={skipIntro} delay={0.2}>
               <p className="leading-relaxed mb-12 whitespace-pre-wrap" style={{ color: THEME_CONFIG.about.bodyColor, fontSize: THEME_CONFIG.about.bodySize, fontWeight: THEME_CONFIG.about.bodyWeight }}>{profile?.about || "Loading bio..."}</p>
             </FadeIn>

             {/* 4. 技能标签最后触发 */}
             <FadeIn forceShow={skipIntro} delay={0.3}>
               <div className="flex flex-wrap justify-center gap-4">
                 {profile?.skills?.map((skill: string) => (
                   <span key={skill} className="px-6 py-2 border rounded-full transition-all cursor-default skill-tag" style={{ color: THEME_CONFIG.about.skillColor, borderColor: THEME_CONFIG.about.skillBorder, borderWidth: THEME_CONFIG.about.skillBorderWidth, fontWeight: THEME_CONFIG.about.skillWeight } as any} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME_CONFIG.about.skillHoverBg; e.currentTarget.style.color = THEME_CONFIG.about.skillHoverText; e.currentTarget.style.borderColor = THEME_CONFIG.about.skillHoverBg; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = THEME_CONFIG.about.skillColor; e.currentTarget.style.borderColor = THEME_CONFIG.about.skillBorder; }}>{skill}</span>
                 ))}
               </div>
             </FadeIn>

           </div>
      </section>


      <section id="contact" className="py-24 pb-64 md:pb-48 px-4 md:px-12 max-w-[1600px] mx-auto flex flex-col justify-center relative z-10">
        <FadeIn forceShow={skipIntro}>
          <SectionHeader title="@CONTACT" rightContent="LINK." />
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {wechatQrUrl && (
                <button onClick={() => setShowWechat(true)} className="group flex flex-col items-center gap-3">
                  <div className="relative p-5 border border-white/20 rounded-full bg-black group-hover:scale-110 group-hover:border-[#07c160] group-hover:text-[#07c160] transition-all duration-300">
                    <div className="absolute inset-0 rounded-full bg-[#07c160] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <FaWeixin size={60} className="relative z-10" />
                  </div>
                  <span className="text-[10px] tracking-widest text-gray-500 uppercase group-hover:text-white transition-colors">Wechat</span>
                </button>
              )}
              {profile?.socials?.behance && <SocialIcon href={profile.socials.behance} icon={<FaBehance size={60} />} label="Behance" hoverColor="#1769ff" />}
              {profile?.socials?.xiaohongshu && <SocialIcon href={profile.socials.xiaohongshu} icon={<SiXiaohongshu size={60} />} label="Red" hoverColor="#ff2442" />}
              {profile?.socials?.bilibili && <SocialIcon href={profile.socials.bilibili} icon={<FaBilibili size={60} />} label="Bilibili" hoverColor="#fb7299" />}
              {profile?.socials?.email && <SocialIcon href={`mailto:${profile.socials.email}`} icon={<SiGmail size={60} />} label="Email" hoverColor="#d9ff00ff" />}
            </div>
          </div>
        </FadeIn>
        <div className="absolute bottom-8 left-0 w-full flex flex-col items-center justify-center gap-2 px-4 text-center z-20 pointer-events-none">
          <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-medium">© 2025 ANAN DESIGN. ALL RIGHTS RESERVED.</p>
          <p className="text-[10px] md:text-xs text-gray-600 uppercase tracking-widest opacity-80">Version 1.05 - 25.12.18</p>
        </div>
      </section>

      <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-black to-transparent z-[1] pointer-events-none" />
    </main>
  );
}

// ... (FadeIn 和 SocialIcon 组件保持不变)
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

// 👇👇👇 重点修改 ProjectCard 组件 👇👇👇
function ProjectCard({ item, onClick }: { item: any, onClick: () => void }) {
  
  // 1. 获取视频 URL (如果是文件则解析，如果是 URL 则直接使用)
  const videoFileUrl = item.coverVideoFile?.asset?._ref ? getFileUrl(item.coverVideoFile.asset._ref) : null;
  const finalVideoSrc = videoFileUrl || item.videoUrl;
  
  // 2. 判断是否展示视频 (后台类型是video 且 有视频源)
  const isVideo = item.type === 'video' && !!finalVideoSrc;

  // 3. 获取封面图 (如果是视频，mainImage 作为 poster)
  const imageSrc = item.mainImage ? (item.img || item.mainImage) : item.img; // 兼容不同数据结构

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="aspect-[3/4] mb-6">
        {(imageSrc || isVideo) ? (
          <TiltedCard
            imageSrc={imageSrc} // 即使是视频，也传封面图作为 Poster
            videoSrc={finalVideoSrc} // 传入视频地址
            isVideo={isVideo} // 告诉组件渲染 Video 标签
            altText={item.title}
            captionText={item.title}
            showGlow={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-800">
            <p className="text-neutral-600">No Image</p>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-end border-b border-white/30 pb-4">
          <div>
            <p className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-1">{item.category}</p>
            <h3 className="text-3xl font-black uppercase italic transition-all duration-300 group-hover:translate-x-2">{item.title}</h3>
            {/* 展示小标题 */}
            {item.subtitle && <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider">{item.subtitle}</p>}
          </div>
          <div className="flex-shrink-0 w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white group-hover:bg-purple-600 group-hover:border-purple-600 group-hover:text-white transition-all duration-300 group-hover:rotate-45">
            <MdArrowOutward size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
