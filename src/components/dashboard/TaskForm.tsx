import Button from '@mui/material/Button'
import { motion } from 'motion/react'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { UserDTO } from '../../services/dto/user.dto'

interface TaskFormProps {
  employees: Array<UserDTO>
  onSubmit: (data: { name: string; description: string; employeeId: string | null }) => void
  onClose: () => void
}

export default function TaskForm({ employees, onSubmit, onClose }: TaskFormProps) {
  const [formData, setFormData] = useState<{
    name: string
    description: string
    employeeId: string | null
  }>({
    name: '',
    description: '',
    employeeId: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.employeeId) {
      newErrors.employeeId = 'Please assign an employee'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
      setFormData({ name: '', description: '', employeeId: '' })
    }
  }

  const selectedEmployee = employees.find((e) => e.id === formData.employeeId)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
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
        className="bg-white border border-border rounded-lg shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-foreground">Create New Task</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-foreground mb-2">Task Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter task name"
                className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.name ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description"
                rows={4}
                className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                  errors.description ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-foreground mb-2">Assign To *</label>
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full px-3 py-2 border rounded-md bg-background text-foreground text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.employeeId ? 'border-destructive' : 'border-border'
                  }`}
                >
                  <span className={selectedEmployee ? 'text-foreground' : 'text-muted-foreground'}>
                    {selectedEmployee ? selectedEmployee.name : 'Select an employee'}
                  </span>
                  <ExpandMoreIcon
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </motion.button>

                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-1 border border-border bg-white rounded-md shadow-lg z-10"
                  >
                    <div className="max-h-48 overflow-y-auto">
                      {employees.map((employee, index) => (
                        <motion.button
                          key={employee.id}
                          type="button"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              employeeId: employee.id,
                            })
                            setIsDropdownOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-secondary text-foreground transition-colors"
                        >
                          {employee.name}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
              {errors.employeeId && (
                <p className="text-sm text-destructive mt-1">{errors.employeeId}</p>
              )}
            </motion.div>
          </motion.div>

          <div className="flex gap-3 pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Create Task
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                type="button"
                onClick={onClose}
                variant="outlined"
                className="w-full bg-transparent"
              >
                Cancel
              </Button>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
