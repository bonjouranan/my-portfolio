'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWeixin } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export default function WechatModal() {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* 触发按钮：把它从 Contact 区域移到这里，状态只在这个组件内部变 */}
      <button onClick={() => setShow(true)} className="group flex flex-col items-center gap-3">
        <div className="relative p-5 border border-white/20 rounded-full bg-black group-hover:scale-110 group-hover:border-[#07c160] group-hover:text-[#07c160] transition-all duration-300">
          <div className="absolute inset-0 rounded-full bg-[#07c160] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
          <FaWeixin size={28} className="relative z-10" />
        </div>
        <span className="text-[10px] tracking-widest text-gray-500 uppercase group-hover:text-white transition-colors">Wechat</span>
      </button>

      {/* 弹窗本体 */}
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }} // 极速响应
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 translate-z-0" // 强制独立层
            onClick={() => setShow(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative bg-neutral-900 p-8 rounded-2xl border border-white/10 flex flex-col items-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShow(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><IoClose size={24}/></button>
              <h3 className="text-xl font-bold mb-6 text-purple-400 tracking-widest">SCAN TO CHAT</h3>
              <div className="p-2 bg-white rounded-lg">
                 {/* 确保图片已在 public 文件夹 */}
                 <img src="/wechat-qr.png" alt="Wechat QR" className="w-64 h-64 object-contain" />
              </div>
              <p className="text-sm text-gray-500 tracking-widest mt-4">ID: ANAN_DESIGN</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
