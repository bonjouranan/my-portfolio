import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import HomeClient from './components/HomeClient';

// ✅ ISR 配置：每 60 秒重新生成一次页面，保证数据新鲜
export const revalidate = 60;

async function getData() {
  // 1. 获取项目
  const projectsData = await client.fetch(`*[_type == "project" && showOnHome == true] | order(order asc) {
    title, category, "img": mainImage, year, type, videoUrl, coverVideoFile, content
  }`);
  
  // 2. 获取个人资料
  const profileData = await client.fetch(`*[_type == "profile"][0] {
    name, role, about, skills, socials, subHeadline
  }`);

  // 3. 获取 Hero 配置
  const heroData = await client.fetch(`*[_type == "hero"][0] {
    topSmallText, line1, line2, heroStyle
  }`);

  // 辅助函数：处理 Sanity 文件链接
  const { projectId, dataset } = client.config();
  const getFileUrl = (ref: string) => {
    if (!ref) return null;
    const parts = ref.split('-');
    if (parts.length < 3) return null;
    const id = parts[1];
    const format = parts[parts.length - 1];
    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${format}`;
  };

  // 数据格式化 (把 urlFor 的工作移到服务器做)
  const formattedProjects = projectsData.map((item: any) => {
    let videoSrc = item.videoUrl;
    if (item.coverVideoFile?.asset?._ref && projectId && dataset) {
       videoSrc = getFileUrl(item.coverVideoFile.asset._ref);
    }
    return {
      ...item,
      img: item.img ? urlFor(item.img).url() : null, // 转换为字符串 URL
      video: videoSrc, 
      poster: item.img ? urlFor(item.img).url() : null,
    };
  });

  const formattedProfile = {
      ...profileData,
      socials: {
          ...profileData?.socials,
          wechatQr: profileData?.socials?.wechatQr ? urlFor(profileData.socials.wechatQr).url() : null
      }
  };

  return {
    allProjects: formattedProjects,
    profile: formattedProfile,
    heroConfig: heroData
  };
}

export default async function Page() {
  const data = await getData();
  // 把处理好的数据传给客户端组件
  return <HomeClient {...data} />;
}
