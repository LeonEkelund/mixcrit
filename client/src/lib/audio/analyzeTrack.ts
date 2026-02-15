import { analyzeLufs } from './lufs'
import { analyzeSpectrum } from './spectrum'
import { analyzeDynamics } from './dynamics'
import { analyzeStereo } from './stereo'
import type { AnalysisResult } from './types'

export async function analyzeTrack(file: File): Promise<AnalysisResult> {
  // Decode the audio file into raw sample data
  const audioContext = new AudioContext()
  const arrayBuffer = await file.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

  // Run all analysis in parallel since they're independent
  const [lufs, spectrum, dynamics, stereo] = await Promise.all([
    analyzeLufs(audioBuffer),
    analyzeSpectrum(audioBuffer),
    analyzeDynamics(audioBuffer),
    analyzeStereo(audioBuffer),
  ])

  await audioContext.close()

  return { lufs, spectrum, dynamics, stereo }
}
