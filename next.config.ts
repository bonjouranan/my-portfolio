import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 允许 Vercel 优化并代理 Sanity 的图片
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;
