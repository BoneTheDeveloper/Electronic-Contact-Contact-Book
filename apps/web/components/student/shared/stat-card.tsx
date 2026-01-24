/**
 * Stat Card Component
 * Summary card with icon, label and value
 */

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
  trend?: number;
  description?: string;
}

const colorStyles = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', iconBg: 'bg-blue-500' },
  green: { bg: 'bg-emerald-100', text: 'text-emerald-600', iconBg: 'bg-emerald-500' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', iconBg: 'bg-purple-500' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', iconBg: 'bg-orange-500' },
  red: { bg: 'bg-red-100', text: 'text-red-600', iconBg: 'bg-red-500' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', iconBg: 'bg-indigo-500' },
} as const;

export function StatCard({ label, value, icon: Icon, color, trend, description }: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', styles.bg)}>
          <Icon className={cn('h-4 w-4', styles.text)} />
        </div>
        <p className="text-gray-500 text-[9px] font-black uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-gray-800 text-2xl font-extrabold">{value}</p>
      {description && (
        <p className="text-gray-400 text-[9px] font-medium mt-0.5">{description}</p>
      )}
      {trend !== undefined && (
        <p className={cn(
          'text-[10px] font-medium mt-1',
          trend >= 0 ? 'text-emerald-600' : 'text-red-600'
        )}>
          {trend >= 0 ? '+' : ''}{trend}%
        </p>
      )}
    </div>
  );
}
