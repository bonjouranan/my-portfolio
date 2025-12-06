import type { Metadata } from 'next'
import { Syne } from 'next/font/google'
import './globals.css'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import ScrollToTop from './components/ScrollToTop' // 1. 引入

const syne = Syne({ 
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-syne',
  display: 'swap', 
})

export const metadata: Metadata = {
  title: 'ANAN | Digital Designer',
  description: 'Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${syne.className} cursor-none bg-black text-white`}>
        
        <Preloader />
        <CustomCursor />
        <Navbar />
        
        {/* 2. 放置回到顶部按钮 (层级不用太高，比鼠标低就行) */}
        <ScrollToTop />
        
        <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.05]" 
             style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}>
        </div>

        {children}
      </body>
    </html>
  )
}
