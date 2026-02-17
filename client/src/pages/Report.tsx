import { useEffect, useRef, useState } from 'react'
import { useAnalysis } from '@/lib/AnalysisContext'
import { genreTargets } from '@/lib/audio/genreTargets'
import { Link } from 'react-router-dom'
import { Play, Pause, Volume2, Activity, Radio, Gauge } from 'lucide-react'
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid'
import { TonalProfile } from '@/components/TonalProfile'
import { motion, AnimatePresence } from 'motion/react'
import WaveSurfer from 'wavesurfer.js'
import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram.esm.js'

// Green-tinted colormap matching the project's primary color
const greenColorMap: number[][] = Array.from({ length: 256 }, (_, i) => {
  const t = i / 255
  return [t * 0.33, t * 0.94, t * 0.67, 1]
})

const barDelays = [0, 0.2, 0.4, 0.1, 0.3, 0.5, 0.15, 0.35]
const barHeights = ['60%', '85%', '45%', '100%', '70%', '90%', '50%', '75%']

function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const duration = 4000
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      setProgress(Math.min(Math.round((elapsed / duration) * 100), 100))
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-end gap-1.5 h-24">
          {barDelays.map((delay, i) => (
            <div
              key={i}
              className="w-2 rounded-full bg-primary"
              style={{
                height: barHeights[i],
                animation: `eqBounce 0.8s ease-in-out ${delay}s infinite alternate`,
              }}
            />
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl font-bold font-mono text-primary">{progress}%</span>
          <span className="text-sm text-muted-foreground">Preparing your report...</span>
        </div>
      </div>
      <style>{`
        @keyframes eqBounce {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  )
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function statusColor(value: number, target: { min: number; max: number }) {
  if (value < target.min) return 'text-yellow-400'
  if (value > target.max) return 'text-red-400'
  return 'text-primary'
}

function statusLabel(value: number, target: { min: number; max: number }) {
  if (value < target.min) return 'Low'
  if (value > target.max) return 'High'
  return 'Good'
}

function MetricRow({ label, value, unit, target }: {
  label: string
  value: number
  unit: string
  target?: { min: number; max: number }
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{value.toFixed(1)} {unit}</span>
        {target && (
          <span className={`text-xs font-medium ${statusColor(value, target)}`}>
            {statusLabel(value, target)}
          </span>
        )}
      </div>
    </div>
  )
}

function Report() {
  const { result, genre, fileName, file } = useAnalysis()
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [spectrogramReady, setSpectrogramReady] = useState(false)
  const [timerDone, setTimerDone] = useState(false)
  const ready = spectrogramReady && timerDone

  useEffect(() => {
    const timeout = setTimeout(() => setTimerDone(true), 4400)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!file || !waveformRef.current) return

    const objectUrl = URL.createObjectURL(file)

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4a4a4a',
      progressColor: '#86efac',
      cursorColor: '#86efac',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 80,
      url: objectUrl,
    })

    const spec = ws.registerPlugin(SpectrogramPlugin.create({
      labels: false,
      height: 100,
      fftSamples: 1024,
      scale: 'mel',
      colorMap: greenColorMap,
      useWebWorker: true,
    }))

    spec.on('ready', () => setSpectrogramReady(true))

    ws.on('ready', () => setDuration(ws.getDuration()))
    ws.on('audioprocess', () => setCurrentTime(ws.getCurrentTime()))
    ws.on('seeking', () => setCurrentTime(ws.getCurrentTime()))
    ws.on('play', () => setIsPlaying(true))
    ws.on('pause', () => setIsPlaying(false))
    ws.on('finish', () => setIsPlaying(false))

    wavesurferRef.current = ws

    return () => {
      ws.destroy()
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No analysis data. <Link to="/upload" className="text-primary hover:underline">Upload a track first.</Link></p>
      </div>
    )
  }

  const targets = genreTargets[genre]

  const bandLabels: Record<string, string> = {
    sub: 'Sub (20–60 Hz)',
    low: 'Low (60–200 Hz)',
    lowMids: 'Low Mids (200–500 Hz)',
    mids: 'Mids (500–2k Hz)',
    highMids: 'High Mids (2k–6k Hz)',
    highs: 'Highs (6k–20k Hz)',
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!ready && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, exit: { duration: 0.5 } }}
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden offscreen while loading, fades in when ready */}
      <motion.div
        initial={false}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.4, delay: ready ? 0.6 : 0 }}
        style={ready ? undefined : { position: 'absolute', left: '-9999px', width: '100%', maxWidth: '64rem' }}
      >
        <div className="min-h-screen px-4 pt-28 pb-12 max-w-5xl mx-auto flex flex-col items-center">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">{fileName}</h1>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary">
              {genre}
            </span>
          </div>

          {/* Waveform Player */}
          {file && (
            <div className="mb-8 w-full rounded-xl border border-border bg-background p-4">
              <div ref={waveformRef} />
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={() => wavesurferRef.current?.playPause()}
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-background hover:opacity-90 transition-opacity"
                >
                  {isPlaying ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                      <rect x="1" y="1" width="3" height="8" rx="0.5" />
                      <rect x="6" y="1" width="3" height="8" rx="0.5" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                      <polygon points="2.5,1 8.5,5 2.5,9" />
                    </svg>
                  )}
                </button>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          )}

          {/* Tonal Profile */}
          <div className="mb-8 w-full">
            <TonalProfile spectrum={result.spectrum} targets={targets} />
          </div>

          {/* Metric Cards */}
          <BentoGrid className="grid-cols-1 lg:grid-cols-2 auto-rows-auto gap-4">
            <BentoCard
              noHover
              name="Loudness"
              className="col-span-1"
              Icon={Volume2}
              description="LUFS metering & true peak levels"
              background={
                <div className="p-4 pt-2 space-y-0">
                  <MetricRow label="Integrated" value={result.lufs.integrated} unit="LUFS" target={targets?.lufs} />
                  <MetricRow label="Short-term max" value={result.lufs.shortTerm} unit="LUFS" />
                  <MetricRow
                    label="True Peak"
                    value={result.lufs.truePeak}
                    unit="dBTP"
                    target={{ min: -20, max: -1 }}
                  />
                </div>
              }
            />

            <BentoCard
              noHover
              name="Dynamics"
              className="col-span-1"
              Icon={Activity}
              description="Dynamic range & crest factor"
              background={
                <div className="p-4 pt-2 space-y-0">
                  <MetricRow label="Dynamic Range" value={result.dynamics.dynamicRange} unit="dB" />
                  <MetricRow label="Crest Factor" value={result.dynamics.crestFactor} unit="dB" target={targets?.crestFactor} />
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-muted-foreground">Clipping</span>
                    <span className={`text-sm font-medium ${result.dynamics.clipping ? 'text-red-400' : 'text-primary'}`}>
                      {result.dynamics.clipping ? 'Detected' : 'None'}
                    </span>
                  </div>
                </div>
              }
            />

            <BentoCard
              noHover
              name="Frequency Spectrum"
              className="col-span-1"
              Icon={Gauge}
              description="Energy distribution across frequency bands"
              background={
                <div className="p-4 pt-2 space-y-0">
                  {Object.entries(result.spectrum).map(([band, value]) => (
                    <MetricRow
                      key={band}
                      label={bandLabels[band] || band}
                      value={value}
                      unit="dB"
                      target={targets?.spectrum[band as keyof typeof targets.spectrum]}
                    />
                  ))}
                </div>
              }
            />

            <BentoCard
              noHover
              name="Stereo Image"
              className="col-span-1"
              Icon={Radio}
              description="Stereo width, correlation & mono compatibility"
              background={
                <div className="p-4 pt-2 space-y-0">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-muted-foreground">Correlation</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{result.stereo.correlation.toFixed(2)}</span>
                      <span className={`text-xs font-medium ${result.stereo.correlation < 0 ? 'text-red-400' : result.stereo.correlation < 0.5 ? 'text-yellow-400' : 'text-primary'}`}>
                        {result.stereo.correlation < 0 ? 'Out of phase' : result.stereo.correlation < 0.5 ? 'Very wide' : 'Good'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-muted-foreground">Mono Compatible</span>
                    <span className={`text-sm font-medium ${result.stereo.monoCompatible ? 'text-primary' : 'text-red-400'}`}>
                      {result.stereo.monoCompatible ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <MetricRow label="Mid Energy" value={result.stereo.midEnergy} unit="dB" />
                  <MetricRow label="Side Energy" value={result.stereo.sideEnergy} unit="dB" />
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-muted-foreground">Stereo Width</span>
                    <span className="text-sm font-medium">{(result.stereo.stereoWidth * 100).toFixed(0)}%</span>
                  </div>
                </div>
              }
            />
          </BentoGrid>

          {/* Footer link */}
          <div className="mt-10 text-center">
            <Link to="/upload" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Analyze another track
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Report
