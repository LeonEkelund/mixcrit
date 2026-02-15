import type { DynamicsResult } from './types'

export async function analyzeDynamics(audioBuffer: AudioBuffer): Promise<DynamicsResult> {
  const samples = getMixedDownSamples(audioBuffer)

  const peak = calculatePeak(samples)
  const rms = calculateRMS(samples)
  const dynamicRange = calculateDynamicRange(samples, audioBuffer.sampleRate)
  const crestFactor = peak - rms // difference between peak and average in dB
  const clipping = detectClipping(samples)

  return { dynamicRange, crestFactor, clipping }
}

// Mix all channels down to mono for analysis
function getMixedDownSamples(audioBuffer: AudioBuffer): Float32Array {
  const length = audioBuffer.length
  const numChannels = audioBuffer.numberOfChannels
  const mixed = new Float32Array(length)

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      mixed[i] += channelData[i] / numChannels
    }
  }

  return mixed
}

// Peak level in dBFS
function calculatePeak(samples: Float32Array): number {
  let maxAbs = 0
  for (let i = 0; i < samples.length; i++) {
    const abs = Math.abs(samples[i])
    if (abs > maxAbs) maxAbs = abs
  }
  return maxAbs === 0 ? -Infinity : 20 * Math.log10(maxAbs)
}

// RMS (average loudness) in dBFS
function calculateRMS(samples: Float32Array): number {
  let sum = 0
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i]
  }
  const rms = Math.sqrt(sum / samples.length)
  return rms === 0 ? -Infinity : 20 * Math.log10(rms)
}

// Dynamic range: difference between the loudest and quietest 1-second windows
function calculateDynamicRange(samples: Float32Array, sampleRate: number): number {
  const windowSize = sampleRate // 1-second windows
  const stepSize = Math.floor(sampleRate * 0.5) // 500ms steps

  let maxRMS = -Infinity
  let minRMS = Infinity

  for (let start = 0; start + windowSize <= samples.length; start += stepSize) {
    let sum = 0
    for (let i = start; i < start + windowSize; i++) {
      sum += samples[i] * samples[i]
    }
    const windowRMS = Math.sqrt(sum / windowSize)
    const windowDB = windowRMS === 0 ? -Infinity : 20 * Math.log10(windowRMS)

    // Ignore quiet sections (below -40 dBFS) so intros/outros don't skew the result
    if (windowDB > -40) {
      if (windowDB > maxRMS) maxRMS = windowDB
      if (windowDB < minRMS) minRMS = windowDB
    }
  }

  if (maxRMS === -Infinity || minRMS === Infinity) return 0
  return maxRMS - minRMS
}

// Check if any samples are at or very near the maximum (clipping)
function detectClipping(samples: Float32Array): boolean {
  const clippingThreshold = 0.99

  for (let i = 0; i < samples.length; i++) {
    if (Math.abs(samples[i]) >= clippingThreshold) return true
  }

  return false
}
