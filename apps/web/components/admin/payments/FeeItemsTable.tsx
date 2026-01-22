'use client'

import { useState, useEffect } from 'react'
import { FileText, Trash2, Edit } from 'lucide-react'

interface FeeItem {
  id: string
  name: string
  code: string
  type: 'mandatory' | 'voluntary'
  amount: number
  semester: '1' | '2' | 'all'
  status: 'active' | 'inactive'
}

interface FeeItemsTableProps {
  semester?: string
  year?: string
  onEdit?: (item: FeeItem) => void
}

export function FeeItemsTable({ semester = 'all', year = '2025-2026', onEdit }: FeeItemsTableProps) {
  const [items, setItems] = useState<FeeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [semester, year])

  const fetchItems = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (semester !== 'all') params.append('semester', semester)

    try {
      const res = await fetch(`/api/fee-items?${params}`)
      const result = await res.json()
      setItems(result.data || [])
    } catch (error) {
      console.error('Failed to fetch fee items:', error)
      // Fallback to mock data if API fails
      setItems([
        { id: 'tuition-hk1', name: 'Học phí', code: 'HP-HK1', type: 'mandatory', amount: 2500000, semester: '1', status: 'active' },
        { id: 'insurance', name: 'Bảo hiểm y tế', code: 'BHYT-25', type: 'mandatory', amount: 854000, semester: 'all', status: 'active' },
        { id: 'uniform-hk1', name: 'Tiền đồng phục', code: 'DP-HK1', type: 'voluntary', amount: 850000, semester: '1', status: 'active' },
        { id: 'boarding-hk1', name: 'Tiền ăn bán trú', code: 'BT-HK1', type: 'voluntary', amount: 1200000, semester: '1', status: 'active' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa khoản thu này?')) return

    try {
      await fetch(`/api/fee-items/${id}`, { method: 'DELETE' })
      fetchItems()
    } catch (error) {
      console.error('Failed to delete fee item:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Đang tải...</div>
  }

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Tên khoản thu
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">
                Mã khoản thu
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-28">
                Loại
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Số tiền (VNĐ)
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Học kỳ
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Trạng thái
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#0284C7]" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{item.name}</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg font-mono">
                    {item.code}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg ${
                    item.type === 'mandatory'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {item.type === 'mandatory' ? 'Bắt buộc' : 'Tự nguyện'}
                  </span>
                </td>
                <td className="px-8 py-4 text-sm font-bold text-slate-700">
                  {formatCurrency(item.amount)} ₫
                </td>
                <td className="px-8 py-4 text-sm font-medium text-slate-500">
                  {item.semester === 'all' ? 'Cả năm' : `Học kỳ ${item.semester}`}
                </td>
                <td className="px-8 py-4">
                  <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Hoạt động
                  </span>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit?.(item)}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
