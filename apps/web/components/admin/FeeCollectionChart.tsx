'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock } from 'lucide-react'
import type { FeeStats } from '@/lib/types'
import { useState, useLayoutEffect } from 'react'

interface FeeCollectionChartProps {
  initialData: FeeStats
}

export function FeeCollectionChart({ initialData }: FeeCollectionChartProps) {
  const [semester, setSemester] = useState<'1' | '2'>('1')
  const [data, setData] = useState(initialData)

  useLayoutEffect(() => {
    const mockData: Record<typeof semester, FeeStats> = {
      '1': {
        percentage: 84,
        paidAmount: '2.14 tỷ',
        remainingAmount: '980 triệu',
        totalAmount: '3.12 tỷ',
        paidStudents: 856,
        totalStudents: 1248,
      },
      '2': {
        percentage: 76,
        paidAmount: '1.91 tỷ',
        remainingAmount: '1.21 tỷ',
        totalAmount: '3.12 tỷ',
        paidStudents: 765,
        totalStudents: 1248,
      },
    }
    setData(mockData[semester])
  }, [semester])

  const circumference = 2 * Math.PI * 15.9155
  const strokeDasharray = `${data.percentage}, 100`

  return (
    <Card className="rounded-3xl border-slate-100">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-black text-slate-800 tracking-tight">
              Thu Học phí & Khoản thu
            </CardTitle>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Tiến độ hoàn thành kế hoạch thu
            </p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSemester('1')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                semester === '1'
                  ? 'bg-white shadow-sm text-slate-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Kỳ I
            </button>
            <button
              onClick={() => setSemester('2')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                semester === '2'
                  ? 'bg-white shadow-sm text-slate-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Kỳ II
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
          {/* Circular Progress */}
          <div className="relative w-44 h-44 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="3.5"
                strokeDasharray="100, 100"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3.5"
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-800">{data.percentage}%</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Đã thu
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 w-full space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Thực thu
                </p>
                <p className="text-lg font-black text-green-600">{data.paidAmount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Công nợ
                </p>
                <p className="text-lg font-black text-orange-600">{data.remainingAmount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Clock className="h-5 w-5" strokeWidth={2.5} />
              </div>
            </div>
            <div className="pt-2 px-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2">
                <span>
                  Chỉ tiêu: {data.totalAmount} ({data.paidStudents}/{data.totalStudents} HS)
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-1000"
                  style={{ width: `${data.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
