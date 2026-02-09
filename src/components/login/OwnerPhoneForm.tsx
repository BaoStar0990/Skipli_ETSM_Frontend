// import { useState } from "react"
import { motion } from 'motion/react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import Input from '@mui/material/Input'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import authApi from '../../services/apis/auth-api'
import ErrorSnackbar from '../ErrorSnackbar'

interface OwnerPhoneFormProps {
  onSubmit: (phone: string) => void
  onBack: () => void
}

const countryOptions = [
  { code: '+1', label: 'US' },
  { code: '+44', label: 'UK' },
  { code: '+61', label: 'Australia' },
  { code: '+65', label: 'Singapore' },
  { code: '+84', label: 'Vietnam' },
  { code: '+91', label: 'India' },
  { code: '+81', label: 'Japan' },
]

export default function OwnerPhoneForm({ onSubmit, onBack }: OwnerPhoneFormProps) {
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isErrorOpen, setIsErrorOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: authApi.createNewAccessCode,
    onError: (error) => {
      console.error('Error sending access code:', error)
      setErrorMessage(error.message)
      setIsErrorOpen(true)
    },
  })

  const submitPhoneNumber = async (e: React.FormEvent) => {
    e.preventDefault()
    const phoneTrimmed = phone.trim()
    if (!phoneTrimmed) return
    setIsLoading(true)
    try {
      const localPhone = phoneTrimmed.replace(/^0+/, '')
      if (!localPhone) return
      const phoneNumber = phoneTrimmed.startsWith('+')
        ? phoneTrimmed
        : `${countryCode}${localPhone}`
      await mutation.mutateAsync({ phoneNumber })
      onSubmit(phoneNumber)
    } finally {
      setIsLoading(false)
    }
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
          className="hover:cursor-pointer mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowBackIcon className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PhoneAndroidIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Owner Sign In</h1>
            <p className="text-sm text-muted-foreground">
              {"We'll send a verification code to your phone"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submitPhoneNumber} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-foreground">
            Phone Number
          </label>
          <div className="grid grid-cols-2 gap-2">
            <FormControl size="small">
              <InputLabel id="country-code-label">Country</InputLabel>
              <Select
                labelId="country-code-label"
                id="country-code"
                value={countryCode}
                label="Country"
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {countryOptions.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.label} ({option.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Input
              id="phone"
              type="tel"
              placeholder="555 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 text-base"
              autoFocus
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={!phone.trim() || isLoading}
          className="h-12 w-full text-base font-medium bg-accent text-accent-foreground hover:bg-sky-500/90"
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

      <ErrorSnackbar
        isErrorOpen={isErrorOpen}
        setIsErrorOpen={setIsErrorOpen}
        errorMessage={errorMessage}
      />
    </motion.div>
  )
}
