'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from "react-icons/io5";
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import { client } from '@/sanity/lib/client';
import dynamic from 'next/dynamic';

// 🛠️ 紧急回滚：改回最原始的 import 方式，这是最安全的
// 使用 .then(mod => mod.default) 确保兼容性
const ReactPlayer = dynamic(() => import('react-player').then(mod => mod.default), { ssr: false });

const getFileUrl = (ref: string) => {
  if (!ref) return null;
  const parts = ref.split('-');
  if (parts.length < 3) return null;
  const id = parts[1]; 
  const format = parts[parts.length - 1];

  const { projectId, dataset } = client.config();

  if (!projectId || !dataset) {
    console.error("❌ 无法自动获取 Project ID");
    return null;
  }
  
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${format}`;
};

const getBilibiliId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(BV[a-zA-Z0-9]+)/);
  return match ? match[1] : null;
};

const ptComponents = {
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

      // 1. B站
      const isBilibili = value.url?.includes('bilibili.com');
      const bvid = isBilibili ? getBilibiliId(value.url) : null;
      
      if (isBilibili && bvid) {
        return (
          <div style={wrapperStyle} className="w-full aspect-video bg-black rounded overflow-hidden shadow-lg">
             <iframe 
               src={`//player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0`} 
               className="w-full h-full"
               scrolling="no" 
               frameBorder="0" 
               allowFullScreen
             />
             {value.caption && <p className="text-center text-sm text-gray-500 mt-2 italic">{value.caption}</p>}
          </div>
        )
      }

      // 2. 文件上传
      const fileUrl = value.videoFile?.asset?._ref ? getFileUrl(value.videoFile.asset._ref) : null;
      
      if (fileUrl) {
        return (
          <div style={wrapperStyle} className="w-full bg-black relative shadow-lg group">
             <video 
               src={fileUrl}
               className="w-full h-auto block" 
               controls
               autoPlay={value.autoplay}
               loop={value.autoplay}
               muted={value.autoplay}
               playsInline
               onError={(e) => {
                 const target = e.target as HTMLVideoElement;
                 target.style.display = 'none'; 
                 if (target.parentElement) {
                    const err = document.createElement('div');
                    err.className = 'text-red-500 text-center py-10 border border-red-500';
                    err.innerHTML = `⚠️ 视频加载失败<br/><span class="text-xs text-gray-400">${fileUrl}</span>`;
                    target.parentElement.appendChild(err);
                 }
               }}
             >
               您的浏览器不支持 HTML5 视频播放。
             </video>
             {value.caption && <p className="text-center text-sm text-gray-500 mt-2 italic">{value.caption}</p>}
          </div>
        );
      }

      // 3. 外部链接
      if (value.url) {
        return (
          <div style={wrapperStyle} className="w-full aspect-video bg-black relative shadow-lg">
            {/* 使用 as any 彻底解决类型报错 */}
            <ReactPlayer 
              {...{
                url: value.url,
                width: "100%",
                height: "100%",
                controls: true,
                playing: value.autoplay,
                loop: value.autoplay,
                muted: value.autoplay,
                onError: () => console.log('Video Load Error')
              } as any}
            />
            
            <div className="absolute inset-0 flex items-center justify-center -z-10 text-gray-600 text-xs">
              Loading Video...
            </div>
            {value.caption && <p className="text-center text-sm text-gray-500 mt-2 italic">{value.caption}</p>}
          </div>
        );
      }

      return null;
    },

    block: {
      normal: ({children}: any) => <p className="mb-6 leading-relaxed text-gray-300">{children}</p>,
      normal_left: ({children}: any) => <p className="mb-6 leading-relaxed text-gray-300 text-left">{children}</p>,
      normal_center: ({children}: any) => <p className="mb-6 leading-relaxed text-gray-300 text-center">{children}</p>,
      normal_right: ({children}: any) => <p className="mb-6 leading-relaxed text-gray-300 text-right">{children}</p>,
      h1: ({children}: any) => <h1 className="text-4xl font-black text-white mt-16 mb-8">{children}</h1>,
      h1_center: ({children}: any) => <h1 className="text-4xl font-black text-white mt-16 mb-8 text-center">{children}</h1>,
      h2: ({children}: any) => <h2 className="text-3xl font-bold text-white mt-12 mb-6">{children}</h2>,
      h2_center: ({children}: any) => <h2 className="text-3xl font-bold text-white mt-12 mb-6 text-center">{children}</h2>,
      h3: ({children}: any) => <h3 className="text-2xl font-bold text-purple-400 mt-10 mb-4">{children}</h3>,
      blockquote: ({children}: any) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-8 bg-white/5 p-4 rounded-r text-left">{children}</blockquote>,
    }
  }
};

export default function ProjectModal({ project, isOpen, onClose }: { project: any, isOpen: boolean, onClose: () => void }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl !cursor-none"
        >
          <button 
            onClick={onClose} 
            className="fixed top-6 right-6 md:top-10 md:right-10 text-white z-[110] p-3 border border-white/20 rounded-full bg-black/50 hover:bg-white hover:text-black transition-colors backdrop-blur-md cursor-none"
          >
            <IoClose size={32} />
          </button>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
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
