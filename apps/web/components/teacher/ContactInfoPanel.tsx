'use client'

import type { Conversation } from '@/lib/types'
import { FileText, Image, Phone, Mail, User } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface ContactInfoPanelProps {
  conversation?: Conversation
}

export function ContactInfoPanel({ conversation }: ContactInfoPanelProps) {
  if (!conversation) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          <p>Chọn một cuộc hội thoại</p>
        </div>
      </div>
    )
  }

  const sharedFiles = [
    { name: 'Bài tập về nhà.pdf', type: 'pdf' },
    { name: 'Ảnh chụp bảng.jpg', type: 'image' },
    { name: 'Thông báo nghỉ học.pdf', type: 'pdf' },
  ]

  return (
    <div className="p-4 h-full overflow-y-auto">
      {/* Parent Info */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-4">Thông tin phụ huynh</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
              <User className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phụ huynh</p>
              <p className="font-bold">{conversation.parentName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Điện thoại</p>
              <p className="font-bold">0901234567</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-bold text-sm">parent@email.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Info */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-4">Học sinh</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Họ và tên</p>
            <p className="font-bold">{conversation.studentName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">MSSV</p>
            <p className="font-bold">{conversation.studentId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Lớp</p>
            <p className="font-bold">{conversation.className}</p>
          </div>
        </div>
      </div>

      {/* Shared Files */}
      <div>
        <h3 className="font-bold text-lg mb-4">Tài liệu chia sẻ</h3>
        <div className="space-y-2">
          {sharedFiles.map((file, index) => (
            <Card key={index} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={file.type === 'pdf' ? 'text-red-500' : 'text-blue-500'}>
                  {file.type === 'pdf' ? <FileText className="h-5 w-5" /> : <Image className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">2.5 MB</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
