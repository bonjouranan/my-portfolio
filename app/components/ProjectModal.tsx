'use client';

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from "react-icons/io5";
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import { client } from '@/sanity/lib/client';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player').then(mod => mod.default), { ssr: false });

// --- 辅助函数 ---

const getFileUrl = (ref: string) => {
  if (!ref) return null;
  const parts = ref.split('-');
  if (parts.length < 3) return null;
  const id = parts[1]; 
  const format = parts[parts.length - 1];
  const config = client.config();
  const projectId = config.projectId;
  const dataset = config.dataset || 'production';
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${format}`;
};

const getBilibiliId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(BV[a-zA-Z0-9]+)/);
  return match ? match[1] : null;
};

// ✨✨✨ 修复部分开始 ✨✨✨

// 鼠标进入视频/媒体区域
const handleMouseEnterMedia = () => {
  // 🔒 安全锁：只有当 body 被锁定（说明弹窗是完全打开状态）时，才允许进入媒体模式
  // 这防止了在弹窗关闭动画期间（此时 overflow 已被重置），鼠标划过视频导致光标再次消失的 Bug
  if (document.body.style.overflow === 'hidden') {
    document.body.classList.add('hovering-media');
  }
};

// 鼠标离开视频/媒体区域
const handleMouseLeaveMedia = () => {
  document.body.classList.remove('hovering-media');
};

// ✨✨✨ 修复部分结束 ✨✨✨

export default function ProjectModal({ project, isOpen, onClose }: { project: any, isOpen: boolean, onClose: () => void }) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      // 当关闭时，立即恢复所有状态
      document.body.style.overflow = '';
      document.body.classList.remove('hovering-media');
    }
    
    // 组件销毁时的彻底清理
    return () => { 
      document.body.style.overflow = ''; 
      document.body.classList.remove('hovering-media');
    }
  }, [isOpen]);

  const ptComponents = useMemo(() => {
    return {
      marks: {
        link: ({value, children}: any) => {
          const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
          return <a href={value?.href} target={target} rel="noopener noreferrer" className="text-purple-400 underline font-bold cursor-none">{children}</a>
        },
        textColor: ({value, children}: any) => <span style={{ color: value?.hex }}>{children}</span>
      },
      types: {
        image: ({ value }: any) => {
          if (!value?.asset?._ref) return null;
          const spacing = value.spacing !== undefined ? value.spacing : 32;
          return (
            <div style={{ marginBottom: `${spacing}px`, marginTop: `${spacing}px` }}>
              <img alt={value.alt || ''} loading="lazy" src={urlFor(value).url()} className="w-full rounded-none block" />
              {value.caption && <p className="text-center text-sm text-gray-500 mt-2 italic">{value.caption}</p>}
            </div>
          );
        },
        videoEmbed: ({ value }: any) => {
          const spacing = value.spacing !== undefined ? value.spacing : 32;
          const wrapperStyle = { marginTop: `${spacing}px`, marginBottom: `${spacing}px` };
          
          const isBilibili = value.url?.includes('bilibili.com');
          const bvid = isBilibili ? getBilibiliId(value.url) : null;
          
          if (isBilibili && bvid) {
            return (
              <div 
                style={wrapperStyle} 
                className="w-full aspect-video bg-black rounded overflow-hidden shadow-lg cursor-auto"
                onMouseEnter={handleMouseEnterMedia}
                onMouseLeave={handleMouseLeaveMedia}
              >
                 <iframe 
                   src={`//player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0`} 
                   className="w-full h-full pointer-events-auto"
                   scrolling="no" 
                   frameBorder="0" 
                   allowFullScreen
                 />
                 {value.caption && <p className="text-center text-sm text-gray-500 mt-2 italic">{value.caption}</p>}
              </div>
            )
          }

          const fileUrl = value.videoFile?.asset?._ref ? getFileUrl(value.videoFile.asset._ref) : null;
          if (fileUrl) {
            return (
              <div 
                style={wrapperStyle} 
                className="w-full bg-black relative shadow-lg group cursor-auto"
                onMouseEnter={handleMouseEnterMedia}
                onMouseLeave={handleMouseLeaveMedia}
              >
                 <video src={fileUrl} className="w-full h-auto block" controls autoPlay={value.autoplay} loop={value.autoplay} muted={value.autoplay} playsInline />
                 {value.caption && <p className="text-center text-sm text-gray-500 mt-2 italic">{value.caption}</p>}
              </div>
            );
          }

          if (value.url) {
            return (
              <div 
                style={wrapperStyle} 
                className="w-full aspect-video bg-black relative shadow-lg cursor-auto"
                onMouseEnter={handleMouseEnterMedia}
                onMouseLeave={handleMouseLeaveMedia}
              >
                <ReactPlayer {...{ url: value.url, width: "100%", height: "100%", controls: true, playing: value.autoplay, loop: value.autoplay, muted: value.autoplay, config: { youtube: { playerVars: { showinfo: 1 } } } } as any} />
                {value.caption && <p className="text-center text-sm text-gray-500 mt-2 italic">{value.caption}</p>}
              </div>
            );
          }
          return null;
        }
      },
      block: {
        normal: ({children}: any) => <p className="mb-6 leading-relaxed text-gray-300">{children}</p>,
        h1: ({children}: any) => <h1 className="text-4xl font-black text-white mt-16 mb-8">{children}</h1>,
        h2: ({children}: any) => <h2 className="text-3xl font-bold text-white mt-12 mb-6">{children}</h2>,
        blockquote: ({children}: any) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-8 bg-white/5 p-4 rounded-r text-left">{children}</blockquote>,
      }
    };
  }, []);

  const customBgColor = project.backgroundColor?.hex || 'rgba(18, 18, 18, 0.98)';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0, pointerEvents: 'none' }} 
          style={{ backgroundColor: customBgColor }}
          className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-xl cursor-none"
        >
          {/* 固定按钮容器 */}
          <div className="fixed top-0 left-0 right-0 z-[120] pointer-events-none">
            <div className="max-w-5xl mx-auto px-4 md:px-8 relative">
              <button 
                onClick={() => {
                  // 点击时立即手动清除一次状态
                  document.body.classList.remove('hovering-media');
                  onClose();
                }} 
                className="pointer-events-auto absolute top-6 right-4 md:top-10 md:-right-16 text-white p-3 border border-white/20 rounded-full bg-black/50 hover:bg-white hover:text-black transition-colors backdrop-blur-md cursor-none"
              >
                <IoClose size={28} />
              </button>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 overflow-y-auto no-scrollbar cursor-none"
          >
            <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pb-32">
              <div className="pt-32 pb-12 text-center border-b border-white/10 mb-12">
                 <p className="text-purple-400 font-bold tracking-[0.2em] mb-4 text-lg uppercase">{project.category}</p>
                 <h1 className="text-4xl md:text-7xl font-black uppercase leading-tight">{project.title}</h1>
              </div>

              {project.content ? (
                <div className="prose prose-invert prose-lg max-w-none text-center cursor-none">
                  <PortableText value={project.content} components={ptComponents} />
                </div>
              ) : (
                <div className="text-center text-gray-500 py-20">No content details yet.</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
