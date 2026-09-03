import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'Brio Health',
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2024-10-01' }),
  ],
})
