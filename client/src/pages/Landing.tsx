import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import thumbnail from '@/assets/thumbnail.png'

function Landing() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  return (
    <>
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
        <p className="relative -mt-2 max-w-md text-center text-lg text-foreground/70">
          Upload your track and get a detailed analysis in seconds. Completely free, no signup required.
        </p>
        <Link
          to="/upload"
          className="group relative flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-10 py-3.5 text-sm font-medium uppercase tracking-wide text-foreground/90 shadow-[0_0_15px_rgba(255,255,255,0.08)] transition-all duration-300 ease-in-out hover:bg-white/10 hover:text-foreground hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]"
        >
          Analyze your mix
        </Link>
        <HeroVideoDialog
          className="relative mt-4 w-full max-w-3xl"
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/WWcbQlPAFfA"
          thumbnailSrc={thumbnail}
          thumbnailAlt="MixCrit demo walkthrough"
        />
      </main>

      <HowItWorks />
      <Features />
    </>
  )
}

export default Landing
