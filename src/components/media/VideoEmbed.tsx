'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import SanityImage from './SanityImage'

interface VideoEmbedProps {
  url: string
  poster?: any
  caption?: string
  className?: string
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

export default function VideoEmbed({ url, poster, caption, className = '' }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false)

  const ytId = getYouTubeId(url)
  const vimeoId = getVimeoId(url)

  if (ytId) {
    if (playing) {
      return (
        <div className={`relative w-full overflow-hidden rounded-[var(--r-xl)] ${className}`} style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={caption || 'Video'}
          />
        </div>
      )
    }
    return (
      <div className={`relative w-full overflow-hidden rounded-[var(--r-xl)] cursor-pointer group ${className}`} style={{ paddingTop: '56.25%' }}>
        <div className="absolute inset-0">
          {poster ? (
            <SanityImage image={poster} fill alt={caption || 'Video thumbnail'} />
          ) : (
            <img
              src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
              alt={caption || 'Video thumbnail'}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-ink-900/30 flex items-center justify-center" onClick={() => setPlaying(true)}>
            <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="text-white ml-1" size={24} fill="white" />
            </div>
          </div>
        </div>
        {caption && <p className="absolute bottom-3 left-4 text-white text-sm font-body">{caption}</p>}
      </div>
    )
  }

  if (vimeoId) {
    return (
      <div className={`relative w-full overflow-hidden rounded-[var(--r-xl)] ${className}`} style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://player.vimeo.com/video/${vimeoId}`}
          allow="autoplay; fullscreen"
          allowFullScreen
          title={caption || 'Video'}
        />
      </div>
    )
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-[var(--r-xl)] ${className}`}>
      <video controls poster={poster?.asset?.url} className="w-full rounded-[var(--r-xl)]">
        <source src={url} />
      </video>
    </div>
  )
}
