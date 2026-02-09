import axiosInstance from '../axios-config'

class ScheduleAPI {
  readonly API_URL = `${import.meta.env.VITE_BACKEND_SERVER_URL ?? 'http://localhost:8000/api/v1'}/schedules`

  deleteSchedule = async (id: string) => {
    await axiosInstance.delete(`${this.API_URL}/${id}`).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to delete schedule')
    })
  }
}

export default new ScheduleAPI()
