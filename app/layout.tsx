'use client';

import { Syne } from 'next/font/google'
import './globals.css'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import ScrollToTop from './components/ScrollToTop'
import { usePathname } from 'next/navigation'
// 👇 新增引入
import { LoaderProvider } from './context/LoaderContext'

const syne = Syne({ 
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-syne',
  display: 'swap', 
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');

  return (
    <html lang="en">
      <body 
        className={`
          ${syne.className} 
          ${isStudio ? 'bg-white text-black cursor-auto' : 'bg-black text-white cursor-none'}
        `}
      >
        {/* 👇 包裹 LoaderProvider */}
        <LoaderProvider>
           
           {/* 1. 只有前台才显示特效 */}
           {!isStudio && (
             <>
               <Preloader />
               <CustomCursor />
               <Navbar />
               <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.05]" 
                    style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}>
               </div>
             </>
           )}

           {/* 2. 页面主体内容 */}
           {children}

           {/* 3. ScrollToTop */}
           {!isStudio && <ScrollToTop />}

        </LoaderProvider>
      </body>
    </html>
  )
}
