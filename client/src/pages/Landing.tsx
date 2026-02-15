import { useState } from 'react'
import { Link } from 'react-router-dom'

function Landing() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden"
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      {/* Dot grid with vignette */}
      <div
        className="absolute inset-0 [background-image:radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_55%)]"
      />

      {/* Mouse highlight layer */}
      <div
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle,rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:16px_16px] transition-[mask-position] duration-100"
        style={{
          maskImage: `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, white, transparent), radial-gradient(ellipse at center, white 10%, transparent 55%)`,
          WebkitMaskImage: `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, white, transparent), radial-gradient(ellipse at center, white 10%, transparent 55%)`,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      />


      <h1 className="relative font-redaction-50 italic text-7xl text-foreground tracking-tight">
        Instant mix feedback.
      </h1>
      <p className="relative max-w-md text-center text-lg text-foreground/70">
        Upload your track and get a detailed analysis in seconds. Completely free, no signup required.
      </p>
      <Link
        to="/upload"
        className="relative mt-2 rounded-full bg-primary px-8 py-3 text-base font-medium uppercase tracking-wide text-background transition-transform duration-300 ease-in-out will-change-transform hover:scale-105"
      >
        Try now
      </Link>
    </main>
  )
}

export default Landing
