import Button from '@mui/material/Button'
import Input from '@mui/material/Input'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { motion } from 'motion/react'
import { useState } from 'react'
import KeyIcon from '@mui/icons-material/Key'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useMutation } from '@tanstack/react-query'
import authApi from '../../services/apis/auth-api'

interface EmployeeCredentialFormProps {
  onSubmit: (username: string, password: string) => void
  onBack: () => void
}

export default function EmployeeCredentialForm({ onSubmit, onBack }: EmployeeCredentialFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const mutation = useMutation({
    mutationFn: (data: { username: string; password: string }) => authApi.loginUsername(data),
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return
    setIsLoading(true)
    await mutation.mutateAsync({ username, password })
    setIsLoading(false)
    onSubmit(username, password)
  }

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
            <KeyIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Credential Sign In
            </h1>
            <p className="text-sm text-muted-foreground">Enter your username and password</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-foreground">
            Username
          </label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-12 text-base"
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-foreground">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <VisibilityOffIcon className="h-5 w-5" />
              ) : (
                <VisibilityIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="button" className="text-sm font-medium text-accent hover:underline">
            Forgot password?
          </button>
        </div>
        <Button
          type="submit"
          disabled={!username.trim() || !password.trim() || isLoading}
          className="h-12 w-full text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-5 w-5 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground"
            />
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </motion.div>
  )
}
