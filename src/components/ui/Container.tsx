interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'prose' | 'wide'
}

export default function Container({ children, className = '', size = 'default' }: ContainerProps) {
  const maxW = {
    default: 'max-w-[1200px]',
    prose: 'max-w-[720px]',
    wide: 'max-w-[1400px]',
  }[size]

  return (
    <div className={`${maxW} mx-auto px-[clamp(1.25rem,4vw,3rem)] ${className}`}>
      {children}
    </div>
  )
}
