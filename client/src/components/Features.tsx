import freq from '@/assets/screenshots/freq-frame.png'
import dynamic from '@/assets/screenshots/dynamic-frame.png'
import stereo from '@/assets/screenshots/stereo-frame.png'
import loud from '@/assets/screenshots/loud-frame.png'

const features = [
  {
    title: 'Frequency Spectrum',
    description: 'See how your EQ balance stacks up against genre targets across sub, low, mids, high mids, and highs.',
    image: freq,
    imageAlt: 'Frequency spectrum',
  },
  {
    title: 'Dynamics',
    description: 'Dynamic range, crest factor, and clipping detection to keep your mix punchy and controlled.',
    image: dynamic,
    imageAlt: 'Dynamics',
  },
  {
    title: 'Stereo Image',
    description: 'Stereo width, correlation, and mono compatibility so your mix translates on every speaker.',
    image: stereo,
    imageAlt: 'Stereo image',
  },
  {
    title: 'Loudness',
    description: 'Integrated LUFS and true peak checked against Spotify, Apple Music, and YouTube targets.',
    image: loud,
    imageAlt: 'Loudness',
  },
]

export default function Features() {
  return (
    <section className="px-4 sm:px-6 pt-12 pb-24">
      {/* Full-height side lines */}
      <div className="max-w-5xl mx-auto relative">


        {/* Outer bordered container */}
        <div className="border border-white/10">

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
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`flex flex-col lg:flex-row lg:h-96 ${i < features.length - 1 ? 'border-b border-white/10' : ''}`}
            >
              {/* Left — text */}
              <div className="flex flex-col justify-center px-8 py-8 lg:w-2/5 lg:border-r border-b lg:border-b-0 border-white/10 shrink-0">
                <span className="text-[11px] font-mono text-muted-foreground/30 mb-3">
                  0{i + 1}
                </span>
                <h3 className="text-xl font-semibold text-foreground tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>

              {/* Right — image */}
              <div className="flex items-center justify-center lg:w-3/5 p-6 bg-white/[0.01] overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.imageAlt}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}
