import type { TaskStatus } from '../../constants/TaskStatus.enum'

export type TaskDTO = {
  id: string | null
  name: string | null
  description: string | null
  employeeId: string | null
  progress: number | null
  status: TaskStatus | null
}
