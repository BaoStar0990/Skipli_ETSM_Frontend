import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8035'

export const socket = io(SOCKET_URL, {
  autoConnect: true,
})
