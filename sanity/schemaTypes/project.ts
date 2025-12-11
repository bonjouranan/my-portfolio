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

    // 封面类型选择
    defineField({
      name: 'type',
      title: 'Cover Type',
      type: 'string',
      options: { list: [{title:'Image',value:'image'}, {title:'Video (URL)',value:'video'}], layout: 'radio' },
      initialValue: 'image',
    }),
    
    // 1. 首页封面 (保持 3:4 不变)
    defineField({
      name: 'mainImage',
      title: 'Cover Image (Homepage / Video Poster)',
      description: '【首页专用】比例 3:4 (竖图)。建议尺寸：900x1200px。此图仅用于首页展示。',
      type: 'image',
      options: { hotspot: true },
    }),

    // 2. 二级页封面 (修改为 Behance 尺寸)
    defineField({
      name: 'secondaryImage',
      title: 'Cover Image (Archive Page)',
      // 💡 修正：明确标注支持 Behance 尺寸
      description: '【全部作品页专用】支持 Behance 封面尺寸 (808x632px)。你不需要专门裁切，直接上传 Behance 的封面图即可，前端已设为自适应比例。',
      type: 'image',
      options: { hotspot: true },
    }),

    // 视频链接
    defineField({
      name: 'videoUrl',
      title: 'Cover Video URL (MP4)',
      type: 'url',
      hidden: ({ document }) => document?.type !== 'video',
    }),
    
    // 详情编辑器 (保持不变)
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
