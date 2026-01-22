import Link from 'next/link'
import type { Class } from '@/lib/types'
import { Users, MapPin, GraduationCap } from 'lucide-react'

interface ClassCardProps {
  class: Class
}

export function ClassCard({ class: classData }: ClassCardProps) {
  return (
    <Link
      href={`/admin/classes/${classData.id}`}
      className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer block"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
          <GraduationCap className="h-6 w-6" />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Khối {classData.grade}
        </span>
      </div>

      <h3 className="text-xl font-black text-slate-800 mb-2">{classData.name}</h3>
      <p className="text-sm text-slate-500 mb-4">{classData.teacher}</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users className="h-4 w-4 text-slate-400" />
          <span className="font-medium">{classData.studentCount}</span>
          <span className="text-slate-400">học sinh</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span className="font-medium">{classData.room}</span>
        </div>
      </div>
    </Link>
  )
}
