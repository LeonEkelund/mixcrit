import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { motion, type Variants } from 'motion/react'
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog'
import Features from '@/components/Features'
import thumbnail from '@/assets/thumbnailfinal.png'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 12 },
  show: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

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

        <motion.div
          className="relative flex flex-col items-center gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs backdrop-blur-sm">
            <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary">New</span>
            <span className="text-muted-foreground/70">AI-powered feedback</span>
          </motion.div>

          <motion.h1 variants={item} className="text-center font-redaction-50 italic text-4xl md:text-5xl lg:text-7xl text-foreground tracking-tight">
            Instant mix feedback.
          </motion.h1>
          <motion.p variants={item} className="-mt-2 text-center text-sm text-foreground/60">
            Professional audio analytics, completely free.
          </motion.p>
          <motion.div variants={item} className="mt-5 rounded-full backdrop-blur-sm">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-6 py-2 text-sm text-white transition-colors duration-200 hover:bg-white/25"
            >
              Analyze your mix
<ArrowRight className="size-3.5 translate-y-[1px]" />
            </Link>
          </motion.div>
          <motion.div variants={item} className="w-full max-w-3xl md:max-w-4xl">
            <HeroVideoDialog
              className="relative w-full"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/WWcbQlPAFfA"
              thumbnailSrc={thumbnail}
              thumbnailAlt="MixCrit demo walkthrough"
            />
          </motion.div>
        </motion.div>

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
