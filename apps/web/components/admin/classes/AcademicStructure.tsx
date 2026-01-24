'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Edit, Trash2 } from 'lucide-react'
import { AddYearModal } from './modals/AddYearModal'
import { AddClassModal } from './modals/AddClassModal'
import { AddSubjectModal } from './modals/AddSubjectModal'
import { EditClassModal } from './modals/EditClassModal'
import type { MockClass } from '@/lib/mock-data'

interface ApiResponse<T> {
  success: boolean
  data: T[]
  total?: number
}

type TabId = 'years' | 'grades' | 'subjects'

interface Year {
  id: number
  name: string
  active: boolean
  semester1: string
  semester2: string
}

interface Grade {
  id: number
  name: string
  active: boolean
}

interface ClassData {
  id: number
  name: string
  grade: number
  room: string
  maxStudents: number
  currentStudents: number
  homeroomTeacher: string
}

interface SubjectCategory {
  id: number
  name: string
  color: string
  icon: string
}

interface Subject {
  id: number
  code: string
  name: string
  periodsPerWeek: number
  category: number
}

// Mock data matching wireframe
const yearsData: Year[] = [
  { id: 1, name: '2025-2026', active: true, semester1: '01/09/2025 - 15/01/2026', semester2: '16/01/2026 - 31/05/2026' },
  { id: 2, name: '2024-2025', active: false, semester1: '01/09/2024 - 15/01/2025', semester2: '16/01/2025 - 31/05/2025' },
  { id: 3, name: '2023-2024', active: false, semester1: '01/09/2023 - 15/01/2024', semester2: '16/01/2024 - 31/05/2024' },
  { id: 4, name: '2022-2023', active: false, semester1: '01/09/2022 - 15/01/2023', semester2: '16/01/2023 - 31/05/2023' },
]

const gradesData: Grade[] = [
  { id: 6, name: 'Khối 6', active: true },
  { id: 7, name: 'Khối 7', active: false },
  { id: 8, name: 'Khối 8', active: false },
  { id: 9, name: 'Khối 9', active: false }
]

const classesData: ClassData[] = [
  { id: 1, name: '6A', grade: 6, room: 'P.101', maxStudents: 40, currentStudents: 38, homeroomTeacher: 'Nguyễn Thanh E' },
  { id: 2, name: '6B', grade: 6, room: 'P.102', maxStudents: 40, currentStudents: 40, homeroomTeacher: 'Trần Thị F' },
  { id: 3, name: '6C', grade: 6, room: 'P.103', maxStudents: 40, currentStudents: 35, homeroomTeacher: 'Lê Văn G' },
  { id: 4, name: '7A', grade: 7, room: 'P.201', maxStudents: 40, currentStudents: 39, homeroomTeacher: 'Phạm Thị H' },
  { id: 5, name: '7B', grade: 7, room: 'P.202', maxStudents: 40, currentStudents: 37, homeroomTeacher: 'Nguyễn Văn I' },
]

const categoriesData: SubjectCategory[] = [
  { id: 1, name: 'Tự nhiên', color: 'blue', icon: '🔬' },
  { id: 2, name: 'Xã hội', color: 'green', icon: '📚' },
  { id: 3, name: 'Năng khiếu', color: 'purple', icon: '🎨' }
]

const subjectsData: Subject[] = [
  { id: 1, code: 'TOAN', name: 'Toán', periodsPerWeek: 5, category: 1 },
  { id: 2, code: 'VAN', name: 'Ngữ văn', periodsPerWeek: 4, category: 2 },
  { id: 3, code: 'ANH', name: 'Tiếng Anh', periodsPerWeek: 4, category: 2 },
  { id: 4, code: 'LY', name: 'Vật lý', periodsPerWeek: 3, category: 1 },
  { id: 5, code: 'HOA', name: 'Hóa học', periodsPerWeek: 3, category: 1 },
  { id: 6, code: 'SINH', name: 'Sinh học', periodsPerWeek: 2, category: 1 },
  { id: 7, code: 'SU', name: 'Lịch sử', periodsPerWeek: 2, category: 2 },
  { id: 8, code: 'DIA', name: 'Địa lý', periodsPerWeek: 2, category: 2 },
  { id: 9, code: 'GDCD', name: 'GDCD', periodsPerWeek: 2, category: 2 },
  { id: 10, code: 'TIN', name: 'Tin học', periodsPerWeek: 2, category: 1 },
  { id: 11, code: 'TD', name: 'Thể dục', periodsPerWeek: 3, category: 3 },
  { id: 12, code: 'NA', name: 'Nghệ thuật', periodsPerWeek: 2, category: 3 },
  { id: 13, code: 'CN', name: 'Công nghệ', periodsPerWeek: 2, category: 1 },
]

