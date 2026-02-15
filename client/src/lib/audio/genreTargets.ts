export type GenreTarget = {
  lufs: { min: number; max: number }
  crestFactor: { min: number; max: number }
  spectrum: {
    sub: { min: number; max: number }
    low: { min: number; max: number }
    lowMids: { min: number; max: number }
    mids: { min: number; max: number }
    highMids: { min: number; max: number }
    highs: { min: number; max: number }
  }
}

export const genreTargets: Record<string, GenreTarget> = {
  'Pop': {
    lufs: { min: -11, max: -8 },
    crestFactor: { min: 7, max: 12 },
    spectrum: {
      sub: { min: -22, max: -14 },     // tight, minimal sub
      low: { min: -18, max: -12 },
      lowMids: { min: -22, max: -14 },
      mids: { min: -20, max: -14 },
      highMids: { min: -26, max: -18 }, // slight high-end shine
      highs: { min: -32, max: -24 },
    },
  },
  'EDM': {
    lufs: { min: -9, max: -6 },
    crestFactor: { min: 4, max: 8 },
    spectrum: {
      sub: { min: -18, max: -10 },     // strong sub (30-60 Hz)
      low: { min: -16, max: -10 },
      lowMids: { min: -24, max: -18 },
      mids: { min: -24, max: -18 },
      highMids: { min: -22, max: -16 }, // bright highs
      highs: { min: -26, max: -20 },
    },
  },
  'Hip-Hop': {
    lufs: { min: -11, max: -8 },
    crestFactor: { min: 6, max: 13 },
    spectrum: {
      sub: { min: -20, max: -10 },     // heavy 808/sub
      low: { min: -18, max: -10 },
      lowMids: { min: -24, max: -16 },
      mids: { min: -24, max: -16 },     // clear vocal mids (1-4 kHz)
      highMids: { min: -28, max: -20 },
      highs: { min: -34, max: -26 },
    },
  },
  'Metal': {
    lufs: { min: -12, max: -9 },
    crestFactor: { min: 8, max: 12 },
    spectrum: {
      sub: { min: -24, max: -18 },     // present but not heavy
      low: { min: -18, max: -12 },
      lowMids: { min: -18, max: -12 },  // strong low-mids (150-400 Hz)
      mids: { min: -20, max: -14 },
      highMids: { min: -22, max: -16 },
      highs: { min: -28, max: -22 },
    },
  },
}
