/**
 * Auth Provider Component
 *
 * Initializes Supabase auth listeners for client-side error handling.
 * Wrap your app or specific routes with this provider to enable automatic
 * redirect to login when auth errors occur.
 *
 * Usage in root layout:
 *   import { AuthProvider } from '@/components/providers/AuthProvider'
 *
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html>
 *         <body>
 *           <AuthProvider>{children}</AuthProvider>
 *         </body>
 *       </html>
 *     )
 *   }
 */

'use client';

import { useEffect, type ReactNode } from 'react';
import { setupAuthListeners } from '@/lib/supabase/client-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Setup auth listeners on mount
    const cleanup = setupAuthListeners();

    // Cleanup on unmount
    return () => {
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
