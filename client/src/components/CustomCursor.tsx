import { useEffect, useRef } from 'react'

/**
 * Decorative follow cursor (desktop). Hidden on coarse pointers.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const dot = dotRef.current
    const ringEl = ringRef.current
    if (!dot || !ringEl) return
    if (window.matchMedia('(pointer: coarse)').matches) {
      dot.style.display = 'none'
      ringEl.style.display = 'none'
      return
    }

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
      dot.style.left = `${e.clientX - 5}px`
      dot.style.top = `${e.clientY - 5}px`
    }
    document.addEventListener('mousemove', onMove)

    let frame = 0
    const tick = () => {
      ring.current.x += (target.current.x - ring.current.x) * 0.12
      ring.current.y += (target.current.y - ring.current.y) * 0.12
      ringEl.style.left = `${ring.current.x - 18}px`
      ringEl.style.top = `${ring.current.y - 18}px`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999] hidden h-2.5 w-2.5 rounded-full bg-brand mix-blend-normal md:block"
        aria-hidden
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9998] hidden h-9 w-9 rounded-full border border-brand/60 md:block"
        aria-hidden
      />
    </>
  )
}
