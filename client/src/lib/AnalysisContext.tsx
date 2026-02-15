import { createContext, useContext, useState } from 'react'
import type { AnalysisResult } from './audio/types'

type AnalysisData = {
  result: AnalysisResult | null
  genre: string
  fileName: string
  setAnalysis: (result: AnalysisResult, genre: string, fileName: string) => void
}

const AnalysisContext = createContext<AnalysisData>({
  result: null,
  genre: '',
  fileName: '',
  setAnalysis: () => { },
})

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [genre, setGenre] = useState('')
  const [fileName, setFileName] = useState('')

  function setAnalysis(newResult: AnalysisResult, newGenre: string, newFileName: string) {
    setResult(newResult)
    setGenre(newGenre)
    setFileName(newFileName)
  }

  return (
    <AnalysisContext.Provider value={{ result, genre, fileName, setAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  return useContext(AnalysisContext)
}
