/**
 * Page Header Component
 * Gradient header with title and optional back button
 */

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, backUrl, actions }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-[#0284C7] to-[#0369A1] pt-16 pb-6 px-6 rounded-b-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {backUrl && (
            <Link
              href={backUrl}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
          )}
          <div>
            <h1 className="text-xl font-extrabold text-white">{title}</h1>
            {subtitle && (
              <p className="text-blue-100 text-xs font-medium mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}
