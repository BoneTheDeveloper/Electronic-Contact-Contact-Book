import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { requireAuth } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar role="admin" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} showYearSlider={true} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
