'use client'

import { useState, useEffect } from 'react'
import { getTeacherConversations, getConversationMessages, type Conversation, type Message } from '@/lib/mock-data'
import { ConversationList } from '@/components/teacher/ConversationList'
import { ChatWindow } from '@/components/teacher/ChatWindow'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const convs = await getTeacherConversations()
      setConversations(convs)
      if (convs.length > 0) {
        setSelectedConversationId(convs[0].id)
        const msgs = await getConversationMessages(convs[0].id)
        setMessages(msgs)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSelectConversation = async (id: string) => {
    setSelectedConversationId(id)
    const msgs = await getConversationMessages(id)
    setMessages(msgs)
  }

  const handleSendMessage = (content: string) => {
    console.log('Sending message:', content)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Conversation List */}
      <div className="w-80 flex-shrink-0">
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        {selectedConversationId ? (
          <ChatWindow
            conversationId={selectedConversationId}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-white">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
