import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderOpen } from 'lucide-react'

const genres = ['Hip-Hop', 'Pop', 'Metal', 'EDM']

function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [genre, setGenre] = useState('')
  const [dragging, setDragging] = useState(false)
  const navigate = useNavigate()

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

  function handleSubmit() {
    if (!file || !genre) return
    // TODO: pass file + genre to analysis, then navigate to report
    navigate('/report')
  }

  return (
    <div>
      <h1>Upload</h1>

      <label
        onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{ border: dragging ? '2px solid white' : '2px dashed gray', padding: '40px', textAlign: 'center', cursor: 'pointer', display: 'block' }}
      >
        <FolderOpen size={48} />
        <p>{file ? file.name : 'Click or drag an audio file here'}</p>
        <input type="file" accept="audio/*" onChange={handleFileChange} hidden />
      </label>

      <div>
        <label>Genre</label>
        <select value={genre} onChange={(event) => setGenre(event.target.value)}>
          <option value="">Select a genre</option>
          {genres.map((genreOption) => (
            <option key={genreOption} value={genreOption}>{genreOption}</option>
          ))}
        </select>
      </div>

      <button onClick={handleSubmit} disabled={!file || !genre}>
        Analyze
      </button>
    </div>
  )
}

export default Upload
