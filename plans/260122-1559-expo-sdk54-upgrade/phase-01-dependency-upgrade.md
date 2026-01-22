# Phase 01: Dependency Upgrade

## Context Links

- [Research: Expo SDK 54](../260122-1532-expo-sdk54-upgrade/research/researcher-01-expo-sdk54-upgrade.md)
- [Research: React 19 Compatibility](../260122-1532-expo-sdk54-upgrade/research/researcher-02-react19-compatibility.md)
- [New Architecture Compatibility](../../apps/mobile/docs/NEW_ARCHITECTURE_COMPATIBILITY.md)

## Overview

Upgrade all core dependencies to Expo SDK 54 compatible versions.

## Key Insights

- Expo SDK 54 requires React Native 0.81.x and React 19.x
- All core React Native libraries have compatible versions
- TypeScript types need update for React 19
- Development builds required (no Expo Go support)

## Requirements

- Update package.json with exact versions from research
- Run pnpm install and resolve conflicts
- Update TypeScript types
- Verify no type errors

## Architecture

**Dependency Hierarchy:**
```
expo ~54.0.0
├── react-native 0.81.5
│   └── react 19.1.0
├── @react-navigation/native ^7.0.0
├── @react-navigation/native-stack ^7.0.0
├── @react-navigation/bottom-tabs ^7.0.0
├── react-native-paper ^6.0.0
├── @react-native-async-storage/async-storage ^1.23.1
├── react-native-safe-area-context 4.14.0
├── react-native-screens ~4.20.0
├── react-native-svg 15.8.0
└── expo-dev-client ~6.0.0
```

## Related Code Files

- `apps/mobile/package.json` - Main dependency declarations
- `apps/mobile/app.json` - Expo SDK version
- `apps/mobile/tsconfig.json` - TypeScript config

## Implementation Steps

1. **Backup current package.json**
   ```bash
   cp apps/mobile/package.json apps/mobile/package.json.backup
   ```

2. **Update dependencies in package.json**

   Update to exact versions:

   ```json
   {
     "dependencies": {
       "expo": "~54.0.0",
       "react": "19.1.0",
       "react-native": "0.81.5",
       "@react-navigation/native": "^7.0.0",
       "@react-navigation/native-stack": "^7.0.0",
       "@react-navigation/bottom-tabs": "^7.0.0",
       "react-native-paper": "^6.0.0",
       "@react-native-async-storage/async-storage": "^1.23.1",
       "react-native-safe-area-context": "4.14.0",
       "react-native-screens": "~4.20.0",
       "react-native-svg": "15.8.0",
       "react-native-web": "~0.19.13",
       "expo-dev-client": "~6.0.0",
       "expo-status-bar": "~3.0.0",
       "zustand": "^4.5.2"
     },
     "devDependencies": {
       "@types/react": "^19.0.0",
       "@types/react-native": "^0.81.0"
     }
   }
   ```

3. **Update app.json SDK version**
   ```json
   {
     "expo": {
       "sdkVersion": "54.0.0"
     }
   }
   ```

4. **Clean and install**
   ```bash
   cd apps/mobile
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

5. **Verify TypeScript compilation**
   ```bash
   pnpm run typecheck
   ```

6. **Document version changes in docs**

## Todo List

- [ ] Backup package.json
- [ ] Update dependencies to SDK 54 versions
- [ ] Update app.json SDK version
- [ ] Clean node_modules and reinstall
- [ ] Run typecheck and fix errors
- [ ] Update NEW_ARCHITECTURE_COMPATIBILITY.md

## Success Criteria

- [ ] pnpm install completes without errors
- [ ] No TypeScript type errors
- [ ] All dependencies resolved correctly
- [ ] Versions match research targets

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Peer dependency conflicts | Medium | Medium | Use --legacy-peer-deps if needed |
| TypeScript type errors | High | High | Fix types incrementally |
| Lock file conflicts | Low | Low | Regenerate from scratch |

## Security Considerations

- Review all updated packages for known vulnerabilities
- Check Expo security advisories for SDK 54

## Next Steps

Proceed to Phase 02: Library Compatibility
