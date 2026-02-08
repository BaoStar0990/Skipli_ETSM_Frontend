import { motion } from 'motion/react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EmailIcon from '@mui/icons-material/Email'
import PasswordIcon from '@mui/icons-material/Password'

interface EmployeeLoginChooseProps {
  onSelect: (method: 'email' | 'credentials') => void
  onBack: () => void
}

export default function EmployeeLoginChoose({ onSelect, onBack }: EmployeeLoginChooseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col gap-6"
    >
      <div>
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:cursor-pointer"
        >
          <ArrowBackIcon className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Employee Sign In</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose how you want to sign in</p>
      </div>

      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('email')}
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-accent hover:bg-accent/5 hover:cursor-pointer"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <EmailIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-foreground">Email</p>
            <p className="text-sm text-muted-foreground">Receive a one-time code via email</p>
          </div>
          <svg
            className="ml-auto h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('credentials')}
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-accent hover:bg-accent/5 hover:cursor-pointer"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <PasswordIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-foreground">Username & Password</p>
            <p className="text-sm text-muted-foreground">Sign in with your credentials</p>
          </div>
          <svg
            className="ml-auto h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  )
}
