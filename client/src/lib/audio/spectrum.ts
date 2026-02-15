import type { SpectrumResult } from './types'

// Frequency band ranges in Hz
const BANDS = {
  sub:      { min: 20,   max: 60 },
  low:      { min: 60,   max: 200 },
  lowMids:  { min: 200,  max: 500 },
  mids:     { min: 500,  max: 2000 },
  highMids: { min: 2000, max: 6000 },
  highs:    { min: 6000, max: 20000 },
} as const

export async function analyzeSpectrum(audioBuffer: AudioBuffer): Promise<SpectrumResult> {
  // Run all bands in parallel — each filters the audio and measures energy
  const [sub, low, lowMids, mids, highMids, highs] = await Promise.all([
    getBandEnergy(audioBuffer, BANDS.sub.min, BANDS.sub.max),
    getBandEnergy(audioBuffer, BANDS.low.min, BANDS.low.max),
    getBandEnergy(audioBuffer, BANDS.lowMids.min, BANDS.lowMids.max),
    getBandEnergy(audioBuffer, BANDS.mids.min, BANDS.mids.max),
    getBandEnergy(audioBuffer, BANDS.highMids.min, BANDS.highMids.max),
    getBandEnergy(audioBuffer, BANDS.highs.min, BANDS.highs.max),
  ])

  return { sub, low, lowMids, mids, highMids, highs }
}

// Filter the audio to a frequency band, then measure the RMS energy in dB
async function getBandEnergy(audioBuffer: AudioBuffer, minHz: number, maxHz: number): Promise<number> {
  const centerFreq = Math.sqrt(minHz * maxHz)
  const Q = centerFreq / (maxHz - minHz)

  const offlineContext = new OfflineAudioContext(1, audioBuffer.length, audioBuffer.sampleRate)

  const source = offlineContext.createBufferSource()
  source.buffer = audioBuffer

  // Bandpass filter isolates just this frequency range
  const filter = offlineContext.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = centerFreq
  filter.Q.value = Q

  source.connect(filter)
  filter.connect(offlineContext.destination)
  source.start(0)

  const renderedBuffer = await offlineContext.startRendering()
  const samples = renderedBuffer.getChannelData(0)

  // Calculate RMS (root mean square) energy
  let sum = 0
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i]
  }
  const rms = Math.sqrt(sum / samples.length)

  // Convert to dB (decibels relative to full scale)
  return rms === 0 ? -Infinity : 20 * Math.log10(rms)
}
