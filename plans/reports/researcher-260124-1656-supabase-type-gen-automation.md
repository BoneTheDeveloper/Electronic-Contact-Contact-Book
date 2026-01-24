# Supabase Type Generation Automation Research Report

## Executive Summary

Supabase CLI does not have native watch mode for automatic type generation. Multiple automation strategies available with trade-offs between development velocity and type safety.

## 1. Supabase CLI Auto-Generation

### Current Capabilities
- **Manual generation**: `npx supabase gen types typescript --local > apps/web/types/supabase.ts`
- **No built-in watch mode**: CLI doesn't auto-detect schema changes
- **Local vs remote**: Supports both `--local` and `--linked` project generation

### Project-Specific Context
- **Current type location**: `apps/web/types/supabase.ts`
- **Migration files**: Located in `supabase/migrations/`
- **Existing workflow**: Manual type generation after schema changes
- **Build system**: Next.js with Turborepo monorepo

### Schema Change Detection
- **No automatic detection**: Must manually trigger type generation after schema changes
- **Migration integration**: Types should be regenerated after running `supabase db push`

## 2. Build-Time Type Generation

### Next.js Integration
```json
// package.json
{
  "scripts": {
    "build": "npm run generate-types && next build",
    "generate-types": "npx supabase gen types typescript --local > apps/web/types/supabase.ts"
  }
}
```

### Turbo Repo Integration (if applicable)
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["generate-types"],
      "outputs": [".next/**"]
    }
  }
}
```

**Trade-offs**:
- ✅ Guaranteed up-to-date types before build
- ❌ Adds 5-10 seconds to build time
- ❌ Delays type feedback until build

## 3. Development-Time Automation

### File Watcher Script (Recommended for Windows)
```javascript
// scripts/watch-types.js
const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

const watcher = chokidar.watch([
  'supabase/migrations/*.sql',
  'supabase/db/*.sql'
], {
  persistent: true,
  ignoreInitial: false,
  usePolling: true, // Better for Windows
  interval: 1000
});

let debounceTimer;
watcher.on('all', (event, filePath) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    console.log(`Detected ${event} in ${filePath}`);
    exec('npx supabase gen types typescript --local > apps/web/types/supabase.ts',
      (error, stdout, stderr) => {
        if (error) {
          console.error('Type generation failed:', stderr);
        } else {
          console.log('Types regenerated successfully');
        }
      });
  }, 2000);
});

console.log('Watching for schema changes...');
```

**Installation**:
```bash
npm install chokidar --save-dev
```

### npm Scripts
```json
{
  "scripts": {
    "dev": "nodemon --watch scripts/watch-types.js --exec \"npm run dev\"",
    "generate-types": "npx supabase gen types typescript --local > apps/web/types/supabase.ts",
    "predev": "npm run generate-types"
  }
}
```

### Immediate Implementation for This Project
Add to `apps/web/package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "predev": "npm run generate-types",
    "generate-types": "npx supabase gen types typescript --local > apps/web/types/supabase.ts",
    "validate": "npm run lint && npm run typecheck && npm run test:run"
  }
}
```

## 4. Git Hooks & CI/CD

### Pre-commit Hook
```bash
# .git/hooks/pre-commit
#!/bin/bash
npm run generate-types
if git diff --quiet apps/web/types/supabase.ts; then
  echo "Types are up to date"
else
  echo "Warning: Types have been updated but not committed"
  git add apps/web/types/supabase.ts
fi
```

### GitHub Action (PR Check)
```yaml
# .github/workflows/check-types.yml
name: Check Types
on:
  pull_request:
    paths:
      - 'supabase/migrations/**'

jobs:
  check-types:
    runs-on: ubuntu-latest
    steps:
      - uses: supabase/setup-cli@v1
      - uses: actions/checkout@v4
      - run: npm run generate-types
      - run: |
          if ! git diff --quiet apps/web/types/supabase.ts; then
            echo "Types need to be updated. Run npm run generate-types"
            exit 1
          fi
```

## 5. Best Practices & Recommendations

### For This Project (Windows Environment)
1. **Immediate Solution**: Add to `apps/web/package.json`
   ```json
   {
     "scripts": {
       "predev": "npm run generate-types",
       "generate-types": "npx supabase gen types typescript --local > apps/web/types/supabase.ts"
     }
   }
   ```

2. **Enhanced Solution**: Implement file watcher with polling for Windows compatibility
   - Use `chokidar` with `usePolling: true`
   - Add 2-second debounce to prevent excessive regeneration
   - Watch migration files in `supabase/migrations/`

3. **CI/CD Integration**: Add PR check to prevent schema-type mismatches in main branch

### Community Patterns
- **Most projects**: Use `predev` script + manual generation after migrations
- **Large teams**: CI/CD automation with nightly scheduled updates
- **Solo developers**: File watcher for immediate feedback

## 6. Local Development vs Production

### Local Development (`supabase start`)
- Types generated from local Docker database
- Schema changes require `supabase db push`
- No automatic type synchronization

### Production
- Types generated from remote project
- Can be automated via CI/CD
- Requires project access token

## Unresolved Questions
1. What's the impact of frequent type regeneration on TypeScript server performance?
2. Are there any Windows-specific file watcher issues to be aware of?
3. How to handle type conflicts when multiple developers work on schema simultaneously?

## Recommendations Summary
1. **Start simple**: Add `predev` script to `apps/web/package.json`
2. **Add file watcher**: For better development experience (Windows-compatible)
3. **Implement CI check**: To prevent merged type mismatches
4. **Document process**: Ensure team understands type generation workflow
5. **Add to validation**: Include type generation in `npm run validate` script

Sources:
- [Generating TypeScript Types | Supabase Docs](https://supabase.com/docs/guides/api/rest/generating-types)
- [Generate types using GitHub Actions | Supabase Docs](https://supabase.com/docs/guides/deployment/ci/generating-types)
- Community solutions for file watching on Windows