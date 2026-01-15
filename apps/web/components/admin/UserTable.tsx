'use client'

import { User } from '@/lib/mock-data'
import { MoreVertical, Mail, Shield } from 'lucide-react'
import { useState } from 'react'

interface UserTableProps {
  users: User[]
}

export function UserTable({ users }: UserTableProps) {
  const [selectedRole, setSelectedRole] = useState<string>('all')

  const filteredUsers =
    selectedRole === 'all' ? users : users.filter((u) => u.role === selectedRole)

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700'
      case 'teacher':
        return 'bg-blue-100 text-blue-700'
      case 'parent':
        return 'bg-green-100 text-green-700'
      case 'student':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedRole('all')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            selectedRole === 'all'
              ? 'bg-slate-800 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setSelectedRole('admin')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            selectedRole === 'admin'
              ? 'bg-slate-800 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Admin
        </button>
        <button
          onClick={() => setSelectedRole('teacher')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            selectedRole === 'teacher'
              ? 'bg-slate-800 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Giáo viên
        </button>
        <button
          onClick={() => setSelectedRole('parent')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            selectedRole === 'parent'
              ? 'bg-slate-800 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Phụ huynh
        </button>
        <button
          onClick={() => setSelectedRole('student')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            selectedRole === 'student'
              ? 'bg-slate-800 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Học sinh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Người dùng
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Email
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Vai trò
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{user.name}</p>
                      {user.classId && (
                        <p className="text-xs text-slate-400">Lớp: {user.classId}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    <Shield className="h-3 w-3 inline mr-1" />
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
