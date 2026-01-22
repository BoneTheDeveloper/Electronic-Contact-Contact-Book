# Phase 06: Integration Testing

**Parent Plan:** [plan.md](./plan.md)
**Research Reports:** [researcher-01](./research/researcher-01-report.md) | [researcher-02](./research/researcher-02-report.md)

## Overview

**Date:** 2026-01-21
**Description:** End-to-end testing of complete user flows on physical devices with New Architecture
**Priority:** P1 (Critical - production validation)
**Status:** pending
**Effort:** 3h

## Key Insights

- Component testing verified individual screens work
- Integration testing verifies complete user flows
- Must test on REAL physical devices (not just emulators)
- Test both Android and iOS if possible
- Focus on real-world usage scenarios

## Requirements

1. Test authentication flow end-to-end
2. Test parent user flows (dashboard → services → details)
3. Test student user flows (dashboard → academics)
4. Test navigation complexity (deep linking, back navigation)
5. Test state management (Zustand) across screens
6. Test AsyncStorage for data persistence
7. Test theme switching persistence
8. Test app backgrounding/foregrounding
9. Test app restart (kill and reopen)
10. Verify performance on real hardware

## Architecture

```
User Flows to Test:

1. Authentication Flow
   Parent Login → Dashboard → Services → Logout

2. Academic Flow
   Dashboard → Grades → Grade Detail → Back → Schedule → Back

3. Payment Flow
   Dashboard → Payment Overview → Payment Method → Payment Detail → Receipt

4. Communication Flow
   Dashboard → Messages → Message Detail → Back → Notifications → News

5. Teacher Interaction Flow
   Dashboard → Teacher Directory → Teacher Detail → Feedback → Submit

6. Settings Flow
   Theme Toggle → Verify All Screens → Restart App → Verify Persistence
```

## Related Code Files

- **Auth:** `/apps/mobile/src/screens/auth/`
- **Parent:** `/apps/mobile/src/screens/parent/`
- **Student:** `/apps/mobile/src/screens/student/`
- **Navigation:** `/apps/mobile/src/navigation/`
- **Stores:** `/apps/mobile/src/stores/`
- **Mock Data:** `/apps/mobile/src/mock-data/`

## Implementation Steps

### Step 1: Prepare Physical Devices

#### Android Device Setup

```bash
# Enable Developer Options on Android device
# Settings → About Phone → Tap Build Number 7 times

# Enable USB Debugging
# Settings → Developer Options → USB Debugging

# Verify device connected
adb devices

# Install development build
npx expo run:android
```

**Expected:** Device listed in `adb devices`

#### iOS Device Setup

```bash
# Requires Apple Developer account ($99/year)
# Enable Developer Mode on iPhone (iOS 16+)
# Settings → Privacy & Security → Developer Mode

# Trust computer on iPhone
# Connect iPhone via USB

# Install development build
npx expo run:ios --device
```

**Expected:** App installs on iPhone

### Step 2: Create Integration Test Plan

Create `/apps/mobile/docs/INTEGRATION_TEST_PLAN.md`:

