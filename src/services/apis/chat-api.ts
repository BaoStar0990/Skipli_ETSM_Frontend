import axiosInstance from '../axios-config'
import type { ChatDTO } from '../dto/chat.dto'

class ChatAPI {
  readonly API_URL = `${import.meta.env.VITE_BACKEND_SERVER_URL ?? 'http://localhost:8000/api/v1'}/chats`

  getUserChats = async (userId: string) => {
    const res = await axiosInstance.get(`${this.API_URL}/${userId}`).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to fetch chats')
    })
    return res.data.data as ChatDTO[]
  }
}

export default new ChatAPI()