export function AcademicStructure() {
  const [activeTab, setActiveTab] = useState<TabId>('years')
  const [selectedGrade, setSelectedGrade] = useState<number>(6)
  const [classes, setClasses] = useState<MockClass[]>([])
  const [selectedClass, setSelectedClass] = useState<MockClass | null>(null)

  // Modal states
  const [showAddYearModal, setShowAddYearModal] = useState(false)
  const [showAddClassModal, setShowAddClassModal] = useState(false)
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false)
  const [showEditClassModal, setShowEditClassModal] = useState(false)

  // Refresh data callback
  const refreshData = async () => {
    try {
      const response = await fetch('/api/classes')
      const result: ApiResponse<MockClass> = await response.json()
      if (result.success) {
        setClasses(result.data)
      }
    } catch (error) {
      console.error('Failed to refresh classes:', error)
    }
  }

  // Fetch classes from API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/classes')
        const result: ApiResponse<MockClass> = await response.json()
        if (result.success) {
          setClasses(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch classes:', error)
      }
    }

    fetchClasses()
  }, [])

  const handleEditClass = (cls: MockClass) => {
    setSelectedClass(cls)
    setShowEditClassModal(true)
  }

  const handleToggleYear = (yearId: number) => {
    console.log('Toggle year:', yearId)
  }

  const handleDeleteSubject = (subjectId: string, subjectName: string) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa môn học "${subjectName}"?\n\n` +
      `Hành động này không thể hoàn tác.`
    )
    if (confirmed) {
      console.log('Deleting subject:', subjectId)
    }
  }

  return (
    <div className="space-y-8">
      {/* Tab Navigation - Wireframe Style */}
      <div className="rounded-[24px] border border-slate-100 bg-white p-2 shadow-sm inline-flex gap-2">
        <button
          onClick={() => setActiveTab('years')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'years'
              ? 'bg-[#0284C7] text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Năm học & Học kỳ
        </button>
        <button
          onClick={() => setActiveTab('grades')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'grades'
              ? 'bg-[#0284C7] text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Khối & Lớp học
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'subjects'
              ? 'bg-[#0284C7] text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Danh mục Môn học
        </button>
      </div>

      {/* TAB 1: Năm học & Học kỳ */}
      {activeTab === 'years' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Year List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-black text-slate-800 tracking-tight">Danh sách Năm học</h4>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Quản lý năm học & học kỳ</p>
                </div>
                <button
                  onClick={() => setShowAddYearModal(true)}
                  className="px-5 py-2.5 bg-[#0284C7] text-white rounded-xl font-bold text-sm hover:bg-[#0369a1] flex items-center gap-2 shadow-lg shadow-blue-100"
                >
                  <Plus className="h-4 w-4" strokeWidth={3} />
                  Thêm năm học
                </button>
              </div>

              <div className="space-y-4">
                {yearsData.map((year) => (
                  <div key={year.id} className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${year.active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'} rounded-xl flex items-center justify-center font-black text-lg`}>
                          {year.name.slice(2, 4)}
                        </div>
                        <div>
                          <h5 className="text-sm font-black text-slate-800">Năm học {year.name}</h5>
                          <p className="text-xs text-slate-400 mt-1">HK I: {year.semester1}</p>
                          <p className="text-xs text-slate-400">HK II: {year.semester2}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={year.active}
                            onChange={() => handleToggleYear(year.id)}
                            className="peer sr-only"
                          />
                          <div className="h-6 w-11 rounded-full bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-100 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#0284C7] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                        </label>
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Year Summary */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-[24px] p-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-black">Năm học hiện tại</h4>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1">Active Year</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-3xl font-black mb-4">2025-2026</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">Học kỳ I</p>
                  <p className="text-sm font-black">01/09 - 15/01</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">Học kỳ II</p>
                  <p className="text-sm font-black">16/01 - 31/05</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
              <h4 className="text-lg font-black text-slate-800 tracking-tight mb-4">Thống kê</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Tổng số năm học</span>
                  <span className="text-lg font-black text-slate-800">{yearsData.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Lớp đang hoạt động</span>
                  <span className="text-lg font-black text-blue-600">28</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Môn học</span>
                  <span className="text-lg font-black text-purple-600">{subjectsData.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Khối & Lớp học */}
      {activeTab === 'grades' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Grades Sidebar */}
          <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-black text-slate-800 tracking-tight">Danh sách Khối</h4>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600">
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              {gradesData.map((grade) => (
                <button
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade.id)}
                  className={`w-full p-4 rounded-xl font-bold text-sm text-left transition-all ${
                    selectedGrade === grade.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {grade.name}
                </button>
              ))}
            </div>
          </div>

          {/* Classes Grid */}
          <div className="lg:col-span-3">
            <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-slate-800 tracking-tight">Danh sách Lớp học</h4>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
                    {gradesData.find(g => g.id === selectedGrade)?.name || 'Khối 6'}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddClassModal(true)}
                  className="px-5 py-2.5 bg-[#0284C7] text-white rounded-xl font-bold text-sm hover:bg-[#0369a1] flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" strokeWidth={3} />
                  Thêm lớp
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {classesData
                .filter((c) => c.grade === selectedGrade)
                .map((cls) => {
                  const percentage = (cls.currentStudents / cls.maxStudents) * 100
                  return (
                    <div
                      key={cls.id}
                      className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                          {cls.name}
                        </div>
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <h4 className="text-lg font-black text-slate-800 mb-1">Lớp {cls.name}</h4>
                      <p className="text-xs text-slate-400 mb-4">{cls.room}</p>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs font-bold mb-2">
                          <span className="text-slate-600">Sĩ số</span>
                          <span className="text-blue-600">{cls.currentStudents}/{cls.maxStudents}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                        <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-bold text-xs">
                          GV
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">{cls.homeroomTeacher}</p>
                          <p className="text-[10px] text-slate-400">GVCN</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Danh mục Môn học */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subject Categories */}
          <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-black text-slate-800 tracking-tight">Nhóm môn học</h4>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600">
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {categoriesData.map((cat) => (
                <div
                  key={cat.id}
                  className={`p-4 bg-${cat.color}-50 border border-${cat.color}-200 rounded-xl flex items-center gap-3`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-800">{cat.name}</p>
                    <p className="text-xs text-slate-400">
                      {subjectsData.filter((s) => s.category === cat.id).length} môn
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects List */}
          <div className="lg:col-span-2">
            <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-black text-slate-800 tracking-tight">Danh sách Môn học</h4>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Cấu hình môn học & hệ số</p>
                </div>
                <button
                  onClick={() => setShowAddSubjectModal(true)}
                  className="px-5 py-2.5 bg-[#0284C7] text-white rounded-xl font-bold text-sm hover:bg-[#0369a1] flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" strokeWidth={3} />
                  Thêm môn học
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Mã môn
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Tên môn học
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Số tiết/tuần
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Nhóm
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subjectsData.map((subject) => {
                      const category = categoriesData.find((c) => c.id === subject.category)
                      return (
                        <tr key={subject.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black">
                              {subject.code}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-800">{subject.name}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-600">{subject.periodsPerWeek}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 bg-${category?.color || 'gray'}-100 text-${category?.color || 'gray'}-600 rounded-lg text-xs font-black`}
                            >
                              {category?.name || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSubject(subject.id.toString(), subject.name)}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddYearModal
        isOpen={showAddYearModal}
        onClose={() => setShowAddYearModal(false)}
        onSuccess={refreshData}
      />

      <AddClassModal
        isOpen={showAddClassModal}
        onClose={() => setShowAddClassModal(false)}
        onSuccess={refreshData}
      />

      <AddSubjectModal
        isOpen={showAddSubjectModal}
        onClose={() => setShowAddSubjectModal(false)}
        onSuccess={refreshData}
      />

      <EditClassModal
        isOpen={showEditClassModal}
        onClose={() => {
          setShowEditClassModal(false)
          setSelectedClass(null)
        }}
        classData={selectedClass}
        onSuccess={refreshData}
      />
    </div>
  )
}
