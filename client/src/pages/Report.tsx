import { useAnalysis } from '@/lib/AnalysisContext'
import { genreTargets } from '@/lib/audio/genreTargets'
import { Link } from 'react-router-dom'

function compareToTarget(value: number, target: { min: number; max: number }): string {
  if (value < target.min) return '(too low)'
  if (value > target.max) return '(too high)'
  return '(in range)'
}

function Report() {
  const { result, genre, fileName } = useAnalysis()

  if (!result) {
    return (
      <div>
        <p>No analysis data. <Link to="/upload">Upload a track first.</Link></p>
      </div>
    )
  }

  const targets = genreTargets[genre]

  return (
    <div>
      <h1>Report: {fileName}</h1>
      <p>Genre: {genre}</p>

      <h2>Loudness (LUFS)</h2>
      <table>
        <tbody>
          <tr>
            <td>Integrated</td>
            <td>{result.lufs.integrated.toFixed(1)} LUFS</td>
            <td>{targets && compareToTarget(result.lufs.integrated, targets.lufs)}</td>
          </tr>
          <tr>
            <td>Short-term max</td>
            <td>{result.lufs.shortTerm.toFixed(1)} LUFS</td>
          </tr>
          <tr>
            <td>True Peak</td>
            <td>{result.lufs.truePeak.toFixed(1)} dBTP</td>
            <td>{result.lufs.truePeak > -1 ? '(risk of clipping)' : '(ok)'}</td>
          </tr>
        </tbody>
      </table>

      <h2>Frequency Spectrum</h2>
      <table>
        <tbody>
          {Object.entries(result.spectrum).map(([band, value]) => (
            <tr key={band}>
              <td>{band}</td>
              <td>{value.toFixed(1)} dB</td>
              <td>{targets && compareToTarget(value, targets.spectrum[band as keyof typeof targets.spectrum])}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Dynamics</h2>
      <table>
        <tbody>
          <tr>
            <td>Dynamic Range</td>
            <td>{result.dynamics.dynamicRange.toFixed(1)} dB</td>
          </tr>
          <tr>
            <td>Crest Factor</td>
            <td>{result.dynamics.crestFactor.toFixed(1)} dB</td>
            <td>{targets && compareToTarget(result.dynamics.crestFactor, targets.crestFactor)}</td>
          </tr>
          <tr>
            <td>Clipping</td>
            <td>{result.dynamics.clipping ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
      </table>

      <h2>Stereo</h2>
      <table>
        <tbody>
          <tr>
            <td>Stereo Correlation</td>
            <td>{result.stereo.correlation.toFixed(2)}</td>
            <td>{result.stereo.correlation < 0 ? '(out of phase!)' : result.stereo.correlation < 0.5 ? '(very wide)' : '(ok)'}</td>
          </tr>
          <tr>
            <td>Mono Compatible</td>
            <td>{result.stereo.monoCompatible ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>Mid Energy</td>
            <td>{result.stereo.midEnergy.toFixed(1)} dB</td>
          </tr>
          <tr>
            <td>Side Energy</td>
            <td>{result.stereo.sideEnergy.toFixed(1)} dB</td>
          </tr>
          <tr>
            <td>Stereo Width</td>
            <td>{(result.stereo.stereoWidth * 100).toFixed(0)}%</td>
          </tr>
        </tbody>
      </table>

      <Link to="/upload">Analyze another track</Link>
    </div>
  )
}

export default Report
