---
title: "Phase 04D: Authentication & User Management"
description: "Mock authentication system with role-based access control"
status: completed
priority: P1
effort: 3h
created: 2026-01-12
completed: 2026-01-12
---

# Phase 04D: Authentication & User Management

## Context Links
- Parent: [plan.md](./plan.md)
- Depends: [phase-02a](./phase-02a-mobile-core.md), [phase-02b](./phase-02b-web-core.md)
- Mock Data: [users.json](../phase-02c-database-mock-data.md)

## Parallelization Info
- **Can run with**: Phases 04A, 04B, 04C (different features)
- **Must complete after**: Phases 02A, 02B, 02C
- **Exclusive files**: Auth-specific files in both apps

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 |
| Status | **Completed** |
| Description | Mock login/logout with role-based routing |
| Review Status | Completed |

## Architecture

### Auth Flow
```
Login → Validate (mock) → Set user state → Redirect by role
                                                  │
                                                  ├─ ADMIN → /admin/dashboard
                                                  ├─ TEACHER → /teacher/dashboard
                                                  ├─ PARENT → /mobile/dashboard
                                                  └─ STUDENT → /mobile/dashboard
```

### Shared Files
```
packages/shared-types/src/auth.ts    # Auth types
apps/mobile/src/stores/auth.ts       # Mobile auth store
apps/web/lib/auth.ts                 # Web auth utilities
apps/web/app/(auth)/login/page.tsx   # Web login
apps/mobile/src/screens/auth/Login.tsx # Mobile login
```

## File Ownership

### Files to Create (Exclusive to 04D)
| File | Owner |
|------|-------|
| `packages/shared-types/src/auth.ts` | Phase 04D |
| `apps/mobile/src/stores/auth.ts` | Phase 04D |
| `apps/mobile/src/screens/auth/Login.tsx` | Phase 04D |
| `apps/web/lib/auth.ts` | Phase 04D |
| `apps/web/app/(auth)/login/page.tsx` | Phase 04D |
| `apps/web/middleware.ts` | Phase 04D |

## Implementation Steps

1. **Define Shared Auth Types**
   ```typescript
   // packages/shared-types/src/auth.ts
   export enum UserRole {
     ADMIN = 'ADMIN',
     TEACHER = 'TEACHER',
     STUDENT = 'STUDENT',
     PARENT = 'PARENT',
   }

   export interface User {
     id: string
     email: string
     name: string
     role: UserRole
     // Role-specific fields
     student?: StudentData
     parent?: ParentData
     teacher?: TeacherData
   }

   export interface AuthState {
     user: User | null
     isAuthenticated: boolean
     login: (email: string, password: string) => Promise<void>
     logout: () => void
   }
   ```

2. **Create Mobile Auth Store**
   ```typescript
   // apps/mobile/src/stores/auth.ts
   import { create } from 'zustand'
   import { persist, createJSONStorage } from 'zustand/middleware'
   import AsyncStorage from '@react-native-async-storage/async-storage'
   import type { User, UserRole } from '@school/shared-types'
   import mockUsers from '../../../mock-data/users.json'

   export const useAuthStore = create(
     persist(
       (set) => ({
         user: null as User | null,
         isAuthenticated: false,

         login: async (email: string, password: string) => {
           // Mock: Find user by email, accept any password
           const user = mockUsers.find(u => u.email === email)

           if (!user) {
             // For demo, create mock user if not found
             const mockUser: User = {
               id: 'demo-user',
               email,
               name: email.split('@')[0],
               role: email.includes('admin') ? 'ADMIN' :
                     email.includes('teacher') ? 'TEACHER' :
                     email.includes('parent') ? 'PARENT' : 'STUDENT',
             }
             set({ user: mockUser, isAuthenticated: true })
             return
           }

           set({ user, isAuthenticated: true })
         },

         logout: () => {
           set({ user: null, isAuthenticated: false })
         },
       }),
       {
         name: 'auth-storage',
         storage: createJSONStorage(() => AsyncStorage),
       }
     )
   )
   ```

