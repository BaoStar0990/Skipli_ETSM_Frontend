import Button from '@mui/material/Button'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { UserDTO } from '../../services/dto/user.dto'

interface ScheduleFormProps {
  employees: Array<UserDTO>
  onSubmit: (data: {
    effectiveFrom: string
    effectiveTo: string
    workDays: Array<{
      date: string
      workHours: Array<{
        startTime: string
        endTime: string
      }>
    }>
    employeeId: string
  }) => void
  onClose: () => void
}

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
]

export default function ScheduleForm({ employees, onSubmit, onClose }: ScheduleFormProps) {
  const [step, setStep] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
  ])
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const parseDateInput = (value: string) => {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const formatDateInput = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getDayIdFromDate = (date: Date) => {
    const dayIds = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return dayIds[date.getDay()]
  }

  const buildWorkDays = () => {
    if (!startDate || !endDate) return []

    const rangeStart = parseDateInput(startDate)
    const rangeEnd = parseDateInput(endDate)
    const days: Array<{
      date: string
      workHours: Array<{ startTime: string; endTime: string }>
    }> = []

    for (
      let current = new Date(rangeStart);
      current <= rangeEnd;
      current.setDate(current.getDate() + 1)
    ) {
      const dayId = getDayIdFromDate(current)
      if (selectedDays.includes(dayId)) {
        days.push({
          date: formatDateInput(current),
          workHours: [{ startTime, endTime }],
        })
      }
    }

    return days
  }

  const getAvailableDayIds = () => {
    if (!startDate || !endDate) return DAYS_OF_WEEK.map((day) => day.id)

    const rangeStart = parseDateInput(startDate)
    const rangeEnd = parseDateInput(endDate)
    const available = new Set<string>()

    for (
      let current = new Date(rangeStart);
      current <= rangeEnd;
      current.setDate(current.getDate() + 1)
    ) {
      available.add(getDayIdFromDate(current))
    }

    return DAYS_OF_WEEK.map((day) => day.id).filter((dayId) => available.has(dayId))
  }

  const availableDayIds = getAvailableDayIds()

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!startDate) newErrors.startDate = 'Start date is required'
      if (!endDate) newErrors.endDate = 'End date is required'
      if (startDate && endDate && parseDateInput(startDate) > parseDateInput(endDate)) {
        newErrors.dateRange = 'Start date must be before end date'
      }
    } else if (currentStep === 2) {
      if (selectedDays.length === 0) newErrors.workDays = 'Select at least one work day'
      if (!startTime) newErrors.startTime = 'Start time is required'
      if (!endTime) newErrors.endTime = 'End time is required'
      if (startTime && endTime && startTime >= endTime) {
        newErrors.timeRange = 'Start time must be before end time'
      }
    } else if (currentStep === 3) {
      if (!selectedEmployeeId) newErrors.employeeId = 'Please assign an employee'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handleSubmit = () => {
    if (validateStep(step)) {
      onSubmit({
        effectiveFrom: startDate,
        effectiveTo: endDate,
        workDays: buildWorkDays(),
        employeeId: selectedEmployeeId,
      })
    }
  }

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-border rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-border p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Create Work Schedule</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((stepNum) => (
              <motion.div
                key={stepNum}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  stepNum <= step ? 'bg-sky-500' : 'bg-teal-100'
                }`}
                initial={false}
                animate={{ opacity: 1 }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Step 1: Select Schedule Range
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Choose the start and end dates for this work schedule
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value)
                        if (errors.startDate) setErrors({ ...errors, startDate: '' })
                      }}
                      onBlur={() => {
                        const newAvailableDayIds = getAvailableDayIds()
                        setSelectedDays((prev) =>
                          prev.filter((dayId) => newAvailableDayIds.includes(dayId)),
                        )
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.startDate && (
                      <p className="text-xs text-destructive mt-1 text-red-800">
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value)
                        if (errors.endDate) setErrors({ ...errors, endDate: '' })
                      }}
                      onBlur={() => {
                        const newAvailableDayIds = getAvailableDayIds()
                        setSelectedDays((prev) =>
                          prev.filter((dayId) => newAvailableDayIds.includes(dayId)),
                        )
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.endDate && (
                      <p className="text-xs text-destructive mt-1 text-red-800">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                {errors.dateRange && (
                  <p className="text-sm text-destructive text-red-800">{errors.dateRange}</p>
                )}

                {startDate && endDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-secondary rounded-lg"
                  >
                    <p className="text-sm text-foreground">
                      Schedule duration:{' '}
                      <span className="font-semibold">
                        {Math.ceil(
                          (parseDateInput(endDate).getTime() -
                            parseDateInput(startDate).getTime()) /
                            (1000 * 60 * 60 * 24),
                        ) + 1}{' '}
                        days
                      </span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Step 2: Select Work Days & Hours
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Choose which days employees will work and their hours
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-4 block">
                    Work Days
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {DAYS_OF_WEEK.filter((day) => availableDayIds.includes(day.id)).map((day) => (
                      <motion.button
                        key={day.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleDay(day.id)}
                        className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${
                          !selectedDays.includes(day.id)
                            ? 'border-primary bg-white/10 text-primary'
                            : 'border-border bg-sky-500 text-foreground hover:border-primary/50'
                        }`}
                      >
                        {day.label.slice(0, 3)}
                      </motion.button>
                    ))}
                  </div>
                  {errors.workDays && (
                    <p className="text-xs text-destructive mt-2 text-red-800">{errors.workDays}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value)
                        if (errors.startTime) setErrors({ ...errors, startTime: '' })
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.startTime && (
                      <p className="text-xs text-destructive mt-1">{errors.startTime}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value)
                        if (errors.endTime) setErrors({ ...errors, endTime: '' })
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.endTime && (
                      <p className="text-xs text-destructive mt-1">{errors.endTime}</p>
                    )}
                  </div>
                </div>

                {errors.timeRange && <p className="text-sm text-destructive">{errors.timeRange}</p>}

                {startTime && endTime && startTime < endTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-secondary rounded-lg"
                  >
                    <p className="text-sm text-foreground">
                      Daily work hours:{' '}
                      <span className="font-semibold">
                        {Math.ceil(
                          (new Date(`2024-01-01T${endTime}`).getTime() -
                            new Date(`2024-01-01T${startTime}`).getTime()) /
                            (1000 * 60 * 60),
                        )}{' '}
                        hours
                      </span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Step 3: Assign Employee
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Select which employee will follow this schedule
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Assign To
                  </label>
                  <div className="relative">
                    <motion.button
                      type="button"
                      onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                        errors.employeeId ? 'border-destructive' : 'border-border'
                      }`}
                    >
                      <span
                        className={selectedEmployee ? 'text-foreground' : 'text-muted-foreground'}
                      >
                        {selectedEmployee ? selectedEmployee.name : 'Select an employee'}
                      </span>
                      <ExpandMoreIcon
                        className={`w-4 h-4 transition-transform ${
                          isEmployeeDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </motion.button>

                    {isEmployeeDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-10"
                      >
                        <div className="p-2 max-h-48 overflow-y-auto">
                          {employees.length > 0 ? (
                            employees.map((employee, index) => (
                              <motion.button
                                key={employee.id ?? index}
                                type="button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.04 }}
                                onClick={() => {
                                  setSelectedEmployeeId(employee.id ?? '')
                                  setIsEmployeeDropdownOpen(false)
                                  if (errors.employeeId) setErrors({ ...errors, employeeId: '' })
                                }}
                                className="w-full text-left px-3 py-2 rounded hover:bg-secondary transition-colors"
                              >
                                {employee.name ?? 'Unnamed employee'}
                              </motion.button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                              No employees available
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                  {errors.employeeId && (
                    <p className="text-xs text-destructive mt-2">{errors.employeeId}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border">
            {step > 1 && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handlePreviousStep}
                  variant="outlined"
                  className="gap-2 bg-transparent"
                >
                  Previous
                </Button>
              </motion.div>
            )}
            <div className="flex-1" />
            {step < 3 && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleNextStep}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  Next
                </Button>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  Create Schedule
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
