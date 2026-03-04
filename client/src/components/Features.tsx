import { useState } from 'react'
import freq from '@/assets/screenshots/freq-final.png'
import dynamic from '@/assets/screenshots/dynamic-final.png'
import stereo from '@/assets/screenshots/stereo-final.png'
import loud from '@/assets/screenshots/loud-final.png'
import { StripedPattern } from '@/components/magicui/striped-pattern'

const features = [
  {
    title: 'Frequency Spectrum',
    description: 'See how your EQ balance stacks up against genre targets across sub, low, mids, high mids, and highs.',
    detail: 'Your mix is split into six frequency bands and compared against genre-calibrated targets. Sub (20–60 Hz) controls weight and rumble. Low (60–200 Hz) adds body. Low Mids (200–500 Hz) can cause muddiness if over-represented. Mids (500 Hz–3 kHz) carry vocals and presence. High Mids (3–6 kHz) add clarity and bite. Highs (6–20 kHz) give air and brightness. Each band is rated Good, Neutral, or Warning so you know exactly where your balance needs work.',
    image: freq,
    imageAlt: 'Frequency spectrum',
  },
  {
    title: 'Dynamics',
    description: 'Dynamic range, crest factor, and clipping detection to keep your mix punchy and controlled.',
    detail: 'Dynamic range measures the difference between the quietest and loudest parts of your track. Crest factor reflects the peak-to-RMS ratio — a healthy mix typically sits between 8–14 dB. Anything lower usually means the track is over-compressed and will sound flat. Clipping detection scans for samples exceeding 0 dBFS, which causes digital distortion. If your mix is clipping, you\'re likely losing headroom before it even hits a mastering chain or streaming platform.',
    image: dynamic,
    imageAlt: 'Dynamics',
  },
  {
    title: 'Stereo Image',
    description: 'Stereo width, correlation, and mono compatibility so your mix translates on every speaker.',
    detail: 'The stereo analyzer looks at three dimensions of your mix\'s width. Stereo width shows how far your mix spreads across the left/right field — too wide and it\'ll fall apart on mono systems. Correlation measures the phase relationship between channels — values below 0 mean phase cancellation, which causes elements to disappear when summed. Mono compatibility tells you how the mix holds up on a single speaker, which matters for phones, club PAs, and most streaming scenarios.',
    image: stereo,
    imageAlt: 'Stereo image',
  },
  {
    title: 'Loudness',
    description: 'Integrated LUFS and true peak checked against Spotify, Apple Music, and YouTube targets.',
    detail: 'Integrated LUFS (Loudness Units Full Scale) is the industry standard for measuring perceived loudness across a full track. Spotify targets -14 LUFS, Apple Music -16 LUFS, YouTube -14 LUFS — tracks louder than these targets get turned down automatically, and over-limiting to hit them kills your dynamics. True peak measures peak levels after digital-to-analog conversion, where inter-sample peaks can exceed 0 dBFS and cause distortion. -1 dBTP is the recommended ceiling for streaming.',
    image: loud,
    imageAlt: 'Loudness',
  },
]

export default function Features() {
  const [flipped, setFlipped] = useState<number | null>(null)

  return (
    <section className="pt-12">
      <div className="flex">

        {/* Left side panel — desktop only */}
        <div
          className="hidden lg:flex flex-1 border border-white/10 border-r-0 relative overflow-hidden"
          style={{ maskImage: 'linear-gradient(to right, black 60%, transparent 100%)' }}
        >
          <StripedPattern className="text-white/15" />
        </div>

        {/* Outer bordered container */}
        <div className="border border-white/10 w-full lg:max-w-5xl px-4 sm:px-6 lg:px-0">

          {/* Heading row */}
          <div className="px-8 py-12 border-b border-white/10 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-redaction-50 italic text-foreground tracking-tight">
              What you get
            </h2>
            <p className="mt-3 text-sm text-muted-foreground/60 max-w-sm mx-auto">
              Every analysis runs locally in your browser. No uploads, no waiting, no accounts.
            </p>
          </div>

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
                <div className={`flex flex-col justify-center px-8 py-8 lg:w-2/5 shrink-0 border-b lg:border-b-0 border-white/10 ${reversed ? 'lg:border-l' : 'lg:border-r'}`}>
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
                      className="group absolute inset-0 flex flex-col items-center justify-center p-6 [backface-visibility:hidden]"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 50%, transparent 75%)' }}
                    >
                      <img
                        src={feature.image}
                        alt={feature.imageAlt}
                        className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-102"
                      />
                      <span className="absolute bottom-3 right-4 text-[11px] font-mono text-muted-foreground/30">click for details →</span>
                    </div>

                    {/* Back — detail text */}
                    <div className="absolute inset-0 flex flex-col justify-center px-8 py-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.detail}</p>
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
