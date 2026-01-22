'use client'

import Link from 'next/link'
import { FileText } from 'lucide-react'

export function QuickAccessCard() {
  return (
    <Link href="/admin/payments/invoice-tracker">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[32px] shadow-sm border border-purple-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-white rounded-3xl shadow-lg">
              <FileText className="w-12 h-12 text-purple-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Quản lý Hóa đơn & Theo dõi Công nợ</h3>
              <p className="text-slate-500 text-sm font-bold mt-2">Xem công nợ, xác nhận thanh toán, gửi nhắc nhở</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-bold text-slate-600">24 hóa đơn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-bold text-slate-600">8 chờ đóng</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-bold text-slate-600">16 đã hoàn thành</span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 bg-white rounded-xl shadow-sm">
            <span className="text-sm font-bold text-purple-600">Mở Quản lý</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
