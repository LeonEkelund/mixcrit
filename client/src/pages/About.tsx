import { motion, type Variants } from 'motion/react'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 12 },
  show: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

function About() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center">
        <motion.h1 variants={item} className="font-redaction-50 italic text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-tight">
          About
        </motion.h1>
        <motion.p variants={item} className="mt-4 max-w-md text-base text-foreground/60 leading-relaxed">
          MixCrit was built by a solo developer with a simple goal — to create a mix analysis tool that's actually useful in the real world. No paywalls, no accounts, no uploading your music to someone else's server.
        </motion.p>
        <motion.p variants={item} className="mt-4 max-w-md text-base text-foreground/60 leading-relaxed">
          Everything runs locally in your browser. Upload your track, get instant feedback on your EQ balance, dynamics, stereo image, and loudness — then use that feedback to make better mixes.
        </motion.p>
        <motion.p variants={item} className="mt-4 max-w-md text-base text-foreground/60 leading-relaxed">
          MixCrit is a work in progress and always improving. If you have feedback or ideas, feel free to <a href="/contact" className="text-primary hover:underline underline-offset-4">get in touch</a>.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default About
