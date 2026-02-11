import { AnimatePresence, motion } from 'motion/react'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { useState } from 'react'
import ScheduleForm from './ScheduleForm'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import userApi from '../../services/apis/user-api'
import type { UserDTO } from '../../services/dto/user.dto'
import type { WorkScheduleDTO } from '../../services/dto/work-schedule.dto'
import type { WorkDayDTO } from '../../services/dto/work-day.dto'
import scheduleApi from '../../services/apis/schedule-api'
import PersonIcon from '@mui/icons-material/Person'

export default function ScheduleTab() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { data: schedulesData } = useQuery({
    queryKey: ['schedules'],
    queryFn: userApi.getWorkSchedules,
  })

  const queryClient = useQueryClient()
  const mutationCreateSchedule = useMutation({
    mutationFn: ({ userId, scheduleData }: { userId: string; scheduleData: WorkScheduleDTO }) =>
      userApi.createWorkSchedule(userId, scheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
    },
  })

  const mutationDeleteSchedule = useMutation({
    mutationFn: (scheduleId: string) => scheduleApi.deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
    },
  })

  const { data: employeesData } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getEmployees,
  })

  const handleCreateSchedule = (data: {
    effectiveFrom: string
    effectiveTo: string
    workDays: WorkDayDTO[]
    employeeId: string
  }) => {
    const { employeeId, ...scheduleData } = data
    mutationCreateSchedule.mutateAsync({ userId: employeeId, scheduleData })
    setIsFormOpen(false)
  }

  const handleDeleteSchedule = async (id: string) => {
    await mutationDeleteSchedule.mutateAsync(id)
  }

  const parseDateInput = (value: string) => {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const formatDateLabel = (value: string) => {
    return parseDateInput(value).toLocaleDateString()
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    return (
      Math.ceil(
        (parseDateInput(endDate).getTime() - parseDateInput(startDate).getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1
    )
  }

  const calculateWorkHours = (startTime: string, endTime: string) => {
    return Math.ceil(
      (new Date(`2024-01-01T${endTime}`).getTime() -
        new Date(`2024-01-01T${startTime}`).getTime()) /
        (1000 * 60 * 60),
    )
  }

  const calculateTotalHours = (workDays: WorkDayDTO[]) => {
    return workDays.reduce((total, workDay) => {
      const dayHours = workDay.workHours.reduce(
        (sum, block) => sum + calculateWorkHours(block.startTime, block.endTime),
        0,
      )
      return total + dayHours
    }, 0)
  }

  const formatHours = (hours: number) => {
    const rounded = Math.round(hours * 10) / 10
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
  }

  const getWorkDayPreview = (workDays: WorkDayDTO[]) => {
    return workDays
      .map((day) => {
        // const blocks = day.workHours.length
        // const blockLabel = blocks === 1 ? 'block' : 'blocks'
        return `${formatDateLabel(day.date)}`
      })
      .join(', ')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Employee Schedule</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total schedules: {schedulesData?.length || 0}
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <AddIcon className="w-4 h-4" />
            Create Schedule
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <ScheduleForm
            employees={(employeesData as UserDTO[]) || []}
            onSubmit={handleCreateSchedule}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <AnimatePresence>
          {schedulesData && schedulesData.length > 0 ? (
            schedulesData.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Schedule #{schedule.id!.toUpperCase()}
                      </h3>
                    </div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => handleDeleteSchedule(schedule.id!)}
                        variant="outlined"
                        size="small"
                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <DeleteIcon className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex gap-3">
                      <CalendarMonthIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Date Range
                        </p>
                        <p className="text-sm text-foreground font-medium mt-1">
                          {formatDateLabel(schedule.effectiveFrom)} -{' '}
                          {formatDateLabel(schedule.effectiveTo)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {calculateDuration(schedule.effectiveFrom, schedule.effectiveTo)} days
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <CalendarMonthIcon className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Work Days
                        </p>
                        <p className="text-sm text-foreground font-medium mt-1">
                          {schedule.workDays.length} day(s)
                        </p>
                        {schedule.workDays.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {getWorkDayPreview(schedule.workDays)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <QueryBuilderIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Work Hours
                        </p>
                        <p className="text-sm text-foreground font-medium mt-1">
                          {formatHours(calculateTotalHours(schedule.workDays))} total hours
                        </p>
                        {schedule.workDays.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatHours(
                              calculateTotalHours(schedule.workDays) / schedule.workDays.length,
                            )}{' '}
                            hours/day avg
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <PersonIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Assigned to
                        </p>
                        <p className="text-sm text-foreground font-medium mt-1">
                          {schedule.employee ? schedule.employee.name : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-card border border-border rounded-lg"
            >
              <CalendarMonthIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">No schedules yet</p>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <AddIcon className="w-4 h-4" />
                Create First Schedule
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
