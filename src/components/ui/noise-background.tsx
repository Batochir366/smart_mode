import React, { useEffect, useRef } from 'react'

interface NoiseProps {
  patternRefreshInterval?: number
  /** 0–255 */
  patternAlpha?: number
}

const Noise: React.FC<NoiseProps> = ({
  patternRefreshInterval = 2,
  patternAlpha = 15,
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = grainRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let frame = 0
    let animationId = 0
    const canvasSize = 1024

    canvas.width = canvasSize
    canvas.height = canvasSize

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255
        data[i] = value
        data[i + 1] = value
        data[i + 2] = value
        data[i + 3] = patternAlpha
      }
      ctx.putImageData(imageData, 0, 0)
    }

    const loop = () => {
      if (frame % patternRefreshInterval === 0) drawGrain()
      frame++
      animationId = window.requestAnimationFrame(loop)
    }

    loop()

    return () => {
      window.cancelAnimationFrame(animationId)
    }
  }, [patternRefreshInterval, patternAlpha])

  return (
    <canvas
      ref={grainRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

interface NoiseBackgroundProps {
  /** Tailwind background color class for the base layer. */
  baseClassName?: string
  /** Custom radial gradient (Tailwind arbitrary value). */
  gradientClassName?: string
  /** Optional grid overlay class. */
  gridClassName?: string
  patternRefreshInterval?: number
  patternAlpha?: number
  className?: string
}

/**
 * Section-scoped animated noise background with a radial gradient spotlight.
 * Drop into a `relative` parent (the parent should also `overflow-hidden`).
 */
export function NoiseBackground({
  baseClassName = 'bg-slate-950',
  gradientClassName = 'bg-[radial-gradient(circle_560px_at_50%_200px,#10b981,transparent)]',
  gridClassName,
  patternRefreshInterval = 2,
  patternAlpha = 18,
  className = '',
}: NoiseBackgroundProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${baseClassName} ${className}`}
    >
      <div className={`absolute inset-0 ${gradientClassName}`} />
      {gridClassName ? <div className={`absolute inset-0 ${gridClassName}`} /> : null}
      <Noise
        patternRefreshInterval={patternRefreshInterval}
        patternAlpha={patternAlpha}
      />
    </div>
  )
}

export default NoiseBackground
