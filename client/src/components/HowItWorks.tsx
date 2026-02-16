import { useRef } from 'react'
import { User, AudioWaveform } from 'lucide-react'
import { AnimatedBeam } from '@/components/ui/animated-beam'
import logo from '@/assets/mixcritsvgfinal.svg'

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const analyzeRef = useRef<HTMLDivElement>(null)
  const mixcritRef = useRef<HTMLDivElement>(null)

  const edgeOffset = 32 // radius of size-16 circles

  return (
    <section className="relative flex flex-col items-center gap-8 py-24 px-6">
      <h2 className="text-4xl font-redaction-50 font-medium tracking-tight text-foreground">
        HOW IT WORKS
      </h2>

      <div
        ref={containerRef}
        className="relative flex w-full max-w-3xl items-center justify-between px-10"
      >
        {/* User */}
        <div className="flex flex-col items-center gap-3">
          <div
            ref={userRef}
            className="relative z-10 flex size-16 items-center justify-center rounded-full border border-white/10 bg-background backdrop-blur-md"
          >
            <User className="size-7 text-foreground/70" />
          </div>
          <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Upload
          </span>
        </div>

        {/* Analyze */}
        <div className="flex flex-col items-center gap-3">
          <div
            ref={analyzeRef}
            className="relative z-10 flex size-16 items-center justify-center rounded-full border border-white/10 bg-background backdrop-blur-md"
          >
            <AudioWaveform className="size-7 text-foreground/70" />
          </div>
          <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Analyze
          </span>
        </div>

        {/* MixCrit */}
        <div className="flex flex-col items-center gap-3">
          <div
            ref={mixcritRef}
            className="relative z-10 flex size-16 items-center justify-center rounded-full border border-white/10 bg-background backdrop-blur-md"
          >
            <img src={logo} alt="MixCrit" className="size-7" />
          </div>
          <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Report
          </span>
        </div>

        {/* Beam 1: User → Analyze (curves up) */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={userRef}
          toRef={analyzeRef}
          curvature={-40}
          pathColor="rgba(255,255,255,0.08)"
          pathWidth={2}
          gradientStartColor="#ffffff"
          gradientStopColor="#ffffff"
          duration={2}
          startXOffset={edgeOffset}
          endXOffset={-edgeOffset}
        />
        {/* Bloom layer for beam 1 */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={userRef}
          toRef={analyzeRef}
          curvature={-40}
          pathColor="transparent"
          pathWidth={6}
          pathOpacity={0}
          gradientStartColor="rgba(255,255,255,0.4)"
          gradientStopColor="rgba(255,255,255,0.4)"
          duration={2}
          startXOffset={edgeOffset}
          endXOffset={-edgeOffset}
          className="blur-[3px]"
        />

        {/* Beam 2: Analyze → MixCrit (curves down) */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={analyzeRef}
          toRef={mixcritRef}
          curvature={40}
          pathColor="rgba(255,255,255,0.08)"
          pathWidth={2}
          gradientStartColor="#ffffff"
          gradientStopColor="#ffffff"
          duration={2}
          delay={0}
          startXOffset={edgeOffset}
          endXOffset={-edgeOffset}
        />
        {/* Bloom layer for beam 2 */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={analyzeRef}
          toRef={mixcritRef}
          curvature={40}
          pathColor="transparent"
          pathWidth={6}
          pathOpacity={0}
          gradientStartColor="rgba(255,255,255,0.4)"
          gradientStopColor="rgba(255,255,255,0.4)"
          duration={2}
          delay={0}
          startXOffset={edgeOffset}
          endXOffset={-edgeOffset}
          className="blur-[3px]"
        />
      </div>
    </section>
  )
}
