'use client'

/**
 * Login Page
 *
 * REAL authentication using Supabase Auth
 *
 * Login identifiers:
 * - Admin: admin_code (AD001) or email
 * - Teacher: employee_code (TC001) or email
 * - Student: student_code (ST2024001) or email
 * - Parent: phone number or email
 */

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AuthBrandingPanel } from '@/components/auth-branding-panel'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [role, setRole] = useState<'teacher' | 'admin'>('teacher')
  const [showPassword, setShowPassword] = useState(false)

  // Get placeholder and label based on role
  const getLoginConfig = () => {
    if (role === 'teacher') {
      return {
        label: 'Mã giáo viên',
        placeholder: 'TC001'
      }
    }
    return {
      label: 'Mã quản trị viên',
      placeholder: 'AD001'
    }
  }

  const loginConfig = getLoginConfig()

  return (
    <>
      {/* Left Branding Panel */}
      <AuthBrandingPanel />

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-800 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
              Đăng nhập
            </h2>
            <p className="text-gray-500 font-medium">
              Vui lòng đăng nhập vào cổng thông tin của bạn.
            </p>
          </div>

          {/* Role Toggle */}
          <div className="bg-gray-100 p-1.5 rounded-2xl flex mb-8">
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'teacher'
                  ? 'bg-[#0284C7] text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Giáo viên
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'admin'
                  ? 'bg-[#0284C7] text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Quản trị viên
            </button>
          </div>

          {/* Login Form */}
          <form action={login} className="space-y-6">
            {/* Hidden role field - sent to backend */}
            <input type="hidden" name="role" value={role} />

            {/* Code/Email Input */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                {loginConfig.label}
              </label>
              <div className="relative">
                {/* User icon */}
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder={loginConfig.placeholder}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-semibold text-gray-900 placeholder-gray-400"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-1">
                Hoặc email đăng ký
              </p>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  className="text-xs font-bold text-[#0284C7] hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                {/* Lock icon */}
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-semibold text-gray-900 placeholder-gray-400"
                />
                {/* Show/Hide password toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    // Eye slash icon (hide)
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    // Eye icon (show)
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-5 bg-[#0284C7] hover:bg-[#0369a1] text-white font-black text-lg rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              ĐĂNG NHẬP HỆ THỐNG
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>

          {/* Demo Accounts Info */}
          <div className="mt-8 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm font-semibold text-blue-800">
              Test Accounts
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Password: <code>Test123456!</code>
            </p>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-gray-600">
                • <strong>Teacher:</strong> TC001 or teacher@school.edu
              </p>
              <p className="text-xs text-gray-600">
                • <strong>Admin:</strong> AD001 or admin@school.edu
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center text-gray-400">
            <p className="text-xs font-bold uppercase tracking-widest">
              ECONTACT v1.0.2
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-sky-500 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
