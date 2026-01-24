'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import type { AttendanceStats } from '@/lib/types'
import { useState, useLayoutEffect } from 'react'

interface AttendanceChartProps {
  initialData: AttendanceStats
}

export function AttendanceChart({ initialData }: AttendanceChartProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'semester'>('week')
  const [data, setData] = useState(initialData)

  useLayoutEffect(() => {
    // Simulate data fetch on period change
    const mockData: Record<typeof period, AttendanceStats> = {
      week: { excused: 8, unexcused: 4, tardy: 28 },
      month: { excused: 35, unexcused: 18, tardy: 118 },
      semester: { excused: 398, unexcused: 223, tardy: 845 },
    }
    setData(mockData[period])
  }, [period])

  return (
    <Card className="rounded-3xl border-slate-100">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-black text-slate-800 tracking-tight">
              Thống kê Chuyên cần
            </CardTitle>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Thống kê vắng mặt & đi trễ
            </p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            className="bg-slate-50 border border-slate-100 text-[11px] font-bold rounded-xl px-4 py-2 outline-none cursor-pointer"
          >
            <option value="week">1 Tuần</option>
            <option value="month">1 Tháng</option>
            <option value="semester">Cả kỳ</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {/* Excused Absent */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-4 border border-amber-200 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center mb-2 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <p className="text-2xl font-black text-amber-600 mb-1">{data.excused}</p>
            <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest">
              Vắng CP
            </p>
          </div>

          {/* Unexcused Absent */}
          <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-2xl p-4 border border-rose-200 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center mb-2 shadow-sm">
              <XCircle className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <p className="text-2xl font-black text-rose-600 mb-1">{data.unexcused}</p>
            <p className="text-[9px] font-black text-rose-700 uppercase tracking-widest">
              Vắng KP
            </p>
          </div>

          {/* Tardy */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mb-2 shadow-sm">
              <Clock className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <p className="text-2xl font-black text-blue-600 mb-1">{data.tardy}</p>
            <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest">
              Đi trễ
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
