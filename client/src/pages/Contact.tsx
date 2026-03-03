function Contact() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-redaction-50 italic text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-tight">
        Get in touch
      </h1>
      <p className="mt-4 max-w-sm text-base text-foreground/60">
        Got questions, feedback, or running into issues? Feel free to reach out directly.
      </p>
      <a
        href="mailto:leongudmundssonekelund@gmail.com"
        className="mt-6 text-primary hover:underline underline-offset-4 transition-colors text-sm"
      >
        leongudmundssonekelund@gmail.com
      </a>
    </div>
  )
}

export default Contact
