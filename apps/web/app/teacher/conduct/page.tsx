import { getTeacherClasses } from '@/lib/supabase/queries'
import { getConductRatings } from '@/lib/supabase/queries'
import type { ConductRating } from '@/lib/types'
import { ConductClient } from './ConductClient'
import { requireAuth } from '@/lib/auth'

export default async function ConductPage() {
  const user = await requireAuth()
  const classes = await getTeacherClasses(user.id) as any[]
  const homeroomClass = classes.find((c: { isHomeroom: boolean }) => c.isHomeroom)

  const initialRatings = homeroomClass
    ? await getConductRatings(homeroomClass.id)
    : []

  if (initialRatings.length === 0) {
    return (
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Học tập & Hạnh kiểm</h1>
          <p className="text-gray-500">Bạn chưa được phân công lớp chủ nhiệm</p>
        </div>
      </div>
    )
  }

  return <ConductClient initialRatings={initialRatings} />
}
