import { useEffect, useRef } from 'react'
import type { SpectrumResult } from '@/lib/audio/types'
import type { GenreTarget } from '@/lib/audio/genreTargets'

type Band = keyof SpectrumResult

const bands: { key: Band; label: string }[] = [
  { key: 'sub', label: '20–60 Hz' },
  { key: 'low', label: '60–200 Hz' },
  { key: 'lowMids', label: '200–500 Hz' },
  { key: 'mids', label: '500 Hz–2 kHz' },
  { key: 'highMids', label: '2–6 kHz' },
  { key: 'highs', label: '6–20 kHz' },
]

function dbToY(db: number, height: number, padTop: number, padBottom: number, dbMin: number, dbMax: number) {
  const t = (db - dbMin) / (dbMax - dbMin)
  return height - padBottom - t * (height - padTop - padBottom)
}

export function TonalProfile({ spectrum, targets }: {
  spectrum: SpectrumResult
  targets?: GenreTarget
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height
    const padTop = 24
    const padBottom = 36
    const dbMin = -40
    const dbMax = 0
    const bandCount = bands.length
    const bandWidth = w / bandCount

    // Clear
    ctx.clearRect(0, 0, w, h)

    // Draw target zones and labels
    for (let i = 0; i < bandCount; i++) {
      const band = bands[i]
      const xStart = i * bandWidth
      const xEnd = (i + 1) * bandWidth
      const xCenter = (xStart + xEnd) / 2

      if (targets) {
        const target = targets.spectrum[band.key]
        const value = spectrum[band.key]
        const inRange = value >= target.min && value <= target.max
        const color = inRange ? 'rgba(134, 239, 172, 0.2)' : 'rgba(200, 80, 100, 0.2)'

        ctx.fillStyle = color
        ctx.fillRect(xStart, padTop, bandWidth, h - padTop - padBottom)

        // Status label above
        const label = inRange ? 'Optimal' : value < target.min ? 'Too Low' : 'Too High'
        ctx.fillStyle = inRange ? '#86efac' : '#ef4444'
        ctx.font = '11px General Sans, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(label, xCenter, padTop - 8)
      }

      // Divider lines between bands
      if (i > 0) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(xStart, padTop)
        ctx.lineTo(xStart, h - padBottom)
        ctx.stroke()
      }

      // Band label at bottom
      ctx.fillStyle = '#a3a3a3'
      ctx.font = '10px General Sans, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(band.label, xCenter, h - 10)
    }

    // Build curve points — start at left edge, center of each band, end at right edge
    const points = [
      { x: 0, y: dbToY(spectrum[bands[0].key], h, padTop, padBottom, dbMin, dbMax) },
      ...bands.map((band, i) => ({
        x: (i + 0.5) * bandWidth,
        y: dbToY(spectrum[band.key], h, padTop, padBottom, dbMin, dbMax),
      })),
      { x: w, y: dbToY(spectrum[bands[bands.length - 1].key], h, padTop, padBottom, dbMin, dbMax) },
    ]

    // Draw smooth curve (catmull-rom spline)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.beginPath()

    if (points.length >= 2) {
      const pts = [
        { x: points[0].x - bandWidth, y: points[0].y },
        ...points,
        { x: points[points.length - 1].x + bandWidth, y: points[points.length - 1].y },
      ]

      ctx.moveTo(pts[1].x, pts[1].y)

      for (let i = 1; i < pts.length - 2; i++) {
        const p0 = pts[i - 1]
        const p1 = pts[i]
        const p2 = pts[i + 1]
        const p3 = pts[i + 2]

        const segments = 20
        for (let t = 1; t <= segments; t++) {
          const s = t / segments
          const s2 = s * s
          const s3 = s2 * s

          const x = 0.5 * (
            (2 * p1.x) +
            (-p0.x + p2.x) * s +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * s2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * s3
          )
          const y = 0.5 * (
            (2 * p1.y) +
            (-p0.y + p2.y) * s +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * s2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * s3
          )

          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    }
  }, [spectrum, targets])

  return (
    <div className="w-full rounded-xl border border-border bg-background p-4">
      <h2 className="text-sm font-medium text-muted-foreground mb-3">Tonal Profile</h2>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: 180 }}
      />
    </div>
  )
}
