import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Projects (作品)',
  type: 'document',
  fields: [
    defineField({ name: 'adminTitle', title: 'Admin Title', type: 'string' }),
    defineField({ name: 'title', title: 'Display Title', type: 'string' }),
    defineField({ name: 'showOnHome', title: 'Show on Homepage', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'Sort Order', type: 'number', initialValue: 0 }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'year', title: 'Year', type: 'string' }),

    // 封面
    defineField({
      name: 'type',
      title: 'Cover Type',
      type: 'string',
      options: { list: [{title:'Image',value:'image'}, {title:'Video (URL)',value:'video'}], layout: 'radio' },
      initialValue: 'image',
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ document }) => document?.type !== 'image',
    }),
    // 升级：支持任意视频链接
    defineField({
      name: 'videoUrl',
      title: 'Cover Video URL',
      type: 'url',
      description: '支持 MP4直链, YouTube, Vimeo, Bilibili (需填 .mp4 格式的 B站源或嵌入代码)',
      // 注意：B站链接通常不能直接 autoPlay，建议封面还是用 MP4 直链或短视频。
      hidden: ({ document }) => document?.type !== 'video',
    }),
    
    // 详情编辑器
    defineField({
      name: 'content',
      title: 'Project Details',
      type: 'array', 
      of: [
        { 
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url' },
                  { name: 'blank', type: 'boolean', title: 'New Tab', initialValue: true }
                ]
              },
              { name: 'textColor', title: 'Color', type: 'color' }
            ]
          }
        }, 
        { 
          type: 'image', 
          options: { hotspot: true },
          fields: [
            { name: 'caption', type: 'string', title: 'Caption' },
            { name: 'spacing', type: 'number', title: 'Spacing (px)', initialValue: 32 }
          ]
        },
        // 🔥 新增：视频嵌入 (URL) 🔥
        defineField({
          name: 'videoEmbed',
          title: 'Video Embed (视频链接)',
          type: 'object',
          fields: [
            { name: 'url', title: 'Video URL (YouTube, Vimeo, MP4...)', type: 'url' },
            { name: 'caption', title: 'Caption', type: 'string' },
            { name: 'autoplay', title: 'Autoplay', type: 'boolean', initialValue: false }
          ],
          preview: {
            select: { title: 'url' }
          }
        })
      ],
    }),
  ],
  preview: {
    select: { title: 'adminTitle', subtitle: 'title', media: 'mainImage' }
  },
  orderings: [
    { title: 'Sort Order', name: 'sortOrder', by: [{field: 'order', direction: 'asc'}] }
  ]
})
