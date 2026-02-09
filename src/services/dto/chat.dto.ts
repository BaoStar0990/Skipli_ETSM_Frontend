import type { UserDTO } from './user.dto'

export type ChatDTO = {
  id: string
  peerUser: UserDTO
  lastMessage: string
  updatedAt: string
}
