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

Start with one sentence giving a general impression of the mix overall. Then give 3-5 specific issues as a numbered list. Each item should be one or two sentences max — state the problem and what to do about it. Add a blank line between each numbered item. No markdown, no asterisks, no bold, no headers. Plain text only.

Give tips on plugins to use, both free and plugins that cost, here is examples of companies to mention:
Free: Tokyo dawn labs, kilohearts
Cost: Fabfilter, Universal audio plugins et.c

Also mention general settings to fix the issues (like boost here and here with EQ, and threshold/speed on compressor)

Do not mention reverb to fix the mix.
Always give free and payed option on the plugins recommended

Everytime you mention clipping, also mention that this could be an intentional effect.

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
