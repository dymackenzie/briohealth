'use client'

import React from 'react'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  external?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-teal-500 text-white hover:bg-teal-600 border-2 border-teal-500 hover:border-teal-600',
  secondary: 'bg-transparent text-ink-900 border-2 border-ink-900 hover:bg-ink-900 hover:text-white',
  accent: 'bg-coral-500 text-white hover:bg-coral-500/90 border-2 border-coral-500',
  ghost: 'bg-transparent text-teal-500 border-2 border-teal-300 hover:bg-teal-050',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  external,
  onClick,
  disabled,
  className = '',
  children,
  type = 'button',
}: ButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 font-body font-semibold transition-all duration-200 cursor-pointer rounded-[999px] focus-visible:outline-2 focus-visible:outline-offset-3`
  const styles = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`

  if (href) {
    return (
      <Link
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={styles}
      >
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles}>
      {children}
    </button>
  )
}
