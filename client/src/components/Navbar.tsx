import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/mixcritsvgfinal.svg'

const navLinks = [
  { label: 'Analyze', to: '/upload' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* Desktop navbar */}
      <header className="fixed top-6 left-0 right-0 z-50 hidden md:grid grid-cols-[1fr_auto_1fr] items-center px-16">
        {/* Logo — left */}
        <Link to="/" className="flex items-center gap-2 justify-self-start transition-opacity opacity-80 hover:opacity-100">
          <img src={logo} alt="MixCrit" className="h-8 w-auto translate-y-px" />
          <span className="font-redaction-50 italic text-4xl leading-none text-foreground tracking-tighter translate-y-[4px]">MIXCRIT</span>
        </Link>

        {/* Nav links — center pill */}
        <nav className="rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-2 py-1.5">
          <div className="flex items-center gap-1">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`rounded-full px-5 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${pathname === to
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Auth buttons — right */}
        <div className="flex items-center gap-2 justify-self-end">
          <Link
            to="/login"
            className="rounded-full border border-border bg-muted/60 px-5 py-2 text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium uppercase tracking-wide text-background transition-colors hover:bg-primary/80"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:hidden">
        <Link to="/" className="flex items-center gap-2 opacity-80">
          <img src={logo} alt="MixCrit" className="h-6 w-auto" />
          <span className="font-redaction-50 italic text-2xl leading-none text-foreground tracking-tighter translate-y-[3px]">MIXCRIT</span>
        </Link>

        {/* Hamburger / X button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </header>

      {/* Fullscreen mobile menu */}
      <div className={`fixed inset-0 z-40 bg-background/40 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <nav className="flex flex-col items-center gap-6">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-3xl font-medium uppercase tracking-wide transition-colors ${pathname === to
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="h-px w-16 bg-border" />

        <div className="flex flex-col items-center gap-3">
          <Link
            to="/login"
            className="rounded-full border border-border bg-muted/60 px-8 py-3 text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-primary px-8 py-3 text-sm font-medium uppercase tracking-wide text-background transition-colors hover:bg-primary/80"
          >
            Register
          </Link>
        </div>
      </div>
    </>
  )
}
