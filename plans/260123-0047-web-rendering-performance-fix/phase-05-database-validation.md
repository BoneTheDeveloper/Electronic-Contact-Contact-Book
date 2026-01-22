# Phase 05: Database Validation & Health Check

**Date**: 2026-01-23
**Priority**: P2
**Status**: pending
**Effort**: 30m

---

## Context Links

- **Related Files**:
  - `apps/web/lib/supabase/server.ts` - Supabase client
  - `apps/web/lib/supabase/queries.ts` - All queries

---

## Overview

Add database health check endpoint and validation to ensure required tables exist.

## Key Insights

From debugger report:
- No way to check if Supabase is connected
- Tables might not exist or be misconfigured
- No health check for monitoring
- Silent failures when DB unavailable

## Requirements

1. Create health check API endpoint
2. Validate required tables exist
3. Check connection status
4. Return useful health status

## Implementation Steps

### Step 1: Create Health Check Endpoint

**File**: `apps/web/app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  services: {
    database: {
      status: 'connected' | 'disconnected' | 'error'
      latency?: number
      error?: string
    }
    tables: {
      status: 'all_present' | 'missing' | 'error'
      missing?: string[]
      present?: string[]
    }
  }
}

const REQUIRED_TABLES = [
  'profiles',
  'students',
  'classes',
  'grades',
  'subjects',
  'enrollments',
  'schedules',
  'attendance',
  'assessments',
  'grade_entries',
  'invoices',
  'fee_items',
  'notifications',
  'leave_requests',
] as const

export async function GET() {
  const startTime = Date.now()
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: { status: 'disconnected' },
      tables: { status: 'all_present' },
    },
  }

  try {
    // Test database connection
    const supabase = await createClient()

    // Simple connection test
    const { error: connectionError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    const latency = Date.now() - startTime

    if (connectionError) {
      health.services.database = {
        status: 'error',
        error: connectionError.message,
      }
      health.status = 'unhealthy'
    } else {
      health.services.database = {
        status: 'connected',
        latency,
      }
    }

    // Check required tables
    const { data: tables, error: tablesError } = await supabase
      .rpc('check_tables', { table_names: REQUIRED_TABLES })

    if (tablesError) {
      // Fallback: check tables one by one
      const tableChecks = await Promise.allSettled(
        REQUIRED_TABLES.map(async (table) => {
          const { error } = await supabase.from(table).select('*').limit(1)
          return { table, exists: !error }
        })
      )

      const present: string[] = []
      const missing: string[] = []

      tableChecks.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.exists) {
          present.push(result.value.table)
        } else {
          missing.push(REQUIRED_TABLES[index])
        }
      })

      health.services.tables = {
        status: missing.length > 0 ? 'missing' : 'all_present',
        present,
        missing,
      }

      if (missing.length > 0) {
        health.status = 'degraded'
      }
    } else {
      health.services.tables = {
        status: 'all_present',
        present: REQUIRED_TABLES as unknown as string[],
      }
    }

  } catch (error) {
    health.services.database = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
    health.status = 'unhealthy'
  }

  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503

  return NextResponse.json(health, { status: statusCode })
}
```

### Step 2: Create Table Check Function (Optional SQL)

**File**: `supabase/migrations/xxx_add_table_check_function.sql`

```sql
-- Helper function to check if tables exist
CREATE OR REPLACE FUNCTION check_tables(table_names text[])
RETURNS TABLE(table_name text, exists boolean) AS $$
BEGIN
  RETURN QUERY
  SELECT
    unnest(table_names) as table_name,
    EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = unnest(table_names)
    );
END;
$$ LANGUAGE plpgsql;
```

### Step 3: Create Health Check Component

**File**: `apps/web/components/health-status.tsx`

