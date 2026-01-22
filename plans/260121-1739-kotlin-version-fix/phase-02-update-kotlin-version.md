# Phase 02: Update Kotlin Version

**Parent Plan:** [plan.md](./plan.md)

## Overview

**Date:** 2026-01-21
**Description:** Override Kotlin version to 1.9.25 via Expo config
**Priority:** P1 (Critical)
**Status:** pending
**Effort:** 10m

## Key Insights

- Expo SDK 52 supports Kotlin version override via config plugins
- `expo-dev-client` plugin can pass Gradle properties
- Can use `expo-build-properties` or direct config

## Related Files

- **Primary:** `apps/mobile/app.json` - Add kotlinVersion override
- **Alternative:** Create `expo-plugin.config.js` for custom Gradle props

## Implementation Steps

### Step 1: Create Expo Config Plugin

Create `apps/mobile/expo-plugin.config.js`:
```javascript
module.exports = function expoConfigPlugin(config) {
  return {
    ...config,
    extra: {
      ...config.extra,
      kotlinVersion: '1.9.25',
    },
  };
};
```

### Step 2: Update app.json

Add plugin reference to `apps/mobile/app.json`:
```json
{
  "expo": {
    "plugins": [
      "expo-dev-client",
      [
        "./expo-plugin.config.js",
        {
          "kotlinVersion": "1.9.25"
        }
      ]
    ]
  }
}
```

### Alternative: Use expo-build-properties

Install and configure:
```bash
npx expo install expo-build-properties
```

Update `app.json`:
```json
{
  "expo": {
    "plugins": [
      "expo-dev-client",
      [
        "expo-build-properties",
        {
          "android": {
            "kotlinVersion": "1.9.25"
          }
        }
      ]
    ]
  }
}
```

## Todo List

- [ ] Install expo-build-properties if needed
- [ ] Update app.json with Kotlin override
- [ ] Verify config syntax
- [ ] Commit changes

## Success Criteria

- [ ] Kotlin 1.9.25 specified in config
- [ ] Config validates with `npx expo config`
- [ ] No syntax errors

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Plugin not available | Low | High | Use manual Gradle override |
| Version conflict | Low | Medium | Match Expo SDK requirements |

## Next Steps

Proceed to [Phase 03: Verify Build](./phase-03-verify-build.md)
