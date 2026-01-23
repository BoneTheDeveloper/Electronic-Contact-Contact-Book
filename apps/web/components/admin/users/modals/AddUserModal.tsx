'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Edit3 } from 'lucide-react'
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
  gender: 'male' | 'female' | 'other'
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

// Role configuration matching wireframe
const roleConfig = {
  student: { prefix: 'HS', name: 'Học sinh', counter: 1248, color: 'blue', icon: 'student' },
  teacher: { prefix: 'GV', name: 'Giáo viên', counter: 85, color: 'purple', icon: 'teacher' },
  parent: { prefix: 'PH', name: 'Phụ huynh', counter: 2186, color: 'teal', icon: 'parent' },
} as const

// Generate user code based on role
const generateUserCode = (role: UserRole): string => {
  const year = new Date().getFullYear()
  const config = roleConfig[role]
  const seq = String(config.counter + 1).padStart(4, '0')
  return `${config.prefix}${year}${seq}`
}

// Icons as SVG components matching wireframe
const StudentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
  </svg>
)

const TeacherIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const ParentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

export function AddUserModal({ isOpen, onClose, onSuccess, initialRole = 'student' }: AddUserModalProps) {
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const generatedCode = generateUserCode(activeRole)

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
    setError('')
    onClose()
  }

  const generateStrongPassword = (): string => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const all = uppercase + lowercase + numbers

    let password = ''
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]

    for (let i = password.length; i < 10; i++) {
      password += all[Math.floor(Math.random() * all.length)]
    }

    return password.split('').sort(() => Math.random() - 0.5).join('')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
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

      console.log('[AddUserModal] Creating user:', payload)

      await new Promise(resolve => setTimeout(resolve, 1000))

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

  const gradeOptions = ['6', '7', '8', '9'].map((g: any) => ({ value: g, label: `Khối ${g}` }))
  const classOptions = ['6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B'].map((c: any) => ({ value: c, label: `Lớp ${c}` }))
  const subjectOptions = ['Toán', 'Ngữ văn', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Sinh học', 'Lịch sử', 'Địa lý', 'GDCD', 'Tin học', 'Thể dục', 'Nghệ thuật', 'Công nghệ'].map((s: any) => ({ value: s, label: s }))

  // Role radio cards config with shadow colors
  const roleCards: { key: UserRole; label: string; icon: React.ReactNode; shadowClass: string; bgClass: string; borderClass: string }[] = [
    {
      key: 'student',
      label: 'Học sinh',
      icon: <StudentIcon />,
      shadowClass: 'shadow-blue-200',
      bgClass: 'bg-blue-100 text-blue-600',
      borderClass: 'peer-checked:border-blue-500 peer-checked:shadow-lg peer-checked:shadow-blue-200 peer-checked:bg-blue-50',
    },
    {
      key: 'teacher',
      label: 'Giáo viên',
      icon: <TeacherIcon />,
      shadowClass: 'shadow-purple-200',
      bgClass: 'bg-purple-100 text-purple-600',
      borderClass: 'peer-checked:border-purple-500 peer-checked:shadow-lg peer-checked:shadow-purple-200 peer-checked:bg-purple-50',
    },
    {
      key: 'parent',
      label: 'Phụ huynh',
      icon: <ParentIcon />,
      shadowClass: 'shadow-teal-200',
      bgClass: 'bg-teal-100 text-teal-600',
      borderClass: 'peer-checked:border-teal-500 peer-checked:shadow-lg peer-checked:shadow-teal-200 peer-checked:bg-teal-50',
    },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Slide-in Modal */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto animate-slide-in">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
          <div>
            <h3 className="text-xl font-black text-slate-800">Thêm người dùng mới</h3>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
              Nhập thông tin tài khoản
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-8 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-1 bg-blue-500 rounded-full"></div>
            <div className="flex-1 h-1 bg-slate-200 rounded-full" id="stepIndicator2"></div>
            <div className="flex-1 h-1 bg-slate-200 rounded-full" id="stepIndicator3"></div>
          </div>

          {/* Role Selection (Step 1) */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wider">
              Bước 1: Chọn vai trò
            </label>
            <div className="grid grid-cols-3 gap-3">
              {roleCards.map((card) => (
                <label key={card.key} className="cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={card.key}
                    checked={activeRole === card.key}
                    onChange={(e) => setActiveRole(e.target.value as UserRole)}
                    className="sr-only peer"
                  />
                  <div className={cn(
                    'p-4 border-2 border-slate-200 rounded-xl text-center transition-all hover:border-slate-300',
                    card.borderClass
                  )}>
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2',
                      card.bgClass
                    )}>
                      {card.icon}
                    </div>
                    <p className="text-xs font-bold text-slate-700">{card.label}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Auto-generated Code Display */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                  Mã định danh (Tự sinh)
                </p>
                <p className="text-sm font-bold text-slate-700">{generatedCode}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Edit3 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Quy tắc: [Tiền tố vai trò] + [Năm hiện tại] + [Số thứ tự tự tăng]
            </p>
          </div>

          {/* Student Form */}
          {activeRole === 'student' && (
            <div className="space-y-6 border-t border-slate-200 pt-6">
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">
                Thông tin học sinh
              </h4>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...studentForm.register('name', { required: 'Vui lòng nhập họ tên' })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...studentForm.register('dob', { required: 'Vui lòng nhập ngày sinh' })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">Giới tính</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      {...studentForm.register('gender')}
                      value="male"
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-700">Nam</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      {...studentForm.register('gender')}
                      value="female"
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-700">Nữ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      {...studentForm.register('gender')}
                      value="other"
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-700">Khác</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    Khối <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...studentForm.register('grade', { required: 'Vui lòng chọn khối' })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none"
                  >
                    <option value="">Chọn khối</option>
                    {gradeOptions.map((opt: any) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    Lớp <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...studentForm.register('classId', { required: 'Vui lòng chọn lớp' })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none"
                  >
                    <option value="">Chọn lớp</option>
                    {classOptions.map((opt: any) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">Ngày nhập học</label>
                <input
                  type="date"
                  {...studentForm.register('enrollmentDate')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>
          )}

          {/* Teacher Form */}
          {activeRole === 'teacher' && (
            <div className="space-y-6 border-t border-slate-200 pt-6">
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">
                Thông tin giáo viên
              </h4>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...teacherForm.register('name', { required: 'Vui lòng nhập họ tên' })}
                    placeholder="Nguyễn Thị B"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...teacherForm.register('phone', { required: 'Vui lòng nhập SĐT' })}
                    placeholder="09xxxxxxxxx"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Dùng để nhận OTP và liên lạc</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">
                  Email công vụ <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...teacherForm.register('email', { required: 'Vui lòng nhập email' })}
                  placeholder="nguyenthib@school.edu.vn"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">
                  Bộ môn giảng dạy chính <span className="text-red-500">*</span>
                </label>
                <select
                  {...teacherForm.register('subject', { required: 'Vui lòng chọn bộ môn' })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="">Chọn bộ môn</option>
                  {subjectOptions.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Parent Form */}
          {activeRole === 'parent' && (
            <div className="space-y-6 border-t border-slate-200 pt-6">
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">
                Thông tin phụ huynh
              </h4>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...parentForm.register('name', { required: 'Vui lòng nhập họ tên' })}
                    placeholder="Nguyễn Văn C"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...parentForm.register('phone', { required: 'Vui lòng nhập SĐT' })}
                    placeholder="09xxxxxxxxx"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">⚠️ SĐT là tên đăng nhập chính</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  {...parentForm.register('email')}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Nhận biên lai học phí điện tử</p>
              </div>
            </div>
          )}

          {/* Account Settings */}
          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wider">
              Cài đặt tài khoản
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-slate-800">Gửi mật khẩu qua SMS/Email</p>
                  <p className="text-xs text-slate-400">Tự động gửi thông tin đăng nhập</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...(activeRole === 'student' ? studentForm.register('sendPassword') : activeRole === 'teacher' ? teacherForm.register('sendPassword') : parentForm.register('sendPassword'))}
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0284C7]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-slate-800">Yêu cầu đổi mật khẩu lần đầu</p>
                  <p className="text-xs text-slate-400">Bắt buộc đổi mật khẩu khi đăng nhập</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...(activeRole === 'student' ? studentForm.register('forcePasswordChange') : activeRole === 'teacher' ? teacherForm.register('forcePasswordChange') : parentForm.register('forcePasswordChange'))}
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0284C7]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#0284C7] text-white rounded-xl font-bold text-sm hover:bg-[#0369a1] disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Đang lưu...' : 'Lưu người dùng'}
            </button>
          </div>
        </form>
      </div>

      {/* Add slide-in animation to global styles */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
