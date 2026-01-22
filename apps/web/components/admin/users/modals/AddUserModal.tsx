'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BaseModal } from '@/components/admin/shared/modals/BaseModal'
import { PrimaryButton, SecondaryButton } from '@/components/admin/shared'
import { cn } from '@/lib/utils'
import { validatePassword } from '@/lib/security-utils'

type UserRole = 'student' | 'teacher' | 'parent'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialRole?: UserRole
}

interface StudentFormData {
  name: string
  dob: string
  gender: 'male' | 'female'
  grade: string
  classId: string
  enrollmentDate: string
  sendPassword: boolean
  forcePasswordChange: boolean
}

interface TeacherFormData {
  name: string
  phone: string
  email: string
  subject: string
  sendPassword: boolean
  forcePasswordChange: boolean
}

interface ParentFormData {
  name: string
  phone: string
  email: string
  sendPassword: boolean
  forcePasswordChange: boolean
}

// Generate user code based on role and sequence
const generateUserCode = (role: UserRole, sequence: number): string => {
  const year = new Date().getFullYear()
  const prefix = role === 'student' ? 'HS' : role === 'teacher' ? 'GV' : 'PH'
  const seq = String(sequence).padStart(4, '0')
  return `${prefix}${year}${seq}`
}

export function AddUserModal({ isOpen, onClose, onSuccess, initialRole = 'student' }: AddUserModalProps) {
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole)
  const [sequence, setSequence] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const generatedCode = generateUserCode(activeRole, sequence)

  // Student form
  const studentForm = useForm<StudentFormData>({
    defaultValues: {
      name: '',
      dob: '',
      gender: 'male',
      grade: '6',
      classId: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      sendPassword: true,
      forcePasswordChange: true,
    },
  })

  // Teacher form
  const teacherForm = useForm<TeacherFormData>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      subject: '',
      sendPassword: true,
      forcePasswordChange: true,
    },
  })

  // Parent form
  const parentForm = useForm<ParentFormData>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      sendPassword: true,
      forcePasswordChange: true,
    },
  })

  const handleClose = () => {
    studentForm.reset()
    teacherForm.reset()
    parentForm.reset()
    setSequence(1)
    setError('')
    onClose()
  }

  const generateStrongPassword = (): string => {
    // Generate a strong password that meets validation requirements
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const all = uppercase + lowercase + numbers

    let password = ''
    // Ensure at least one of each required type
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]

    // Fill remaining with random characters (min 8 total)
    for (let i = password.length; i < 10; i++) {
      password += all[Math.floor(Math.random() * all.length)]
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      // Validate form based on role
      let formValid = false
      let formData: any = {}

      if (activeRole === 'student') {
        const result = studentForm.trigger()
        if (!await result) {
          setError('Vui lòng điền đầy đủ thông tin bắt buộc')
          setLoading(false)
          return
        }
        formData = studentForm.getValues()
        formValid = true
      } else if (activeRole === 'teacher') {
        const result = teacherForm.trigger()
        if (!await result) {
          setError('Vui lòng điền đầy đủ thông tin bắt buộc')
          setLoading(false)
          return
        }
        formData = teacherForm.getValues()
        formValid = true
      } else {
        const result = parentForm.trigger()
        if (!await result) {
          setError('Vui lòng điền đầy đủ thông tin bắt buộc')
          setLoading(false)
          return
        }
        formData = parentForm.getValues()
        formValid = true
      }

      if (!formValid) {
        setError('Dữ liệu không hợp lệ')
        setLoading(false)
        return
      }

      // Generate and validate password
      const generatedPassword = generateStrongPassword()
      const passwordValidation = validatePassword(generatedPassword)

      if (!passwordValidation.isValid) {
        setError(`Lỗi mật khẩu: ${passwordValidation.error}`)
        setLoading(false)
        return
      }

      const payload = {
        role: activeRole,
        code: generatedCode,
        password: generatedPassword,
        sendPassword: true,
        forcePasswordChange: true,
        ...formData,
      }

      // TODO: API - POST /api/users
      console.log('[AddUserModal] Creating user:', payload)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock success
      onSuccess?.()
      handleClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tạo người dùng'
      setError(errorMessage)
      console.error('[AddUserModal] Failed to create user:', error)
    } finally {
      setLoading(false)
    }
  }

  const roleTabs: { key: UserRole; label: string; icon: string }[] = [
    { key: 'student', label: 'Học sinh', icon: '👦' },
    { key: 'teacher', label: 'Giáo viên', icon: '👨‍🏫' },
    { key: 'parent', label: 'Phụ huynh', icon: '👨‍👩‍👧' },
  ]

  const gradeOptions = ['6', '7', '8', '9'].map(g => ({ value: g, label: `Khối ${g}` }))
  const classOptions = ['6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B'].map(c => ({ value: c, label: `Lớp ${c}` }))
  const subjectOptions = ['Toán', 'Ngữ văn', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Sinh học'].map(s => ({ value: s, label: s }))

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Thêm người dùng mới"
      size="xl"
      primaryAction={{
        label: 'Thêm người dùng',
        onClick: () => {
          if (activeRole === 'student') studentForm.handleSubmit(handleSubmit)()
          else if (activeRole === 'teacher') teacherForm.handleSubmit(handleSubmit)()
          else parentForm.handleSubmit(handleSubmit)()
        },
        disabled: loading,
        loading,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Role Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          {roleTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveRole(tab.key)
                setSequence(1)
              }}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors',
                activeRole === tab.key
                  ? 'border-b-2 border-[#0284C7] text-[#0284C7]'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Auto-generated Code Display */}
        <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mã người dùng</p>
              <p className="text-lg font-bold text-[#0284C7]">{generatedCode}</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600">Số thứ tự:</label>
              <input
                type="number"
                min="1"
                value={sequence}
                onChange={e => setSequence(Number(e.target.value))}
                className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>
          </div>
        </div>

        {/* Student Form */}
        {activeRole === 'student' && (
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  {...studentForm.register('name', { required: 'Vui lòng nhập họ tên' })}
                  placeholder="Nguyễn Văn A"
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                    'border-slate-300'
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...studentForm.register('dob', { required: 'Vui lòng nhập ngày sinh' })}
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                    'border-slate-300'
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Giới tính
                </label>
                <select
                  {...studentForm.register('gender')}
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                    'border-slate-300'
                  )}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Khối <span className="text-red-500">*</span>
                </label>
                <select
                  {...studentForm.register('grade', { required: 'Vui lòng chọn khối' })}
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                    'border-slate-300'
                  )}
                >
                  {gradeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Lớp <span className="text-red-500">*</span>
                </label>
                <select
                  {...studentForm.register('classId', { required: 'Vui lòng chọn lớp' })}
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                    'border-slate-300'
                  )}
                >
                  <option value="">Chọn lớp</option>
                  {classOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ngày nhập học
                </label>
                <input
                  type="date"
                  {...studentForm.register('enrollmentDate')}
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                    'border-slate-300'
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...studentForm.register('sendPassword')}
                  className="h-4 w-4 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                />
                <span className="text-sm text-slate-700">Gửi mật khẩu qua SMS/Email</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...studentForm.register('forcePasswordChange')}
                  className="h-4 w-4 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                />
                <span className="text-sm text-slate-700">Yêu cầu đổi mật khẩu khi đăng nhập lần đầu</span>
              </label>
            </div>
          </form>
        )}

        {/* Teacher Form */}
        {activeRole === 'teacher' && (
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  {...teacherForm.register('name', { required: 'Vui lòng nhập họ tên' })}
                  placeholder="Nguyễn Văn A"
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                    'border-slate-300'
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  {...teacherForm.register('phone', { required: 'Vui lòng nhập SĐT' })}
                  placeholder="0123456789"
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                    'border-slate-300'
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...teacherForm.register('email', { required: 'Vui lòng nhập email' })}
                  placeholder="teacher@school.edu.vn"
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                    'border-slate-300'
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Chuyên môn <span className="text-red-500">*</span>
                </label>
                <select
                  {...teacherForm.register('subject', { required: 'Vui lòng chọn chuyên môn' })}
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                    'border-slate-300'
                  )}
                >
                  <option value="">Chọn môn dạy</option>
                  {subjectOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...teacherForm.register('sendPassword')}
                  className="h-4 w-4 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                />
                <span className="text-sm text-slate-700">Gửi mật khẩu qua SMS/Email</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...teacherForm.register('forcePasswordChange')}
                  className="h-4 w-4 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                />
                <span className="text-sm text-slate-700">Yêu cầu đổi mật khẩu khi đăng nhập lần đầu</span>
              </label>
            </div>
          </form>
        )}

        {/* Parent Form */}
        {activeRole === 'parent' && (
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  {...parentForm.register('name', { required: 'Vui lòng nhập họ tên' })}
                  placeholder="Nguyễn Văn A"
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                    'border-slate-300'
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Số điện thoại (Đăng nhập) <span className="text-red-500">*</span>
                </label>
                <input
                  {...parentForm.register('phone', { required: 'Vui lòng nhập SĐT' })}
                  placeholder="0123456789"
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                    'border-slate-300'
                  )}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email (Nhận hóa đơn)
                </label>
                <input
                  type="email"
                  {...parentForm.register('email')}
                  placeholder="parent@example.com"
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                    'border-slate-300'
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...parentForm.register('sendPassword')}
                  className="h-4 w-4 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                />
                <span className="text-sm text-slate-700">Gửi mật khẩu qua SMS/Email</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...parentForm.register('forcePasswordChange')}
                  className="h-4 w-4 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                />
                <span className="text-sm text-slate-700">Yêu cầu đổi mật khẩu khi đăng nhập lần đầu</span>
              </label>
            </div>
          </form>
        )}
      </div>
    </BaseModal>
  )
}