```markdown
# Integration Test Plan - New Architecture

**Date:** 2026-01-21
**Devices:** Physical Android + Physical iOS
**Architecture:** Fabric + TurboModules ENABLED

## Test Environment Setup
- [ ] Physical Android device connected
- [ ] Physical iOS device connected (if available)
- [ ] Development build installed on both
- [ ] Metro bundler running
- [ ] App launched and New Architecture verified

## Test Scenarios

### Scenario 1: Parent Complete Flow (15 min)

**Steps:**
1. Launch app
2. Enter parent email: `parent@econtact.vn`
3. Enter any password
4. Tap login
5. Verify navigation to Parent Dashboard
6. Tap Schedule icon
7. Verify Schedule screen loads
8. Tap back
9. Tap Grades icon
10. Verify Grades screen loads
11. Tap first grade card
12. Verify grade detail opens
13. Tap back
14. Tap bottom tab: Messages
15. Verify Messages screen loads
16. Tap first message
17. Verify message detail opens
18. Tap back
19. Tap bottom tab: Notifications
20. Verify Notifications screen loads
21. Tap bottom tab: Profile (if available)
22. Tap logout
23. Verify navigation to login screen

**Expected Results:**
- All navigations smooth (Fabric benefit)
- No crashes
- No jank or stuttering
- Console shows no errors
- Back button works correctly throughout
- Tab switching instant

**Actual Results:**
_________________________________________________
_________________________________________________

**Issues Found:**
_________________________________________________

---

### Scenario 2: Student Complete Flow (10 min)

**Steps:**
1. Launch app
2. Enter student email: `student@econtact.vn`
3. Enter any password
4. Tap login
5. Verify navigation to Student Dashboard
6. Tap Schedule
7. Verify Schedule screen loads
8. Tap back
9. Tap Grades
10. Verify Grades screen loads
11. Tap back
12. Tap logout (if available)
13. Verify navigation to login screen

**Expected Results:**
- All navigations smooth
- No crashes
- No rendering issues
- Console shows no errors

**Actual Results:**
_________________________________________________
_________________________________________________

**Issues Found:**
_________________________________________________

---

### Scenario 3: Payment Flow (10 min)

**Steps:**
1. Login as parent
2. From Dashboard, tap Payment icon
3. Verify Payment Overview loads
4. Tap first payment
5. Verify Payment Detail loads
6. Tap Download Receipt
7. Verify receipt screen opens
8. Tap back
9. Tap back to return to Overview
10. Tap Payment Method
11. Verify Payment Method screen loads
12. Tap Add Method (if available)
13. Verify form opens
14. Tap cancel/back

**Expected Results:**
- All screens render correctly
- Paper components work (Cards, Buttons, Lists)
- No layout issues
- Smooth transitions

**Actual Results:**
_________________________________________________
_________________________________________________

**Issues Found:**
_________________________________________________

---

### Scenario 4: Theme Persistence (5 min)

**Steps:**
1. Launch app
2. Login as parent
3. Toggle to dark mode (if available)
4. Verify all screens dark mode
5. Navigate through 5+ screens
6. Kill app (swipe away)
7. Relaunch app
8. Verify still in dark mode
9. Toggle to light mode
10. Kill app
11. Relaunch app
12. Verify still in light mode

**Expected Results:**
- Theme persists across app restarts
- AsyncStorage works with New Architecture
- No data loss
- Theme applies to all screens

**Actual Results:**
_________________________________________________
_________________________________________________

**Issues Found:**
_________________________________________________

---

### Scenario 5: Performance Under Load (10 min)

**Steps:**
1. Launch app
2. Login as parent
3. Rapidly tap through 10 different screens
4. Rapidly switch between bottom tabs 20 times
5. Open and close 5 different modals/dialogs
6. Scroll through long lists quickly
7. Monitor performance

**Expected Results:**
- No frame drops (maintain 60fps)
- No memory leaks
- No crashes
- Smooth animations throughout
- Better performance than old architecture

**Actual Results:**
_________________________________________________
_________________________________________________

**Issues Found:**
_________________________________________________

---

### Scenario 6: App Backgrounding (5 min)

**Steps:**
1. Launch app
2. Login as parent
3. Navigate to any screen
4. Press home button (background app)
5. Wait 30 seconds
6. Return to app
7. Verify screen still renders correctly
8. Navigate to another screen
9. Background again
10. Wait 2 minutes
11. Return to app
12. Verify still responsive

**Expected Results:**
- App resumes correctly
- No white screen
- No crashes on resume
- State maintained
- Console shows no errors

**Actual Results:**
_________________________________________________
_________________________________________________

**Issues Found:**
_________________________________________________

---

### Scenario 7: Memory & Battery (5 min)

**Steps:**
1. Open device settings
2. Check memory usage before app
3. Launch app
4. Login and navigate through 10 screens
5. Check memory usage
6. Leave app open for 5 minutes
7. Check battery usage
8. Close app
9. Check memory released

**Expected Results:**
- Memory usage reasonable (< 200MB)
- Memory released when app closed
- Battery drain minimal
- No memory leaks

**Actual Results:**
_________________________________________________
_________________________________________________

**Issues Found:**
_________________________________________________

---

## Device-Specific Testing

### Android Device
- [ ] All scenarios pass on Android
- [ ] Back button works correctly
- [ ] Hardware back navigation works
- [ ] Navigation bar doesn't overlap content
- [ ] Status bar renders correctly
- [ ] No Android-specific crashes

### iOS Device
- [ ] All scenarios pass on iOS
- [ ] Swipe back gesture works
- [ ] Home indicator doesn't overlap content
- [ ] Notch/Dynamic Island handled correctly
- [ ] No iOS-specific crashes

## Console Monitoring

During all tests, monitor for:

**Expected:**
- No red box errors
- No yellow box warnings (unless expected)
- No Fabric errors
- No TurboModule errors
- No AsyncStorage errors
- No navigation errors

**Check for:**
```
Fabric is enabled
TurboModules are enabled
```

## Performance Metrics

Record these metrics:

**Android:**
- App launch time: _____ seconds
- Screen transition time: _____ ms
- List scroll FPS: _____ fps
- Memory usage: _____ MB
- Battery drain: _____ %/hour

**iOS:**
- App launch time: _____ seconds
- Screen transition time: _____ ms
- List scroll FPS: _____ fps
- Memory usage: _____ MB
- Battery drain: _____ %/hour

## Issues Summary

| Scenario | Platform | Issue | Severity | Status |
|----------|----------|-------|----------|--------|
| | | | | |

## Overall Assessment

**Ready for Production:**
- [ ] Yes - All tests pass
- [ ] No - Issues need fixing

**Blockers:**
_________________________________________________

**Recommendations:**
_________________________________________________
```

