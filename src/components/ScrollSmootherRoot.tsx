import { type ReactNode, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

export function ScrollSmootherRoot({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    const content = contentRef.current
    if (!wrapper || !content) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const smoother = ScrollSmoother.create({
      wrapper,
      content,
      smooth: prefersReduced ? 0 : 1,
      smoothTouch: prefersReduced ? 0 : 0.15,
    })

    return () => smoother.kill()
  }, [])

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
