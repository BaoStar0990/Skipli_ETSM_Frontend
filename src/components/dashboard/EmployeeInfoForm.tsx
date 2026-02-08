import Button from '@mui/material/Button'
import { motion } from 'motion/react'
import CloseIcon from '@mui/icons-material/Close'
import Input from '@mui/material/Input'
import { useState } from 'react'
import type { UserDTO } from '../../services/dto/user.dto'

interface EmployeeFormProps {
  employee: UserDTO | null
  onSubmit: (data: Omit<UserDTO, 'id'>) => void
  onClose: () => void
}

export default function EmployeeInfoForm({ employee, onSubmit, onClose }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    phoneNumber: employee?.phoneNumber || '',
    username: employee?.username || '',
    password: employee?.password || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    // if (!formData.username.trim()) newErrors.username = 'Username is required'
    // if (!formData.password.trim()) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-foreground">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`ms-1 mt-2 ${errors.name ? 'border-destructive' : ''}`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`ms-1 mt-2 ${errors.email ? 'border-destructive' : ''}`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
                Phone number *
              </label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`ms-1 mt-2 ${errors.phoneNumber ? 'border-destructive' : ''}`}
                placeholder="+1 234 567 8901"
              />
              {errors.phoneNumber && (
                <p className="text-xs text-destructive mt-1">{errors.phoneNumber}</p>
              )}
            </motion.div>

            {employee && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label htmlFor="username" className="text-sm font-medium text-foreground">
                    Username *
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`ms-1 mt-2 ${errors.username ? 'border-destructive' : ''}`}
                    placeholder="johndoe"
                  />
                  {errors.username && (
                    <p className="text-xs text-destructive mt-1">{errors.username}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password *
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`ms-1 mt-2 ${errors.password ? 'border-destructive' : ''}`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive mt-1">{errors.password}</p>
                  )}
                </motion.div>
              </>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="flex gap-4 pt-4 border-t border-border"
          >
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {employee ? 'Update Employee' : 'Add Employee'}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  )
}
