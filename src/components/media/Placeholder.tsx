import { ImageIcon } from 'lucide-react'

interface PlaceholderProps {
  label?: string
  ratio?: string
  tone?: 'teal' | 'sand' | 'coral'
  className?: string
}

const toneStyles = {
  teal: 'from-teal-050 to-teal-100',
  sand: 'from-sand-200 to-sand-300',
  coral: 'from-coral-100 to-coral-300/30',
}

export default function Placeholder({ label, ratio = '4/3', tone = 'teal', className = '' }: PlaceholderProps) {
  const [w, h] = ratio.split('/').map(Number)
  const paddingTop = `${(h / w) * 100}%`

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[var(--r-xl)] bg-gradient-to-br ${toneStyles[tone]} ${className}`}
      style={{ paddingTop }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
        <ImageIcon className="text-teal-300" size={32} />
        {label && (
          <p className="text-center text-[0.8125rem] font-body text-ink-500 leading-snug max-w-[180px]">
            {label}
          </p>
        )}
      </div>
    </div>
  )
}