3. **Create Web Auth Utilities**
   ```typescript
   // apps/web/lib/auth.ts
   'use server'

   import { cookies } from 'next/headers'
   import type { User } from '@school/shared-types'
   import mockUsers from '../../mock-data/users.json'

   export async function login(email: string, password: string) {
     // Mock authentication
     const user = mockUsers.find(u => u.email === email)

     const authUser: User = user || {
       id: 'demo-user',
       email,
       name: email.split('@')[0],
       role: email.includes('admin') ? 'ADMIN' :
             email.includes('teacher') ? 'TEACHER' :
             email.includes('parent') ? 'PARENT' : 'STUDENT',
     }

     // Set mock cookie
     cookies().set('auth', JSON.stringify(authUser), {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'lax',
       maxAge: 60 * 60 * 24 * 7, // 1 week
     })

     return authUser
   }

   export async function logout() {
     cookies().delete('auth')
   }

   export async function getUser(): Promise<User | null> {
     const auth = cookies().get('auth')?.value
     return auth ? JSON.parse(auth) : null
   }
   ```

4. **Create Web Login Page**
   ```typescript
   // apps/web/app/(auth)/login/page.tsx
   import { login } from '@/lib/auth'
   import { redirect } from 'next/navigation'

   export default function LoginPage() {
     return (
       <div className="min-h-screen flex items-center justify-center bg-slate-50">
         <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
           <div className="text-center mb-8">
             <h1 className="text-2xl font-black text-slate-800">ECONTACT</h1>
             <p className="text-sm text-slate-400">Đăng nhập vào cổng thông tin</p>
           </div>

           <form action={async (formData) => {
             'use server'
             const email = formData.get('email') as string
             const password = formData.get('password') as string
             const user = await login(email, password)

             // Redirect by role
             const redirectMap = {
               ADMIN: '/admin/dashboard',
               TEACHER: '/teacher/dashboard',
               PARENT: '/mobile/dashboard',
               STUDENT: '/mobile/dashboard',
             }
             redirect(redirectMap[user.role])
           }}>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium mb-1">Email</label>
                 <input
                   name="email"
                   type="email"
                   placeholder="admin@econtact.vn"
                   className="w-full px-4 py-2 border rounded-lg"
                   required
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                 <input
                   name="password"
                   type="password"
                   placeholder="••••••••"
                   className="w-full px-4 py-2 border rounded-lg"
                   required
                 />
               </div>
               <button
                 type="submit"
                 className="w-full bg-[#0284C7] text-white py-2.5 rounded-xl font-bold hover:bg-[#0369A1] transition-colors"
               >
                 Đăng nhập
               </button>
             </div>
           </form>

           <div className="mt-6 text-center text-sm text-slate-400">
             <p>Demo: Chấp nhận mọi email/password</p>
           </div>
         </div>
       </div>
     )
   }
   ```

