/**
 * Empty State Component
 * Displayed when no data is available
 */

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      {Icon && (
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="h-10 w-10 text-gray-400" />
        </div>
      )}
      <h3 className="text-gray-800 font-extrabold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm text-center mb-6">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-[#0284C7] text-white px-6 py-3 rounded-xl font-extrabold text-sm hover:bg-[#0369A1] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
