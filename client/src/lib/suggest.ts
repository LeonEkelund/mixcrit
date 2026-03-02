import type { AnalysisResult } from './audio/types'
import { genreTargets } from './audio/genreTargets'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function getSuggestions(result: AnalysisResult, genre: string): Promise<string> {
  const genreTarget = genreTargets[genre]
  const response = await fetch(`${API_URL}/api/ai/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ result, genre, genreTarget }),
  })
  const data = await response.json()
  return data.suggestion
}
