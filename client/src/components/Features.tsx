import { useState, useRef } from 'react'
import { User, AudioWaveform, Info } from 'lucide-react'
import freq from '@/assets/screenshots/freq-final.png'
import dynamic from '@/assets/screenshots/dynamic-final.png'
import stereo from '@/assets/screenshots/stereo-final.png'
import loud from '@/assets/screenshots/loud-final.png'
import logo from '@/assets/mixcritsvgfinal.svg'
import { StripedPattern } from '@/components/magicui/striped-pattern'
import { AnimatedBeam } from '@/components/ui/animated-beam'
import testbg from '@/assets/testbg.png'

const features = [
  {
    title: 'Frequency Spectrum',
    description: 'See how your EQ balance stacks up against genre targets across sub, low, mids, high mids, and highs.',
    detail: 'Your mix is split into six frequency bands and compared against genre-calibrated targets. Sub (20–60 Hz) controls weight and rumble. Low (60–200 Hz) adds body. Low Mids (200–500 Hz) can cause muddiness if over-represented. Mids (500 Hz–3 kHz) carry vocals and presence. High Mids (3–6 kHz) add clarity and bite. Highs (6–20 kHz) give air and brightness. Each band is rated Good, Neutral, or Warning so you know exactly where your balance needs work.',
    image: freq,
    imageAlt: 'Frequency spectrum',
    imageScale: 0.9,
  },
  {
    title: 'Dynamics',
    description: 'Dynamic range, crest factor, and clipping detection to keep your mix punchy and controlled.',
    detail: 'Dynamic range measures the difference between the quietest and loudest parts of your track. Crest factor reflects the peak-to-RMS ratio — a healthy mix typically sits between 8–14 dB. Anything lower usually means the track is over-compressed and will sound flat. Clipping detection scans for samples exceeding 0 dBFS, which causes digital distortion. If your mix is clipping, you\'re likely losing headroom before it even hits a mastering chain or streaming platform.',
    image: dynamic,
    imageAlt: 'Dynamics',
    imageScale: 0.8,
  },
  {
    title: 'Stereo Image',
    description: 'Stereo width, correlation, and mono compatibility so your mix translates on every speaker.',
    detail: 'The stereo analyzer looks at three dimensions of your mix\'s width. Stereo width shows how far your mix spreads across the left/right field — too wide and it\'ll fall apart on mono systems. Correlation measures the phase relationship between channels — values below 0 mean phase cancellation, which causes elements to disappear when summed. Mono compatibility tells you how the mix holds up on a single speaker, which matters for phones, club PAs, and most streaming scenarios.',
    image: stereo,
    imageAlt: 'Stereo image',
    imageScale: 0.9,
  },
  {
    title: 'Loudness',
    description: 'Integrated LUFS and true peak checked against Spotify, Apple Music, and YouTube targets.',
    detail: 'Integrated LUFS (Loudness Units Full Scale) is the industry standard for measuring perceived loudness across a full track. Spotify targets -14 LUFS, Apple Music -16 LUFS, YouTube -14 LUFS — tracks louder than these targets get turned down automatically, and over-limiting to hit them kills your dynamics. True peak measures peak levels after digital-to-analog conversion, where inter-sample peaks can exceed 0 dBFS and cause distortion. -1 dBTP is the recommended ceiling for streaming.',
    image: loud,
    imageAlt: 'Loudness',
    imageScale: 0.8,
  },
]

const edgeOffset = 32

