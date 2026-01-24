/**
 * Student Portal Entry Point
 * Redirects to dashboard
 */

import { redirect } from 'next/navigation';

export default function StudentPage() {
  redirect('/student/dashboard');
}