5. **Create Mobile Login Screen**
   ```typescript
   // apps/mobile/src/screens/auth/Login.tsx
   import { useState } from 'react'
   import { View, Text, TextInput, Button, Alert } from 'react-native'
   import { useAuthStore } from '@/stores/auth'
   import { useRouter } from 'expo-router'

   export function LoginScreen() {
     const [email, setEmail] = useState('')
     const [password, setPassword] = useState('')
     const [loading, setLoading] = useState(false)
     const { login } = useAuthStore()
     const router = useRouter()

     const handleLogin = async () => {
       setLoading(true)
       try {
         await login(email, password)
         const user = useAuthStore.getState().user

         // Redirect by role
         if (user?.role === 'PARENT') {
           router.replace('/parent/dashboard')
         } else if (user?.role === 'STUDENT') {
           router.replace('/student/dashboard')
         }
       } catch (error) {
         Alert.alert('Lỗi', 'Đăng nhập thất bại')
       } finally {
         setLoading(false)
       }
     }

     return (
       <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F8FAFC' }}>
         <View style={{ alignItems: 'center', marginBottom: 40 }}>
           <Text style={{ fontSize: 32, fontWeight: '800', color: '#0284C7' }}>ECONTACT</Text>
           <Text style={{ fontSize: 14, color: '#64748B' }}>Ứng dụng Quan ly Điện tử</Text>
         </View>

         <TextInput
           placeholder="Email"
           value={email}
           onChangeText={setEmail}
           autoCapitalize="none"
           keyboardType="email-address"
           style={{
             backgroundColor: 'white',
             borderRadius: 12,
             padding: 16,
             marginBottom: 16,
             borderWidth: 1,
             borderColor: '#E2E8F0',
           }}
         />

         <TextInput
           placeholder="Mật khẩu"
           value={password}
           onChangeText={setPassword}
           secureTextEntry
           style={{
             backgroundColor: 'white',
             borderRadius: 12,
             padding: 16,
             marginBottom: 24,
             borderWidth: 1,
             borderColor: '#E2E8F0',
           }}
         />

         <Button
           mode="contained"
           onPress={handleLogin}
           loading={loading}
           disabled={!email || !password}
           style={{ borderRadius: 12 }}
           contentStyle={{ paddingVertical: 8 }}
         >
           Đăng nhập
         </Button>

         <Text style={{ textAlign: 'center', marginTop: 24, color: '#94A3B8', fontSize: 12 }}>
           Demo: Chấp nhận mọi email/password
         </Text>
       </View>
     )
   }
   ```

6. **Create Middleware for Protected Routes**
   ```typescript
   // apps/web/middleware.ts
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'

   export function middleware(request: NextRequest) {
     const auth = request.cookies.get('auth')?.value
     const user = auth ? JSON.parse(auth) : null

     const isAuthPage = request.nextUrl.pathname.startsWith('/login')
     const isAdmin = request.nextUrl.pathname.startsWith('/admin')
     const isTeacher = request.nextUrl.pathname.startsWith('/teacher')

     // Redirect to login if not authenticated
     if (!user && !isAuthPage && (isAdmin || isTeacher)) {
       return NextResponse.redirect(new URL('/login', request.url))
     }

     // Redirect to appropriate portal if already authenticated
     if (user && isAuthPage) {
       const redirectMap = {
         ADMIN: '/admin/dashboard',
         TEACHER: '/teacher/dashboard',
         PARENT: '/mobile/dashboard',
         STUDENT: '/mobile/dashboard',
       }
       return NextResponse.redirect(new URL(redirectMap[user.role], request.url))
     }

     return NextResponse.next()
   }

   export const config = {
     matcher: ['/admin/:path*', '/teacher/:path*', '/login'],
   }
   ```

## Todo List
- [ ] Define shared auth types
- [ ] Create mobile auth store
- [ ] Create web auth utilities
- [ ] Build web login page
- [ ] Build mobile login screen
- [ ] Create middleware for protected routes
- [ ] Test role-based redirects
- [ ] Test session persistence

## Success Criteria
- Login works on both mobile and web
- Role-based redirect works correctly
- Session persists after app refresh
- Logout clears state and redirects
- Middleware protects admin/teacher routes

## Conflict Prevention
- Shared types in `packages/shared-types`
- Auth logic isolated to this phase
- No overlap with other phases

## Risk Assessment
| Risk | Mitigation |
|------|-----------|
| Mock auth confusion | Document clearly this is demo only |
| Session persistence issues | Test on both platforms |
| Role-based routing bugs | Test all 4 roles |

## Security Considerations
- **CRITICAL**: This is mock auth only - document prominently
- No password validation (accepts any input)
- No real token generation
- Cookies not httpOnly in development
- Add clear warnings in login UI

## Next Steps
- Phase 05 (Integration) - test auth flows
- Phase 05 (Testing) - verify auth works end-to-end
