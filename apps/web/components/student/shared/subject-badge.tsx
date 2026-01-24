/**
 * Subject Badge Component
 * Colored badge showing subject short name
 */

import { cn } from '@/lib/utils';
import { getSubjectInfo } from './constants';

interface SubjectBadgeProps {
  subjectName: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
} as const;

export function SubjectBadge({ subjectName, size = 'md' }: SubjectBadgeProps) {
  const info = getSubjectInfo(subjectName);

  return (
    <div className={cn(
      'rounded-xl flex items-center justify-center font-black',
      info.bg,
      info.text,
      sizeStyles[size]
    )}>
      {info.short}
    </div>
  );
}
