// lucide dropped its brand icons in v1, so these are hand-drawn.

type IconProps = { className?: string }

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M14.3 8.4V6.6c0-.8.2-1.2 1.4-1.2h1.6V2.1A21 21 0 0 0 14.9 2c-2.6 0-4.4 1.6-4.4 4.5v1.9H7.7v3.3h2.8V22h3.8v-10.3h2.8l.4-3.3z" />
    </svg>
  )
}

export function XIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M17.7 3h3.3l-7.2 8.3L22.3 21h-6.6l-5.2-6.8L4.5 21H1.2l7.7-8.8L1.7 3h6.8l4.7 6.2zm-1.2 16h1.8L7.6 4.8H5.7z" />
    </svg>
  )
}

export const socialIcons = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  X: XIcon,
} as const
