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
    
    // --- 标签与分类 ---
    defineField({ 
      name: 'category', 
      title: 'Display Tag (作品卡片展示标签)', 
      description: '【仅展示】显示在作品卡片左下角的文字 (例如: VAPE - CGI & AIGC)。此处内容不会生成筛选按钮。',
      type: 'string' 
    }),
    defineField({
      name: 'filterCategories',
      title: 'Filter Categories (筛选分类)',
      description: '【筛选专用】在此处添加标签 (例如: CGI, COOL, AIGC)。只有这里出现的标签，才会生成网站顶部的筛选按钮。',
      type: 'array',
      of: [{type: 'string'}],
      options: { layout: 'tags' }
    }),

    defineField({ name: 'year', title: 'Year', type: 'string' }),

    // 封面类型选择
    defineField({
      name: 'type',
      title: 'Cover Type',
      type: 'string',
      options: { list: [{title:'Image',value:'image'}, {title:'Video (URL / Upload)',value:'video'}], layout: 'radio' },
      initialValue: 'image',
    }),
    
    // 1. 首页封面
    defineField({
      name: 'mainImage',
      title: 'Cover Image (Homepage / Video Poster)',
      description: '【首页专用】比例 3:4 (竖图)。如果类型选了 Video，这张图会作为视频加载前的封面 (Poster)。',
      type: 'image',
      options: { hotspot: true },
    }),

    // 2. 二级页封面
    defineField({
      name: 'secondaryImage',
      title: 'Cover Image (Archive Page)',
      description: '【全部作品页专用】支持 Behance 封面尺寸 (808x632px)。',
      type: 'image',
      options: { hotspot: true },
    }),

    // --- 封面视频配置 (修改后) ---
    defineField({
      name: 'videoUrl',
      title: 'Cover Video URL (Link)',
      description: '填入 .mp4 结尾的链接 (旧方式)',
      type: 'url',
      hidden: ({ document }) => document?.type !== 'video',
    }),
    // 👇 新增：封面视频文件上传
    defineField({
      name: 'coverVideoFile',
      title: 'Cover Video File (Upload)',
      description: '直接上传封面视频文件 (优先于 URL 展示)',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ document }) => document?.type !== 'video',
    }),
    
    // --- 详情编辑器 ---
    defineField({
      name: 'content',
      title: 'Project Details',
      type: 'array', 
      of: [
        { 
          type: 'block',
          styles: [
            {title: 'Normal (Default)', value: 'normal'},
            {title: 'Normal (Left)', value: 'normal_left'},
            {title: 'Normal (Center)', value: 'normal_center'},
            {title: 'Normal (Right)', value: 'normal_right'},
            {title: 'H1', value: 'h1'},
            {title: 'H1 (Center)', value: 'h1_center'},
            {title: 'H2', value: 'h2'},
            {title: 'H2 (Center)', value: 'h2_center'},
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
        // 详情页视频组件
        defineField({
          name: 'videoEmbed',
          title: 'Video (URL / Upload)',
          type: 'object',
          fields: [
            { name: 'url', title: 'Video URL', type: 'url' },
            { name: 'videoFile', title: 'Video File', type: 'file', options: { accept: 'video/*' } },
            { name: 'caption', title: 'Caption', type: 'string' },
            { 
              name: 'spacing', 
              title: 'Vertical Spacing (上下间距 px)', 
              type: 'number', 
              initialValue: 32,
              validation: Rule => Rule.min(0).max(200)
            },
            { name: 'autoplay', title: 'Autoplay', type: 'boolean', initialValue: false }
          ],
          preview: { 
            select: { title: 'url', file: 'videoFile.asset.originalFilename' },
            prepare({title, file}) { return { title: file ? `File: ${file}` : (title || 'Video Embed') } }
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
