import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderOpen } from 'lucide-react'
import { analyzeTrack } from '@/lib/audio/analyzeTrack'
import { useAnalysis } from '@/lib/AnalysisContext'
import { motion } from 'motion/react'

const genres = ['Hip-Hop', 'Pop', 'Metal', 'EDM']

function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [genre, setGenre] = useState('')
  const [dragging, setDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)
  const navigate = useNavigate()
  const { setAnalysis } = useAnalysis()
  const resultRef = useRef<Awaited<ReturnType<typeof analyzeTrack>> | null>(null)

  function handleFile(audioFile: File) {
    if (audioFile.type.startsWith('audio/')) setFile(audioFile)
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) handleFile(selectedFile)
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault()
    setDragging(false)
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) handleFile(droppedFile)
  }

  async function handleSubmit() {
    if (!file || !genre) return

    setAnalyzing(true)
    const result = await analyzeTrack(file)
    resultRef.current = result
    setAnalysis(result, genre, file.name, file)
    setFadingOut(true)
  }

  function handleFadeComplete() {
    if (fadingOut) {
      navigate('/report')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        animate={{ opacity: fadingOut ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={handleFadeComplete}
        className="w-full max-w-md flex flex-col items-center gap-6"
      >
        <label
          onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`w-full flex flex-col items-center gap-2 rounded-lg p-6 text-center cursor-pointer border-2 border-dashed transition-colors ${dragging ? 'border-white' : 'border-muted-foreground/40 hover:border-muted-foreground'}`}
        >
          <FolderOpen size={32} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{file ? file.name : 'Click or drag an audio file here'}</p>
          <input type="file" accept="audio/*" onChange={handleFileChange} hidden />
        </label>

        <div className="w-full">
          <select
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a genre</option>
            {genres.map((genreOption) => (
              <option key={genreOption} value={genreOption}>{genreOption}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!file || !genre || analyzing}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-background transition-opacity duration-300 disabled:opacity-30 disabled:pointer-events-none enabled:hover:opacity-90"
        >
          {analyzing ? 'Analyzing...' : 'Analyze'}
        </button>

        <p className="text-xs text-muted-foreground/60 text-center">Your file is analyzed locally and is never uploaded or stored on any server.</p>
      </motion.div>
    </div>
  )
}

export default Upload
