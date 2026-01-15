'use client'

import { useState } from 'react'
import { Conversation } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConversationListProps {
  conversations: Conversation[]
  selectedId?: string
  onSelectConversation: (id: string) => void
}

export function ConversationList({ conversations, selectedId, onSelectConversation }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = conversations.filter(conv =>
    conv.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .slice(-1)[0]
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Tin nhắn</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button className="flex-1 py-3 text-sm font-medium text-sky-600 border-b-2 border-sky-600">
          Tất cả
        </button>
        <button className="flex-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
          Chưa đọc
        </button>
        <button className="flex-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
          Đánh dấu
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
            <MessageCircle className="h-12 w-12 mb-2" />
            <p className="text-sm text-center">
              {searchQuery ? 'Không tìm thấy cuộc trò chuyện nào' : 'Chưa có tin nhắn nào'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  'w-full p-4 text-left hover:bg-gray-50 transition-colors',
                  selectedId === conversation.id && 'bg-sky-50 border-l-4 border-sky-600'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar with Online Indicator */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                      {getAvatarInitials(conversation.parentName)}
                    </div>
                    {/* Online Indicator */}
                    <div
                      className={cn(
                        'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                        conversation.online ? 'bg-green-500' : 'bg-gray-400'
                      )}
                    ></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{conversation.parentName}</h4>
                      <span className="text-xs text-gray-500 shrink-0 ml-2">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">{conversation.studentName}</p>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                  </div>

                  {/* Unread Badge */}
                  {conversation.unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="shrink-0 ml-2 h-5 w-5 flex items-center justify-center p-0 rounded-full text-xs"
                    >
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
