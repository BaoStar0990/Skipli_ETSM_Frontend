import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ChatIcon from '@mui/icons-material/Chat'
import type { ChatDTO } from '../../services/dto/chat.dto'
import type { UserDTO } from '../../services/dto/user.dto'

interface ChatListProps {
  chats: ChatDTO[]
  onSelectChat: (chat: ChatDTO, employee: UserDTO) => void
  onCreateChat: () => void
}

export default function ChatList({ chats, onSelectChat, onCreateChat }: ChatListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Messages</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {chats.length} conversation{chats.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onCreateChat}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            size="small"
          >
            <ChatIcon className="w-4 h-4" />
            New Chat
          </Button>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length > 0 ? (
          <div className="p-4 space-y-2">
            {chats.map((chat: ChatDTO, index) => (
              <motion.button
                key={chat.id}
                onClick={() => onSelectChat(chat, chat.peerUser)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ x: 4 }}
                className="w-full text-left p-4 bg-card hover:bg-secondary/50 border border-border rounded-lg transition-colors duration-200 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {chat.peerUser.name}
                      </h3>
                      {/* {chat.unread > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex-shrink-0"
                        >
                          {chat.unread}
                        </motion.span>
                      )} */}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {new Date(chat.updatedAt).toLocaleString('sv-SE', {
                      hour12: false,
                    })}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center px-6"
          >
            <ChatBubbleOutlineIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">No conversations yet</p>
            <Button
              onClick={onCreateChat}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <ChatIcon className="w-4 h-4" />
              Start a Conversation
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
