import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, type Variants } from 'motion/react'
import { useAuth } from '@/lib/AuthContext'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 12 },
  show: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await login(data.token)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        className="w-full max-w-md flex flex-col gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Log in</h1>
          <p className="text-sm text-muted-foreground">Welcome back.</p>
        </motion.div>

        <motion.form variants={item} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-base md:text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-base md:text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-background transition-opacity disabled:opacity-30 disabled:pointer-events-none hover:opacity-90"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </motion.form>

        <motion.p variants={item} className="text-sm text-muted-foreground text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-foreground hover:text-primary transition-colors">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Login