export default function Features() {
  const [flipped, setFlipped] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const analyzeRef = useRef<HTMLDivElement>(null)
  const mixcritRef = useRef<HTMLDivElement>(null)

  return (
    <section className="pt-4">
      <div className="flex">

        {/* Left side panel — desktop only */}
        <div
          className="hidden lg:flex flex-1 border border-white/10 border-r-0 relative overflow-hidden"
          style={{ maskImage: 'linear-gradient(to right, black 60%, transparent 100%)' }}
        >
          <StripedPattern className="text-white/15" />
        </div>

        {/* Outer bordered container */}
        <div className="relative border border-white/10 w-full lg:max-w-5xl px-4 sm:px-6 lg:px-0">

          {/* Heading + beam wrapper with bg */}
          <div className="relative overflow-hidden border-b border-white/10">
            {/* Background layer */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${testbg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
              }}
            />

            {/* Heading row */}
            <div className="relative z-10 px-8 py-20 text-center overflow-hidden">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-redaction-50 italic text-foreground tracking-tight">
                From upload to insight
              </h2>
              <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">Opt-in AI</span>
                <span className="text-muted-foreground/70">Runs entirely in your browser. No accounts, no waiting.</span>
              </div>
            </div>

            {/* How it works strip */}
            <div className="relative z-10 px-8 py-6">
              <div
                ref={containerRef}
                className="relative flex w-full sm:max-w-2xl mx-auto items-start justify-between px-2 sm:px-4"
              >
                {/* User */}
                <div className="flex flex-col items-center gap-2">
                  <div ref={userRef} className="relative z-10 flex size-12 items-center justify-center rounded-full border border-white/10 bg-background">
                    <User className="size-5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Upload</span>
                  <p className="max-w-[5rem] text-center text-[10px] text-muted-foreground/70">Drop your mix in any format</p>
                </div>

                {/* Analyze */}
                <div className="flex flex-col items-center gap-2">
                  <div ref={analyzeRef} className="relative z-10 flex size-12 items-center justify-center rounded-full border border-white/10 bg-background">
                    <AudioWaveform className="size-5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Analyze</span>
                  <p className="max-w-[5rem] text-center text-[10px] text-muted-foreground/70">Examines EQ, dynamics, and more</p>
                </div>

                {/* Report */}
                <div className="flex flex-col items-center gap-2">
                  <div ref={mixcritRef} className="relative z-10 flex size-12 items-center justify-center rounded-full border border-white/10 bg-background">
                    <img src={logo} alt="MixCrit" className="size-5 opacity-70" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Report</span>
                  <p className="max-w-[5rem] text-center text-[10px] text-muted-foreground/70">Get actionable feedback in seconds</p>
                </div>

                {/* Beam 1 */}
                <AnimatedBeam containerRef={containerRef} fromRef={userRef} toRef={analyzeRef} curvature={-40} pathColor="rgba(255,255,255,0.08)" pathWidth={2} gradientStartColor="#ffffff" gradientStopColor="#ffffff" duration={2} startXOffset={edgeOffset} endXOffset={-edgeOffset} />
                <AnimatedBeam containerRef={containerRef} fromRef={userRef} toRef={analyzeRef} curvature={-40} pathColor="transparent" pathWidth={12} pathOpacity={0} gradientStartColor="rgba(255,255,255,0.6)" gradientStopColor="rgba(255,255,255,0.6)" duration={2} startXOffset={edgeOffset} endXOffset={-edgeOffset} className="blur-[6px]" />

                {/* Beam 2 */}
                <AnimatedBeam containerRef={containerRef} fromRef={analyzeRef} toRef={mixcritRef} curvature={40} pathColor="rgba(255,255,255,0.08)" pathWidth={2} gradientStartColor="#ffffff" gradientStopColor="#ffffff" duration={2} startXOffset={edgeOffset} endXOffset={-edgeOffset} />
                <AnimatedBeam containerRef={containerRef} fromRef={analyzeRef} toRef={mixcritRef} curvature={40} pathColor="transparent" pathWidth={12} pathOpacity={0} gradientStartColor="rgba(255,255,255,0.6)" gradientStopColor="rgba(255,255,255,0.6)" duration={2} startXOffset={edgeOffset} endXOffset={-edgeOffset} className="blur-[6px]" />
              </div>
            </div>
          </div>{/* end heading+beam wrapper */}

          {/* Feature rows */}
          {features.map((feature, i) => {
            const reversed = i % 2 !== 0
            const isFlipped = flipped === i
            return (
              <div
                key={feature.title}
                className={`flex flex-col lg:flex-row lg:h-96 ${reversed ? 'lg:flex-row-reverse' : ''} ${i < features.length - 1 ? 'border-b border-white/10' : ''}`}
              >
                {/* Text — static */}
                <div className={`flex flex-col justify-center px-8 py-8 lg:w-2/5 shrink-0 border-b lg:border-b-0 border-white/10 bg-white/[0.02] ${reversed ? 'lg:border-l' : 'lg:border-r'}`}>
                  <span className="text-[11px] font-mono text-muted-foreground/30 mb-3">0{i + 1}</span>
                  <h3 className="text-xl font-semibold text-foreground tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>

                {/* Image panel — flippable */}
                <div
                  className="lg:w-3/5 overflow-hidden cursor-pointer"
                  style={{ perspective: '1200px' }}
                  onClick={() => setFlipped(isFlipped ? null : i)}
                >
                  <div
                    className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ease-in-out"
                    style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', minHeight: '16rem' }}
                  >
                    {/* Front — image */}
                    <div
                      className="group absolute inset-0 [backface-visibility:hidden] overflow-hidden" style={{ backgroundColor: 'oklch(0.1448 0 0)' }}
                    >
                      <div className="relative w-full h-full" style={{ transform: `perspective(1200px) rotateX(6deg) scale(${feature.imageScale ?? 1})` }}>
                        <img
                          src={feature.image}
                          alt={feature.imageAlt}
                          className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-102"
                        />
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: 'radial-gradient(ellipse at center, transparent 40%, oklch(0.1448 0 0 / 0.4) 70%, oklch(0.1448 0 0 / 0.85) 100%), linear-gradient(to bottom, transparent 50%, oklch(0.1448 0 0 / 0.7) 100%)',
                          }}
                        />
                      </div>
                      <Info className="absolute bottom-2 right-2 size-3 text-muted-foreground/20" />
                    </div>

                    {/* Back — detail text */}
                    <div className="absolute inset-0 flex flex-col justify-center px-5 py-5 sm:px-8 sm:py-8 [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ backgroundColor: 'oklch(0.1448 0 0)' }}>
                      <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed">{feature.detail}</p>
                      <span className="mt-6 text-[11px] font-mono text-muted-foreground/30">← click to go back</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

        </div>

        {/* Right side panel — desktop only */}
        <div
          className="hidden lg:flex flex-1 border border-white/10 border-l-0 relative overflow-hidden"
          style={{ maskImage: 'linear-gradient(to left, black 60%, transparent 100%)' }}
        >
          <StripedPattern direction="right" className="text-white/15" />
        </div>

      </div>
    </section>
  )
}
