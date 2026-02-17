export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-8">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <span className="text-xs text-muted-foreground/50">
          &copy; {new Date().getFullYear()} MixCrit
        </span>
        <a href="#" className="text-xs text-muted-foreground/50 transition-colors hover:text-muted-foreground">
          Analytics
        </a>
      </div>
    </footer>
  )
}
