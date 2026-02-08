import { motion } from 'motion/react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SecurityIcon from '@mui/icons-material/Security'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import authApi from '../../services/apis/auth-api'
import ErrorSnackbar from '../ErrorSnackbar'

interface OTPVerificationProps {
  destination?: string
  label: 'email' | 'phone'
  onSubmit: (otp: string) => void
  // onResend: () => void
  onBack: () => void
}

export default function OTPVerification({
  destination,
  label,
  onSubmit,
  onBack,
}: OTPVerificationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const OTP_LENGTH = 6

  const otpArray = Array.from({ length: OTP_LENGTH }, (_, index) => otp[index] ?? '')

  const setOtpAtIndex = (index: number, value: string) => {
    const next = otpArray.slice()
    next[index] = value
    setOtp(next.join(''))
  }

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (!cleaned) {
      setOtpAtIndex(index, '')
      return
    }

    const digits = cleaned.slice(0, OTP_LENGTH)
    const next = otpArray.slice()
    let cursor = index
    for (const digit of digits) {
      if (cursor >= OTP_LENGTH) break
      next[cursor] = digit
      cursor += 1
    }
    setOtp(next.join(''))

    const nextInput = document.getElementById(`otp-${Math.min(cursor, OTP_LENGTH - 1)}`)
    if (nextInput instanceof HTMLInputElement) {
      nextInput.focus()
      nextInput.select()
    }
  }

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === 'Backspace') {
      if (otpArray[index]) {
        setOtpAtIndex(index, '')
      } else if (index > 0) {
        const prev = document.getElementById(`otp-${index - 1}`)
        if (prev instanceof HTMLInputElement) {
          prev.focus()
          prev.select()
        }
      }
    }
  }

  const [errorMessage, setErrorMessage] = useState('')
  const [isErrorOpen, setIsErrorOpen] = useState(false)

  const mutationSMSValidation = useMutation({
    mutationFn: authApi.validateAccessCode,
    onError: (error) => {
      console.error('Error sending access code:', error)
      setErrorMessage(error.message)
      setIsErrorOpen(true)
      setIsLoading(false)
    },
  })

  const mutationEmailValidation = useMutation({
    mutationFn: authApi.validateEmailCode,
    onError: (error) => {
      console.error('Error sending access code:', error)
      setErrorMessage(error.message)
      setIsErrorOpen(true)
      setIsLoading(false)
    },
  })

  const submitOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length < 6) return
    setIsLoading(true)
    if (label === 'phone') {
      await mutationSMSValidation.mutateAsync({ phoneNumber: destination ?? '', otp })
    } else {
      await mutationEmailValidation.mutateAsync({ email: destination ?? '', otp })
    }
    setIsLoading(false)
    onSubmit(otp)
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
          className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:cursor-pointer"
        >
          <ArrowBackIcon className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <SecurityIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Verification Code
            </h1>
            <p className="text-sm text-muted-foreground">
              Sent to {label} <span className="font-medium text-foreground">{destination}</span>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submitOTP} className="flex flex-col gap-5">
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            {otpArray.map((digit, index) => (
              <TextField
                key={`otp-${index}`}
                id={`otp-${index}`}
                value={digit}
                onChange={(event) => handleOtpChange(index, event.target.value)}
                onKeyDown={(event) => handleOtpKeyDown(index, event)}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  maxLength: 1,
                  className: 'text-center text-lg',
                }}
                className="w-12"
                size="small"
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={otp.length < 6 || isLoading}
          className="h-12 w-full text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-5 w-5 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground"
            />
          ) : (
            'Verify'
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {"Didn't receive a code?"}{' '}
          <button
            type="button"
            // onClick={onResend}
            className="font-medium text-accent hover:underline"
          >
            Resend
          </button>
        </p>
      </form>
      <ErrorSnackbar
        isErrorOpen={isErrorOpen}
        setIsErrorOpen={setIsErrorOpen}
        errorMessage={errorMessage}
      />
    </motion.div>
  )
}