### Step 3: Execute Test Scenarios

Run through each scenario in the test plan:

```bash
# Start Metro bundler with clear cache
cd /c/Project/electric_contact_book/apps/mobile
npx expo start --clear

# On physical device:
# 1. Open development build app
# 2. Shake device to open dev menu
# 3. Tap "Reload" to clear cache
# 4. Begin testing scenarios
```

### Step 4: Monitor Console Logs

While testing, keep eye on Metro console:

```bash
# In terminal running npx expo start
# Watch for:
# - Red errors
# - Yellow warnings
# - Fabric/TurboModule messages
# - Performance warnings
```

### Step 5: Check Device Logs

#### Android Logs

```bash
# In separate terminal
adb logcat *:S ReactNative:V ReactNativeJS:V

# Look for:
# - FATAL exceptions
# - ReactNative errors
# - Fabric errors
# - TurboModule errors
```

#### iOS Logs

```bash
# Open Console.app on Mac
# Filter by device
# Look for app-specific errors
```

### Step 6: Document All Issues

Update test plan document with actual results and issues.

### Step 7: Performance Profiling

#### Android Profiling

```bash
# Open Android Studio
# Tools → Profiler
# Select app process
# Monitor:
# - CPU usage
# - Memory usage
# - Network activity
# - Battery usage
```

#### iOS Profiling

```bash
# Open Xcode
# Window → Devices and Simulators
# Select device
# Open console for app
# Or use Instruments for detailed profiling
```

## Todo List

