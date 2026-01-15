import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GradeDistribution } from '@/lib/mock-data'

interface GradeDistributionProps {
  data: GradeDistribution[]
}

export function GradeDistribution({ data }: GradeDistributionProps) {
  return (
    <Card className="rounded-3xl border-slate-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-black text-slate-800 tracking-tight">
          Xếp loại Học lực
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {data.map((item) => (
            <div key={item.grade} className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                <span>{item.grade}</span>
                <span className="text-slate-700">{item.percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
