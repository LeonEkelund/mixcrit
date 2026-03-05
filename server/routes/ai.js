import Groq from 'groq-sdk'
import express from 'express'

const router = express.Router()
const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/suggest', async (req, res) => {
  const { result, genre, genreTarget } = req.body

  if (!result || !genre || !genreTarget) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const prompt = buildPrompt(result, genre, genreTarget)

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  res.json({ suggestion: response.choices[0].message.content ?? '' })
})

function buildPrompt(result, genre, t) {
  return `
You are a professional mixing and mastering engineer. Analyze these measurements for a ${genre} track.

Return your response in exactly this format, no exceptions:

OVERVIEW
One sentence giving a general impression of the mix.

ISSUES
1. Issue Title
One to two sentences describing the problem and exactly what to do about it. Mention specific settings (e.g. boost 3dB at 200Hz, set threshold to -18dB).

2. Issue Title
One to two sentences describing the problem and fix.

(3-5 issues total)

PLUGINS
Free: Specific plugin name (Tokyo Dawn Labs, Kilohearts, etc.)
Paid: Specific plugin name (FabFilter, Universal Audio, etc.)
One sentence on which issue each plugin addresses.

Rules:
- No markdown, no asterisks, no bold
- Do not mention reverb as a fix
- If clipping is detected, mention it could be intentional
- Always give both free and paid plugin options

LOUDNESS
- Integrated: ${result.lufs.integrated.toFixed(1)} LUFS (target: ${t.lufs.min} to ${t.lufs.max})
- Short-term max: ${result.lufs.shortTerm.toFixed(1)} LUFS
- True Peak: ${result.lufs.truePeak.toFixed(1)} dBTP (limit: -1.0)

DYNAMICS
- Dynamic Range: ${result.dynamics.dynamicRange.toFixed(1)} dB
- Crest Factor: ${result.dynamics.crestFactor.toFixed(1)} dB (target: ${t.crestFactor.min} to ${t.crestFactor.max})
- Clipping: ${result.dynamics.clipping ? 'DETECTED' : 'None'}

FREQUENCY SPECTRUM
- Sub 20-60 Hz:        ${result.spectrum.sub.toFixed(1)} dB  [${t.spectrum.sub.min} to ${t.spectrum.sub.max}]
- Low 60-200 Hz:       ${result.spectrum.low.toFixed(1)} dB  [${t.spectrum.low.min} to ${t.spectrum.low.max}]
- Low Mids 200-500 Hz: ${result.spectrum.lowMids.toFixed(1)} dB  [${t.spectrum.lowMids.min} to ${t.spectrum.lowMids.max}]
- Mids 500-2k Hz:      ${result.spectrum.mids.toFixed(1)} dB  [${t.spectrum.mids.min} to ${t.spectrum.mids.max}]
- High Mids 2k-6k Hz:  ${result.spectrum.highMids.toFixed(1)} dB  [${t.spectrum.highMids.min} to ${t.spectrum.highMids.max}]
- Highs 6k-20k Hz:     ${result.spectrum.highs.toFixed(1)} dB  [${t.spectrum.highs.min} to ${t.spectrum.highs.max}]

STEREO IMAGE
- Correlation: ${result.stereo.correlation.toFixed(2)}
- Mono Compatible: ${result.stereo.monoCompatible ? 'Yes' : 'No'}
- Stereo Width: ${(result.stereo.stereoWidth * 100).toFixed(0)}%
- Mid Energy: ${result.stereo.midEnergy.toFixed(1)} dB
- Side Energy: ${result.stereo.sideEnergy.toFixed(1)} dB
`.trim()
}

export default router
