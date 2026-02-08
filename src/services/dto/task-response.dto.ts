import type { TaskStatus } from '../../constants/TaskStatus.enum'
import type { UserDTO } from './user.dto'

export type TaskResponseDto = {
  id: string
  name: string
  description: string
  employee: UserDTO | null
  progress: number
  status: TaskStatus
}
