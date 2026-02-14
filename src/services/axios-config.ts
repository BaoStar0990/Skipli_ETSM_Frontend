import axios from 'axios'
import type { NavigateFunction } from 'react-router-dom'

let navigateRef: NavigateFunction | null = null

export const setAxiosNavigator = (navigate: NavigateFunction) => {
  navigateRef = navigate
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL ?? 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log('API Response:', response)
    return response
  },
  (error) => {
    console.error('API Error:', error)
    if (navigateRef && error.response?.status === 401) {
      navigateRef('/', { replace: true })
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
