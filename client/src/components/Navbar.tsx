import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import logo from '../assets/mixcritsvgfinal.svg'
import { useAuth } from '@/lib/AuthContext'

const navLinks = [
  { label: 'Analyze', to: '/upload' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, isLoggedIn, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '?'

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
      <header className="fixed top-6 left-0 right-0 z-50 hidden lg:grid grid-cols-[1fr_auto_1fr] items-center px-16">
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
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${pathname === to
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Auth — right */}
        <div className="flex items-center gap-2 justify-self-end">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-background transition-all ring-1 ring-primary/30 hover:ring-primary/60 hover:opacity-80"
              >
                {initials}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-52 rounded-xl border border-white/10 bg-background/90 backdrop-blur-md p-1 shadow-xl">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setDropdownOpen(false) }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-border bg-muted/60 px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-primary/80"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 lg:hidden border-b border-white/10 bg-background/60 backdrop-blur-md">
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
      <AnimatePresence>
      {menuOpen && <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed inset-0 z-40 bg-background/40 backdrop-blur-2xl flex flex-col justify-between px-6 pt-24 pb-10 lg:hidden"
      >
        <nav className="flex flex-col gap-2">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-2xl font-medium py-2 transition-colors ${pathname === to
                ? 'text-primary'
                : 'text-foreground/80 hover:text-foreground'
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          {isLoggedIn ? (
            <>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <button
                onClick={() => { logout(); setMenuOpen(false) }}
                className="w-full rounded-md border border-border bg-muted/60 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full rounded-md border border-border bg-muted/60 px-4 py-3 text-sm font-medium text-center text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-center text-background transition-colors hover:bg-primary/80"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </motion.div>}
      </AnimatePresence>
    </>
  )
}
