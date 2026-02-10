import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CloseIcon from '@mui/icons-material/Close'
import type { UserDTO } from '../../services/dto/user.dto'

interface NewChatDialogProps {
  employees: UserDTO[]
  onCreateChat: (employee: UserDTO) => void
  onClose: () => void
  existingChatIds?: (string | null)[]
}

export default function NewChatDialog({
  employees,
  onCreateChat,
  onClose,
  existingChatIds = [],
}: NewChatDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<UserDTO | null>(null)

  const availableEmployees = employees.filter((emp) => !existingChatIds.includes(emp.id))

  const handleSelectEmployee = (employee: UserDTO) => {
    setSelectedEmployee(employee)
    setIsOpen(false)
  }

  const handleCreateChat = () => {
    if (selectedEmployee) {
      onCreateChat(selectedEmployee)
      setSelectedEmployee(null)
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
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-border rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Start New Chat</h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-md transition-colors">
            <CloseIcon className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Employee
            </label>

            <div className="relative">
              <motion.button
                whileHover={{ backgroundColor: 'var(--secondary)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-secondary border border-border rounded-lg text-foreground text-left transition-colors"
              >
                <span className={selectedEmployee ? 'text-foreground' : 'text-muted-foreground'}>
                  {selectedEmployee ? selectedEmployee.name : 'Choose an employee...'}
                </span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ExpandMoreIcon className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-10 overflow-hidden"
                  >
                    {availableEmployees.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto">
                        {availableEmployees.map((employee, index) => (
                          <motion.button
                            key={employee.id}
                            onClick={() => handleSelectEmployee(employee)}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15, delay: index * 0.02 }}
                            whileHover={{ backgroundColor: 'var(--secondary)' }}
                            className="w-full px-4 py-3 text-left text-foreground hover:bg-secondary transition-colors border-b border-border last:border-b-0 flex items-center gap-3"
                          >
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                              {employee.name && employee.name.substring(0, 2).toUpperCase()}
                            </div>
                            <span>{employee.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                        No available employees
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outlined" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <motion.div
              whileHover={selectedEmployee ? { scale: 1.02 } : {}}
              whileTap={selectedEmployee ? { scale: 0.98 } : {}}
              className="flex-1"
            >
              <Button
                onClick={handleCreateChat}
                disabled={!selectedEmployee}
                className={`w-full ${
                  selectedEmployee
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Start Chat
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
