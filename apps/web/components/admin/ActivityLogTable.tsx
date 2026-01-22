import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Activity } from '@/lib/types'
import { Activity as ActivityIcon } from 'lucide-react'

interface ActivityLogTableProps {
  activities: Activity[]
}

export function ActivityLogTable({ activities }: ActivityLogTableProps) {
  return (
    <Card className="rounded-3xl border-slate-100 overflow-hidden">
      <CardHeader className="px-8 pb-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <CardTitle className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ActivityIcon className="h-5 w-5" />
            Hoạt động hệ thống
          </CardTitle>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
            Audit Log - Nhật ký hoạt động
          </p>
        </div>
        <button className="text-[#0284C7] text-xs font-black uppercase tracking-widest hover:underline">
          Xem tất cả
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Người dùng
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Hành động
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Thời gian
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.map((activity) => {
                const initials = activity.user
                  .split(' ')
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()

                const bgColor =
                  activity.note.includes('Hoàn tất')
                    ? 'bg-green-100 text-green-600'
                    : activity.note.includes('Đang chờ')
                    ? 'bg-blue-100 text-[#0284C7]'
                    : 'bg-slate-100 text-slate-700'

                return (
                  <tr key={activity.id} className="hover:bg-slate-50/50">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center font-bold text-xs`}>
                          {initials}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{activity.user}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-500 tracking-tight">
                      {activity.action}
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-400">{activity.time}</td>
                    <td className="px-8 py-4">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                          activity.note.includes('Hoàn tất')
                            ? 'bg-green-100 text-green-600'
                            : activity.note.includes('Đang chờ')
                            ? 'bg-blue-100 text-[#0284C7]'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {activity.note}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
