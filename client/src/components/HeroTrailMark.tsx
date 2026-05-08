/**
 * Illustrator trail + head from Demjikh hero mark (viewBox 173.7×62.8).
 * Head center: (31.4, 31.4). Unused global .st* styles stripped.
 */
const CY = 31.4
/** Ellipse vertical radius (Illustrator had ~31.4 — 2× for larger trail blobs). */
const RY = 62.8

type EllipseEntry = {
  cx: number
  rx: number
  elOpacity: number
  x1: number
  y1: number
  x2: number
  y2: number
  stopOpacity: number
}

const ELLIPSES: EllipseEntry[] = [
  { cx: 43, rx: 56.2, elOpacity: 0.3, x1: 16.7613, y1: 31.5811, x2: 71.3128, y2: 31.2337, stopOpacity: 1 },
  { cx: 51.9, rx: 52.8, elOpacity: 0.35, x1: 27.4386, y1: 33.2932, x2: 78.3084, y2: 29.3909, stopOpacity: 0.9571 },
  { cx: 60.8, rx: 49.6, elOpacity: 0.4, x1: 38.106, y1: 34.7743, x2: 85.3141, y2: 27.7962, stopOpacity: 0.9143 },
  { cx: 69.7, rx: 46.2, elOpacity: 0.45, x1: 48.6901, y1: 36.0539, x2: 92.4088, y2: 26.4177, stopOpacity: 0.8714 },
  { cx: 78.6, rx: 43, elOpacity: 0.5, x1: 59.1245, y1: 37.1777, x2: 99.664, y2: 25.2065, stopOpacity: 0.8286 },
  { cx: 87.5, rx: 39.8, elOpacity: 0.55, x1: 69.3567, y1: 38.2045, x2: 107.1364, y2: 24.0992, stopOpacity: 0.7857 },
  { cx: 96.4, rx: 36.4, elOpacity: 0.6, x1: 79.3569, y1: 39.2002, x2: 114.8582, y2: 23.025, stopOpacity: 0.7429 },
  { cx: 105.3, rx: 33.2, elOpacity: 0.65, x1: 89.1262, y1: 40.2277, x2: 122.8285, y2: 21.916, stopOpacity: 0.7 },
  { cx: 114.2, rx: 29.8, elOpacity: 0.7, x1: 98.6979, y1: 41.336, x2: 131.0113, y2: 20.7195, stopOpacity: 0.6571 },
  { cx: 123.2, rx: 26.6, elOpacity: 0.75, x1: 108.1318, y1: 42.5519, x2: 139.3425, y2: 19.4064, stopOpacity: 0.6143 },
  { cx: 132.1, rx: 23.4, elOpacity: 0.8, x1: 117.5012, y1: 43.8779, x2: 147.743, y2: 17.9739, stopOpacity: 0.5714 },
  { cx: 141, rx: 20, elOpacity: 0.85, x1: 126.8791, y1: 45.2952, x2: 156.1341, y2: 16.4422, stopOpacity: 0.5286 },
  { cx: 149.9, rx: 16.8, elOpacity: 0.9, x1: 136.329, y1: 46.7702, x2: 164.4475, y2: 14.8476, stopOpacity: 0.4857 },
  { cx: 158.8, rx: 13.4, elOpacity: 0.95, x1: 145.8992, y1: 48.2597, x2: 172.6308, y2: 13.2365, stopOpacity: 0.4429 },
  { cx: 167.7, rx: 10.2, elOpacity: 1, x1: 155.6213, y1: 49.7167, x2: 180.6499, y2: 11.6596, stopOpacity: 0.4 },
  { cx: 176.6, rx: 8.8, elOpacity: 1, x1: 164.932, y1: 51.104, x2: 188.214, y2: 10.305, stopOpacity: 0.36 },
  { cx: 185.5, rx: 7.4, elOpacity: 1, x1: 174.249, y1: 52.468, x2: 195.941, y2: 8.992, stopOpacity: 0.33 },
  { cx: 194.4, rx: 6.2, elOpacity: 1, x1: 183.611, y1: 53.741, x2: 203.736, y2: 7.756, stopOpacity: 0.3 },
  { cx: 203.3, rx: 5.2, elOpacity: 1, x1: 193.012, y1: 54.952, x2: 211.486, y2: 6.563, stopOpacity: 0.27 },
  { cx: 212.2, rx: 4.4, elOpacity: 1, x1: 202.451, y1: 56.083, x2: 219.182, y2: 5.443, stopOpacity: 0.24 },
  { cx: 221.1, rx: 3.7, elOpacity: 1, x1: 211.915, y1: 57.147, x2: 226.817, y2: 4.381, stopOpacity: 0.21 },
  { cx: 230, rx: 3.1, elOpacity: 1, x1: 221.402, y1: 58.136, x2: 234.391, y2: 3.372, stopOpacity: 0.18 },
  { cx: 238.9, rx: 2.6, elOpacity: 1, x1: 230.91, y1: 59.066, x2: 241.902, y2: 2.416, stopOpacity: 0.15 },
  { cx: 247.8, rx: 2.2, elOpacity: 1, x1: 240.439, y1: 59.952, x2: 249.356, y2: 1.511, stopOpacity: 0.12 },
  { cx: 256.7, rx: 1.8, elOpacity: 1, x1: 249.987, y1: 60.792, x2: 256.757, y2: 0.658, stopOpacity: 0.1 },
  { cx: 265.6, rx: 1.5, elOpacity: 1, x1: 259.552, y1: 61.564, x2: 264.103, y2: -0.131, stopOpacity: 0.09 },
  { cx: 274.5, rx: 1.3, elOpacity: 1, x1: 269.131, y1: 62.28, x2: 271.39, y2: -0.904, stopOpacity: 0.08 },
  { cx: 283.4, rx: 1.1, elOpacity: 1, x1: 278.724, y1: 62.95, x2: 278.626, y2: -1.631, stopOpacity: 0.07 },
  { cx: 292.3, rx: 0.95, elOpacity: 1, x1: 288.329, y1: 63.572, x2: 285.82, y2: -2.308, stopOpacity: 0.06 },
  { cx: 301.2, rx: 0.82, elOpacity: 1, x1: 297.944, y1: 64.154, x2: 292.979, y2: -2.941, stopOpacity: 0.05 },
  { cx: 310.1, rx: 0.7, elOpacity: 1, x1: 307.567, y1: 64.701, x2: 300.108, y2: -3.543, stopOpacity: 0.045 },
  { cx: 319, rx: 0.58, elOpacity: 1, x1: 317.198, y1: 65.216, x2: 307.214, y2: -4.116, stopOpacity: 0.04 },
  { cx: 327.9, rx: 0.48, elOpacity: 1, x1: 326.836, y1: 65.704, x2: 314.303, y2: -4.662, stopOpacity: 0.035 },
  { cx: 336.8, rx: 0.4, elOpacity: 1, x1: 336.479, y1: 66.168, x2: 321.378, y2: -5.183, stopOpacity: 0.03 },
  { cx: 345.7, rx: 0.32, elOpacity: 1, x1: 346.126, y1: 66.611, x2: 328.442, y2: -5.682, stopOpacity: 0.025 },
]

