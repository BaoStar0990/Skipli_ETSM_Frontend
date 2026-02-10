import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SendIcon from '@mui/icons-material/Send'
import { socket } from '../../services/socket/socket-io'
import type { UserDTO } from '../../services/dto/user.dto'
import type { ChatDTO } from '../../services/dto/chat.dto'
import chatApi from '../../services/apis/chat-api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { MessageDTO } from '../../services/dto/message.dto'

interface ChatboxProps {
  chat: ChatDTO
  onBack: () => void
  employee?: UserDTO
}

export default function Chatbox({ chat, onBack, employee }: ChatboxProps) {
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState<MessageDTO[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userId = localStorage.getItem('id') || ''

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const queryClient = useQueryClient()

  const { data: chats } = useQuery({
    queryKey: ['chats', chat.id],
    queryFn: () => chatApi.getChatById(chat.id),
  })

  const mutationSendMessage = useMutation({
    mutationFn: (data: MessageDTO) => chatApi.sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats', userId] })
    },
  })

  useEffect(() => {
    setMessages(chats?.chatHistory || [])
  }, [chats?.chatHistory])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    socket.emit('join-room', { userId, peerId: employee?.id })

    socket.on('connected', (message) => {
      console.log('Received message:', message)
    })

    socket.on('send-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    return () => {
      socket.off('send-message')
    }
  }, [userId, chat.id])

  const handleSend = async () => {
    if (messageInput.trim()) {
      const data: MessageDTO = {
        senderId: userId,
        receiverId: employee?.id || '',
        content: messageInput.trim(),
      }
      await mutationSendMessage.mutateAsync(data)
      setMessageInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between p-3 border-b border-border bg-card shadow-sm">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <ArrowBackIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        <div className="flex-1 text-center">
          <h2 className="text-xl font-bold text-foreground">{employee?.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">Active now</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <MoreVertIcon className="w-5 h-5 text-muted-foreground" />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages?.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.senderId === userId
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary text-foreground rounded-bl-none border border-border'
                }`}
              >
                {message.senderId !== userId && (
                  <p className="text-xs font-medium mb-1 opacity-70">{employee?.name}</p>
                )}
                <p className="text-sm break-words">{message.content}</p>
                <p
                  className={`text-xs mt-1.5 ${
                    message.senderId === userId
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  {/* {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} */}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-border bg-card">
        <div className="flex gap-3">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSend}
              disabled={!messageInput.trim()}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendIcon className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
