'use client'

import { useState } from 'react'
import { Message } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Paperclip } from 'lucide-react'

interface ChatWindowProps {
  conversationId?: string
  messages?: Message[]
  onSendMessage?: (content: string) => void
}

export function ChatWindow({
  conversationId = '1',
  messages: initialMessages,
  onSendMessage
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || [])
  const [newMessage, setNewMessage] = useState('')

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

    // Mock reply after 1 second
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        conversationId,
        senderId: 'p1',
        senderName: 'Phụ huynh',
        content: 'Cảm ơn thầy đã phản hồi!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isFromTeacher: false,
      }
      setMessages(prev => [...prev, reply])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Cuộc trò chuyện</h3>
        <p className="text-sm text-gray-500">Nhập tin nhắn để bắt đầu trò chuyện</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isFromTeacher ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  message.isFromTeacher
                    ? 'bg-sky-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium opacity-90">{message.senderName}</span>
                  <span className="text-xs opacity-70">{message.timestamp}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="shrink-0" type="button">
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
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()} type="button">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