export const HERO_TRAIL_ELLIPSE_COUNT = ELLIPSES.length

export const HERO_TRAIL_HEAD = { cx: 31.4, cy: 31.4 }
export const HERO_TRAIL_VIEW_H = 62.8

/** Head disc radius — 2× Illustrator r=31.4 so it matches enlarged trail blobs. */
export const HEAD_R = 62.8

/** Container `<text>` for the trail label (words are `<tspan data-hero-trail-label-word>`). */
export const HERO_TRAIL_LABEL_SELECTOR = '[data-hero-trail-label]'
/** Per-word nodes for staggered opacity from scroll progress. */
export const HERO_TRAIL_LABEL_WORD_SELECTOR = '[data-hero-trail-label-word]'

/** Head fill: Illustrator diagonal scaled ×2 about HERO_TRAIL_HEAD. */
const HEAD_GRAD_ORIG = [
  [9.8411, 14.5487],
  [60.2222, 53.9242],
] as const
const HEAD_GRAD_XY = HEAD_GRAD_ORIG.map(([sx, sy]) => ({
  x: HERO_TRAIL_HEAD.cx + 2 * (sx - HERO_TRAIL_HEAD.cx),
  y: HERO_TRAIL_HEAD.cy + 2 * (sy - HERO_TRAIL_HEAD.cy),
}))

type Props = {
  idPrefix: string
  /** Shown centered inside the head disc; omit to hide. */
  label?: string
}

export function HeroTrailMark({ idPrefix, label }: Props) {
  const p = idPrefix

  return (
    <>
      <defs>
        {ELLIPSES.map((e, i) => {
          const gid = `${p}-e${i}`
          return (
            <linearGradient
              key={gid}
              id={gid}
              gradientUnits="userSpaceOnUse"
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
            >
              <stop offset="11.06%" stopColor="#1EBF70" stopOpacity={e.stopOpacity} />
              <stop offset="100%" stopColor="#1EBF70" stopOpacity={0} />
            </linearGradient>
          )
        })}
        <linearGradient
          id={`${p}-head`}
          gradientUnits="userSpaceOnUse"
          x1={HEAD_GRAD_XY[0].x}
          y1={HEAD_GRAD_XY[0].y}
          x2={HEAD_GRAD_XY[1].x}
          y2={HEAD_GRAD_XY[1].y}
        >
          <stop offset="0%" stopColor="#1EBF70" />
          <stop offset="88.12%" stopColor="#1EBF70" stopOpacity={0} />
        </linearGradient>
      </defs>
      <g>
        <g>
          {ELLIPSES.map((e, i) => (
            <ellipse
              key={`${p}-ellipse-${i}`}
              data-hero-trail-ellipse
              data-base-opacity={e.elOpacity}
              cx={e.cx}
              cy={CY}
              rx={e.rx}
              ry={RY}
              opacity={0}
              fill={`url(#${p}-e${i})`}
            />
          ))}
        </g>
        <circle cx={HERO_TRAIL_HEAD.cx} cy={HERO_TRAIL_HEAD.cy} r={HEAD_R} fill={`url(#${p}-head)`} />
        {label ? (
          <text
            data-hero-trail-label
            x={HERO_TRAIL_HEAD.cx - 30}
            y={HERO_TRAIL_HEAD.cy}
            textAnchor="start"
            dominantBaseline="central"
            fill="#FFFFFF"
            fillOpacity={0.92}
            fontSize={26}
            fontWeight={600}
            className="font-benzin pointer-events-none select-none"
            style={{ letterSpacing: '0.03em' }}
            aria-hidden
          >
            {label
              .trim()
              .split(/\s+/)
              .filter(Boolean)
              .map((word, i, arr) => (
                <tspan key={`${p}-trail-word-${i}`} data-hero-trail-label-word opacity={0}>
                  {word}
                  {i < arr.length - 1 ? '\u00A0' : ''}
                </tspan>
              ))}
          </text>
        ) : null}
      </g>
    </>
  )
}
