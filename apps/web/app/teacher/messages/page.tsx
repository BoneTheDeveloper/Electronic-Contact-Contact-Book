'use client'

import { useState, useEffect } from 'react'
import { getTeacherConversations, getConversationMessages, type Conversation, type Message } from '@/lib/mock-data'
import { ConversationList } from '@/components/teacher/ConversationList'
import { ChatWindow } from '@/components/teacher/ChatWindow'
import { ContactInfoPanel } from '@/components/teacher/ContactInfoPanel'

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
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  const selectedConversation = conversations.find(c => c.id === selectedConversationId)

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Column - Chat List (320px) */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200">
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Center Column - Active Conversation (flex-1) */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversationId ? (
          <ChatWindow
            conversationId={selectedConversationId}
            messages={messages}
            onSendMessage={handleSendMessage}
            conversation={selectedConversation}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p>Chọn một cuộc hội thoại</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Contact Info (320px, hidden on mobile) */}
      <div className="hidden lg:block w-80 flex-shrink-0 border-l border-gray-200 bg-white">
        <ContactInfoPanel conversation={selectedConversation} />
      </div>
    </div>
  )
}
