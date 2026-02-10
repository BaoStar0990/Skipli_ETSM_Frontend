import axiosInstance from '../axios-config'
import type { ChatDTO } from '../dto/chat.dto'
import type { MessageDTO } from '../dto/message.dto'

class ChatAPI {
  readonly API_URL = `${import.meta.env.VITE_BACKEND_SERVER_URL ?? 'http://localhost:8000/api/v1'}/chats`

  getUserChats = async (userId: string) => {
    const res = await axiosInstance.get(`${this.API_URL}/users/${userId}`).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to fetch chats')
    })
    return res.data.data as ChatDTO[]
  }

  createChat = async (data: { peerUserId: string }) => {
    const res = await axiosInstance.post(this.API_URL, data).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to create chat')
    })
    return res.data.data as ChatDTO
  }

  getChatById = async (chatId: string) => {
    const res = await axiosInstance.get(`${this.API_URL}/${chatId}`).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to fetch chat')
    })
    return res.data.data as ChatDTO
  }

  sendMessage = async (data: MessageDTO) => {
    const reformattedData: Omit<MessageDTO, 'id'> = {
      senderId: data.senderId,
      receiverId: data.receiverId,
      content: data.content,
    }
    await axiosInstance.post(`${this.API_URL}/send`, reformattedData).catch((error) => {
      throw new Error(error.response?.data?.message || 'Failed to send message')
    })
  }
}

export default new ChatAPI()
