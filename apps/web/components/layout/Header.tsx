'use client'

import { Bell, Search, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import type { User as UserType } from '@school-management/shared-types'

interface HeaderProps {
  title?: string
  subtitle?: string
  user?: UserType | null
  showYearSlider?: boolean
}

const years = [
  '2025-2026',
  '2024-2025',
  '2023-2024',
  '2022-2023',
  '2021-2022',
  '2020-2021',
  '2019-2020',
]

export function Header({ title, subtitle, user: initialUser, showYearSlider = false }: HeaderProps) {
  const [user] = useState(initialUser)
  const [selectedYear, setSelectedYear] = useState('2025-2026')
  const [sliderScroll, setSliderScroll] = useState(0)

  const handleLogout = () => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/auth/logout'
    document.body.appendChild(form)
    form.submit()
  }

  const slideYear = (direction: number) => {
    const slider = document.getElementById('yearSlider')
    if (slider) {
      const scrollAmount = 150
      if (direction === 1) {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      } else {
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      }
    }
  }

  const selectYear = (year: string) => {
    setSelectedYear(year)
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-extrabold text-slate-800">{title || 'Bảng điều khiển'}</h2>

        {/* Year Slider - shown on admin dashboard */}
        {showYearSlider && (
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 md:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

            {/* Slider Button Left */}
            <button
              onClick={() => slideYear(-1)}
              className="slider-btn flex h-6 w-6 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Year Items Slider */}
            <div
              id="yearSlider"
              className="year-slider flex max-w-[400px] gap-2 flex-row-reverse overflow-x-auto scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => selectYear(year)}
                  className={cn(
                    'year-item whitespace-nowrap rounded-xl px-3 py-1 text-[11px] font-bold transition-all',
                    selectedYear === year
                      ? 'bg-gradient-to-br from-[#0284C7] to-[#0369a1] text-white shadow-lg shadow-blue-200'
                      : 'text-slate-600 hover:-translate-y-0.5'
                  )}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Slider Button Right */}
            <button
              onClick={() => slideYear(1)}
              className="slider-btn flex h-6 w-6 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm học sinh, giáo viên..."
            className="w-64 rounded-xl border-none bg-slate-50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Notifications */}
        <div className="flex items-center gap-3">
          <button className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
          </button>
          <button className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .year-slider::-webkit-scrollbar {
          display: none;
        }
        .year-slider {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </header>
  )
}
