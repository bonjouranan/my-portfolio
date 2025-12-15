import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import WorksClient from './WorksClient';

export const revalidate = 60; // 60秒 ISR 缓存

export default async function WorksPage() {
  const data = await client.fetch(`*[_type == "project"] | order(order desc) {
    title, 
    category,          
    filterCategories, 
    "img": mainImage, 
    "img2": secondaryImage, 
    year, type, videoUrl, content
  }`);

  const formatted = data.map((item: any) => ({
    ...item,
    id: item.title,
    // 优先使用 img2，没有则用 img
    img: item.img2 ? urlFor(item.img2).url() : (item.img ? urlFor(item.img).url() : null),
    video: item.videoUrl,
    poster: item.img ? urlFor(item.img).url() : null,
    filterCategories: item.filterCategories || [] 
  }));

  return <WorksClient initialWorks={formatted} />;
}
