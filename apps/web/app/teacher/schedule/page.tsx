import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { getTeacherSchedule } from '@/lib/supabase/queries'

interface ScheduleItem {
  period: number
  time: string
  className: string
  subject: string
  room: string
}

async function fetchSchedule(): Promise<ScheduleItem[]> {
  return await getTeacherSchedule('current-teacher-id').catch(() => []) as ScheduleItem[]
}

export default async function TeachingSchedulePage() {
  const schedule = await fetchSchedule() || []

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lịch giảng dạy</h1>
        <p className="text-gray-500">Xem lịch dạy theo tuần</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tuần:</span>
              <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-300">
                Tuần này
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
                Tuần tới
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-sky-600" />
            Thời khóa biểu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedule.map((item) => (
              <div
                key={item.period}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl border border-sky-100 hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-20 text-center">
                  <div className="text-3xl font-black text-sky-600">
                    {item.period}
                  </div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Tiết
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{item.time}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm font-semibold text-sky-700">
                      {item.subject}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Lớp: <span className="font-semibold">{item.className}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div className="text-sm font-bold text-gray-700 bg-white px-3 py-1.5 rounded-lg border">
                    {item.room}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
