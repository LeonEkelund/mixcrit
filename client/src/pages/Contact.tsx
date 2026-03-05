import { motion, type Variants } from 'motion/react'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 12 },
  show: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

function Contact() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center">
        <motion.h1 variants={item} className="font-redaction-50 italic text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-tight">
          Get in touch
        </motion.h1>
        <motion.p variants={item} className="mt-4 max-w-sm text-base text-foreground/60">
          Got questions, feedback, or running into issues? Feel free to reach out directly.
        </motion.p>
        <motion.a
          variants={item}
          href="mailto:leongudmundssonekelund@gmail.com"
          className="mt-6 text-primary hover:underline underline-offset-4 transition-colors text-sm"
        >
          leongudmundssonekelund@gmail.com
        </motion.a>
      </motion.div>
    </div>
  )
}

export default Contact
