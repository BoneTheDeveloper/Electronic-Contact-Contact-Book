'use client'

import { useState, useEffect } from 'react'
import { User, Calendar, DollarSign, Clock, FileText, CheckCircle2 } from 'lucide-react'
import { BaseModal } from '@/components/admin/shared/modals/BaseModal'
import { SecondaryButton } from '@/components/admin/shared/buttons/secondary-button'
import type { Invoice } from '@/lib/types'

interface PaymentRecord {
  id: string
  date: string
  amount: number
  method: 'cash' | 'bank_transfer' | 'card'
  status: 'completed' | 'pending' | 'failed'
  confirmedBy: string
  notes?: string
}

interface InvoiceDetail {
  id: string
  student: {
    id: string
    name: string
    class: string
    parentPhone: string
  }
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  status: 'paid' | 'pending' | 'overdue'
  issueDate: string
  dueDate: string
  paidDate?: string
  feeItems: Array<{
    name: string
    code: string
    type: 'mandatory' | 'voluntary'
    amount: number
  }>
  paymentHistory: PaymentRecord[]
}

interface InvoiceDetailModalProps {
  isOpen: boolean
  onClose: () => void
  invoiceId: string
}

export function InvoiceDetailModal({ isOpen, onClose, invoiceId }: InvoiceDetailModalProps) {
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && invoiceId) {
      fetchInvoiceDetails()
    }
  }, [isOpen, invoiceId])

  const fetchInvoiceDetails = async () => {
    setLoading(true)
    try {
      // TODO: API call to GET /api/invoices/:id
      const response = await fetch(`/api/invoices/${invoiceId}`)
      if (response.ok) {
        const data = await response.json()
        setInvoice(data.data)
      } else {
        // Mock data for demo
        setInvoice(getMockInvoiceDetail())
      }
    } catch (error) {
      console.error('Failed to fetch invoice details:', error)
      // Mock data for demo
      setInvoice(getMockInvoiceDetail())
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string; icon: any }> = {
      paid: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      pending: { label: 'Chờ thanh toán', color: 'bg-amber-100 text-amber-700', icon: Clock },
      overdue: { label: 'Quá hạn', color: 'bg-red-100 text-red-700', icon: Clock },
    }
    const { label, color, icon: Icon } = config[status] || config.pending
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase rounded-lg ${color}`}>
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
    )
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi Tiết Hóa Đơn"
      size="xl"
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-bold text-slate-500">Đang tải thông tin...</p>
          </div>
        </div>
      ) : invoice ? (
        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mã Hóa Đơn</p>
                <p className="text-xl font-black font-mono tracking-tight">{invoice.id}</p>
              </div>
              {getStatusBadge(invoice.status)}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng tiền</p>
                <p className="text-lg font-black">{formatCurrency(invoice.totalAmount)} ₫</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Đã thanh toán</p>
                <p className="text-lg font-black text-green-400">{formatCurrency(invoice.paidAmount)} ₫</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Còn lại</p>
                <p className="text-lg font-black text-red-400">{formatCurrency(invoice.remainingAmount)} ₫</p>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-[#0284C7]" />
              <p className="text-sm font-bold text-slate-700">Thông Tin Học Sinh</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Họ và tên</p>
                <p className="text-sm font-bold text-slate-800">{invoice.student.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lớp</p>
                <p className="text-sm font-bold text-slate-800">{invoice.student.class}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mã học sinh</p>
                <p className="text-sm font-mono text-slate-600">{invoice.student.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">SĐT Phụ huynh</p>
                <p className="text-sm font-mono text-slate-600">{invoice.student.parentPhone}</p>
              </div>
            </div>
          </div>

          {/* Fee Items */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[#0284C7]" />
              <p className="text-sm font-bold text-slate-700">Chi Tiết Khoản Thu</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider col-span-2">Khoản thu</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Loại</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Số tiền</p>
              </div>
              {invoice.feeItems.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-slate-100 last:border-b-0">
                  <div className="col-span-2">
                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{item.code}</p>
                  </div>
                  <span className={`inline-flex self-center px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                    item.type === 'mandatory' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {item.type === 'mandatory' ? 'Bắt buộc' : 'Tự nguyện'}
                  </span>
                  <p className="text-sm font-bold text-slate-800 text-right">{formatCurrency(item.amount)} ₫</p>
                </div>
              ))}
            </div>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Ngày phát hành</p>
              </div>
              <p className="text-base font-black text-blue-800">{formatDate(invoice.issueDate)}</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Hạn thanh toán</p>
              </div>
              <p className="text-base font-black text-amber-800">{formatDate(invoice.dueDate)}</p>
            </div>
            {invoice.paidDate && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Ngày thanh toán</p>
                </div>
                <p className="text-base font-black text-green-800">{formatDate(invoice.paidDate)}</p>
              </div>
            )}
          </div>

          {/* Payment History Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-[#0284C7]" />
              <p className="text-sm font-bold text-slate-700">Lịch Sử Thanh Toán</p>
            </div>
            <div className="space-y-3">
              {invoice.paymentHistory.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-center">
                  <p className="text-sm font-bold text-slate-400">Chưa có giao dịch thanh toán nào</p>
                </div>
              ) : (
                invoice.paymentHistory.map((payment, index) => (
                  <div key={payment.id} className="relative pl-8">
                    {/* Timeline Line */}
                    {index < invoice.paymentHistory.length - 1 && (
                      <div className="absolute left-[13px] top-8 bottom-[-12px] w-0.5 bg-slate-200" />
                    )}

                    {/* Timeline Dot */}
                    <div className={`absolute left-0 top-1.5 w-7 h-7 rounded-full border-2 ${
                      payment.status === 'completed'
                        ? 'bg-green-100 border-green-500'
                        : payment.status === 'pending'
                        ? 'bg-amber-100 border-amber-500'
                        : 'bg-red-100 border-red-500'
                    } flex items-center justify-center`}>
                      {payment.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                      {payment.status === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    </div>

                    {/* Payment Card */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {formatCurrency(payment.amount)} ₫
                          </p>
                          <p className="text-xs text-slate-500">{formatDate(payment.date)}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : payment.status === 'pending'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {payment.status === 'completed' ? 'Hoàn thành' : payment.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Phương thức: <span className="font-bold text-slate-700">{
                          payment.method === 'cash' ? 'Tiền mặt' :
                          payment.method === 'bank_transfer' ? 'Chuyển khoản' : 'Thẻ'
                        }</span></span>
                        <span>Xác nhận bởi: <span className="font-bold text-slate-700">{payment.confirmedBy}</span></span>
                      </div>
                      {payment.notes && (
                        <p className="text-xs text-slate-600 mt-2 italic">&ldquo;{payment.notes}&rdquo;</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm font-bold text-slate-400">Không tìm thấy thông tin hóa đơn</p>
        </div>
      )}
    </BaseModal>
  )
}

// Mock data helper
function getMockInvoiceDetail(): InvoiceDetail {
  return {
    id: 'INV-2025-001234',
    student: {
      id: 'HS2025001',
      name: 'Nguyễn Văn An',
      class: '6A',
      parentPhone: '0912345678',
    },
    totalAmount: 5404000,
    paidAmount: 2500000,
    remainingAmount: 2904000,
    status: 'pending',
    issueDate: '2025-09-01',
    dueDate: '2025-10-15',
    feeItems: [
      { name: 'Học phí', code: 'HP-HK1', type: 'mandatory', amount: 2500000 },
      { name: 'Bảo hiểm y tế', code: 'BHYT-25', type: 'mandatory', amount: 854000 },
      { name: 'Tiền đồng phục', code: 'DP-HK1', type: 'voluntary', amount: 850000 },
      { name: 'Tiền ăn bán trú', code: 'BT-HK1', type: 'voluntary', amount: 1200000 },
    ],
    paymentHistory: [
      {
        id: 'PAY-001',
        date: '2025-09-10',
        amount: 2500000,
        method: 'cash',
        status: 'completed',
        confirmedBy: 'admin@school.edu',
        notes: 'Thanh toán học phí HK1',
      },
    ],
  }
}
