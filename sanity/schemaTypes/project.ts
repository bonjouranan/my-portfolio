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

    // 封面类型选择 (只控制 Video URL 是否显示)
    defineField({
      name: 'type',
      title: 'Cover Type',
      type: 'string',
      options: { list: [{title:'Image',value:'image'}, {title:'Video (URL)',value:'video'}], layout: 'radio' },
      initialValue: 'image',
    }),
    
    // ⚡️ 修复：无论选什么类型，这里都能上传图片 ⚡️
    // 1. 首页封面 / 视频封面
    defineField({
      name: 'mainImage',
      title: 'Cover Image (Homepage / Video Poster)',
      description: '如果类型选 Image，这就是首页封面；如果选 Video，这就是视频未加载时的占位图。',
      type: 'image',
      options: { hotspot: true },
      // hidden: ... 删掉了！
    }),

    // 2. 二级页封面 (始终显示)
    defineField({
      name: 'secondaryImage',
      title: 'Cover Image (Archive Page)',
      description: '二级页展示的封面图（如果不填，默认使用首页封面）',
      type: 'image',
      options: { hotspot: true },
      // hidden: ... 删掉了！
    }),

    // 视频链接 (只在选 Video 时显示)
    defineField({
      name: 'videoUrl',
      title: 'Cover Video URL (MP4)',
      type: 'url',
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
        defineField({
          name: 'videoEmbed',
          title: 'Video Embed (视频链接)',
          type: 'object',
          fields: [
            { name: 'url', title: 'Video URL', type: 'url' },
            { name: 'caption', title: 'Caption', type: 'string' },
            { name: 'autoplay', title: 'Autoplay', type: 'boolean', initialValue: false }
          ],
          preview: { select: { title: 'url' } }
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
