import type { StereoResult } from './types'

export async function analyzeStereo(audioBuffer: AudioBuffer): Promise<StereoResult> {
  // Stereo analysis needs 2 channels — if mono, return defaults
  if (audioBuffer.numberOfChannels < 2) {
    return {
      correlation: 1,
      monoCompatible: true,
      midEnergy: 0,
      sideEnergy: -Infinity,
      stereoWidth: 0,
    }
  }

  const left = audioBuffer.getChannelData(0)
  const right = audioBuffer.getChannelData(1)
  const length = audioBuffer.length

  // Calculate mid (L+R) and side (L-R) signals
  let midSum = 0
  let sideSum = 0
  let leftSum = 0
  let rightSum = 0
  let crossSum = 0

  for (let i = 0; i < length; i++) {
    const mid = (left[i] + right[i]) / 2
    const side = (left[i] - right[i]) / 2

    midSum += mid * mid
    sideSum += side * side
    leftSum += left[i] * left[i]
    rightSum += right[i] * right[i]
    crossSum += left[i] * right[i]
  }

  // Stereo correlation: how similar L and R are
  // +1 = identical (mono), 0 = unrelated, -1 = completely out of phase
  const leftRMS = Math.sqrt(leftSum / length)
  const rightRMS = Math.sqrt(rightSum / length)
  const correlation = (leftRMS * rightRMS === 0)
    ? 1
    : (crossSum / length) / (leftRMS * rightRMS)

  // Mid/side energy in dB
  const midRMS = Math.sqrt(midSum / length)
  const sideRMS = Math.sqrt(sideSum / length)
  const midEnergy = midRMS === 0 ? -Infinity : 20 * Math.log10(midRMS)
  const sideEnergy = sideRMS === 0 ? -Infinity : 20 * Math.log10(sideRMS)

  // Stereo width: ratio of side energy to mid energy
  // 0 = pure mono, higher = wider stereo image
  const stereoWidth = midRMS === 0 ? 0 : sideRMS / midRMS

  // Mono compatible if correlation > 0.5 (no major phase cancellation)
  const monoCompatible = correlation > 0.5

  return { correlation, monoCompatible, midEnergy, sideEnergy, stereoWidth }
}
