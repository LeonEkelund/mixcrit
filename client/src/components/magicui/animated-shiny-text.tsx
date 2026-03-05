import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedShinyTextProps {
  children: ReactNode
  className?: string
  shimmerWidth?: number
}

export function AnimatedShinyText({ children, className, shimmerWidth = 100 }: AnimatedShinyTextProps) {
  return (
    <span className={cn('relative inline-flex items-center', className)}>
      {/* Base text — always visible */}
      <span className="text-foreground/70">{children}</span>
      {/* Shine layer */}
      <span
        aria-hidden
        style={{ '--shiny-width': `${shimmerWidth}px` } as CSSProperties}
        className="pointer-events-none absolute inset-0 animate-shiny-text bg-clip-text text-transparent bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] bg-gradient-to-r from-transparent via-white via-50% to-transparent"
      >
        {children}
      </span>
    </span>
  )
}
