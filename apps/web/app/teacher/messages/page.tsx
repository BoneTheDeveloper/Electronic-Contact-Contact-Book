import { getTeacherConversations, getConversationMessages } from '@/lib/supabase/queries'
import type { Conversation, Message } from '@/lib/types'
import { MessagesClient } from './MessagesClient'

export default async function MessagesPage() {
  const conversations = await getTeacherConversations()
  const selectedConversationId = conversations.length > 0 ? conversations[0].id : undefined
  const initialMessages = selectedConversationId
    ? await getConversationMessages(selectedConversationId)
    : []

  return (
    <MessagesClient
      initialConversations={conversations}
      initialSelectedConversationId={selectedConversationId}
      initialMessages={initialMessages}
    />
  )
}
