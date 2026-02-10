import { AnimatePresence, motion } from 'motion/react'
import ChatList from './ChatList'
import Chatbox from './ChatBox'
import { useState } from 'react'
import NewChatDialog from './NewChatForm'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import chatApi from '../../services/apis/chat-api'
import type { ChatDTO } from '../../services/dto/chat.dto'
import userApi from '../../services/apis/user-api'
import type { UserDTO } from '../../services/dto/user.dto'

export default function ChatTab() {
  const [selectedChat, setSelectedChat] = useState<ChatDTO | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<UserDTO | null>(null)
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)

  const userId = localStorage.getItem('id') || 'userId'

  const queryClient = useQueryClient()

  const { data: chats } = useQuery({
    queryKey: ['chats', userId],
    queryFn: () => chatApi.getUserChats(userId),
  })

  const { data: employees } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getEmployees,
  })

  const mutationCreateChat = useMutation({
    mutationFn: (peerUserId: string) => chatApi.createChat({ peerUserId }),
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ['chats', userId] })
      setSelectedChat(newChat)
    },
  })

  const handleSelectChat = (chat: ChatDTO, employee: UserDTO) => {
    setSelectedChat(chat)
    setSelectedEmployee(employee)
  }

  const handleCreateChat = async (employee: UserDTO) => {
    if (employee.id) {
      mutationCreateChat.mutate(employee.id)
      setShowNewChatDialog(false)
      setSelectedEmployee(employee)
    }
  }

  const handleBack = () => {
    setSelectedChat(null)
  }

  return (
    <div className="h-screen bg-background flex">
      <AnimatePresence>
        {showNewChatDialog && (
          <NewChatDialog
            employees={!employees ? [] : employees}
            existingChatIds={!chats ? [] : chats.map((c) => c.peerUser.id)}
            onCreateChat={handleCreateChat}
            onClose={() => setShowNewChatDialog(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedChat ? (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Chatbox
              chat={selectedChat}
              // messages={[]}
              onBack={handleBack}
              employee={!selectedEmployee ? undefined : selectedEmployee}
            />
          </motion.div>
        ) : (
          <motion.div
            key="chatlist"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <ChatList
              chats={chats ? chats : []}
              onSelectChat={handleSelectChat}
              onCreateChat={() => setShowNewChatDialog(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
