import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const type = body?._type as string | undefined

    if (type) {
      revalidateTag(type, 'max')
    } else {
      for (const tag of ['siteSettings', 'navigation', 'homePage', 'aboutPage', 'service', 'program', 'teamMember', 'post', 'category', 'page']) {
        revalidateTag(tag, 'max')
      }
    }

    return NextResponse.json({ revalidated: true, type: type || 'all' })
  } catch {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
