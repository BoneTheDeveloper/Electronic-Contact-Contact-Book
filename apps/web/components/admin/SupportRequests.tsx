'use client'

import { Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function SupportRequests() {
  return (
    <div className="rounded-[32px] bg-slate-800 p-8 text-white shadow-xl shadow-slate-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-white/10 p-2">
          <Lock width={20} height={20} />
        </div>
        <h4 className="text-lg font-black tracking-tight">Hỗ trợ & Phúc khảo</h4>
      </div>

      <div className="space-y-4">
        {/* Forgot Password Requests */}
        <div className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10">
          <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Quên mật khẩu (4)
          </p>
          <p className="text-sm font-bold text-white">Xác thực OTP thất bại</p>
          <p className="mt-1 text-xs text-slate-400">Cần hỗ trợ reset trực tiếp</p>
        </div>

        {/* Grade Review Requests */}
        <div className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10">
          <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Yêu cầu phúc khảo (2)
          </p>
          <p className="text-sm font-bold text-white">Chờ mở khóa đầu điểm</p>
          <p className="mt-1 text-xs text-slate-400">Môn: Toán, Tiếng Anh</p>
        </div>
      </div>

      <Link
        href="/admin/support"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-black uppercase tracking-widest text-slate-800 transition-all hover:bg-slate-100"
      >
        Xử lý yêu cầu
        <ArrowRight width={14} height={14} />
      </Link>
    </div>
  )
}
