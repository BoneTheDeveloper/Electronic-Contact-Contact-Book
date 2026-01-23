import { getUsers } from '@/lib/supabase/queries'
import { UsersManagementServer } from '@/components/admin/users/UsersManagementServer'
import { Plus, Upload } from 'lucide-react'
import { AddUserModal, ImportExcelModal } from '@/components/admin/users/modals'
import { UsersPageClient } from './UsersPageClient'

// Server Component - fetch data server-side with caching
export default async function UsersPage() {
  // Fetch users server-side
  const users = await getUsers()

  return (
    <UsersPageClient initialUsers={users} />
  )
}
