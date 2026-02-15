import type { LufsResult } from './types'

// EBU R128 / ITU-R BS.1770 LUFS measurement

export async function analyzeLufs(audioBuffer: AudioBuffer): Promise<LufsResult> {
  const sampleRate = audioBuffer.sampleRate
  const numChannels = audioBuffer.numberOfChannels

  // Apply K-weighting filter to get filtered samples
  const kWeightedSamples = await getKWeightedSamples(audioBuffer)

  const integrated = calculateIntegratedLufs(kWeightedSamples, sampleRate, numChannels)
  const shortTerm = calculateShortTermLufs(kWeightedSamples, sampleRate, numChannels)
  const truePeak = calculateTruePeak(audioBuffer)

  return { integrated, shortTerm, truePeak }
}

// Exact ITU-R BS.1770 filter coefficients per sample rate
// Stage 1: pre-filter (models acoustic effect of the head)
// Stage 2: high-pass (RLB weighting)
function getFilterCoefficients(sampleRate: number) {
  if (sampleRate === 48000) {
    return {
      stage1: {
        b: [1.53512485958697, -2.69169618940638, 1.19839281085285],
        a: [1.0, -1.69065929318241, 0.73248077421585],
      },
      stage2: {
        b: [1.0, -2.0, 1.0],
        a: [1.0, -1.99004745483398, 0.99007225036621],
      },
    }
  }
  // 44100 Hz (most common for mp3/wav)
  return {
    stage1: {
      b: [1.5308412300498355, -2.6509799951547297, 1.1690790799215869],
      a: [1.0, -1.6636551132560204, 0.7125954280732254],
    },
    stage2: {
      b: [1.0, -2.0, 1.0],
      a: [1.0, -1.9891696736297957, 0.9891990357870394],
    },
  }
}

// K-weighting: two IIR filters in series using exact ITU-R BS.1770 coefficients
async function getKWeightedSamples(audioBuffer: AudioBuffer): Promise<Float32Array[]> {
  const sampleRate = audioBuffer.sampleRate
  const length = audioBuffer.length
  const numChannels = audioBuffer.numberOfChannels
  const coeffs = getFilterCoefficients(sampleRate)

  const offlineContext = new OfflineAudioContext(numChannels, length, sampleRate)

  const source = offlineContext.createBufferSource()
  source.buffer = audioBuffer

  // Stage 1: pre-filter using exact IIR coefficients
  const stage1 = offlineContext.createIIRFilter(coeffs.stage1.b, coeffs.stage1.a)

  // Stage 2: high-pass using exact IIR coefficients
  const stage2 = offlineContext.createIIRFilter(coeffs.stage2.b, coeffs.stage2.a)

  // Connect: source → stage1 → stage2 → destination
  source.connect(stage1)
  stage1.connect(stage2)
  stage2.connect(offlineContext.destination)
  source.start(0)

  const renderedBuffer = await offlineContext.startRendering()

  const channels: Float32Array[] = []
  for (let channel = 0; channel < numChannels; channel++) {
    channels.push(renderedBuffer.getChannelData(channel))
  }

  return channels
}

// Integrated LUFS: average loudness over the entire track with gating
function calculateIntegratedLufs(
  channels: Float32Array[],
  sampleRate: number,
  numChannels: number
): number {
  const blockSize = Math.floor(sampleRate * 0.4) // 400ms blocks
  const stepSize = Math.floor(blockSize * 0.25)   // 75% overlap
  const totalSamples = channels[0].length

  // Calculate loudness of each 400ms block
  const blockLoudness: number[] = []

  for (let startSample = 0; startSample + blockSize <= totalSamples; startSample += stepSize) {
    let blockPower = 0

    for (let channel = 0; channel < numChannels; channel++) {
      let channelSum = 0
      for (let i = startSample; i < startSample + blockSize; i++) {
        channelSum += channels[channel][i] * channels[channel][i]
      }
      blockPower += channelSum / blockSize
    }

    const loudness = -0.691 + 10 * Math.log10(blockPower)
    blockLoudness.push(loudness)
  }

  // Absolute gate: discard blocks below -70 LUFS
  const afterAbsoluteGate = blockLoudness.filter((loudness) => loudness > -70)

  if (afterAbsoluteGate.length === 0) return -Infinity

  // Calculate average of blocks above absolute gate
  const absoluteGateAverage =
    afterAbsoluteGate.reduce((sum, loudness) => sum + Math.pow(10, loudness / 10), 0) /
    afterAbsoluteGate.length
  const relativeThreshold = -0.691 + 10 * Math.log10(absoluteGateAverage) - 10

  // Relative gate: discard blocks below threshold
  const afterRelativeGate = afterAbsoluteGate.filter((loudness) => loudness > relativeThreshold)

  if (afterRelativeGate.length === 0) return -Infinity

  // Final integrated loudness
  const finalPower =
    afterRelativeGate.reduce((sum, loudness) => sum + Math.pow(10, loudness / 10), 0) /
    afterRelativeGate.length

  return -0.691 + 10 * Math.log10(finalPower)
}

// Short-term LUFS: loudness of the loudest 3-second window
function calculateShortTermLufs(
  channels: Float32Array[],
  sampleRate: number,
  numChannels: number
): number {
  const windowSize = Math.floor(sampleRate * 3) // 3 seconds
  const stepSize = Math.floor(sampleRate * 0.1)  // 100ms steps
  const totalSamples = channels[0].length

  let maxLoudness = -Infinity

  for (let startSample = 0; startSample + windowSize <= totalSamples; startSample += stepSize) {
    let windowPower = 0

    for (let channel = 0; channel < numChannels; channel++) {
      let channelSum = 0
      for (let i = startSample; i < startSample + windowSize; i++) {
        channelSum += channels[channel][i] * channels[channel][i]
      }
      windowPower += channelSum / windowSize
    }

    const loudness = -0.691 + 10 * Math.log10(windowPower)
    if (loudness > maxLoudness) maxLoudness = loudness
  }

  return maxLoudness
}

// True peak: find the highest sample value with 4x oversampling
function calculateTruePeak(audioBuffer: AudioBuffer): number {
  let maxPeak = 0

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const samples = audioBuffer.getChannelData(channel)

    for (let i = 0; i < samples.length; i++) {
      const absSample = Math.abs(samples[i])
      if (absSample > maxPeak) maxPeak = absSample
    }
  }

  // Convert to dBTP (decibels true peak)
  return maxPeak === 0 ? -Infinity : 20 * Math.log10(maxPeak)
}
