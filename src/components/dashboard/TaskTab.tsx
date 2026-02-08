import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import AddTaskIcon from '@mui/icons-material/AddTask'
import CheckIcon from '@mui/icons-material/Check'
import TaskForm from './TaskForm'
import type { TaskStatus } from '../../constants/TaskStatus.enum'
import userApi from '../../services/apis/user-api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import taskApi from '../../services/apis/task-api'

interface Task {
  id: string
  name: string
  description: string
  assignedTo: string
  status: TaskStatus
  progress: number
  createdAt: string
}

export default function TaskTab() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getTasks,
  })

  const queryClient = useQueryClient()

  const mutationCreateTask = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const { data: employeesData } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getEmployees,
  })

  // const { data: tasksData } = useQuery({
  //   queryKey: ['tasks'],
  //   queryFn: taskApi.getTasks,
  // })

  const handleCreateTask = (data: {
    name: string
    description: string
    employeeId: string | null
  }) => {
    mutationCreateTask.mutateAsync(data)
    setIsFormOpen(false)
  }

  const handleDeleteTask = (id: string) => {
    // setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleUpdateProgress = (id: string, newProgress: number) => {
    // setTasks(
    //   tasks.map((task) => {
    //     if (task.id === id) {
    //       let status: Task['status'] = 'PENDING'
    //       if (newProgress > 0 && newProgress < 100) {
    //         status = 'IN_PROGRESS'
    //       } else if (newProgress === 100) {
    //         status = 'DONE'
    //       }
    //       return { ...task, progress: newProgress, status }
    //     }
    //     return task
    //   }),
    // )
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'DONE':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: Task['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Task for Employee</h2>
          <p className="text-sm text-muted-foreground mt-1">Total tasks: {tasks && tasks.length}</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <AddTaskIcon className="w-4 h-4" />
            Create Task
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <TaskForm
            employees={employeesData || []}
            onSubmit={handleCreateTask}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <AnimatePresence>
          {tasks && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{task.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => handleDeleteTask(task.id)}
                        variant="outlined"
                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <DeleteIcon className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Status
                      </p>
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          task.status,
                        )}`}
                      >
                        {getStatusLabel(task.status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Assigned To
                      </p>
                      <p className="text-sm text-foreground font-medium mt-2">
                        {task.employee?.name || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Progress
                      </p>
                      <p className="text-sm text-foreground font-medium mt-2">{task.progress}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        Progress Bar
                      </span>
                      <div className="flex gap-1">
                        {[0, 25, 50, 75, 100].map((percent) => (
                          <motion.button
                            key={percent}
                            onClick={() => handleUpdateProgress(task.id, percent)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              task.progress === percent
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-foreground hover:bg-secondary/80'
                            }`}
                          >
                            {percent}%
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${task.progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-sky-500 h-full rounded-full"
                      />
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
              <CheckIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">No tasks yet</p>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <AddTaskIcon className="w-4 h-4" />
                Create First Task
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
