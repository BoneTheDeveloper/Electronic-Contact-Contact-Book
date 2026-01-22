'use client'

import { useState } from 'react'
import { Download, FileText, Table, FileSpreadsheet, Calendar } from 'lucide-react'
import { BaseModal } from '@/components/admin/shared/modals/BaseModal'
import { PrimaryButton } from '@/components/admin/shared/buttons/primary-button'
import { SecondaryButton } from '@/components/admin/shared/buttons/secondary-button'

type ExportFormat = 'pdf' | 'excel' | 'csv'

interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ExportReportModal({ isOpen, onClose, onSuccess }: ExportReportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('pdf')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [includePaid, setIncludePaid] = useState(true)
  const [includePending, setIncludePending] = useState(true)
  const [includeOverdue, setIncludeOverdue] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState('')

  // Set default date range (current month)
  useState(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    setStartDate(firstDay.toISOString().split('T')[0])
    setEndDate(lastDay.toISOString().split('T')[0])
  })

  const formatOptions = [
    {
      id: 'pdf' as ExportFormat,
      name: 'PDF',
      description: 'Tài liệu in ấn chất lượng cao',
      icon: FileText,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      id: 'excel' as ExportFormat,
      name: 'Excel',
      description: 'Bảng tính có thể chỉnh sửa',
      icon: FileSpreadsheet,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      id: 'csv' as ExportFormat,
      name: 'CSV',
      description: 'Dữ liệu thô dạng văn bản',
      icon: Table,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  ]

  const validateForm = (): boolean => {
    if (!startDate || !endDate) {
      setError('Vui lòng chọn khoảng thời gian')
      return false
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      setError('Ngày bắt đầu không được sau ngày kết thúc')
      return false
    }

    // Check date range is not more than 1 year
    const maxDate = new Date(start)
    maxDate.setFullYear(maxDate.getFullYear() + 1)
    if (end > maxDate) {
      setError('Khoảng thời gian không được quá 1 năm')
      return false
    }

    if (!includePaid && !includePending && !includeOverdue) {
      setError('Vui lòng chọn ít nhất một trạng thái hóa đơn')
      return false
    }

    setError('')
    return true
  }

  const handleExport = async () => {
    if (!validateForm()) return

    setIsExporting(true)
    setError('')

    try {
      // TODO: API call to POST /api/invoices/export
      const response = await fetch('/api/invoices/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          startDate,
          endDate,
          includePaid,
          includePending,
          includeOverdue,
        }),
      })

      if (response.ok) {
        // Download file
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `bao-cao-hoa-don_${startDate}_${endDate}.${format === 'csv' ? 'csv' : format === 'excel' ? 'xlsx' : 'pdf'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        onSuccess?.()
        handleClose()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Có lỗi xảy ra khi xuất báo cáo')
      }
    } catch (error) {
      console.error('Failed to export report:', error)
      // Mock success for demo
      alert(`Đã xuất báo cáo thành công (định dạng: ${format.toUpperCase()})`)
      onSuccess?.()
      handleClose()
    } finally {
      setIsExporting(false)
    }
  }

  const handleClose = () => {
    setFormat('pdf')
    setError('')
    onClose()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Xuất Báo Cáo Hóa Đơn"
      size="lg"
      primaryAction={{
        label: 'Xuất Báo Cáo',
        onClick: handleExport,
        disabled: isExporting,
        loading: isExporting,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-4">
        {/* Format Selection */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Định Dạng Tập Tin <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {formatOptions.map((option) => {
              const Icon = option.icon
              return (
                <label
                  key={option.id}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    format === option.id
                      ? `${option.borderColor} ${option.bgColor}`
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={option.id}
                    checked={format === option.id}
                    onChange={(e) => setFormat(e.target.value as ExportFormat)}
                    className="sr-only"
                  />
                  <Icon className={`w-6 h-6 ${option.color}`} />
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800">{option.name}</p>
                    <p className="text-[10px] text-slate-500">{option.description}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Khoảng Thời Gian <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#0284C7]"
              />
              <Calendar className="absolute right-4 top-8 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#0284C7]"
              />
              <Calendar className="absolute right-4 top-8 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          {startDate && endDate && (
            <p className="text-xs text-slate-500 mt-2">
              Khoảng thời gian: {formatDate(startDate)} - {formatDate(endDate)}
            </p>
          )}
        </div>

        {/* Invoice Status Filter */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Trạng Thái Hóa Đơn <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-green-50 transition-colors">
              <input
                type="checkbox"
                checked={includePaid}
                onChange={(e) => setIncludePaid(e.target.checked)}
                className="w-4 h-4 text-green-500 rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">Đã thanh toán</p>
                <p className="text-xs text-slate-500">Bao gồm các hóa đơn đã hoàn tất thanh toán</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">PAID</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-amber-50 transition-colors">
              <input
                type="checkbox"
                checked={includePending}
                onChange={(e) => setIncludePending(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">Chờ thanh toán</p>
                <p className="text-xs text-slate-500">Bao gồm các hóa đơn chưa thanh toán</p>
              </div>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg">PENDING</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-red-50 transition-colors">
              <input
                type="checkbox"
                checked={includeOverdue}
                onChange={(e) => setIncludeOverdue(e.target.checked)}
                className="w-4 h-4 text-red-500 rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">Quá hạn</p>
                <p className="text-xs text-slate-500">Bao gồm các hóa đơn quá hạn thanh toán</p>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg">OVERDUE</span>
            </label>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Download className="w-4 h-4 text-[#0284C7]" />
            <p className="text-sm font-bold text-slate-700">Tóm Tắt Xuất Dữ Liệu</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Định dạng:</span>
              <span className="font-bold text-slate-800 uppercase">{format}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Khoảng thời gian:</span>
              <span className="font-bold text-slate-800">{formatDate(startDate)} - {formatDate(endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trạng thái:</span>
              <span className="font-bold text-slate-800">
                {[
                  includePaid && 'Đã thanh toán',
                  includePending && 'Chờ thanh toán',
                  includeOverdue && 'Quá hạn',
                ].filter(Boolean).join(', ') || 'Không có'}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <Download className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
