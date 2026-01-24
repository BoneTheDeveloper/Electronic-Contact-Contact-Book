'use client';

/**
 * Admin Error Boundary
 * Catches errors in admin routes including layout.tsx
 */

import { useEffect } from 'react';
import { AlertCircle, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="text-gray-800 font-extrabold text-xl mb-2">Có lỗi xảy ra</h1>
          <p className="text-gray-500 text-sm mb-6">
            Phiên làm việc có thể đã hết hạn. Vui lòng đăng nhập lại.
          </p>

          <div className="space-y-3">
            <Link
              href="/admin/login"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-sm rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>

            <button
              onClick={reset}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-sm rounded-xl transition-colors"
            >
              Thử lại
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="text-gray-400 text-xs font-black uppercase cursor-pointer mb-2">
                Chi tiết lỗi
              </summary>
              <pre className="bg-gray-100 p-3 rounded-xl text-[10px] text-gray-600 overflow-auto max-h-32">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
