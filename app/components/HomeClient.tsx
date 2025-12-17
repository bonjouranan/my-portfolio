// 📍 文件: app/components/HomeClient.tsx
// ✨ 已更新：实现了点击“全部作品”触发加载动画，以及卡片标题悬浮右移效果。

'use client';

// --- 1. 依赖项导入 ---
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import Link from 'next/link'; // ❌ 移除 Link，改为用 router 跳转以配合动画
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // ✅ 新增：用于页面跳转

// 👇 引入 Context (用于控制加载动画)
import { useLoader } from '../context/LoaderContext'; 

// 导入我们自定义的组件
import TiltedCard from './TiltedCard';
import ColorBends from './ColorBends';
import ParticleScene from './ParticleScene';
import PlayfulText from './PlayfulText';
import ProjectModal from './ProjectModal';
import SectionHeader from './SectionHeader';
import BottomGlow from './BottomGlow';

// 导入图标库
import { FaBehance, FaBilibili, FaPlay, FaPause, FaWeixin } from "react-icons/fa6";
import { SiXiaohongshu, SiGmail } from "react-icons/si";
import { IoArrowDown, IoClose } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";

// --- 2. 主题配置 ---
const THEME_CONFIG = {
  sectionTitle: { color: "#ffffff", mobileSize: "36px", desktopSize: "60px", weight: 700, italic: false, letterSpacing: "0em" },
  sectionSub: { color: "#9ca3af", size: "0.875rem", weight: 400, spacing: "0.1em" },
  about: {
    subHeadlineColor: "#9435e9", subHeadlineSize: "0.8rem", subHeadlineWeight: 700,
    nameColor: "#ffffff", nameSize: "60px", nameWeight: 900,
    roleColor: "#ffffff", roleSize: "60px", roleWeight: 900,
    bodyColor: "#a3a3a3", bodySize: "1.5rem", bodyWeight: 300,
    skillColor: "#cacaca", skillBorder: "#383838ff", skillBorderWidth: "1px",
    skillHoverBg: "#ffffff", skillHoverText: "#000000", skillWeight: 600,
  }
};

