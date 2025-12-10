'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from "react-icons/io5";
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

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
      if (!value?.url) return null;
      return (
        <div className="my-12 w-full aspect-video bg-black">
          <ReactPlayer 
            {...{ url: value.url } as any} // 👈 这一招能绕过所有类型检查
            width="100%"
            height="100%"
            controls={true}
            playing={value.autoplay} 
            loop={value.autoplay}
            muted={value.autoplay}
          />
          {value.caption && <p className="text-center text-sm text-gray-500 mt-2 italic">{value.caption}</p>}
        </div>
      );
    }
  },
  
  block: {
    normal: ({children}: any) => <p className="mb-6 leading-relaxed text-gray-300">{children}</p>,
    h1: ({children}: any) => <h1 className="text-4xl font-black text-white mt-16 mb-8">{children}</h1>,
    h2: ({children}: any) => <h2 className="text-3xl font-bold text-white mt-12 mb-6">{children}</h2>,
    h3: ({children}: any) => <h3 className="text-2xl font-bold text-purple-400 mt-10 mb-4">{children}</h3>,
    blockquote: ({children}: any) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-8 bg-white/5 p-4 rounded-r">{children}</blockquote>,
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
          // ⚡️ 强制隐藏系统鼠标 (!cursor-none)
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl !cursor-none"
        >
          <button 
            onClick={onClose} 
            // 按钮也要 cursor-none，否则移上去会显示小手
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
                  <p className="text-purple-400 font-bold tracking-[0.2em] mb-4 text-lg uppercase">{project.category} — {project.year}</p>
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
