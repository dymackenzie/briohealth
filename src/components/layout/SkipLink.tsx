export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-teal-500 focus:text-white focus:rounded-[var(--r-md)] focus:font-body focus:font-semibold"
    >
      Skip to main content
    </a>
  )
}
