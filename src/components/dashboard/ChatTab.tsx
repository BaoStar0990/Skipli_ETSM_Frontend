import { AnimatePresence, motion } from 'motion/react'
import ChatList from './ChatList'
import Chatbox, { type Message } from './ChatBox'
import { useState } from 'react'
import NewChatDialog, { type Employee } from './NewChatForm'
import { useQuery } from '@tanstack/react-query'
import chatApi from '../../services/apis/chat-api'
import type { ChatDTO } from '../../services/dto/chat.dto'

const employees: Employee[] = [
  { id: '1', name: 'John Doe', avatar: 'JD' },
  { id: '2', name: 'Sarah Smith', avatar: 'SS' },
  { id: '3', name: 'Michael Johnson', avatar: 'MJ' },
  { id: '4', name: 'Emily Brown', avatar: 'EB' },
]

const chatMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      sender: 'other',
      senderName: 'John Doe',
      content: 'Hi! How are you doing?',
      timestamp: '2024-02-09T10:00:00',
      avatar: 'JD',
    },
    {
      id: '2',
      sender: 'user',
      senderName: 'You',
      content: 'Hi John! Doing great, thanks for asking.',
      timestamp: '2024-02-09T10:05:00',
      avatar: 'YOU',
    },
    {
      id: '3',
      sender: 'other',
      senderName: 'John Doe',
      content: 'Can you review the project timeline?',
      timestamp: '2024-02-09T10:10:00',
      avatar: 'JD',
    },
    {
      id: '4',
      sender: 'user',
      senderName: 'You',
      content: "Sure, I'll take a look at it today",
      timestamp: '2024-02-09T10:12:00',
      avatar: 'YOU',
    },
  ],
  '2': [
    {
      id: '1',
      sender: 'other',
      senderName: 'Sarah Smith',
      content: 'Hi! Just checking about next week',
      timestamp: '2024-02-08T14:30:00',
      avatar: 'SS',
    },
    {
      id: '2',
      sender: 'user',
      senderName: 'You',
      content: 'Yes, everything is set!',
      timestamp: '2024-02-08T14:35:00',
      avatar: 'YOU',
    },
    {
      id: '3',
      sender: 'other',
      senderName: 'Sarah Smith',
      content: 'The schedule looks good for next week',
      timestamp: '2024-02-08T14:40:00',
      avatar: 'SS',
    },
  ],
  '3': [
    {
      id: '1',
      sender: 'other',
      senderName: 'Michael Johnson',
      content: 'Do you have time for a quick sync?',
      timestamp: '2024-02-08T09:00:00',
      avatar: 'MJ',
    },
    {
      id: '2',
      sender: 'user',
      senderName: 'You',
      content: 'Sure, what time works for you?',
      timestamp: '2024-02-08T09:05:00',
      avatar: 'YOU',
    },
    {
      id: '3',
      sender: 'other',
      senderName: 'Michael Johnson',
      content: 'Meeting at 3 PM today',
      timestamp: '2024-02-08T09:10:00',
      avatar: 'MJ',
    },
  ],
}

export default function ChatTab() {
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [selectedChat, setSelectedChat] = useState<ChatDTO | null>(null)
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)

  const userId = localStorage.getItem('id') || 'userId'

  const { data: chats } = useQuery({
    queryKey: ['chats', userId],
    queryFn: () => chatApi.getUserChats(userId),
  })

  const handleSelectChat = (chat: ChatDTO) => {
    setSelectedChat({ ...chat, unread: 0 })
    // setChats((prevChats) => prevChats.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c)))
  }

  const handleSendMessage = (content: string) => {
    if (!selectedChat) return

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      senderName: 'You',
      content,
      timestamp: new Date().toISOString(),
      avatar: 'YOU',
    }

    setMessages((prev) => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
    }))

    setTimeout(() => {
      const responses = [
        'That sounds great!',
        'Thanks for the update!',
        'I agree with you!',
        'Let me get back to you on that.',
        'Perfect, thanks!',
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const reply: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'other',
        senderName: selectedChat.name,
        content: randomResponse,
        timestamp: new Date().toISOString(),
        avatar: selectedChat.avatar,
      }

      setMessages((prev) => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), reply],
      }))
    }, 1000)

    // setChats((prevChats) =>
    //   prevChats.map((c) =>
    //     c.id === selectedChat.id ? { ...c, lastMessage: content, timestamp: 'now' } : c,
    //   ),
    // )
  }

  const handleCreateChat = (employee: Employee) => {
    const existingChat = chats.find((c) => c.id === employee.id)
    if (existingChat) {
      setSelectedChat(existingChat)
      setShowNewChatDialog(false)
      return
    }

    const newChat: Chat = {
      id: employee.id,
      name: employee.name,
      lastMessage: 'Started a new conversation',
      timestamp: 'now',
      unread: 0,
      avatar: employee.avatar || employee.name.substring(0, 2).toUpperCase(),
    }

    setMessages((prev) => ({
      ...prev,
      [newChat.id]: [],
    }))

    // setChats((prev) => [newChat, ...prev])
    setSelectedChat(newChat)
    setShowNewChatDialog(false)
  }

  const handleBack = () => {
    setSelectedChat(null)
  }

  return (
    <div className="h-screen bg-background flex">
      <AnimatePresence>
        {showNewChatDialog && (
          <NewChatDialog
            employees={employees}
            existingChatIds={!chats ? [] : chats.map((c) => c.id)}
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
              messages={messages[selectedChat.id] || []}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
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
