import { motion } from 'motion/react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import EmailIcon from '@mui/icons-material/Email'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import authApi from '../../services/apis/auth-api'

interface EmployeeEmailFormProps {
  onSubmit: (email: string) => void
  onBack: () => void
}

export default function EmployeeEmailForm({ onSubmit, onBack }: EmployeeEmailFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const mutation = useMutation({
    mutationFn: authApi.loginEmail,
  })

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
          className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowBackIcon className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <EmailIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Email Sign In</h1>
            <p className="text-sm text-muted-foreground">
              {"We'll send a verification code to your email"}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (!email.trim()) return
          setIsLoading(true)
          await mutation.mutateAsync({ email })
          setIsLoading(false)
          onSubmit(email)
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-foreground">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 text-base"
            autoFocus
          />
        </div>
        <Button
          type="submit"
          disabled={!email.trim() || isLoading}
          className="h-12 w-full text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-5 w-5 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground"
            />
          ) : (
            'Send Code'
          )}
        </Button>
      </form>
    </motion.div>
  )
}
