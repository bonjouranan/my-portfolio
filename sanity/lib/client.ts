import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'hrwvrhof', // 你的 ID
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // 开发时设为 false 可以看到最新数据，上线可改为 true
})
