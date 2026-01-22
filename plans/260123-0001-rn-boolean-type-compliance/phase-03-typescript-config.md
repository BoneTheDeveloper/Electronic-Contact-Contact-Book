# Phase 03: TypeScript Strict Configuration

**Date:** 2026-01-23
**Status:** Completed
**Priority:** Medium

## Context

Links:
- [Plan Overview](./plan.md)
- [Phase 01: Codebase Audit](./phase-01-codebase-audit.md)
- [Phase 02: ESLint Rule](./phase-02-eslint-rule.md)

## Overview

Enhance TypeScript configuration to catch type mismatches at compile-time, preventing boolean prop violations before runtime.

## Key Insights

### TypeScript's Role

TypeScript can prevent boolean prop violations through:
1. **Strict type checking:** Catch any `string` passed to `boolean` props
2. **Component prop definitions:** Explicit boolean prop types
3. **Exhaustive type checking:** No implicit `any` types

### Current Configuration Assessment

Review `apps/mobile/tsconfig.json` for:
- `strict: true`
- `strictNullChecks: true`
- `noImplicitAny: true`
- `strictBooleanExpressions: true` (TS 5.0+)

## Requirements

1. Enable strict TypeScript compiler options
2. Define explicit prop types for all components
3. Use `strictBooleanExpressions` for boolean context enforcement
4. Configure type checking in build pipeline

## Related Code Files

- `apps/mobile/tsconfig.json`
- `apps/mobile/package.json`
- Component prop type definitions

## Implementation Steps

### Step 1: Update tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBooleanExpressions": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Step 2: Define Component Prop Types

Example for custom components:

```typescript
// ❌ BAD - Loose typing
interface MyModalProps {
  visible?: any;
}

// ✅ GOOD - Explicit boolean typing
interface MyModalProps {
  visible: boolean;
}
```

### Step 3: Add Type Checker Script

```json
// package.json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch"
  }
}
```

### Step 4: CI/CD Integration

```yaml
# .github/workflows/typecheck.yml
- name: Type Check
  run: |
    cd apps/mobile
    npm run typecheck
```

## Todo List

- [ ] Review current tsconfig.json
- [ ] Enable strict boolean expressions
- [ ] Add type check script to package.json
- [ ] Run typecheck and fix any issues
- [ ] Add typecheck to pre-commit hooks
- [ ] Document type checking workflow

## Success Criteria

1. TypeScript compiles with zero errors
2. `strictBooleanExpressions` enabled
3. Type checking passes in CI/CD
4. No implicit `any` types in components

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Existing type errors | Medium | Medium | Fix incrementally |
| Build time increase | Low | Low | Acceptable tradeoff |
| Developer friction | Medium | Low | Clear error messages |

## Security Considerations

N/A - Type safety only

## Next Steps

1. Update tsconfig.json
2. Run typecheck and fix any issues
3. Proceed to [Phase 04: Validation Testing](./phase-04-validation-testing.md)

---

**Last Updated:** 2026-01-23
