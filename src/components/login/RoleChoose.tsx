import { motion } from 'motion/react'

import BusinessIcon from '@mui/icons-material/Business'
import GroupsIcon from '@mui/icons-material/Groups'

interface RoleChooseProps {
  onSelect: (role: 'OWNER' | 'EMPLOYEE') => void
}

export default function RoleChoose({ onSelect }: RoleChooseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col gap-6"
    >
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome to ETSM</h1>
        <p className="mt-2 text-sm text-muted-foreground">Choose your account type to continue</p>
      </div>

      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('OWNER')}
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-accent hover:cursor-pointer hover:bg-accent/5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BusinessIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-foreground">Owner</p>
            <p className="text-sm text-muted-foreground">Sign in with your phone number</p>
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
          onClick={() => onSelect('EMPLOYEE')}
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-accent hover:cursor-pointer hover:bg-accent/5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <GroupsIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-foreground">Employee</p>
            <p className="text-sm text-muted-foreground">Sign in with email or credentials</p>
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
