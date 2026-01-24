/**
 * UsersManagementServer - Server Component for SSR
 * Renders initial data server-side, passes to client component for interactivity
 */

import { UsersManagement } from './UsersManagement'
import type { User } from '@/lib/types'

interface UserStats {
  total: number
  admin: number
  teachers: number
  parents: number
  students: number
}

interface UsersManagementServerProps {
  initialUsers: User[]
  refreshTrigger?: number
  onAddUser?: () => void
  onImportExcel?: () => void
}

export function UsersManagementServer({
  initialUsers,
  refreshTrigger,
  onAddUser,
  onImportExcel
}: UsersManagementServerProps) {
  // Calculate statistics server-side (faster, no client-side work)
  const stats: UserStats = {
    total: initialUsers.length,
    admin: initialUsers.filter((u: User) => u.role === 'admin').length,
    teachers: initialUsers.filter((u: User) => u.role === 'teacher').length,
    parents: initialUsers.filter((u: User) => u.role === 'parent').length,
    students: initialUsers.filter((u: User) => u.role === 'student').length,
  }

  // Get unique classes server-side
  const classOptions = initialUsers
    .map((u: User) => u.classId)
    .filter((value): value is string => Boolean(value))
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((c) => ({ value: c, label: `Lớp ${c}` }))

  return (
    <UsersManagement
      initialUsers={initialUsers}
      initialStats={stats}
      initialClassOptions={classOptions}
      refreshTrigger={refreshTrigger}
      onAddUser={onAddUser}
      onImportExcel={onImportExcel}
    />
  )
}
