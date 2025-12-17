// 📍 文件: app/components/MainContent.tsx (100%完整的最终版)

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBehance, FaBilibili, FaWeixin } from "react-icons/fa6";
import { SiXiaohongshu, SiGmail } from "react-icons/si";
import { MdArrowOutward } from "react-icons/md";

// 引入所有需要的子组件
import TiltedCard from './TiltedCard';
import SectionHeader from './SectionHeader';
import ColorBends from './ColorBends';

// 从 HomeClient 复制过来的辅助组件
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
      
      <motion.div whileHover={{ y: -8 }}>
        <div className="flex justify-between items-end border-b border-white/30 pb-4">
          <div>
            <p className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-1">{item.category}</p>
            <h3 className="text-3xl font-black uppercase italic group-hover:text-purple-300 group-hover:translate-x-2 transition-all duration-300">{item.title}</h3>
          </div>
          <div className="flex-shrink-0 w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white group-hover:bg-purple-600 group-hover:border-purple-600 group-hover:text-white transition-all duration-300 group-hover:rotate-45">
            <MdArrowOutward size={24} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}


// 定义组件接收的 props 类型
interface MainContentProps {
  allProjects: any[];
  profile: any;
  skipIntro: boolean;
  visibleCount: number;
  setVisibleCount: (count: number) => void;
  setSelectedProject: (project: any) => void;
  setShowWechat: (show: boolean) => void; // 新增
  THEME_CONFIG: any;
}

export default function MainContent({
  allProjects,
  profile,
  skipIntro,
  visibleCount,
  setVisibleCount,
  setSelectedProject,
  setShowWechat, // 新增
  THEME_CONFIG
}: MainContentProps) {
  const visibleProjects = allProjects.slice(0, Math.min(visibleCount, 8));

  return (
    <div className="relative">
      <ColorBends 
        className="absolute top-0 left-0 w-full h-full"
        colors={['#9435E9', '#FF0055', '#00FFF2']}
        speed={0.1}
        mouseInfluence={0.2}
        warpStrength={1.2}
        scale={1.2}
      />
      <div className="relative z-10">
        <section id="work" className="py-32 px-4 md:px-12 max-w-[1600px] mx-auto">
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
                <button onClick={() => setVisibleCount(Math.min(visibleCount + 4, 8))} className="w-full px-12 py-4 bg-white text-black hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest text-sm font-bold">Load More丨加载更多</button>
              )}
              <Link href="/works" className="w-full">
                <button className="w-full px-12 py-4 bg-white text-black hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest text-sm font-bold">View All丨全部作品</button>
              </Link>
            </div>
          </FadeIn>
        </section>
        <section id="about" className="py-32 px-4 md:px-12 max-w-[1600px] mx-auto">
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
        <section id="contact" className="pt-32 pb-64 md:pb-48 px-4 md:px-12 max-w-[1600px] mx-auto flex flex-col justify-center">
          <FadeIn forceShow={skipIntro}>
            <SectionHeader title="@CONTACT" rightContent="LINK." />
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {profile?.socials?.wechatQr && (
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
        </section>
      </div>
    </div>
  );
}
