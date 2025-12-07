import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Anan Portfolio',

  projectId: 'hrwvrhof', // ⚠️ 确认这里填的是 hrwvrhof
  dataset: 'production',

  basePath: '/studio', // 这个也很重要

  plugins: [structureTool(), visionTool(), colorInput()],

  schema: {
    types: schemaTypes,
  },
})
