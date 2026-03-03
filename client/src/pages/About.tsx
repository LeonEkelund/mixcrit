function About() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-redaction-50 italic text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-tight">
        About
      </h1>
      <p className="mt-4 max-w-md text-base text-foreground/60 leading-relaxed">
        MixCrit was built by a solo developer with a simple goal — to create a mix analysis tool that's actually useful in the real world. No paywalls, no accounts, no uploading your music to someone else's server.
      </p>
      <p className="mt-4 max-w-md text-base text-foreground/60 leading-relaxed">
        Everything runs locally in your browser. Upload your track, get instant feedback on your EQ balance, dynamics, stereo image, and loudness — then use that feedback to make better mixes.
      </p>
      <p className="mt-4 max-w-md text-base text-foreground/60 leading-relaxed">
        MixCrit is a work in progress and always improving. If you have feedback or ideas, feel free to <a href="/contact" className="text-primary hover:underline underline-offset-4">get in touch</a>.
      </p>
    </div>
  )
}

export default About
