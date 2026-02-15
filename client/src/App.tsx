
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnalysisProvider } from './lib/AnalysisContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Upload from './pages/Upload'
import Report from './pages/Report'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  return (
    <BrowserRouter>
      <AnalysisProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/report" element={<Report />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnalysisProvider>
    </BrowserRouter>
  )
}

export default App