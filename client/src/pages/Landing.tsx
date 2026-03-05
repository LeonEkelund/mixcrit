import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog'
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text'
import Features from '@/components/Features'
import thumbnail from '@/assets/thumbnailfinal.png'

function Landing() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showChevron, setShowChevron] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowChevron(true), 2000)
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <main
        className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden px-4 lg:px-12"
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

        <div className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs backdrop-blur-sm">
          <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary">New</span>
          <span className="text-muted-foreground/70">AI-powered feedback</span>
        </div>

        <h1 className="relative text-center font-redaction-50 italic text-4xl md:text-5xl lg:text-7xl text-foreground tracking-tight">
          Instant mix feedback.
        </h1>
        <p className="relative -mt-2 text-center text-sm text-foreground/60">
          Professional audio analytics, completely free.
        </p>
        <Link
          to="/upload"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm backdrop-blur-sm text-foreground transition-colors duration-200 hover:bg-white/10"
        >
          <AnimatedShinyText shimmerWidth={160}>Analyze your mix</AnimatedShinyText>
          <ArrowRight className="size-3.5 translate-y-[1px]" />
        </Link>
        <HeroVideoDialog
          className="relative w-full max-w-3xl"
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/WWcbQlPAFfA"
          thumbnailSrc={thumbnail}
          thumbnailAlt="MixCrit demo walkthrough"
        />

        {/* Scroll chevron */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-700 ${showChevron && !scrolled ? 'opacity-100' : 'opacity-0'}`}
        >
          <ChevronDown className="size-6 text-foreground/50 animate-bounce" />
        </div>
      </main>

      <Features />
    </>
  )
}

export default Landing
