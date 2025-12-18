import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Projects (作品)',
  type: 'document',
  fields: [
    // 1. 后台展示文案
    defineField({ 
      name: 'adminTitle', 
      title: '1. 后台展示文案 (Admin Title)', 
      description: '仅用于后台列表识别，不会展示在前端',
      type: 'string',
      validation: Rule => Rule.required()
    }),

    // 2. 主标题文案
    defineField({ 
      name: 'title', 
      title: '2. 主标题文案 (Display Title)', 
      description: '作品卡片及详情页展示的大标题',
      type: 'string',
      validation: Rule => Rule.required()
    }),

    // 3. 小标题 (已移除)

    // 4. 筛选标签
    defineField({
      name: 'filterCategories',
      title: '4. 筛选标签 (Filter Categories)',
      description: '用于网站顶部的筛选分类 (例如: CGI, AIGC)。只有填写的标签才会生成筛选按钮。',
      type: 'array',
      of: [{type: 'string'}],
      options: { layout: 'tags' }
    }),

    // 左下角展示标签
    defineField({ 
      name: 'category', 
      title: '卡片左下角展示文字 (Display Tag)', 
      description: '显示在作品卡片左下角 (例如: VAPE - CGI & AIGC)',
      type: 'string' 
    }),

    // 5. 是否展示首页
    defineField({ 
      name: 'showOnHome', 
      title: '5. 是否展示首页 (Show on Home)', 
      type: 'boolean', 
      initialValue: true 
    }),

    // 6. 展示位置 (1-8)
    defineField({ 
      name: 'order', 
      title: '6. 展示位置 (1-8)', 
      description: '数字越小越靠前。建议使用 1-8 控制首页顺序。',
      type: 'number', 
      initialValue: 0 
    }),

    // 封面媒体类型
    defineField({
      name: 'type',
      title: '封面媒体类型',
      type: 'string',
      options: { list: [{title:'图片 (Image)',value:'image'}, {title:'视频 (Video)',value:'video'}], layout: 'radio' },
      initialValue: 'image',
    }),

    // 7. 首页封面
    defineField({
      name: 'mainImage',
      title: '7. 首页封面 (3:4)',
      description: '竖版图片。如果类型选了视频，这张图将作为视频加载前的封面 (Poster)。',
      type: 'image',
      options: { hotspot: true },
    }),

    // 首页卡片视频 (文件)
    defineField({
      name: 'coverVideoFile',
      title: '首页卡片视频文件 (Upload)',
      description: '上传 .mp4 文件，将在首页卡片自动静音循环播放',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ document }) => document?.type !== 'video',
    }),

    // 首页卡片视频 (URL)
    defineField({
      name: 'videoUrl',
      title: '首页卡片视频链接 (URL)',
      description: '填入直链 (如 .mp4 结尾)。',
      type: 'url',
      hidden: ({ document }) => document?.type !== 'video',
    }),

    // 8. 二级页封面
    defineField({
      name: 'secondaryImage',
      title: '8. 二级页封面 (808x632)',
      description: '全部作品页 (Works) 使用的横版封面。',
      type: 'image',
      options: { hotspot: true },
    }),

    // 9. 内容编辑器
    defineField({
      name: 'content',
      title: '9. 内容编辑器 (Detail Content)',
      type: 'array', 
      of: [
        { 
          type: 'block',
          styles: [
            {title: '正文 (默认)', value: 'normal'},
            {title: '正文 (左对齐)', value: 'normal_left'},
            {title: '正文 (居中)', value: 'normal_center'},
            {title: '正文 (右对齐)', value: 'normal_right'},
            {title: '大标题 (H1)', value: 'h1'},
            {title: '中标题 (H2)', value: 'h2'},
            {title: '小标题 (H3)', value: 'h3'},
            {title: '引用', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: '粗体', value: 'strong'},
              {title: '斜体', value: 'em'},
              {title: '代码', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: '链接',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  { name: 'blank', type: 'boolean', title: '新窗口打开', initialValue: true }
                ]
              },
              { name: 'textColor', title: '颜色', type: 'color' }
            ]
          }
        }, 
        { 
          type: 'image', 
          options: { hotspot: true },
          fields: [
            { name: 'caption', type: 'string', title: '图片说明' },
            { name: 'spacing', type: 'number', title: '上下间距 (px)', initialValue: 32 }
          ]
        },
        defineField({
          name: 'videoEmbed',
          title: '插入视频 (文件/URL)',
          type: 'object',
          fields: [
            { name: 'videoFile', title: '视频文件上传', type: 'file', options: { accept: 'video/*' } },
            { name: 'url', title: '视频链接 (URL / B站 / YouTube)', type: 'url' },
            { name: 'autoplay', title: '自动播放 (静音)', type: 'boolean', initialValue: false },
            { name: 'caption', title: '说明文字', type: 'string' },
            { name: 'spacing', title: '上下间距 (px)', type: 'number', initialValue: 32 },
          ],
          preview: { 
            select: { title: 'url', file: 'videoFile.asset.originalFilename' },
            prepare({title, file}) { return { title: file ? `File: ${file}` : (title || 'Video') } }
          }
        })
      ],
    }),
  ],
  preview: {
    select: { title: 'adminTitle', subtitle: 'title', media: 'mainImage' }
  },
  orderings: [
    { title: '展示位置 (正序)', name: 'sortOrder', by: [{field: 'order', direction: 'asc'}] }
  ]
})
