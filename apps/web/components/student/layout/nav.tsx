/**
 * Student Bottom Navigation (Mobile)
 * 3-item bottom nav for mobile screens
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/student/dashboard', label: 'Trang chủ', icon: Home },
  { href: '/student/feedback', label: 'Tin nhắn', icon: MessageSquare },
  { href: '/student/profile', label: 'Cá nhân', icon: User },
] as const;

export function StudentNav() {
  const pathname = usePathname();

  return (
    <div className="flex justify-around items-center px-4 py-3">
      {navItems.map((item) => {
        const isActive = pathname?.startsWith(item.href) || pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 transition-colors',
              isActive ? 'text-[#0284C7]' : 'text-gray-400'
            )}
          >
            <Icon className={cn('h-6 w-6', isActive ? 'text-[#0284C7]' : 'text-gray-400')} />
            <span className="text-[9px] font-black uppercase">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
