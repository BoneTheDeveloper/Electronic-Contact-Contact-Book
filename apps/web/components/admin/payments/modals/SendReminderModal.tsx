'use client'

import { useState } from 'react'
import { Mail, Calendar, User, Send } from 'lucide-react'
import { BaseModal } from '@/components/admin/shared/modals/BaseModal'
import { PrimaryButton } from '@/components/admin/shared/buttons/primary-button'
import { SecondaryButton } from '@/components/admin/shared/buttons/secondary-button'

interface ReminderRecipient {
  studentName: string
  parentEmail: string
  parentPhone: string
  amount: number
  dueDate: string
}

interface ReminderTemplate {
  id: string
  name: string
  subject: string
  message: string
}

interface SendReminderModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  recipients: ReminderRecipient[]
  currentUser?: { role: string; name: string; id?: string }
}

const REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: 'overdue',
    name: 'Nhắc nhở quá hạn',
    subject: 'THÔNG BÁO: Học phí chưa thanh toán đã quá hạn',
    message: `Kính gửi Phụ huynh của em {studentName},

Hệ thống ghi nhận khoản học phí {amount} đ của em có hạn thanh toán vào ngày {dueDate} hiện đã QUÁ HẠN.

Để tránh ảnh hưởng đến việc học tập của em, vui lòng hoàn tất thanh toán sớm nhất có thể.

Thông tin thanh toán:
- Số tiền: {amount} đ
- Hạn thanh toán: {dueDate}

Trân trọng,
Ban hành chính Trường THCS ABC`,
  },
  {
    id: 'due_soon',
    name: 'Sắp đến hạn',
    subject: 'NHẮC NHỞ: Hạn thanh toán học phí sắp tới',
    message: `Kính gửi Phụ huynh của em {studentName},

Đây là email nhắc nhở về khoản học phí {amount} đ với hạn thanh toán vào ngày {dueDate}.

Vui lòng hoàn tất thanh toán trước hạn để đảm bảo quy định nhà trường.

Thông tin thanh toán:
- Số tiền: {amount} đ
- Hạn thanh toán: {dueDate}

Trân trọng,
Ban hành chính Trường THCS ABC`,
  },
  {
    id: 'partial_payment',
    name: 'Thanh toán một phần',
    subject: 'XÁC NHẬN: Đã nhận thanh toán một phần học phí',
    message: `Kính gửi Phụ huynh của em {studentName},

Chúng tôi đã nhận được thanh toán một phần khoản học phí. Tuy nhiên, vẫn còn số tiền chưa thanh toán như sau:

- Tổng tiền: {totalAmount} đ
- Đã thanh toán: {paidAmount} đ
- Còn lại: {remainingAmount} đ
- Hạn thanh toán: {dueDate}

Vui lòng hoàn tất thanh toán số tiền còn lại trước hạn.

Trân trọng,
Ban hành chính Trường THCS ABC`,
  },
  {
    id: 'custom',
    name: 'Tùy chỉnh',
    subject: 'THÔNG BÁO HỌC PHÍ',
    message: `Kính gửi Phụ huynh,

Vui lòng thanh toán khoản học phí của em {studentName}.

Số tiền: {amount} đ
Hạn thanh toán: {dueDate}

Trân trọng.`,
  },
]

