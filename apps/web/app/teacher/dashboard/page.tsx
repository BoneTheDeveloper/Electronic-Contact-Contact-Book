import {
  Users,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  MessageSquare,
  BookOpen,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface DashboardData {
  stats: {
    teaching: number
    homeroom: string
    gradeReviewRequests: number
    leaveRequests: number
    pendingGrades: number
  }
  gradeReviews: Array<{
    id: string
    studentName: string
    className: string
    assessmentType: string
    currentScore: number
    reason?: string
  }>
  leaveRequests: Array<{
    id: string
    studentName: string
    startDate: string
    endDate: string
    reason: string
  }>
  classes: Array<{
    id: string
    name: string
    subject: string
    studentCount: number
    schedule: string
    isHomeroom: boolean
  }>
  schedule: Array<{
    period: number
    subject: string
    className: string
    time: string
    room: string
  }>
  assessments: {
    evaluated: number
    pending: number
    positive: number
    needsAttention: number
  }
}

async function fetchDashboardData(): Promise<DashboardData> {
  const res = await fetch('/api/teacher/dashboard', {
    cache: 'no-store',
  })
  const json = await res.json()
  return json.data
}

export default async function TeacherDashboard() {
  const data = await fetchDashboardData()
  const { stats, gradeReviews, leaveRequests, classes, schedule, assessments } = data

  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Bảng điều khiển Giáo viên</h1>
        <p className="text-gray-500">Học kỳ II • Tuần 24</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Lớp giảng dạy</CardTitle>
            <div className="rounded-lg bg-blue-50 p-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-gray-900">{stats.teaching}</div>
            <p className="text-xs text-gray-500">Lớp chủ nhiệm: {stats.homeroom}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Phúc khảo mới</CardTitle>
            <div className="rounded-lg bg-red-50 p-2">
              <FileText className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-black text-gray-900">{stats.gradeReviewRequests}</div>
              <Badge variant="destructive" className="text-xs">Mới</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Đơn nghỉ phép</CardTitle>
            <div className="rounded-lg bg-orange-50 p-2">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-gray-900">{stats.leaveRequests}</div>
            <p className="text-xs text-gray-500">Chờ duyệt</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Đã nhập điểm</CardTitle>
            <div className="rounded-lg bg-green-50 p-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-gray-900">92%</div>
            <p className="text-xs text-gray-500">{stats.pendingGrades} bài còn lại</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Grade Review Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-black">Yêu cầu Phúc khảo (GVBM)</CardTitle>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">
                    Các bài thi môn Toán cần chấm lại
                  </p>
                </div>
                <Link href="/teacher/assessments">
                  <Button variant="link" className="text-sky-600 text-xs font-black uppercase tracking-widest p-0 h-auto">
                    Xem tất cả
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {gradeReviews.slice(0, 3).map((request) => (
                <div
                  key={request.id}
                  className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition-all border border-transparent hover:border-blue-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-gray-400 border border-gray-200 shadow-sm">
                      {request.studentName.split(' ').slice(-1)[0].substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {request.studentName} • {request.className}
                      </p>
                      <p className="text-xs text-gray-500">
                        {request.assessmentType === 'final' ? 'Thi cuối kỳ' : 'Kiểm tra 15 phút'} • Điểm hiện tại:{' '}
                        <span className="font-bold text-red-500">{request.currentScore}</span>
                      </p>
                      {request.reason && (
                        <p className="text-xs text-gray-600 mt-1 italic">Lý do: {request.reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                      Chi tiết
                    </Button>
                    <Button size="sm">Chấm lại</Button>
                  </div>
                </div>
              ))}
              {gradeReviews.length === 0 && (
                <div className="text-center text-gray-400 py-8">Không có yêu cầu phúc khảo nào</div>
              )}
            </CardContent>
          </Card>

          {/* Regular Assessment Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-black">Đánh giá nhận xét</CardTitle>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">
                    Đánh giá học sinh theo môn
                  </p>
                </div>
                <Link href="/teacher/assessments">
                  <Button variant="link" className="text-sky-600 text-xs font-black uppercase tracking-widest p-0 h-auto">
                    Xem tất cả
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-green-600">
                      {assessments.evaluated}
                    </div>
                    <div className="text-sm text-green-700 font-bold mt-1">Đã đánh giá</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-amber-600">
                      {assessments.pending}
                    </div>
                    <div className="text-sm text-amber-700 font-bold mt-1">Chưa đánh giá</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-blue-600">
                      {assessments.positive}
                    </div>
                    <div className="text-sm text-blue-700 font-bold mt-1">Tiếp tục cố gắng</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-red-600">
                      {assessments.needsAttention}
                    </div>
                    <div className="text-sm text-red-700 font-bold mt-1">Cần lưu ý</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Leave Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-black">Đơn nghỉ phép chờ duyệt (GVCN)</CardTitle>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">
                    Lớp chủ nhiệm 10A
                  </p>
                </div>
                <Button variant="link" className="text-sky-600 text-xs font-black uppercase tracking-widest">
                  Lịch sử
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Học sinh
                      </th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Ngày nghỉ
                      </th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Lý do
                      </th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leaveRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-4 py-4 font-bold text-sm text-gray-700">{request.studentName}</td>
                        <td className="px-4 py-4 text-xs font-medium text-gray-500">
                          {new Date(request.startDate).toLocaleDateString('vi-VN')} - {new Date(request.endDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-400 italic">{request.reason}</td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Chi tiết
                            </Button>
                            <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                              Duyệt
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              Từ chối
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* My Classes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-black">Lớp đang dạy</CardTitle>
                <Link href="/teacher/grades">
                  <Button variant="link" className="text-sky-600 text-xs font-black uppercase tracking-widest p-0 h-auto">
                    Xem tất cả
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {classes.slice(0, 4).map((cls) => (
                  <Link key={cls.id} href={`/teacher/grades/${cls.id}`}>
                    <div className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-transparent hover:border-blue-200 cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900">{cls.name}</h4>
                            {cls.isHomeroom && (
                              <Badge variant="outline" className="text-xs">
                                CN
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{cls.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{cls.studentCount} HS</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{cls.schedule}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Today's Schedule */}
          <Card className="bg-gray-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-black">Lịch dạy hôm nay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {schedule.map((item, index) => (
                <div key={item.period} className="relative pl-6 border-l-2 border-blue-500/30">
                  <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-600'}`} />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Tiết {item.period}
                  </p>
                  <p className="text-sm font-bold">{item.subject} • {item.className}</p>
                  <p className="text-xs text-gray-500">{item.time} • Phòng {item.room}</p>
                </div>
              ))}
            </CardContent>
            <div className="p-6 pt-0">
              <Link href="/teacher/schedule">
                <Button variant="outline" className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20">
                  Xem toàn bộ lịch
                </Button>
              </Link>
            </div>
          </Card>

          {/* Messages Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-black">Tin nhắn mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-700 leading-snug">
                    Nhà trường: Họp hội đồng sư phạm vào 16:30 chiều nay.
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">10 phút trước</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-gray-200 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-700 leading-snug">
                    Admin: Đã cập nhật mẫu báo cáo học kỳ II mới.
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">2 giờ trước</p>
                </div>
              </div>
              <Link href="/teacher/messages" className="block">
                <Button variant="outline" className="w-full">Xem tất cả tin nhắn</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-black">Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/teacher/attendance" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Điểm danh nhanh
                </Button>
              </Link>
              <Link href="/teacher/grades" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Nhập điểm
                </Button>
              </Link>
              <Link href="/teacher/messages" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Gửi tin nhắn
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
