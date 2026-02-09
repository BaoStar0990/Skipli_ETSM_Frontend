import axiosInstance from '../axios-config'
import type { TaskResponseDto } from '../dto/task-response.dto'
import type { TaskDTO } from '../dto/task.dto'

class TaskAPI {
  readonly API_URL = `${import.meta.env.VITE_BACKEND_SERVER_URL ?? 'http://localhost:8000/api/v1'}/tasks`

  createTask = async (data: Omit<TaskDTO, 'id' | 'progress' | 'status'>) => {
    const res = await axiosInstance.post(`${this.API_URL}`, data).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to create new task')
    })
    return res.data
  }

  getTasks = async (): Promise<TaskResponseDto[]> => {
    const res = await axiosInstance.get(`${this.API_URL}`).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks')
    })
    return res.data.data as TaskResponseDto[]
  }

  deleteTask = async (taskId: string) => {
    await axiosInstance.delete(`${this.API_URL}/${taskId}`).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to delete task')
    })
  }

  updateTaskProgress = async (taskId: string, progress: number) => {
    const res = await axiosInstance
      .patch(`${this.API_URL}/${taskId}`, { progress })
      .catch((error) => {
        throw new Error(error.response?.data?.message || 'Failed to update task progress')
      })
    return res.data
  }
}

export default new TaskAPI()
