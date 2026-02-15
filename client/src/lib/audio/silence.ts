import type { SilenceResult } from './types'

// Check for silence at the start and end of the track
const SILENCE_THRESHOLD = 0.005  // samples below this are considered silent
const CHECK_DURATION = 0.1       // check the first/last 100ms

export async function analyzeSilence(audioBuffer: AudioBuffer): Promise<SilenceResult> {
  const sampleRate = audioBuffer.sampleRate
  const samplesToCheck = Math.floor(sampleRate * CHECK_DURATION)

  const start = isSilent(audioBuffer, 0, samplesToCheck)
  const end = isSilent(audioBuffer, audioBuffer.length - samplesToCheck, audioBuffer.length)

  return { start, end }
}

// Check if a range of samples is silent across all channels
function isSilent(audioBuffer: AudioBuffer, from: number, to: number): boolean {
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const samples = audioBuffer.getChannelData(channel)
    for (let i = from; i < to; i++) {
      if (Math.abs(samples[i]) > SILENCE_THRESHOLD) return false
    }
  }
  return true
}
