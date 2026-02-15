export type LufsResult = {
  integrated: number
  shortTerm: number
  truePeak: number
}

export type SpectrumResult = {
  sub: number       // 20–60 Hz
  low: number       // 60–200 Hz
  lowMids: number   // 200–500 Hz
  mids: number      // 500–2k Hz
  highMids: number  // 2k–6k Hz
  highs: number     // 6k–20k Hz
}

export type DynamicsResult = {
  dynamicRange: number
  crestFactor: number
  clipping: boolean
}

export type StereoResult = {
  correlation: number     // -1 to +1 (1 = mono, 0 = unrelated, -1 = out of phase)
  monoCompatible: boolean // true if mix won't fall apart in mono
  midEnergy: number       // dB — energy in the center (mid)
  sideEnergy: number      // dB — energy in the sides
  stereoWidth: number     // ratio of side to mid (0 = mono, higher = wider)
}

export type AnalysisResult = {
  lufs: LufsResult
  spectrum: SpectrumResult
  dynamics: DynamicsResult
  stereo: StereoResult
}
