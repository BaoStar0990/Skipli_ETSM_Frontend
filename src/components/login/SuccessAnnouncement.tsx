import { useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import GppGoodIcon from '@mui/icons-material/GppGood'

export default function SuccessAnnouncement() {
  const navigate = useNavigate()

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate('/dashboard')
    }, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [navigate])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center gap-4 py-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
      >
        <GppGoodIcon className="h-16 w-16 text-accent" />
      </motion.div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">You're in!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Successfully authenticated. Redirecting...
        </p>
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.4, duration: 2, ease: 'linear' }}
        className="h-1 max-w-[200px] rounded-full bg-accent"
      />
    </motion.div>
  )
}
