import axiosInstance from '../axios-config'
import type { TaskResponseDto } from '../dto/task-response.dto'
import type { TaskDTO } from '../dto/task.dto'

class TaskAPI {
  readonly API_URL = `${import.meta.env.VITE_BACKEND_SERVER_URL ?? 'http://localhost:8000/api/v1'}/tasks`

  createTask = async (data: TaskDTO) => {
    const reformattedData: Omit<TaskDTO, 'id' | 'progress' | 'status'> = {
      name: data.name,
      description: data.description,
      employeeId: data.employeeId,
    }
    const res = await axiosInstance.post(`${this.API_URL}`, reformattedData).catch((error) => {
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
}

export default new TaskAPI()
