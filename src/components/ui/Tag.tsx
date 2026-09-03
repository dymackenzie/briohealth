interface TagProps {
  children: React.ReactNode
  color?: 'teal' | 'coral' | 'sand'
  className?: string
}

const colorStyles = {
  teal: 'bg-teal-100 text-teal-700',
  coral: 'bg-coral-100 text-coral-500',
  sand: 'bg-sand-200 text-ink-700',
}

export default function Tag({ children, color = 'teal', className = '' }: TagProps) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-[999px] text-[0.8125rem] font-body font-semibold tracking-wide ${colorStyles[color]} ${className}`}>
      {children}
    </span>
  )
}
