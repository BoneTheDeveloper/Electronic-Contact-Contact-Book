# Phase 03: New Architecture Configuration

## Context Links

- [Research: Expo SDK 54](../260122-1532-expo-sdk54-upgrade/research/researcher-01-expo-sdk54-upgrade.md)
- [New Architecture Compatibility](../../apps/mobile/docs/NEW_ARCHITECTURE_COMPATIBILITY.md)

## Overview

Configure New Architecture settings for Expo Go compatibility (DISABLED) while documenting future TurboModule migration path.

## Key Insights

- SDK 54 supports both legacy and New Architecture
- Expo Go requires legacy architecture (newArchEnabled: false)
- Development builds can enable New Architecture later
- All current libraries have New Architecture support when ready

## Requirements

- Keep newArchEnabled: false in app.json
- Document current legacy state
- Create migration checklist for future New Architecture enablement
- Verify app runs without New Architecture

## Architecture

**Current State (Legacy):**
```
app.json:
├── newArchEnabled: false
├── All libraries use legacy/compatibility layers
└── Expo Go compatible

Future State (New Architecture):
├── newArchEnabled: true
├── TurboModules for native APIs
├── Fabric for UI components
└── Development builds required
```

**Library New Architecture Support:**
| Library | Legacy | TurboModule | Fabric |
|---------|--------|-------------|--------|
| AsyncStorage | ✅ | ✅ v2+ | - |
| Navigation | ✅ | - | ✅ v7+ |
| Safe Area | ✅ | ✅ | ✅ |
| Screens | ✅ | ✅ | ✅ |
| SVG | ✅ | - | ✅ |
| Paper | ✅ | - | ⚠️ Compatibility |

## Related Code Files

- `apps/mobile/app.json` - New Architecture flag
- `apps/mobile/docs/NEW_ARCHITECTURE_COMPATIBILITY.md` - Compatibility matrix
- `apps/mobile/docs/NEW_ARCHITECTURE_MIGRATION_CHECKLIST.md` - Future migration guide

## Implementation Steps

### 1. Verify Current Configuration

**Check app.json:**
```json
{
  "expo": {
    "newArchEnabled": false
  }
}
```

**Keep this setting for Expo Go compatibility.**

### 2. Document Current State

**Update NEW_ARCHITECTURE_COMPATIBILITY.md:**

Update "Current Dependencies" section with SDK 54 versions:
```markdown
## Current Dependencies (SDK 54 - New Architecture DISABLED)

| Library | Version | Status | Notes |
|---------|---------|--------|-------|
| react | 19.1.0 | ✅ Compatible | React 19 stable |
| react-native | 0.81.5 | ✅ Compatible | New Architecture disabled |
| expo | ~54.0.0 | ✅ Compatible | Expo Go NOT supported, dev builds required |
| @react-navigation/native | ^7.0.0 | ✅ Compatible | Static API |
| react-native-paper | ^6.0.0 | ✅ Compatible | Material Design 3 |
| @react-native-async-storage/async-storage | ^1.23.1 | ✅ Compatible | Old architecture implementation |
| react-native-safe-area-context | 4.14.0 | ✅ Compatible | Old architecture implementation |
| react-native-screens | ~4.20.0 | ✅ Compatible | Old architecture implementation |
| react-native-svg | 15.8.0 | ✅ Compatible | Old architecture implementation |
| expo-dev-client | ~6.0.0 | ✅ Compatible | Development builds |
| expo-status-bar | ~3.0.0 | ✅ Compatible | No native code |
```

### 3. Create Migration Checklist

**Create NEW_ARCHITECTURE_MIGRATION_CHECKLIST.md:**

```markdown
# New Architecture Migration Checklist

**For Future Use:** When ready to enable New Architecture (Fabric + TurboModules)

## Prerequisites

- [ ] All libraries support New Architecture
- [ ] Development build workflow established
- [ ] Physical device testing available
- [ ] Performance baseline established

## Migration Steps

### Phase 1: Enable New Architecture
- [ ] Set `newArchEnabled: true` in app.json
- [ ] Run `npx expo prebuild --clean`
- [ ] Verify compilation succeeds

### Phase 2: TurboModule Migration
- [ ] Upgrade AsyncStorage to v2 (TurboModule)
- [ ] Verify all native modules have TurboModule support
- [ ] Test all native functionality

### Phase 3: Fabric Components
- [ ] Verify React Navigation Fabric compatibility
- [ ] Test Paper components with Fabric
- [ ] Monitor for rendering bugs

### Phase 4: Testing
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on physical devices
- [ ] Performance testing

### Phase 5: Rollback Plan
- [ ] Keep backup of working config
- [ ] Document any issues found
- [ ] Know how to disable New Architecture if needed

## Known Issues

- React Native Paper may have rendering bugs with Fabric
- Monitor: https://github.com/callstack/react-native-paper/issues/4454
```

### 4. Verify App Runs Without New Architecture

```bash
cd apps/mobile
npx expo start --clear
```

Test on:
- [ ] iOS Simulator
- [ ] Android Emulator

## Todo List

- [ ] Verify newArchEnabled: false in app.json
- [ ] Update NEW_ARCHITECTURE_COMPATIBILITY.md for SDK 54
- [ ] Create NEW_ARCHITECTURE_MIGRATION_CHECKLIST.md
- [ ] Test app builds and runs successfully
- [ ] Document why New Architecture is disabled

## Success Criteria

- [ ] newArchEnabled: false confirmed
- [ ] App builds successfully
- [ ] App runs on simulators/emulators
- [ ] Documentation updated
- [ ] Migration checklist created

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Expo Go incompatibility | Certain | Low | Use development builds |
| New Architecture bugs | N/A | N/A | Not enabled |
| Future migration complexity | Low | Medium | Checklist prepared |

## Security Considerations

- None for this phase (configuration only)

## Next Steps

Proceed to Phase 04: Component Testing