```tsx
'use client'

import { useEffect, useState } from 'react'

interface HealthData {
  status: 'healthy' | 'degraded' | 'unhealthy'
  services: {
    database: { status: string; latency?: number }
    tables: { status: string; missing?: string[] }
  }
}

export function HealthStatusBadge() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(setHealth)
      .catch(() => setHealth(null))
  }, [])

  if (!health) {
    return (
      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
        Checking...
      </span>
    )
  }

  const getColor = () => {
    switch (health.status) {
      case 'healthy': return 'bg-green-100 text-green-800'
      case 'degraded': return 'bg-amber-100 text-amber-800'
      case 'unhealthy': return 'bg-red-100 text-red-800'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}
      >
        {health.status === 'healthy' ? '●' : health.status === 'degraded' ? '▲' : '●'}{' '}
        {health.status}
      </button>

      {showDetails && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-4 text-left z-50">
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Database:</span>{' '}
              <span className={health.services.database.status === 'connected' ? 'text-green-600' : 'text-red-600'}>
                {health.services.database.status}
              </span>
              {health.services.database.latency && (
                <span className="text-gray-500 text-xs ml-1">
                  ({health.services.database.latency}ms)
                </span>
              )}
            </div>
            <div>
              <span className="font-medium">Tables:</span>{' '}
              <span className={health.services.tables.status === 'all_present' ? 'text-green-600' : 'text-amber-600'}>
                {health.services.tables.status}
              </span>
            </div>
            {health.services.tables.missing && health.services.tables.missing.length > 0 && (
              <div className="text-amber-700">
                Missing: {health.services.tables.missing.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

### Step 4: Add Health Check to Layout (Dev Only)

**File**: `apps/web/app/layout.tsx`

```tsx
import { HealthStatusBadge } from '@/components/health-status'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-50">
            <HealthStatusBadge />
          </div>
        )}
        {children}
      </body>
    </html>
  )
}
```

### Step 5: Create Database Validation Script

**File**: `scripts/validate-db.ts`

```typescript
#!/usr/bin/env tsx

import { createClient } from '../apps/web/lib/supabase/server'

const REQUIRED_TABLES = [
  'profiles',
  'students',
  'classes',
  'grades',
  'subjects',
  'enrollments',
  'schedules',
  'attendance',
  'assessments',
  'grade_entries',
  'invoices',
  'fee_items',
  'notifications',
  'leave_requests',
]

async function validateDatabase() {
  console.log('🔍 Validating Supabase database...\n')

  const supabase = await createClient()

  // Check connection
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1)

    if (error) {
      console.error('❌ Database connection failed:', error.message)
      process.exit(1)
    }

    console.log('✅ Database connected\n')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }

  // Check tables
  console.log('Checking required tables...')
  let missingTables: string[] = []

  for (const table of REQUIRED_TABLES) {
    const { error } = await supabase.from(table).select('*').limit(1)

    if (error) {
      console.log(`  ❌ ${table} - ${error.message}`)
      missingTables.push(table)
    } else {
      console.log(`  ✅ ${table}`)
    }
  }

  console.log()

  if (missingTables.length > 0) {
    console.error(`❌ Missing ${missingTables.length} tables: ${missingTables.join(', ')}`)
    console.log('\nRun migrations to create missing tables:')
    console.log('  npx supabase db push')
    process.exit(1)
  }

  console.log('✅ All required tables present')
  console.log('\n✅ Database validation passed!')
}

validateDatabase().catch(console.error)
```

## Todo List

- [ ] Create `apps/web/app/api/health/route.ts`
- [ ] Create `apps/web/components/health-status.tsx`
- [ ] Update `apps/web/app/layout.tsx` (dev only)
- [ ] Create `scripts/validate-db.ts`
- [ ] Test health endpoint
- [ ] Run validation script

## Success Criteria

- [ ] Health endpoint returns correct status
- [ ] Missing tables detected and reported
- [ ] Latency measured correctly
- [ ] Dev badge shows in development
- [ ] Validation script works

## Risk Assessment

- **Risk**: Very Low (only adds monitoring)
- **Impact**: Positive (visibility into DB issues)
- **Testing**: Manual endpoint testing

---

## Plan Complete

All phases defined. Ready to execute.

**Total Estimated Effort**: 4 hours
**Priority**: P1 (blocking deployment)
**Next Step**: Execute Phase 01
