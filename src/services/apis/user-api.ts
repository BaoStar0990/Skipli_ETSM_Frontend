import type { UserDTO } from '../dto/user.dto'
import axiosInstance from '../axios-config'
import type { WorkScheduleDTO } from '../dto/work-schedule.dto'
import type { TaskResponseDto } from '../dto/task-response.dto'

interface AccountConfirmationData {
  username: string
  password: string
}

class UserAPI {
  readonly API_URL = `${import.meta.env.VITE_BACKEND_SERVER_URL ?? 'http://localhost:8000/api/v1'}/employees`

  getEmployees = async (): Promise<UserDTO[]> => {
    const res = await axiosInstance.get(`${this.API_URL}`).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to fetch employees')
    })
    return res.data.data as UserDTO[]
  }

  createEmployee = async (data: Omit<UserDTO, 'id' | 'username' | 'password'>) => {
    const res = await axiosInstance.post(`${this.API_URL}`, data).catch((error) => {
      throw new Error(error.response?.data?.message || '  Failed to create employee')
    })
    return res.data.data
  }

  updateEmployee = async (id: string, data: Omit<UserDTO, 'id'>) => {
    const res = await axiosInstance.put(`${this.API_URL}/${id}`, data).catch((error) => {
      throw new Error(error.response?.data?.message || '  Failed to update employee')
    })
    return res.data.data
  }

  deleteEmployee = async (id: string) => {
    const res = await axiosInstance.delete(`${this.API_URL}/${id}`).catch((error) => {
      throw new Error(error.response?.data?.message || '  Failed to delete employee')
    })
    return res.data.data
  }

  createWorkSchedule = async (userId: string, scheduleData: WorkScheduleDTO) => {
    const res = await axiosInstance
      .post(`${this.API_URL}/${userId}/work-schedules`, scheduleData)
      .catch((error) => {
        throw new Error(error.response?.data?.message || '  Failed to create work schedule')
      })
    return res.data.data
  }

  getWorkSchedules = async (): Promise<WorkScheduleDTO[]> => {
    const res = await axiosInstance.get(`${this.API_URL}/work-schedules`).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to fetch work schedules')
    })
    return res.data.data as Promise<WorkScheduleDTO[]>
  }
  accountConfirmation = async (id: string, data: AccountConfirmationData) => {
    const res = await axiosInstance
      .post(`${this.API_URL}/${id}/confirmation`, data)
      .catch((error) => {
        throw new Error(error.response?.data?.message || 'Failed to confirm account')
      })
    return res.data
  }
  getTasksByEmployeeId = async (employeeId: string): Promise<TaskResponseDto[]> => {
    const res = await axiosInstance
      .get(`${this.API_URL}/${employeeId}/tasks`, {})
      .catch((error) => {
        throw new Error(error.response?.data?.message || 'Failed to fetch tasks')
      })
    return res.data.data as TaskResponseDto[]
  }
}

export default new UserAPI()
