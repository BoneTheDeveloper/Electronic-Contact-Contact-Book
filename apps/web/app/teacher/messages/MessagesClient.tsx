'use client'

import { useState, useCallback } from 'react'
import type { Conversation, Message } from '@/lib/types'
import { ConversationList } from '@/components/teacher/ConversationList'
import { ChatWindow } from '@/components/teacher/ChatWindow'
import { ContactInfoPanel } from '@/components/teacher/ContactInfoPanel'

interface MessagesClientProps {
  initialConversations: Conversation[]
  initialSelectedConversationId?: string
  initialMessages: Message[]
}

export function MessagesClient({
  initialConversations,
  initialSelectedConversationId,
  initialMessages
}: MessagesClientProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(initialSelectedConversationId)
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  const handleSelectConversation = useCallback(async (id: string) => {
    setSelectedConversationId(id)
    // In real implementation, fetch messages from API
    const msgs = await import('@/lib/mock-data').then(m => m.getConversationMessages(id))
    setMessages(msgs)
  }, [])

  const handleSendMessage = useCallback((content: string) => {
    console.log('Sending message:', content)
    // In real implementation, send to API
  }, [])

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
