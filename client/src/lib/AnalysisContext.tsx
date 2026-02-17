import { createContext, useContext, useState } from 'react'
import type { AnalysisResult } from './audio/types'

type AnalysisData = {
  result: AnalysisResult | null
  genre: string
  fileName: string
  file: File | null
  setAnalysis: (result: AnalysisResult, genre: string, fileName: string, file: File) => void
}

const AnalysisContext = createContext<AnalysisData>({
  result: null,
  genre: '',
  fileName: '',
  file: null,
  setAnalysis: () => { },
})

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [genre, setGenre] = useState('')
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState<File | null>(null)

  function setAnalysis(newResult: AnalysisResult, newGenre: string, newFileName: string, newFile: File) {
    setResult(newResult)
    setGenre(newGenre)
    setFileName(newFileName)
    setFile(newFile)
  }

  return (
    <AnalysisContext.Provider value={{ result, genre, fileName, file, setAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  return useContext(AnalysisContext)
}
