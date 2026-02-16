import { Activity, ArrowLeftRight, Gauge, Volume2 } from 'lucide-react'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'

const features = [
  {
    Icon: Activity,
    name: 'EQ Balance',
    description: 'See how your frequency spectrum stacks up',
    detail: 'Broken down by sub, low, mid, high, and air bands',
    className: 'col-span-3 sm:col-span-1',
    background: <></>,
  },
  {
    Icon: Gauge,
    name: 'Dynamic Range',
    description: 'Check your compression and transient detail',
    detail: 'Crest factor, peak-to-loudness ratio, and more',
    className: 'col-span-3 sm:col-span-1',
    background: <></>,
  },
  {
    Icon: ArrowLeftRight,
    name: 'Stereo Width',
    description: 'Analyze your stereo image across frequencies',
    detail: 'Correlation, mid/side balance, and panning spread',
    className: 'col-span-3 sm:col-span-1',
    background: <></>,
  },
  {
    Icon: Volume2,
    name: 'Loudness',
    description: 'LUFS measurements against streaming targets',
    detail: 'Integrated, short-term, and true peak with platform targets',
    className: 'col-span-3 sm:col-span-1',
    background: <></>,
  },
]

export default function Features() {
  return (
    <section className="flex flex-col items-center gap-10 px-6 py-24">
      <h2 className="text-6xl font-redaction-50 font-medium tracking-tight italic text-foreground">
        What you get
      </h2>

      <BentoGrid className="max-w-3xl auto-rows-[12rem] grid-cols-3 sm:grid-cols-2">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </section>
  )
}