// --- 3. 主页面组件 (HomeClient) ---
export default function HomeClient({ allProjects, profile, heroConfig }: any) {
  
  // ✅ 新增：获取路由和动画触发器
  const router = useRouter();
  const { triggerIntro } = useLoader();

  // --- 3.1. 状态管理 (State) ---
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [skipIntro, setSkipIntro] = useState(false);
  const [showWechat, setShowWechat] = useState(false);
  const [particleStart, setParticleStart] = useState(false);
  const [isIpad, setIsIpad] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  // --- 3.2. 副作用钩子 (useEffect) ---
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

  // ✅ 新增：处理点击“全部作品”的逻辑
  const handleViewAll = () => {
    triggerIntro(); // 1. 触发加载动画
    // 2. 稍微延迟跳转，让动画开始播放
    setTimeout(() => {
      router.push('/works');
    }, 100);
  };

  // --- 3.3. 变量定义 ---
  const START_DELAY = skipIntro ? 0 : 2.5;
  const wechatQrUrl = profile?.socials?.wechatQr || null;
  const visibleProjects = allProjects.slice(0, Math.min(visibleCount, 8));

  // --- 3.4. JSX 结构渲染 ---
  return (
    <main className={`bg-black min-h-screen text-white overflow-x-hidden selection:bg-purple-500 selection:text-white relative ${isIpad ? 'cursor-none' : ''}`}>
      
      {/* 
        👇 ✨✨✨【背景终极调参区 V2.0】✨✨✨ 👇
      */}
      <div className="fixed inset-0 z-0">
        <ColorBends 
          // --- 🎨 颜色模式切换 (colors) ---
          // brightness={0.25}
          // speed={0.5}
          // scale={0.6}
          // frequency={1.01}
          // warpStrength={1.01}
          // noise={0.4}
          // rotation={0}
          // autoRotate={5}
          // mouseInfluence={0.5}
          // parallax={0.1}
          // (保持你原有的配置)
          brightness={0.25}
          speed={0.5}
          scale={0.6}
          frequency={1.01}
          warpStrength={1.01}
          noise={0.4}
          rotation={0}
          autoRotate={5}
          mouseInfluence={0.5}
          parallax={0.1}
        />
      </div>

      {/* 
        👇 ✨✨✨【黑色渐变遮罩】✨✨✨ 👇
      */}
      <div className="absolute top-[100vh] inset-x-0 z-[5] pointer-events-none bg-gradient-to-b from-black to-transparent h-[150vh]" />

      {/* --- 全局组件 --- */}
      <BottomGlow />
      {wechatQrUrl && <div className="hidden"><Image src={wechatQrUrl} alt="preload" width={1} height={1} /></div>}
      <ProjectModal project={selectedProject || {}} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />

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

      {/* --- 4. 首屏 (Hero Section) --- */}
      <section className="h-screen w-full relative z-10 bg-black flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
        <div className="relative z-20 text-center pointer-events-auto mix-blend-difference">
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: START_DELAY + 0.2, duration: 1, ease: "circOut" }} className="h-[1px] w-24 bg-gray-600 mx-auto mb-6 origin-center" whileHover={{ width: 100, height: 2, background: "linear-gradient(90deg, #ff0000, #00ff00, #0000ff)" }}></motion.div>
          
          <div className="mb-4">
            <PlayfulText text={heroConfig?.topSmallText || "@Ver.1.04      2024-2025   "} delay={START_DELAY + 0.6} className="text-sm md:text-base tracking-[0.5em] text-gray-400 justify-center" isHollow={false} isTitle={false} />
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

      {/* --- 5. 内容区 (Works, About, Contact) --- */}
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
            
            {/* 👇 修改：使用 handleViewAll 触发加载动画 */}
            <div className="w-full">
               <button 
                 onClick={handleViewAll}
                 className="w-full px-12 py-4 bg-white text-black hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest text-sm font-bold"
               >
                 View All丨全部作品
               </button>
            </div>
          </div>
        </FadeIn>
      </section>

      <section id="about" className="py-32 px-4 md:px-12 max-w-[1600px] mx-auto relative z-10">
        <FadeIn forceShow={skipIntro}>
          <SectionHeader title="@ABOUT" rightContent={profile?.subHeadline || "WHO IS ANAN?"} />
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="leading-tight mb-12">
              <h2 className="block mb-2" style={{ color: THEME_CONFIG.about.nameColor, fontSize: `clamp(32px, 5vw, ${THEME_CONFIG.about.nameSize})`, fontWeight: THEME_CONFIG.about.nameWeight }}>{profile?.name || "Anan 安安"}</h2>
              <h3 className="block" style={{ color: THEME_CONFIG.about.roleColor, fontSize: `clamp(32px, 5vw, ${THEME_CONFIG.about.roleSize})`, fontWeight: THEME_CONFIG.about.roleWeight }}>{profile?.role || "L视觉设计师"}</h3>
            </div>
            
            <p className="leading-relaxed mb-12 whitespace-pre-wrap" style={{ color: THEME_CONFIG.about.bodyColor, fontSize: THEME_CONFIG.about.bodySize, fontWeight: THEME_CONFIG.about.bodyWeight }}>{profile?.about || "Loading bio..."}</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.skills?.map((skill: string) => (
                <span key={skill} className="px-6 py-2 border rounded-full transition-all cursor-default skill-tag"
                  style={{ color: THEME_CONFIG.about.skillColor, borderColor: THEME_CONFIG.about.skillBorder, borderWidth: THEME_CONFIG.about.skillBorderWidth, fontWeight: THEME_CONFIG.about.skillWeight } as any}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME_CONFIG.about.skillHoverBg; e.currentTarget.style.color = THEME_CONFIG.about.skillHoverText; e.currentTarget.style.borderColor = THEME_CONFIG.about.skillHoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = THEME_CONFIG.about.skillColor; e.currentTarget.style.borderColor = THEME_CONFIG.about.skillBorder; }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      <section id="contact" className="py-32 pb-64 md:pb-48 px-4 md:px-12 max-w-[1600px] mx-auto flex flex-col justify-center relative z-10">
        <FadeIn forceShow={skipIntro}>
          <SectionHeader title="@CONTACT" rightContent="LINK." />
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

        <div className="absolute bottom-8 left-0 w-full flex flex-col items-center justify-center gap-2 px-4 text-center z-20 pointer-events-none">
          <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-medium">© 2025 ANAN DESIGN. ALL RIGHTS RESERVED.</p>
          <p className="text-[10px] md:text-xs text-gray-600 uppercase tracking-widest opacity-80">Version 1.04 - 25.12.16</p>
        </div>
      </section>
      
      {/* 
        👇 ✨✨✨【新增：页面底部向上渐变遮罩】✨✨✨ 👇 
        放在 <main> 结束前，确保它覆盖在内容最底层但位于背景之上
      */}
      <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-black to-transparent z-[1] pointer-events-none" />

    </main>
  );
}

// --- 6. 辅助组件 ---

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
  return (
    <div
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[3/4] mb-6">
        {item.img ? (
          <TiltedCard
            imageSrc={item.img}
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
            {/* 👇 修正：添加了 group-hover:translate-x-2 实现悬浮右移 */}
            <h3 className="text-3xl font-black uppercase italic transition-all duration-300 group-hover:translate-x-2">{item.title}</h3>
          </div>
          <div className="flex-shrink-0 w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white group-hover:bg-purple-600 group-hover:border-purple-600 group-hover:text-white transition-all duration-300 group-hover:rotate-45">
            <MdArrowOutward size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
