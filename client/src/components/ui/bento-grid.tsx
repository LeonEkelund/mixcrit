import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { cn } from "@/lib/utils"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  description: string
  noHover?: boolean
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  noHover,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      "bg-background transform-gpu [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] [border:1px_solid_rgba(255,255,255,.1)]",
      !noHover && "group",
      className
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="p-4">
      <div className={cn("pointer-events-none z-10 flex transform-gpu flex-col gap-1", !noHover && "transition-all duration-300 lg:group-hover:-translate-y-10")}>
        <Icon className={cn("h-12 w-12 origin-left transform-gpu text-neutral-700", !noHover && "transition-all duration-300 ease-in-out group-hover:scale-75")} />
        <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
          {name}
        </h3>
        <p className="max-w-lg text-neutral-400">{description}</p>
      </div>
    </div>

    {!noHover && (
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    )}
  </div>
)

export { BentoCard, BentoGrid }