- [ ] Prepare Android physical device
- [ ] Prepare iOS physical device (if available)
- [ ] Install development build on devices
- [ ] Create integration test plan document
- [ ] Execute Scenario 1: Parent Complete Flow
- [ ] Execute Scenario 2: Student Complete Flow
- [ ] Execute Scenario 3: Payment Flow
- [ ] Execute Scenario 4: Theme Persistence
- [ ] Execute Scenario 5: Performance Under Load
- [ ] Execute Scenario 6: App Backgrounding
- [ ] Execute Scenario 7: Memory & Battery
- [ ] Monitor console logs during all tests
- [ ] Check device logs
- [ ] Profile performance metrics
- [ ] Document all issues found
- [ ] Fix any critical issues
- [ ] Re-test fixed issues
- [ ] Verify performance acceptable

## Success Criteria

- [ ] All 7 test scenarios pass on Android
- [ ] All 7 test scenarios pass on iOS (if available)
- [ ] No crashes during any scenario
- [ ] No critical issues found
- [ ] No high-severity issues found
- [ ] Performance equal or better than old architecture
- [ ] Memory usage acceptable
- [ ] Battery drain acceptable
- [ ] Theme persistence works
- [ ] AsyncStorage works with New Architecture

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| App crashes on physical device | Low | Critical | Check device logs, verify build configuration |
| Performance worse than old arch | Very Low | Medium | New Architecture should improve performance |
| Memory leaks detected | Low | High | Profile with tools, check for improper cleanup |
| AsyncStorage issues | Very Low | Medium | TurboModule support verified |
| Theme persistence fails | Very Low | Low | Simple key-value storage |

## Rollback Plan

If integration testing fails:

```bash
# Document all issues
# Assess severity
# If > 2 critical issues:

# Consider rollback:
git checkout app.json metro.config.js
npx expo prebuild --clean
npx expo run:android
npx expo run:ios

# Wait for library updates
# Re-test when libraries updated
```

## Next Steps

After integration testing:

- All user flows verified working
- Performance acceptable
- Proceed to [Phase 07: Production Build](./phase-07-production-build.md)
- Configure production builds for app stores

## Validation Commands

```bash
cd /c/Project/electric_contact_book/apps/mobile

# 1. TypeScript check
npm run typecheck

# 2. Lint check
npm run lint

# 3. Review integration test results
cat docs/INTEGRATION_TEST_PLAN.md

# 4. Check for any uncommitted changes
git status
```

## Testing Metrics

**Time Estimates:**
- Device setup: 30 min
- Scenario 1: 15 min
- Scenario 2: 10 min
- Scenario 3: 10 min
- Scenario 4: 5 min
- Scenario 5: 10 min
- Scenario 6: 5 min
- Scenario 7: 5 min
- Documentation: 30 min
- **Total: ~2 hours**

**Pass Criteria:**
- All scenarios pass
- 0 critical issues
- < 2 high-severity issues
- Performance ≥ old architecture
- Memory usage < 250MB
- Battery drain < 10%/hour

## Notes

- **CRITICAL:** Must test on REAL physical devices
- Emulators/simulators don't catch all issues
- Test rapid user interactions (stress test)
- Monitor for memory leaks (leave app running)
- Test edge cases (backgrounding, low memory)
- Document performance metrics for comparison

## Performance Baseline

**Old Architecture (Expected):**
- App launch: 2-3 seconds
- Screen transition: 200-300ms
- List scroll: 50-55fps
- Memory: ~150-200MB

**New Architecture (Target):**
- App launch: 2-3 seconds (similar)
- Screen transition: 150-200ms (improved)
- List scroll: 55-60fps (improved)
- Memory: ~120-150MB (improved)

## Known Issues to Watch For

### Physical Device Specific
- Touch handling differences
- Keyboard appearance
- Status bar overlap
- Notch/ Dynamic Island issues
- Back button behavior (Android)
- Gesture conflicts (iOS)

### Performance Issues
- Frame drops during transitions
- Stuttering list scrolling
- Memory leaks over time
- Excessive battery drain
- Slow app launch

### State Management
- Zustand state not updating
- AsyncStorage not persisting
- Theme not applying correctly
- Navigation state lost
