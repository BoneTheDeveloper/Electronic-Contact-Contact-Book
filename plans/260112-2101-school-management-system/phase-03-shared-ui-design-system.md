---
title: "Phase 03: Shared UI & Design System"
description: "Reusable components and design tokens for mobile and web"
status: completed
priority: P2
effort: 3h
created: 2026-01-12
completed: 2026-01-12
---

# Phase 03: Shared UI & Design System

## Context Links
- Parent: [plan.md](./plan.md)
- Depends: [phase-01](./phase-01-project-setup.md), Phase 02A/B
- Docs: [design-guidelines](../../docs/design-guidelines.md)

## Parallelization Info
- **Must complete after**: Phases 02A, 02B (consuming apps exist)
- **Must complete before**: Phases 04A-D (features use components)
- **Exclusive files**: `packages/shared-ui/*`

## Overview
| Field | Value |
|-------|-------|
| Priority | P2 |
| Status | Completed |
| Description | Shared React components, design tokens, utilities |
| Review Status | Completed |

## Key Insights
- Use CSS variables for web, theme object for mobile
- Some components can be shared (cards, buttons)
- Some are platform-specific (navigation)

## Requirements
- React 18+
- TypeScript 5+
- Platform-agnostic components where possible

## Architecture

### Package Structure
```
packages/shared-ui/
├── src/
│   ├── tokens/
│   │   ├── colors.ts      # Shared color definitions
│   │   ├── typography.ts  # Font scales
│   │   └── spacing.ts     # Spacing units
│   ├── components/
│   │   ├── Button/        # Shared button (RN + Web)
│   │   ├── Card/          # Shared card
│   │   ├── Badge/         # Status badges
│   │   ├── Avatar/        # User avatars
│   │   └── index.ts
│   ├── utils/
│   │   ├── cn.ts          # Class name utility
│   │   └── format.ts      # Date, currency formatting
│   └── index.ts
└── package.json
```

### Platform-Specific Considerations
| Component | Mobile | Web |
|-----------|--------|-----|
| Button | React Native Paper | HTML button |
| Card | RN View | div |
| Badge | RN View | span |
| Avatar | Image | img |

## File Ownership

### Files to Create (Exclusive to 03)
| File | Owner |
|------|-------|
| `packages/shared-ui/src/tokens/*` | Phase 03 |
| `packages/shared-ui/src/components/*` | Phase 03 |
| `packages/shared-ui/src/utils/*` | Phase 03 |
| `packages/shared-ui/package.json` | Phase 03 |

## Implementation Steps

1. **Create Shared UI Package**
   ```bash
   mkdir -p packages/shared-ui/src
   cd packages/shared-ui
   npm init -y
   npm install react clsx tailwind-merge
   ```

2. **Define Color Tokens**
   ```typescript
   // src/tokens/colors.ts
   export const colors = {
     primary: {
       50: '#E0F2FE',
       100: '#BAE6FD',
       500: '#0284C7',
       600: '#0369A1',
       700: '#075985',
     },
     success: {
       50: '#F0FDF4',
       500: '#4CAF50',
     },
     warning: {
       50: '#FFF7ED',
       500: '#FF9800',
     },
     error: {
       50: '#FEF2F2',
       500: '#F44336',
     },
   } as const
   ```

3. **Create Typography Tokens**
   ```typescript
   // src/tokens/typography.ts
   export const typography = {
     fontFamily: {
       sans: 'Inter, sans-serif',
     },
     fontSize: {
       h1: ['32px', { lineHeight: '40px', fontWeight: '600' }],
       h2: ['24px', { lineHeight: '32px', fontWeight: '600' }],
       h3: ['20px', { lineHeight: '28px', fontWeight: '500' }],
       body: ['14px', { lineHeight: '20px', fontWeight: '400' }],
       small: ['12px', { lineHeight: '16px', fontWeight: '400' }],
     },
   } as const
   ```

4. **Create Badge Component** (Platform-agnostic)
   ```typescript
   // src/components/Badge/index.tsx
   import { View, Text } from 'react-native'
   import { colors } from '../../tokens/colors'

   interface BadgeProps {
     variant: 'success' | 'warning' | 'error'
     children: string
   }

   export function Badge({ variant, children }: BadgeProps) {
     const bgColors = {
       success: colors.success[50],
       warning: colors.warning[50],
       error: colors.error[50],
     }
     const textColors = {
       success: colors.success[500],
       warning: colors.warning[500],
       error: colors.error[500],
     }

     return (
       <View style={{
         backgroundColor: bgColors[variant],
         paddingHorizontal: 8,
         paddingVertical: 4,
         borderRadius: 4,
       }}>
         <Text style={{ color: textColors[variant], fontSize: 12, fontWeight: '600' }}>
           {children}
         </Text>
       </View>
     )
   }
   ```

5. **Create Utility Functions**
   ```typescript
   // src/utils/cn.ts
   import { type ClassValue, clsx } from 'clsx'
   import { twMerge } from 'tailwind-merge'

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs))
   }

   // src/utils/format.ts
   export function formatCurrency(amount: number): string {
     return new Intl.NumberFormat('vi-VN', {
       style: 'currency',
       currency: 'VND',
     }).format(amount)
   }

   export function formatDate(date: Date | string): string {
     return new Date(date).toLocaleDateString('vi-VN')
   }
   ```

6. **Export Components**
   ```typescript
   // src/index.ts
   export * from './tokens/colors'
   export * from './tokens/typography'
   export * from './components/Badge'
   export * from './utils/cn'
   export * from './utils/format'
   ```

## Todo List
- [x] Create shared-ui package
- [x] Define color tokens
- [x] Define typography tokens
- [x] Define spacing tokens
- [x] Create Badge component
- [x] Create Button component (shared)
- [x] Create Card component (shared)
- [x] Create Avatar component
- [x] Create utility functions (cn, format)
- [x] Export all components

## Success Criteria
- Package can be installed in apps: `npm install @school/shared-ui`
- Badge component renders in both mobile and web
- Tokens exported for use in styling
- Utility functions tested

## Conflict Prevention
- Shared components are read-only after creation
- App-specific overrides in app code, not here
- No app dependencies in this package

## Risk Assessment
| Risk | Mitigation |
|------|-----------|
| Platform incompatibility | Test in both apps |
| Styling conflicts | Use component props, not global styles |
| Over-abstraction | Keep components simple |

## Security Considerations
- No user input handling in shared components
- Sanitize any text content before rendering

## Next Steps
- Phase 04A (Mobile Features) - uses shared components
- Phase 04B (Admin Features) - uses shared components
- Phase 04C (Teacher Features) - uses shared components
