# Supabase Type Patterns & Guidelines

This document covers common patterns and pitfalls when working with Supabase types in TypeScript.

## Database Schema Sources

| Source | Location | Purpose |
|--------|----------|---------|
| **Migrations** | `supabase/migrations/*.sql` | Source of truth for schema |
| **Generated Types** | `apps/web/types/supabase.ts` | Auto-generated TypeScript types |
| **Query Functions** | `apps/web/lib/supabase/queries.ts` | Data access patterns |

## Common Type Issues & Solutions

### 1. Insert Type Mismatch

**Problem:** TypeScript error when inserting data due to complex type inference.

```typescript
// ❌ DON'T - Causes type errors
const insertData: Database['public']['Tables']['fee_assignments']['Insert'] = {
  id: crypto.randomUUID(),
  name: name.trim(),
  target_grades: (targetGrades?.length ? targetGrades : null),
  // ...
}

await supabase
  .from('fee_assignments' as const)
  .insert(insertData)
```

**Solution:** Use type alias + `as any` assertion for insert.

```typescript
// ✅ DO - Use type alias
type FeeAssignmentsInsert = Database['public']['Tables']['fee_assignments']['Insert']

const insertData: FeeAssignmentsInsert = {
  id: crypto.randomUUID(),
  name: name.trim(),
  target_grades: (targetGrades?.length ? targetGrades : null),
  // ...
}

await supabase
  .from('fee_assignments')
  .insert(insertData as any)
  .select()
  .single()
```

### 2. `.eq()` Type Errors

**Problem:** String arguments not assignable to `.eq()` parameter.

```typescript
// ❌ DON'T
.eq('id' as const, id)
.eq('role', 'parent')  // Still may fail
```

**Solution:** Use `as any` for value parameter.

```typescript
// ✅ DO
.eq('id', id as any)
.eq('role', 'parent' as any)
```

### 3. Nested Path Filters

**Problem:** Filtering on joined tables (`profiles.status`) causes type errors.

```typescript
// ❌ DON'T
.eq('profiles.status', 'active')  // Type error
```

**Solution:** Add `as any` to the value.

```typescript
// ✅ DO
.eq('profiles.status', 'active' as any)
```

### 4. Update Type Errors

**Problem:** Update object type not matching expected type.

```typescript
// ❌ DON'T
.update({ is_primary: false } as GuardiansInsert)
```

**Solution:** Use `as any` for the update object.

```typescript
// ✅ DO
.update({ is_primary: false } as any)
```

## Database Schema vs Generated Types

### Verifying Schema Alignment

Example: `fee_assignments.target_classes`

| Source | Definition |
|--------|------------|
| Migration (`20260122194503_finance_data.sql`) | `target_classes TEXT[]` (nullable - no NOT NULL) |
| Database (via Supabase MCP) | `target_classes TEXT[]` (nullable) |
| Generated Types | `target_classes?: string[] \| null` |

**All sources are aligned.** The migration correctly defines nullable columns.

**Best Practice:** When in doubt, use Supabase MCP tools to verify the actual database schema matches migrations.

## Best Practices

### 1. Define Type Aliases

```typescript
type TableNameInsert = Database['public']['Tables']['table_name']['Insert']
type TableNameRow = Database['public']['Tables']['table_name']['Row']
```

### 2. Use Type Aliases for Variables

```typescript
const insertData: TableNameInsert = { /* ... */ }
const updateData: Partial<TableNameUpdate> = { /* ... */ }
```

### 3. Use `as any` for Supabase Method Values

```typescript
.insert(data as any)
.update(data as any)
.eq('column', value as any)
```

### 4. Avoid `as const` on Table Names

```typescript
// ❌ DON'T
.from('table_name' as const)

// ✅ DO
.from('table_name')
```

### 5. Handle Arrays Correctly

```typescript
// When array should be null instead of empty
target_grades: (targetGrades?.length ? targetGrades : null)

// When array is required
fee_items: validFeeItems  // Don't use empty array
```

## Fee Function Patterns

### Creating Fee Assignment

```typescript
type FeeAssignmentsInsert = Database['public']['Tables']['fee_assignments']['Insert']

const insertData: FeeAssignmentsInsert = {
  id: crypto.randomUUID(),
  name: name.trim(),
  target_grades: (targetGrades?.length ? targetGrades : null),
  target_classes: targetClasses,
  fee_items: validFeeItems,
  start_date: startDateValue,
  due_date: finalDueDate,
}

const { data, error } = await supabase
  .from('fee_assignments')
  .insert(insertData as any)
  .select()
  .single()
```

### Querying Fee Assignments

```typescript
const { data, error } = await supabase
  .from('fee_assignments')
  .select('*')
  .eq('status', 'published' as any)
  .order('due_date', { ascending: true })
```

### Updating Fee Assignment

```typescript
const { error } = await supabase
  .from('fee_assignments')
  .update({ status: 'published' } as any)
  .eq('id', assignmentId as any)
```

## Type Safety vs Pragmatism

While TypeScript provides type safety, Supabase's complex type system sometimes requires pragmatic workarounds:

1. **Use `as any` for Supabase method values** - The types are overly complex
2. **Trust generated types over migrations** - Database may differ from migration
3. **Use type aliases for clarity** - Makes code more readable
4. **Keep migrations in sync** - Use `supabase db push` to update types

## Verifying Schema Alignment

Use Supabase MCP tools to verify database schema matches migrations:

```bash
# List all tables and their columns
mcp__supabase__list_tables(schemas: ["public"])

# Compare with migration file
supabase/migrations/20260122194503_finance_data.sql
```

**Key checks:**
1. Column data types match (TEXT, UUID, INT, etc.)
2. Nullable/NOT NULL constraints match
3. Array types match (TEXT[], UUID[])
4. Default values match

## Regenerating Types

When schema changes:

```bash
# Generate types from database
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > apps/web/types/supabase.ts
```

## Resources

- [Supabase TypeScript Docs](https://supabase.com/docs/reference/javascript/typescript-support)
- [Database Schema](../../supabase/migrations/)
- [Generated Types](../../apps/web/types/supabase.ts)
