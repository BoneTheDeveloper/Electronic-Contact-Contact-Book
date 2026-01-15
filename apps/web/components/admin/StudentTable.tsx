import { Student } from '@/lib/mock-data'

interface StudentTableProps {
  students: Student[]
}

export function StudentTable({ students }: StudentTableProps) {
  const getFeesStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'overdue':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getFeesStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Đã đóng'
      case 'pending':
        return 'Chưa đóng'
      case 'overdue':
        return 'Quá hạn'
      default:
        return status
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50">
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Học sinh
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Lớp
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Chuyên cần
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Học phí
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-slate-50/50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {student.name
                      .split(' ')
                      .slice(-1)[0]
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <p className="text-sm font-bold text-slate-800">{student.name}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-600">{student.grade}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        student.attendance >= 95
                          ? 'bg-green-500'
                          : student.attendance >= 85
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${student.attendance}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{student.attendance}%</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getFeesStatusColor(
                    student.feesStatus
                  )}`}
                >
                  {getFeesStatusText(student.feesStatus)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
