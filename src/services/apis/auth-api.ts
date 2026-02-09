import axiosInstance from '../axios-config'

class AuthAPI {
  readonly API_URL = `${import.meta.env.VITE_BACKEND_SERVER_URL ?? 'http://localhost:8000/api/v1'}/auth`

  createNewAccessCode = async (data: { phoneNumber: string }) => {
    const res = await axiosInstance.post(`${this.API_URL}/sms-login`, data).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to create new access code')
    })
    return res.data
  }

  validateAccessCode = async (data: { phoneNumber: string; otp: string }) => {
    const res = await axiosInstance.post(`${this.API_URL}/code-validation`, data).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to validate access code')
    })
    return res.data
  }
  loginEmail = async (data: { email: string }) => {
    const res = await axiosInstance.post(`${this.API_URL}/email-login`, data).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to login with email')
    })
    return res.data
  }
  validateEmailCode = async (data: { email: string; otp: string }) => {
    const res = await axiosInstance
      .post(`${this.API_URL}/email-code-validation`, data)
      .catch((error) => {
        throw new Error(error.response?.data?.message || 'Failed to validate email code')
      })
    return res.data
  }
  loginUsername = async (data: { username: string; password: string }) => {
    const res = await axiosInstance.post(`${this.API_URL}/login`, data).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to login with username')
    })
    return res.data
  }
  logout = async () => {
    const res = await axiosInstance.post(`${this.API_URL}/logout`).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to logout')
    })
    return res.data
  }
}

export default new AuthAPI()
