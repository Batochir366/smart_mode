import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin)

/** Matches Tailwind `scroll-mt-24` (6rem) so targets clear the sticky nav. */
const NAV_SCROLL_OFFSET_PX = 96

const SCROLL_DURATION_S = 2

/** Smooth-scroll to a section by element id (matches hash targets in nav). */
export function scrollToSection(id: string): boolean {
  if (!document.getElementById(id)) return false

  const smoother = ScrollSmoother.get()

  if (smoother) {
    const y = smoother.offset(`#${id}`, `top top+=${NAV_SCROLL_OFFSET_PX}px`, true)
    gsap.killTweensOf(smoother)
    gsap.to(smoother, {
      scrollTop: y,
      duration: SCROLL_DURATION_S,
      ease: 'power2.inOut',
      overwrite: 'auto',
    })
    return true
  }

  gsap.killTweensOf(window)
  gsap.to(window, {
    duration: SCROLL_DURATION_S,
    ease: 'power2.inOut',
    scrollTo: {
      y: `#${id}`,
      offsetY: NAV_SCROLL_OFFSET_PX,
      autoKill: true,
    },
  })

  return true
}