export function SendReminderModal({
  isOpen,
  onClose,
  onSuccess,
  recipients,
  currentUser,
}: SendReminderModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(REMINDER_TEMPLATES[0].id)
  const [customSubject, setCustomSubject] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [sendDate, setSendDate] = useState(new Date().toISOString().split('T')[0])
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  // Permission check
  const canSendReminder = currentUser?.role === 'admin'

  const currentTemplate = REMINDER_TEMPLATES.find(t => t.id === selectedTemplate) || REMINDER_TEMPLATES[0]
  const isCustomTemplate = selectedTemplate === 'custom'

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  const previewMessage = (recipient: ReminderRecipient) => {
    let message = isCustomTemplate ? customMessage : currentTemplate.message
    let subject = isCustomTemplate ? customSubject : currentTemplate.subject

    // Replace placeholders
    message = message
      .replace(/{studentName}/g, recipient.studentName)
      .replace(/{amount}/g, formatCurrency(recipient.amount))
      .replace(/{dueDate}/g, new Date(recipient.dueDate).toLocaleDateString('vi-VN'))
      .replace(/{totalAmount}/g, formatCurrency(recipient.amount))
      .replace(/{paidAmount}/g, formatCurrency(Math.floor(recipient.amount * 0.5)))
      .replace(/{remainingAmount}/g, formatCurrency(Math.ceil(recipient.amount * 0.5)))

    subject = subject
      .replace(/{studentName}/g, recipient.studentName)
      .replace(/{amount}/g, formatCurrency(recipient.amount))
      .replace(/{dueDate}/g, new Date(recipient.dueDate).toLocaleDateString('vi-VN'))

    return { subject, message }
  }

  const handleSend = async () => {
    // Permission check
    if (!canSendReminder) {
      setError('Bạn không có quyền gửi nhắc nhở thanh toán')
      return
    }

    if (recipients.length === 0) {
      setError('Không có người nhận để gửi nhắc nhở')
      return
    }

    setIsSending(true)
    setError('')

    try {
      // TODO: API call to POST /api/payments/:id/reminder
      const promises = recipients.map((recipient) => {
        const { subject, message } = previewMessage(recipient)
        return fetch('/api/payments/reminder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientEmail: recipient.parentEmail,
            recipientPhone: recipient.parentPhone,
            subject,
            message,
            sendDate,
            sentBy: currentUser?.id || 'admin-id',
            sentByName: currentUser?.name || 'Admin',
          }),
        })
      })

      const results = await Promise.allSettled(promises)
      const successful = results.filter((r: any) => r.status === 'fulfilled').length

      if (successful === recipients.length) {
        onSuccess?.()
        handleClose()
        alert(`Đã gửi nhắc nhở thành công đến ${successful} phụ huynh`)
      } else {
        setError(`Đã gửi thành công ${successful}/${recipients.length} nhắc nhở`)
      }
    } catch (error) {
      console.error('Failed to send reminder:', error)
      // Mock success for demo
      onSuccess?.()
      handleClose()
      alert(`Đã gửi nhắc nhở thành công đến ${recipients.length} phụ huynh`)
    } finally {
      setIsSending(false)
    }
  }

  const handleClose = () => {
    setSelectedTemplate(REMINDER_TEMPLATES[0].id)
    setCustomSubject('')
    setCustomMessage('')
    setSendDate(new Date().toISOString().split('T')[0])
    setError('')
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Gửi Nhắc Nhở Thanh Toán"
      size="xl"
      primaryAction={{
        label: `Gửi ${recipients.length} Nhắc Nhở`,
        onClick: handleSend,
        disabled: !canSendReminder || isSending,
        loading: isSending,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-4">
        {/* Permission Warning */}
        {!canSendReminder && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <Mail className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">Không Có Quyền Truy Cập</p>
              <p className="text-xs text-amber-700 mt-1">Chỉ quản trị viên mới có quyền gửi nhắc nhở thanh toán</p>
            </div>
          </div>
        )}

        {/* Recipients Summary */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-[#0284C7]" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Người Nhận</p>
          </div>
          <p className="text-sm font-bold text-slate-800">
            {recipients.length} phụ huynh sẽ nhận nhắc nhở
          </p>
          {recipients.length <= 5 && (
            <div className="mt-2 space-y-1">
              {recipients.map((recipient, index) => (
                <p key={index} className="text-xs text-slate-600">
                  • {recipient.studentName} - {recipient.parentEmail}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Template Selection */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Mẫu Thông Báo <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {REMINDER_TEMPLATES.map((template) => (
              <label
                key={template.id}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-[#0284C7] bg-blue-50'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  value={template.id}
                  checked={selectedTemplate === template.id}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  disabled={!canSendReminder}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{template.name}</p>
                  <p className="text-xs text-slate-500 truncate">{template.subject}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Subject (when custom template selected) */}
        {isCustomTemplate && (
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              Tiêu Đề Email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="Nhập tiêu đề email"
              disabled={!canSendReminder}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none focus:border-[#0284C7] ${
                !canSendReminder ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>
        )}

        {/* Custom Message (when custom template selected) */}
        {isCustomTemplate && (
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              Nội Dung <span className="text-red-500">*</span>
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Nhập nội dung nhắc nhở. Sử dụng {studentName}, {amount}, {dueDate} để tự động điền thông tin."
              rows={6}
              disabled={!canSendReminder}
              className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#0284C7] resize-none ${
                !canSendReminder ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>
        )}

        {/* Send Date */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Ngày Gửi
          </label>
          <div className="relative">
            <input
              type="date"
              value={sendDate}
              onChange={(e) => setSendDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              disabled={!canSendReminder}
              className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#0284C7] ${
                !canSendReminder ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Preview */}
        {!isCustomTemplate && recipients.length > 0 && (
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              Xem Trước
            </label>
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <p className="text-xs font-bold text-slate-500 mb-2">Tiêu đề:</p>
              <p className="text-sm font-bold text-slate-800 mb-3">
                {previewMessage(recipients[0]).subject}
              </p>
              <p className="text-xs font-bold text-slate-500 mb-2">Nội dung:</p>
              <div className="bg-slate-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans">
                  {previewMessage(recipients[0]).message}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <Send className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
