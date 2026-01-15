import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export interface StatItem {
  label: string
  value: string | number
  change: string
  icon: LucideIcon
  color: string
}

export function StatsGrid({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isPositive = stat.change.startsWith('+')
        const isNeutral = !stat.change.startsWith('+') && !stat.change.startsWith('-')

        return (
          <Card key={stat.label} className="rounded-3xl border-slate-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span
                  className={`text-xs font-bold ${
                    isPositive ? 'text-green-500' : isNeutral ? 'text-slate-400' : 'text-red-500'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <h4 className="text-2xl font-black text-slate-800">{stat.value}</h4>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
