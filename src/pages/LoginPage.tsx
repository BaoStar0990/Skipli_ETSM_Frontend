import RoleChoose from '../components/login/RoleChoose'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { LoginStep } from '../constants/LoginStep.enum'
import OwnerPhoneForm from '../components/login/OwnerPhoneForm'
import OTPVerification from '../components/login/OTPVerification'
import SuccessAnnouncement from '../components/login/SuccessAnnouncement'
import EmployeeLoginChoose from '../components/login/EmployeeLoginChoose'
import EmployeeEmailForm from '../components/login/EmployeeEmailForm'
import EmployeeCredentialForm from '../components/login/EmployeeCredentialForm'

const LoginPage = () => {
  const [step, setStep] = useState<LoginStep>('ROLE_CHOOSE')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

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
          <AnimatePresence mode="wait">
            {step === 'ROLE_CHOOSE' && (
              <RoleChoose
                key="ROLE_CHOOSE"
                onSelect={(role) => {
                  localStorage.setItem('userRole', role)
                  if (role === 'OWNER') setStep('OWNER_PHONE_LOGIN')
                  else setStep('EMPLOYEE_METHOD')
                }}
              />
            )}

            {step === 'OWNER_PHONE_LOGIN' && (
              <OwnerPhoneForm
                key="OWNER_PHONE_LOGIN"
                onSubmit={(p) => {
                  setPhone(p)
                  setStep('OWNER_OTP_VERIFY')
                }}
                onBack={() => setStep('ROLE_CHOOSE')}
              />
            )}

            {step === 'OWNER_OTP_VERIFY' && (
              <OTPVerification
                key="OWNER_OTP_VERIFY"
                destination={phone}
                label="phone"
                onSubmit={() => setStep('SUCCESS')}
                onBack={() => setStep('OWNER_PHONE_LOGIN')}
                // onResend={() => {}}
              />
            )}

            {step === 'EMPLOYEE_METHOD' && (
              <EmployeeLoginChoose
                key="EMPLOYEE_METHOD"
                onSelect={(method) => {
                  if (method === 'email') setStep('EMPLOYEE_EMAIL_LOGIN')
                  else setStep('EMPLOYEE_CREDENTIALS')
                }}
                onBack={() => setStep('ROLE_CHOOSE')}
              />
            )}

            {step === 'EMPLOYEE_EMAIL_LOGIN' && (
              <EmployeeEmailForm
                key="EMPLOYEE_EMAIL_LOGIN"
                onSubmit={(email) => {
                  setEmail(email)
                  setStep('EMPLOYEE_EMAIL_OTP')
                }}
                onBack={() => setStep('EMPLOYEE_METHOD')}
              />
            )}

            {step === 'EMPLOYEE_EMAIL_OTP' && (
              <OTPVerification
                key="EMPLOYEE_EMAIL_OTP"
                destination={email}
                label="email"
                onSubmit={() => setStep('SUCCESS')}
                onBack={() => setStep('EMPLOYEE_EMAIL_LOGIN')}
                // onResend={() => {}}
              />
            )}

            {step === 'EMPLOYEE_CREDENTIALS' && (
              <EmployeeCredentialForm
                key="EMPLOYEE_CREDENTIALS"
                onSubmit={() => setStep('SUCCESS')}
                onBack={() => setStep('EMPLOYEE_METHOD')}
              />
            )}

            {step === 'SUCCESS' && <SuccessAnnouncement key="SUCCESS" />}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  )
}

export default LoginPage
