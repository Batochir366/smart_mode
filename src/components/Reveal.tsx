import { useEffect, useRef, useState, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger helper to align with original reveal-delay-* */
  delay?: 'none' | '1' | '2'
  /** Skip intersection observer — content is visible immediately (e.g. stage panels) */
  instant?: boolean
}

export function Reveal({ children, className = '', delay = 'none', instant = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealedByScroll, setRevealedByScroll] = useState(false)

  useEffect(() => {
    if (instant) return

    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setRevealedByScroll(true)
        })
      },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [instant])

  const visible = instant || revealedByScroll

  const delayCls =
    delay === '1' ? 'delay-150' : delay === '2' ? 'delay-300' : ''

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${delayCls} ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`.trim()}
    >
      {children}
    </div>
  )
}
