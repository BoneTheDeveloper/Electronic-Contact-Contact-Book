'use client'

import { useState, useRef, useCallback } from 'react'
import { BaseModal } from '@/components/admin/shared/modals/BaseModal'
import { PrimaryButton, SecondaryButton } from '@/components/admin/shared'
import { Upload, Download, FileSpreadsheet, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImportExcelModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  importType?: 'students' | 'teachers' | 'parents'
}

interface ValidationResult {
  row: number
  errors: string[]
}

export function ImportExcelModal({ isOpen, onClose, onSuccess, importType = 'students' }: ImportExcelModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [importSuccess, setImportSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const typeLabels = {
    students: 'học sinh',
    teachers: 'giáo viên',
    parents: 'phụ huynh',
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ]
    const validExtensions = ['.xlsx', '.xls']

    const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase()

    if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
      alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)')
      return
    }

    setFile(selectedFile)
    setValidationResults([])
    setImportSuccess(false)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setValidationResults([])
    setImportSuccess(false)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDownloadTemplate = async () => {
    // TODO: API - GET /api/users/import-template?type={importType}
    console.log('[ImportExcelModal] Downloading template for:', importType)

    // For now, create a simple CSV template
    const headers = importType === 'students'
      ? 'Họ và tên,Ngày sinh,Giới tính,Khối,Lớp,Ngày nhập học\n'
      : importType === 'teachers'
      ? 'Họ và tên,Số điện thoại,Email,Chuyên môn\n'
      : 'Họ và tên,Số điện thoại,Email\n'

    const blob = new Blob([headers], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `template_${importType}_${new Date().getTime()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImport = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      // Simulate file upload and processing
      const totalSteps = 100
      for (let i = 0; i <= totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, 30))
        setProgress(i)
      }

      // TODO: API - POST /api/users/import
      // Would send: FormData with file and type
      console.log('[ImportExcelModal] Importing file:', file.name, 'Type:', importType)

      // Mock validation results
      const mockValidation: ValidationResult[] = [
        // Uncomment to test error display
        // { row: 3, errors: ['Số điện thoại không hợp lệ'] },
        // { row: 7, errors: ['Ngày sinh sai định dạng', 'Khối không hợp lệ'] },
      ]

      setValidationResults(mockValidation)

      if (mockValidation.length === 0) {
        setImportSuccess(true)
        setTimeout(() => {
          onSuccess?.()
          handleClose()
        }, 2000)
      }
    } catch (error) {
      console.error('[ImportExcelModal] Import failed:', error)
      alert('Nhập dữ liệu thất bại. Vui lòng thử lại.')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    handleRemoveFile()
    onClose()
  }

  const hasErrors = validationResults.some(v => v.errors.length > 0)

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Nhập danh sách ${typeLabels[importType]} từ Excel`}
      size="lg"
      primaryAction={
        importSuccess
          ? undefined
          : {
              label: hasErrors ? 'Thử lại' : 'Nhập dữ liệu',
              onClick: hasErrors ? handleRemoveFile : handleImport,
              disabled: !file || uploading,
              loading: uploading,
            }
      }
      secondaryAction={{
        label: importSuccess ? 'Đóng' : 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-6">
        {/* Template Download */}
        {!file && !importSuccess && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-bold text-blue-900">Tải mẫu file nhập dữ liệu</p>
                  <p className="text-xs text-blue-700">Tải xuống file mẫu để điền thông tin {typeLabels[importType]}</p>
                </div>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Tải mẫu
              </button>
            </div>
          </div>
        )}

        {/* File Upload Area */}
        {!file && !importSuccess && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'relative rounded-lg border-2 border-dashed p-8 text-center transition-all cursor-pointer',
              dragActive
                ? 'border-[#0284C7] bg-blue-50'
                : 'border-slate-300 hover:border-[#0284C7] hover:bg-slate-50'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
            />
            <Upload className={cn('mx-auto h-12 w-12', dragActive ? 'text-[#0284C7]' : 'text-slate-400')} />
            <p className="mt-4 text-sm font-bold text-slate-700">
              {dragActive ? 'Thả file vào đây' : 'Kéo và thả file Excel vào đây'}
            </p>
            <p className="mt-2 text-xs text-slate-500">hoặc click để chọn file</p>
            <p className="mt-4 text-xs text-slate-400">Hỗ trợ định dạng .xlsx, .xls (tối đa 5MB)</p>
          </div>
        )}

        {/* Selected File */}
        {file && !importSuccess && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 border border-slate-200 p-4">
              <FileSpreadsheet className="h-10 w-10 text-green-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button
                onClick={handleRemoveFile}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Đang xử lý file...</span>
                  <span className="font-bold">{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-[#0284C7] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Validation Results */}
            {!uploading && validationResults.length > 0 && (
              <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <p className="text-sm font-bold text-orange-800">Phát hiện lỗi trong file</p>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {validationResults.map((result, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="font-bold text-orange-700">Dòng {result.row}:</span>
                      <span className="text-orange-600"> {result.errors.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success State */}
        {importSuccess && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <p className="text-lg font-bold text-green-900">Nhập dữ liệu thành công!</p>
            <p className="text-sm text-green-700 mt-2">Danh sách {typeLabels[importType]} đã được cập nhật.</p>
          </div>
        )}

        {/* Instructions */}
        {!file && !importSuccess && (
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Hướng dẫn:</p>
            <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
              <li>Tải file mẫu về máy</li>
              <li>Điền đầy đủ thông tin vào file mẫu</li>
              <li>Lưu file và quay lại màn hình này</li>
              <li>Kéo thả hoặc chọn file đã điền</li>
              <li>Nhấn "Nhập dữ liệu" để hoàn tất</li>
            </ol>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
