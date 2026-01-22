# Development Testing Utilities

**Location**: `apps/mobile/src/utils/devOnly/`

**Purpose**: Development-only utilities to verify Expo SDK 54 upgrade, New Architecture (Fabric/TurboModules), and app performance.

**IMPORTANT**: These utilities are for development only and should be removed or tree-shaken in production builds.

---

## Files

| File | Description |
|------|-------------|
| `index.ts` | Central export and `runDevChecks()` entry point |
| `verifyNewArchitecture.ts` | New Architecture verification utilities |
| `screenChecklist.ts` | Complete list of 37 screens to test |
| `performanceTest.ts` | Performance measurement utilities |
| `TEST_REPORT_TEMPLATE.md` | Test report template for documentation |

---

## Quick Start

### 1. Run All Verification Checks

In your app's entry point (App.tsx), add:

```typescript
import { runDevChecks } from './src/utils/devOnly';

export default function App() {
  useEffect(() => {
    if (__DEV__) {
      runDevChecks();
    }
  }, []);

  // ... rest of app
}
```

### 2. Run Performance Tests

```typescript
import { runPerformanceTests } from './src/utils/devOnly';

// In a dev menu or test screen
const handleRunTests = async () => {
  const report = await runPerformanceTests(navigationRef.current);
  console.log(formatPerformanceReport(report));
};
```

---

## API Reference

### New Architecture Verification

#### `verifyNewArchitecture()`

Checks if React Native New Architecture (Fabric/TurboModules) is enabled.

**Returns**: `NewArchitectureInfo`

```typescript
interface NewArchitectureInfo {
  platform: string;
  newArchEnabled: boolean;
  hermesEnabled: boolean;
  turboModulesEnabled: boolean;
  fabricEnabled: boolean;
}
```

**Example**:
```typescript
import { verifyNewArchitecture } from './src/utils/devOnly';

const info = verifyNewArchitecture();
console.log('New Arch:', info.newArchEnabled); // true/false
```

#### `getTurboModules()`

Returns list of TurboModules available in the app.

**Returns**: `string[]`

**Example**:
```typescript
import { getTurboModules } from './src/utils/devOnly';

const modules = getTurboModules();
console.log('TurboModules:', modules);
// ['NativeStatusBarManager', 'NativeDeviceInfo', ...]
```

#### `verifyReactNativeVersion()`

Checks if React Native version supports New Architecture.

**Returns**: `boolean`

---

### Screen Checklist

#### `SCREEN_CHECKLIST`

Complete list of 37 screens with categories and critical flags.

**Type**: `ScreenChecklistItem[]`

```typescript
interface ScreenChecklistItem {
  path: string;
  name: string;
  category: 'auth' | 'dashboard' | 'students' | 'teachers' | 'attendance' | 'grades' | 'messages' | 'profile' | 'payments' | 'settings';
  critical: boolean;
  description?: string;
  navigationParams?: Record<string, any>;
}
```

#### `getScreensByCategory(category)`

Get screens filtered by category.

**Example**:
```typescript
import { getScreensByCategory } from './src/utils/devOnly';

const authScreens = getScreensByCategory('auth');
console.log('Auth screens:', authScreens.length); // 2
```

#### `getCriticalScreens()`

Get only critical screens (must pass testing).

**Returns**: `ScreenChecklistItem[]`

#### `printChecklist()`

Print formatted checklist to console.

**Example**:
```typescript
import { printChecklist } from './src/utils/devOnly';

printChecklist();
// Output:
// === Screen Testing Checklist ===
// Total Screens: 37
// Critical Screens: 28
// [AUTH] 2 screens
//   🔴 CRITICAL Login Screen (auth/login)
// ...
```

---

### Performance Testing

#### `measurePerformance(operation, fn, target, max)`

Measure execution time of an async operation.

**Parameters**:
- `operation`: string - Name of the operation
- `fn`: () => Promise<void> - Function to measure
- `target`: number - Target time in milliseconds
- `max`: number - Maximum acceptable time in milliseconds

**Returns**: `Promise<PerformanceMetrics>`

**Example**:
```typescript
import { measurePerformance } from './src/utils/devOnly';

const metric = await measurePerformance(
  'Load Student Data',
  async () => {
    await fetchStudentData();
  },
  500, // Target: 500ms
  1000 // Max: 1000ms
);

console.log(`Duration: ${metric.duration}ms, Passed: ${metric.passed}`);
```

#### `measureNavigation(navigation, route, params?)`

Measure navigation performance to a route.

**Returns**: `Promise<PerformanceMetrics>`

**Example**:
```typescript
import { measureNavigation } from './src/utils/devOnly';

const metric = await measureNavigation(
  navigation,
  'StudentDetail',
  { studentId: '123' }
);

console.log(`Navigation took: ${metric.duration}ms`);
```

#### `measureMemoryUsage()`

Get current memory usage (if available).

**Returns**: `PerformanceMetrics | null`

#### `runPerformanceTests(navigation?)`

Run complete performance test suite.

**Returns**: `Promise<PerformanceReport>`

