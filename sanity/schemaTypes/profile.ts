import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'profile',
  title: 'Profile (个人简介)',
  type: 'document',
  fields: [
    // 只保留 name, role, subHeadline, about, skills, socials
    defineField({
      name: 'name',
      title: 'Name (名字)',
      type: 'string',
      initialValue: 'Anan 安安',
    }),
    defineField({
      name: 'role',
      title: 'Role (职位)',
      type: 'string',
      initialValue: 'Visual Designer 视觉设计师',
    }),
    defineField({
      name: 'subHeadline',
      title: 'Sub Headline (小标题)',
      type: 'string',
      initialValue: 'WHO IS ANAN?',
    }),
    defineField({
      name: 'about',
      title: 'About Me (简介文案)',
      type: 'text', 
      rows: 4,
    }),
    defineField({
      name: 'skills',
      title: 'Skills (技能标签)',
      type: 'array',
      of: [{ type: 'string' }], 
    }),
    defineField({
      name: 'socials',
      title: 'Social Links (社交链接)',
      type: 'object',
      fields: [
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'wechatQr', title: 'Wechat QR (微信二维码)', type: 'image' },
        { name: 'behance', title: 'Behance URL', type: 'url' },
        { name: 'xiaohongshu', title: 'Red (小红书) URL', type: 'url' },
        { name: 'bilibili', title: 'Bilibili URL', type: 'url' },
      ]
    }),
  ],
})
