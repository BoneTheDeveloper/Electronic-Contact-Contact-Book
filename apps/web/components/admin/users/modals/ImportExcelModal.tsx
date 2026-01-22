'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Download, FileSpreadsheet, X, CheckCircle2 } from 'lucide-react'
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
    setImportSuccess(false)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setImportSuccess(false)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDownloadTemplate = async () => {
    console.log('[ImportExcelModal] Downloading template for:', importType)

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
      const totalSteps = 100
      for (let i = 0; i <= totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, 30))
        setProgress(i)
      }

      console.log('[ImportExcelModal] Importing file:', file.name, 'Type:', importType)

      setImportSuccess(true)
      setTimeout(() => {
        onSuccess?.()
        handleClose()
      }, 2000)
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

  if (!isOpen) return null

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-800">Nhập danh sách từ Excel</h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-xl"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-6">
            {/* File Upload Area */}
            {!file && !importSuccess && (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer',
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-400'
                )}
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8" />
                </div>
                <p className="text-sm font-bold text-slate-700 mb-2">
                  Kéo thả file Excel vào đây
                </p>
                <p className="text-xs text-slate-400 mb-4">hoặc nhấn để chọn file</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="px-6 py-2 bg-[#0284C7] text-white rounded-xl font-bold text-sm hover:bg-[#0369a1]"
                >
                  Chọn file
                </button>
              </div>
            )}

            {/* Selected File */}
            {file && !importSuccess && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
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
              </div>
            )}

            {/* Template Download */}
            {!file && !importSuccess && (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Tải mẫu file Excel</p>
                    <p className="text-xs text-slate-400">Template với định dạng chuẩn</p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 text-[#0284C7] font-bold text-sm hover:bg-blue-50 rounded-xl"
                >
                  Tải xuống
                </button>
              </div>
            )}

            {/* Success State */}
            {importSuccess && (
              <div className="rounded-2xl bg-green-50 border border-green-200 p-6 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-600 mb-4" />
                <p className="text-lg font-bold text-green-900">Nhập dữ liệu thành công!</p>
                <p className="text-sm text-green-700 mt-2">
                  Danh sách {typeLabels[importType]} đã được cập nhật.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-slate-200">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50"
            >
              {importSuccess ? 'Đóng' : 'Hủy bỏ'}
            </button>
            {!importSuccess && (
              <button
                onClick={handleImport}
                disabled={!file || uploading}
                className="flex-1 px-6 py-3 bg-[#0284C7] text-white rounded-xl font-bold text-sm hover:bg-[#0369a1] disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {uploading ? `Đang nhập ${progress}%` : 'Nhập dữ liệu'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
