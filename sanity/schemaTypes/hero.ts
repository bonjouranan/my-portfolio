import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Section (首屏配置)',
  type: 'document',
  fields: [
    defineField({
      name: 'topSmallText',
      title: 'Top Small Text (顶部小字)',
      type: 'string',
      initialValue: 'PORTFOLIO 2025',
    }),
    defineField({
      name: 'line1',
      title: 'Line 1 Text (第一行大字)',
      type: 'string',
      initialValue: 'DIGITAL',
    }),
    defineField({
      name: 'line2',
      title: 'Line 2 Text (第二行大字)',
      type: 'string',
      initialValue: 'CRAFTER',
    }),
    defineField({
      name: 'heroStyle',
      title: 'Hero Style (第二行样式)',
      type: 'string',
      options: {
        list: [
          { title: 'Hollow (镂空)', value: 'hollow' },
          { title: 'Solid (实心)', value: 'solid' },
        ],
      },
      initialValue: 'hollow',
    }),
  ],
})
