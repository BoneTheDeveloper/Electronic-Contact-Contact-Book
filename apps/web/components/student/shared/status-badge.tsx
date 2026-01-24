/**
 * Status Badge Component
 * Badge for payment, attendance, request status
 */

import { cn } from '@/lib/utils';
import { STATUS_COLORS } from './constants';

type StatusType = keyof typeof STATUS_COLORS | 'approved' | 'rejected';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const sizeStyles = {
  sm: 'text-[8px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
} as const;

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const styles = STATUS_COLORS[status];

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-black uppercase',
      styles.bg,
      styles.text,
      sizeStyles[size]
    )}>
      {styles.label}
    </span>
  );
}
