'use client'

import { useState, useEffect } from 'react'
import { Calendar, Users, BookOpen, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { StatCard } from '@/components/admin/shared'
import { AddYearModal } from './modals/AddYearModal'
import { AddClassModal } from './modals/AddClassModal'
import { AddSubjectModal } from './modals/AddSubjectModal'
import { EditClassModal } from './modals/EditClassModal'
import type { Class } from '@/lib/types'

interface ApiResponse<T> {
  success: boolean
  data: T[]
  total?: number
}

type TabId = 'years' | 'classes' | 'subjects'

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  { id: 'years', label: 'Năm học', icon: <Calendar className="h-4 w-4" /> },
  { id: 'classes', label: 'Khối lớp', icon: <Users className="h-4 w-4" /> },
  { id: 'subjects', label: 'Môn học', icon: <BookOpen className="h-4 w-4" /> },
]

// Mock years data
const yearsData = [
  {
    id: '2025-2026',
    name: 'Năm học 2025-2026',
    isCurrent: true,
    semester1: '01/09/2025 - 15/01/2026',
    semester2: '16/01/2026 - 31/05/2026',
    classes: 24,
    students: 720,
  },
  {
    id: '2024-2025',
    name: 'Năm học 2024-2025',
    isCurrent: false,
    semester1: '01/09/2024 - 15/01/2025',
    semester2: '16/01/2025 - 31/05/2025',
    classes: 20,
    students: 600,
  },
]

// Mock subjects data
const subjectsData = [
  { id: '1', name: 'Toán', category: 'Khoa học tự nhiên', coefficient: 3, classes: 24 },
  { id: '2', name: 'Văn học', category: 'Khoa học xã hội', coefficient: 2, classes: 24 },
  { id: '3', name: 'Tiếng Anh', category: 'Ngoại ngữ', coefficient: 2, classes: 24 },
  { id: '4', name: 'Lý', category: 'Khoa học tự nhiên', coefficient: 2, classes: 12 },
  { id: '5', name: 'Hóa', category: 'Khoa học tự nhiên', coefficient: 2, classes: 12 },
  { id: '6', name: 'Sinh', category: 'Khoa học tự nhiên', coefficient: 2, classes: 12 },
  { id: '7', name: 'Sử', category: 'Khoa học xã hội', coefficient: 1, classes: 24 },
  { id: '8', name: 'Địa', category: 'Khoa học xã hội', coefficient: 1, classes: 24 },
  { id: '9', name: 'GDCD', category: 'Khoa học xã hội', coefficient: 1, classes: 24 },
  { id: '10', name: 'Tin học', category: 'Kỹ thuật', coefficient: 1, classes: 24 },
  { id: '11', name: 'Công nghệ', category: 'Kỹ thuật', coefficient: 1, classes: 24 },
]

export function AcademicStructure() {
  const [activeTab, setActiveTab] = useState<TabId>('years')
  const [classes, setClasses] = useState<MockClass[]>([])
  const [selectedClass, setSelectedClass] = useState<MockClass | null>(null)

  // Modal states
  const [showAddYearModal, setShowAddYearModal] = useState(false)
  const [showAddClassModal, setShowAddClassModal] = useState(false)
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false)
  const [showEditClassModal, setShowEditClassModal] = useState(false)

  // Refresh data callback
  const refreshData = async () => {
    // Re-fetch classes from API
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

  const handleDeleteSubject = (subjectId: string, subjectName: string) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa môn học "${subjectName}"?\n\n` +
      `Hành động này không thể hoàn tác.`
    )
    if (confirmed) {
      // TODO: API - DELETE /api/subjects/:id
      console.log('Deleting subject:', subjectId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-t-lg px-4 py-3 text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[rgba(2,132,199,0.1)] text-[#0284C7] border-b-2 border-[#0284C7]'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {activeTab === 'years' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Năm học & Học kỳ</h2>
              <button
                onClick={() => setShowAddYearModal(true)}
                className="flex items-center gap-2 rounded-lg bg-[#0284C7] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#0270a8]"
              >
                <Plus className="h-4 w-4" />
                Thêm Năm Học
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {yearsData.map((year) => (
                <div
                  key={year.id}
                  className={`relative overflow-hidden rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
                    year.isCurrent
                      ? 'border-[#0284C7] bg-gradient-to-br from-blue-50 to-white'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {year.isCurrent && (
                    <div className="absolute right-4 top-4 rounded-full bg-[#0284C7] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      Hiện tại
                    </div>
                  )}
                  <h3 className="text-xl font-black text-slate-800">{year.name}</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>Học kỳ I: {year.semester1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>Học kỳ II: {year.semester2}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-6 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400">Số lớp</p>
                      <p className="text-lg font-bold text-slate-800">{year.classes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Học sinh</p>
                      <p className="text-lg font-bold text-slate-800">{year.students}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Danh sách Lớp học</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddClassModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-[#0284C7] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#0270a8]"
                >
                  <Plus className="h-4 w-4" />
                  Thêm Lớp
                </button>
                {['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'].map((grade) => (
                  <button
                    key={grade}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:border-[#0284C7]"
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-800">{cls.name}</h3>
                      <p className="text-xs text-slate-400">Khối {cls.grade}</p>
                    </div>
                    <div className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Phòng {cls.room}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Giáo viên chủ nhiệm</span>
                      <span className="text-sm font-semibold text-slate-700">
                        {cls.teacher || 'Chưa phân công'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Sĩ số</span>
                      <span className="text-sm font-semibold text-slate-700">{cls.studentCount ?? 0} học sinh</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEditClass(cls)}
                      className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 hover:border-[#0284C7] hover:text-[#0284C7]"
                    >
                      <Edit className="inline h-3 w-3 mr-1" />
                      Sửa
                    </button>
                    <button className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 hover:border-[#0284C7] hover:text-[#0284C7]">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Danh mục Môn học</h2>
              <button
                onClick={() => setShowAddSubjectModal(true)}
                className="flex items-center gap-2 rounded-lg bg-[#0284C7] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#0270a8]"
              >
                <Plus className="h-4 w-4" />
                Thêm Môn Học
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard
                title="Tổng môn học"
                value={subjectsData.length}
                color="blue"
              />
              <StatCard
                title="Môn bắt buộc"
                value="8"
                color="green"
              />
              <StatCard
                title="Môn tự chọn"
                value="3"
                color="orange"
              />
            </div>

            {/* Subjects by Category */}
            <div className="space-y-4">
              {['Khoa học tự nhiên', 'Khoa học xã hội', 'Ngoại ngữ', 'Kỹ thuật'].map((category) => {
                const categorySubjects = subjectsData.filter(s => s.category === category)
                return (
                  <div key={category} className="rounded-xl border border-slate-200 bg-white p-4">
                    <h3 className="mb-3 text-sm font-black text-slate-800">{category}</h3>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {categorySubjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 transition-all hover:bg-slate-100"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800">{subject.name}</p>
                            <p className="text-xs text-slate-500">{subject.classes} lớp</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-[#0284C7] px-3 py-1 text-xs font-bold text-white">
                              Hệ số {subject.coefficient}
                            </div>
                            <button
                              onClick={() => handleDeleteSubject(subject.id, subject.name)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Xóa môn học"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

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
