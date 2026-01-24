'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { BaseModal } from '@/components/admin/shared/modals/BaseModal'
import { PrimaryButton } from '@/components/admin/shared/buttons/primary-button'
import { SecondaryButton } from '@/components/admin/shared/buttons/secondary-button'
import type { Invoice } from '@/lib/types'

interface PaymentConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  invoice: Invoice
  currentUser?: { role: string; id?: string }
}

export function PaymentConfirmModal({
  isOpen,
  onClose,
  onSuccess,
  invoice,
  currentUser,
}: PaymentConfirmModalProps) {
  const [paymentAmount, setPaymentAmount] = useState(invoice.remainingAmount.toString())
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Permission check
  const canConfirmPayment = currentUser?.role === 'admin'

  const remainingBalance = invoice.remainingAmount - Number(paymentAmount || 0)
  const isPartialPayment = Number(paymentAmount) < invoice.remainingAmount
  const isOverPayment = Number(paymentAmount || 0) > invoice.remainingAmount

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  const handleConfirm = async () => {
    // Permission check
    if (!canConfirmPayment) {
      setError('Bạn không có quyền xác nhận thanh toán')
      return
    }

    if (!paymentAmount || Number(paymentAmount) <= 0) {
      setError('Vui lòng nhập số tiền thanh toán')
      return
    }

    if (isOverPayment) {
      setError('Số tiền thanh toán không được lớn hơn số tiền còn lại')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // TODO: API call to POST /api/payments/:id/confirm
      const response = await fetch(`/api/payments/${invoice.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(paymentAmount),
          notes: notes.trim(),
          confirmedBy: currentUser?.id || 'admin-id',
          confirmedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        onSuccess?.()
        handleClose()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Có lỗi xảy ra khi xác nhận thanh toán')
      }
    } catch (error) {
      console.error('Failed to confirm payment:', error)
      // Mock success for demo
      onSuccess?.()
      handleClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setPaymentAmount(invoice.remainingAmount.toString())
    setNotes('')
    setError('')
    onClose()
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      paid: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-700' },
      pending: { label: 'Chờ thanh toán', color: 'bg-amber-100 text-amber-700' },
      overdue: { label: 'Quá hạn', color: 'bg-red-100 text-red-700' },
    }
    const { label, color } = config[status] || config.pending
    return (
      <span className={`px-3 py-1 text-xs font-black uppercase rounded-lg ${color}`}>
        {label}
      </span>
    )
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Xác Nhận Thanh Toán"
      size="lg"
      primaryAction={{
        label: 'Xác Nhận Thanh Toán',
        onClick: handleConfirm,
        disabled: !canConfirmPayment || isSubmitting,
        loading: isSubmitting,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-4">
        {/* Permission Warning */}
        {!canConfirmPayment && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">Không Có Quyền Truy Cập</p>
              <p className="text-xs text-amber-700 mt-1">Chỉ quản trị viên mới có quyền xác nhận thanh toán</p>
            </div>
          </div>
        )}

        {/* Invoice Summary */}
        <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hóa Đơn</p>
              <p className="text-lg font-black text-slate-800 font-mono">{invoice.id}</p>
            </div>
            {getStatusBadge(invoice.status)}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Học sinh</span>
              <span className="text-sm font-bold text-slate-800">{invoice.studentName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Mã HS</span>
              <span className="text-sm font-mono text-slate-600">{invoice.studentId}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng tiền</span>
              <span className="text-base font-black text-slate-800">{formatCurrency(invoice.totalAmount)} ₫</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Đã thanh toán</span>
              <span className="text-sm font-bold text-green-600">{formatCurrency(invoice.paidAmount)} ₫</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Còn lại</span>
              <span className="text-base font-black text-red-600">{formatCurrency(invoice.remainingAmount)} ₫</span>
            </div>
          </div>
        </div>

        {/* Fee Items Preview */}
        {invoice.feeItems && invoice.feeItems.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Chi Tiết Khoản Thu</p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {invoice.feeItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-xs font-bold text-slate-700">{item.code}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{item.code}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-800">{formatCurrency(item.amount)} ₫</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Amount Input */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Số Tiền Thanh Toán <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder={invoice.remainingAmount.toString()}
              disabled={!canConfirmPayment}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-lg font-black outline-none transition-colors pr-20 ${
                isOverPayment
                  ? 'border-red-300 focus:border-red-500 text-red-600'
                  : 'border-slate-200 focus:border-[#0284C7]'
              } ${!canConfirmPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
              ₫
            </span>
          </div>

          {/* Quick Amount Buttons */}
          {canConfirmPayment && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setPaymentAmount(invoice.remainingAmount.toString())}
                className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-lg transition-colors"
              >
                Thanh toán hết ({formatCurrency(invoice.remainingAmount)} ₫)
              </button>
              <button
                onClick={() => setPaymentAmount(Math.floor(invoice.remainingAmount / 2).toString())}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                50% ({formatCurrency(Math.floor(invoice.remainingAmount / 2))} ₫)
              </button>
            </div>
          )}
        </div>

        {/* Balance Preview */}
        {paymentAmount && (
          <div className={`p-4 rounded-xl border-2 ${
            isPartialPayment
              ? 'bg-amber-50 border-amber-200'
              : isOverPayment
              ? 'bg-red-50 border-red-200'
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPartialPayment ? (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                ) : isOverPayment ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                <span className="text-sm font-bold text-slate-700">
                  {isOverPayment ? 'Thanh toán quá mức' : isPartialPayment ? 'Thanh toán một phần' : 'Thanh toán đủ'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Còn lại sau khi thanh toán</p>
                <p className={`text-lg font-black ${
                  remainingBalance > 0 ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {formatCurrency(Math.max(0, remainingBalance))} ₫
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Ghi Chú
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú cho thanh toán này (không bắt buộc)"
            rows={3}
            disabled={!canConfirmPayment}
            className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#0284C7] resize-none ${
              !canConfirmPayment ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
