import type { CSSProperties } from 'react'

type GridVariant = 'magenta-orb' | 'dark-mini'

interface GridBackgroundProps {
  /** Preset look. Ignored if `style` is provided. */
  variant?: GridVariant
  /** Tailwind class for the base layer (e.g. `bg-white`, `bg-[#0f0f0f]`). */
  baseClassName?: string
  /** Override the inline background style entirely. */
  style?: CSSProperties
  className?: string
}

const VARIANT_STYLES: Record<GridVariant, { base: string; style: CSSProperties }> = {
  'magenta-orb': {
    base: 'bg-white',
    style: {
      backgroundImage: `
        linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
        radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
      `,
      backgroundSize: '40px 40px, 40px 40px, 100% 100%',
    },
  },
  'dark-mini': {
    base: 'bg-[#0f0f0f]',
    style: {
      backgroundImage: `
        linear-gradient(to right, #262626 1px, transparent 1px),
        linear-gradient(to bottom, #262626 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
    },
  },
}

/**
 * Section-scoped grid background. Drop into any `relative` parent.
 * Pair with `overflow-hidden` on the parent if you want the grid clipped.
 */
export function GridBackground({
  variant = 'magenta-orb',
  baseClassName,
  style,
  className = '',
}: GridBackgroundProps) {
  const preset = VARIANT_STYLES[variant]
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${baseClassName ?? preset.base} ${className}`}
      style={style ?? preset.style}
    />
  )
}

export default GridBackground
