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
You are a professional mixing and mastering engineer. Below are measurements for a ${genre} track. Identify the most important problems only — skip anything within its target range.

Output ONLY the following two sections in exactly this format:

OVERVIEW
Two to three sentences giving an honest overall impression of the mix and its main weaknesses.

ISSUES
1. Issue Title
Problem: Two to three sentences explaining what the problem is and why it matters for this genre.
Resolution: Two to three sentences with specific actionable steps — include exact frequency ranges, dB amounts, compressor threshold and ratio settings, or ceiling values where relevant.
Free: Plugin name.
Paid: Plugin name.

2. Issue Title
Problem: ...
Resolution: ...
Free: Plugin name.
Paid: Plugin name.

(3 to 5 issues total)

Rules:
- No markdown, no asterisks, no bold
- Do not output raw numbers from the measurements
- Do not flag anything within its target range
- Do not suggest reverb
- If clipping is detected, note it may be intentional (e.g. saturation or limiting)

MEASUREMENTS (context only — do not output these):
Loudness: ${result.lufs.integrated.toFixed(1)} LUFS integrated (target ${t.lufs.min} to ${t.lufs.max}), ${result.lufs.truePeak.toFixed(1)} dBTP true peak (limit -1.0)
Dynamics: ${result.dynamics.dynamicRange.toFixed(1)} dB range, ${result.dynamics.crestFactor.toFixed(1)} dB crest factor (target ${t.crestFactor.min} to ${t.crestFactor.max}), clipping: ${result.dynamics.clipping ? 'DETECTED' : 'none'}
Spectrum: sub ${result.spectrum.sub.toFixed(1)} dB [${t.spectrum.sub.min}-${t.spectrum.sub.max}], low ${result.spectrum.low.toFixed(1)} dB [${t.spectrum.low.min}-${t.spectrum.low.max}], low mids ${result.spectrum.lowMids.toFixed(1)} dB [${t.spectrum.lowMids.min}-${t.spectrum.lowMids.max}], mids ${result.spectrum.mids.toFixed(1)} dB [${t.spectrum.mids.min}-${t.spectrum.mids.max}], high mids ${result.spectrum.highMids.toFixed(1)} dB [${t.spectrum.highMids.min}-${t.spectrum.highMids.max}], highs ${result.spectrum.highs.toFixed(1)} dB [${t.spectrum.highs.min}-${t.spectrum.highs.max}]
Stereo: correlation ${result.stereo.correlation.toFixed(2)}, mono compatible: ${result.stereo.monoCompatible ? 'yes' : 'no'}, width ${(result.stereo.stereoWidth * 100).toFixed(0)}%
`.trim()
}

export default router
