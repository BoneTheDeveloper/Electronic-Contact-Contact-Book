/**
 * Function Grid Component (Dashboard)
 * 9-icon navigation grid for student features
 */

import Link from 'next/link';
import { STUDENT_FUNCTIONS } from '../shared/constants';
import { cn } from '@/lib/utils';

interface FunctionGridProps {
  className?: string;
}

export function FunctionGrid({ className }: FunctionGridProps) {
  return (
    <div className={cn(
      // Mobile: 3 columns, Tablet/Desktop: 4 columns
      'grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6',
      'pb-32 md:pb-8', // Extra padding for mobile bottom nav
      className
    )}>
      {STUDENT_FUNCTIONS.map((item) => (
        <Link
          key={item.id}
          href={item.route}
          className="group flex flex-col items-center"
        >
          <div className={cn(
            'w-20 h-20 md:w-24 md:h-24',
            'bg-white rounded-3xl shadow-sm border border-gray-100',
            'flex items-center justify-center',
            'transition-all duration-200',
            'group-hover:scale-105 group-active:scale-95'
          )}>
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <svg
                className="w-6 h-6 md:w-7 md:h-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke={item.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Icons for each function type */}
                {item.icon === 'calendar' && (
                  <>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </>
                )}
                {item.icon === 'check-circle' && (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12l2 2 4-4" />
                  </>
                )}
                {item.icon === 'account-check' && (
                  <>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <polyline points="15 11 18 13 23 8" />
                  </>
                )}
                {item.icon === 'book' && (
                  <>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </>
                )}
                {item.icon === 'file-document' && (
                  <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </>
                )}
                {item.icon === 'message-reply' && (
                  <>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <polyline points="9 11 12 8 15 11" />
                  </>
                )}
                {item.icon === 'newspaper' && (
                  <>
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8" />
                    <path d="M15 18h-5" />
                    <path d="M10 6h8v4h-8V6z" />
                  </>
                )}
                {item.icon === 'chart-pie' && (
                  <>
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  </>
                )}
                {item.icon === 'cash' && (
                  <>
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </>
                )}
              </svg>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase text-gray-600 mt-3 text-center leading-tight tracking-wide">
            {item.label.replace(' ', '\u00A0')}
          </span>
        </Link>
      ))}
    </div>
  );
}
