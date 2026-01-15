'use client'

import { useState, useEffect, useRef } from 'react'
import { Message, Conversation } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Paperclip, Phone, Video, Info, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatWindowProps {
  conversationId?: string
  messages?: Message[]
  conversation?: Conversation
  onSendMessage?: (content: string) => void
}

export function ChatWindow({
  conversationId = '1',
  messages: initialMessages,
  conversation,
  onSendMessage
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || [])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: '2',
      senderName: 'Thầy Nguyễn Thanh T.',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isFromTeacher: true,
    }

    setMessages(prev => [...prev, message])

    if (onSendMessage) {
      onSendMessage(newMessage)
    }

    setNewMessage('')

    // Show typing indicator then reply
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        conversationId,
        senderId: 'p1',
        senderName: conversation?.parentName || 'Phụ huynh',
        content: 'Cảm ơn thầy đã phản hồi!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isFromTeacher: false,
      }
      setMessages(prev => [...prev, reply])
    }, 1500)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-4">
        <div>
          <div className="font-bold text-gray-900">{conversation?.parentName || 'Phụ huynh'}</div>
          <div className="text-sm text-gray-500">
            Phụ huynh {conversation?.studentName} - {conversation?.className}
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <Phone className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <Video className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-sm">Chưa có tin nhắn nào</p>
              <p className="text-xs mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('flex', message.isFromTeacher ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[70%] px-4 py-2 rounded-2xl',
                    message.isFromTeacher
                      ? 'bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-br-sm'
                      : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  <div
                    className={cn(
                      'text-xs mt-1 text-right',
                      message.isFromTeacher ? 'text-sky-200' : 'text-gray-400'
                    )}
                  >
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10" type="button">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            type="button"
            className="h-10 px-4"
          >
            <Send className="h-4 w-4 mr-2" />
            Gửi
          </Button>
        </div>
      </div>
    </div>
  )
}
