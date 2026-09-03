import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const isSanityConfigured = Boolean(projectId)

const realClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01',
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null

export const client = {
  fetch: async (query: any, params?: any, options?: any): Promise<any> => {
    if (!realClient) return null
    return realClient.fetch(query, params, options)
  },
}
