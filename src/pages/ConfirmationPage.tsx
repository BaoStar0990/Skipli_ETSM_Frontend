import { motion } from 'motion/react'
import ConfirmationForm from '../components/confirmation/ConfirmationForm'

export default function ConfirmationPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/5" />
        <div className="absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-accent/3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-foreground/5">
          <ConfirmationForm />
        </div>
      </motion.div>
    </main>
  )
}