```typescript
interface PerformanceReport {
  totalOperations: number;
  passed: number;
  failed: number;
  metrics: PerformanceMetrics[];
}
```

**Example**:
```typescript
import { runPerformanceTests } from './src/utils/devOnly';

const report = await runPerformanceTests(navigation);
console.log(`Passed: ${report.passed}/${report.totalOperations}`);
```

---

## Console Output Format

### `runDevChecks()` Output

```
╔════════════════════════════════════════════════╗
║  EContact Mobile - Dev Mode Verification        ║
╚════════════════════════════════════════════════╝

=== New Architecture Verification ===
Platform: ios
New Architecture Enabled: true
Hermes Enabled: true
TurboModules Enabled: true
Fabric Enabled: true
======================================

=== Screen Testing Checklist ===
Total Screens: 37
Critical Screens: 28

[AUTH] 2 screens
  🔴 CRITICAL Login Screen (auth/login)
  ⚪ Forgot Password (auth/forgot-password)

[DASHBOARD] 6 screens
  🔴 CRITICAL Parent Dashboard (parent/dashboard)
  ...

╔════════════════════════════════════════════════╗
║  Verification Summary                          ║
╚════════════════════════════════════════════════╝

✓ New Architecture: ENABLED
✓ Hermes: ENABLED
✓ Fabric: ENABLED
✓ TurboModules: ENABLED
✓ Version Supported: YES
✓ Screen Count: VALID

TurboModules: ['NativeStatusBarManager', 'NativeDeviceInfo', ...]

════════════════════════════════════════════════
```

---

## Performance Benchmarks

| Metric | Target | Max | Status |
|--------|--------|-----|--------|
| App Startup | <2s | 3s | ⏳ |
| Screen Transition | <300ms | 500ms | ⏳ |
| List Scroll (60fps) | No drops | 1 drop/100 items | ⏳ |
| Memory Usage | <200MB | 300MB | ⏳ |

---

## Screen Testing Checklist

### For Each Screen, Verify:

#### 1. Rendering
- [ ] Screen loads without crash
- [ ] All elements visible
- [ ] No layout shifts
- [ ] Styling correct
- [ ] Safe areas correct (iOS)

#### 2. Interactions
- [ ] Buttons respond to touch
- [ ] Inputs accept text
- [ ] Scrolls work smoothly
- [ ] Modals open/close

#### 3. Navigation
- [ ] Back button works
- [ ] Deep links work
- [ ] Tab transitions smooth
- [ ] Navigation params passed correctly

#### 4. Data
- [ ] Mock data loads
- [ ] API calls succeed (when implemented)
- [ ] Loading states work
- [ ] Errors handled gracefully

---

## Test Execution Steps

1. **Setup**
   - Build development version: `npx expo prebuild`
   - Start development server: `npx expo start --clear`
   - Install on test device

2. **Run Verification**
   - Launch app
   - Check console for `runDevChecks()` output
   - Verify New Architecture is enabled

3. **Test Screens**
   - Use `SCREEN_CHECKLIST` as guide
   - Test all 37 screens
   - Mark issues in test report

4. **Run Performance Tests**
   - Execute `runPerformanceTests()`
   - Review benchmark results
   - Document any failures

5. **Document Results**
   - Fill out `TEST_REPORT_TEMPLATE.md`
   - Attach screenshots of issues
   - Note any platform-specific problems

---

## Platform-Specific Testing

### iOS
- Safe areas (notch, home indicator)
- Status bar behavior
- Swipe back gesture
- Dark mode

### Android
- Back button handling
- Hardware keyboard
- Edge-to-edge display
- Material Design 3

---

## Known Issues & Workarounds

### Performance API
- React Native 0.81+ has `performance.now()` in global scope
- Fallback to `Date.now()` for older versions
- Memory usage measurement may not be available on all platforms

### Navigation Testing
- Dynamic navigation uses `@ts-expect-error` for type safety
- Test routes should exist in navigation structure
- Params must match route definition

---

## Next Steps After Testing

1. **Review Test Results**
   - Check all critical screens pass
   - Verify performance benchmarks met
   - Identify any regressions

2. **Document Issues**
   - Create GitHub issues for bugs found
   - Prioritize by severity (critical/high/low)
   - Assign to appropriate developers

3. **Fix Issues**
   - Address critical blockers first
   - Re-test after fixes
   - Update test report

4. **Sign-Off**
   - QA approval required
   - Performance benchmarks met
   - No critical regressions

5. **Phase Completion**
   - Mark Phase 04 as complete
   - Update documentation
   - Deploy to production

---

## Related Documentation

- [Phase 04: Testing Plan](../../../plans/260119-1816-expo-sdk-54-upgrade/phase-04-testing.md)
- [Test Report Template](./TEST_REPORT_TEMPLATE.md)
- [System Architecture](../../../docs/system-architecture.md)
- [Deployment Guide](../../../docs/deployment-guide.md)

---

**Version**: 1.0
**Last Updated**: 2026-01-19
**Phase**: Phase 04 - Testing
