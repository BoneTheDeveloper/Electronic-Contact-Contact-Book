# Phase 05: Component Testing

**Parent Plan:** [plan.md](./plan.md)
**Research Reports:** [researcher-01](./research/researcher-01-report.md) | [researcher-02](./research/researcher-02-report.md)

## Overview

**Date:** 2026-01-21
**Description:** Test all 37 screens and components with New Architecture enabled to identify regressions
**Priority:** P1 (Critical - validation)
**Status:** pending
**Effort:** 4h

## Key Insights

- 43 source files total (screens, navigation, stores, theme)
- React Native Paper components most likely to have issues
- Navigation transitions should be smoother with Fabric
- Need systematic testing approach for each screen

## Requirements

1. Test all authentication screens (2 screens)
2. Test all parent screens (13 screens)
3. Test all student screens (3 screens)
4. Test navigation between all screens
5. Test all React Native Paper components
6. Document any issues found
7. Fix critical issues immediately

## Architecture

```
Screen Hierarchy:
├── Auth (2 screens)
│   ├── LoginScreen
│   └── CustomLoginScreen
├── Parent (13 screens)
│   ├── Dashboard
│   ├── Schedule
│   ├── Grades
│   ├── Attendance
│   ├── Messages
│   ├── Notifications
│   ├── News
│   ├── Payment Overview
│   ├── Payment Method
│   ├── Payment Detail
│   ├── Payment Receipt
│   ├── Teacher Directory
│   ├── Teacher Feedback
│   ├── Leave Request
│   └── Summary
└── Student (3 screens)
    ├── Dashboard
    ├── Schedule
    └── Grades
```

## Related Code Files

- **All Screens:** `/apps/mobile/src/screens/`
- **Navigation:** `/apps/mobile/src/navigation/`
- **Stores:** `/apps/mobile/src/stores/`
- **Theme:** `/apps/mobile/src/theme/`

## Implementation Steps

### Step 1: Create Testing Checklist

Create `/apps/mobile/docs/NEW_ARCHITECTURE_TESTING.md`:

```markdown
# New Architecture Testing Checklist

**Date:** 2026-01-21
**Platform:** Android + iOS
**Architecture:** Fabric + TurboModules ENABLED

## Test Environment
- [ ] Android emulator/device running
- [ ] iOS simulator/device running
- [ ] Metro bundler connected
- [ ] New Architecture verified enabled

## Authentication Screens (2)

### LoginScreen
- [ ] Screen renders without crashes
- [ ] Email input accepts text
- [ ] Password input accepts text
- [ ] Login button pressable
- [ ] Navigation to Parent/Student screens works
- [ ] Mock authentication works
- [ ] No console errors

### CustomLoginScreen
- [ ] Custom UI renders correctly
- [ ] All interactive elements work
- [ ] No layout issues
- [ ] No console errors

## Parent Screens (13)

### Dashboard
- [ ] 9 service icons render correctly
- [ ] All icons pressable
- [ ] Navigation to each service works
- [ ] Header displays correctly
- [ ] No layout issues
- [ ] No console errors

### Schedule
- [ ] Calendar displays
- [ ] Schedule items render
- [ ] List scrolls smoothly
- [ ] No Paper component issues
- [ ] No console errors

### Grades
- [ ] Grade cards render
- [ ] List scrolls smoothly
- [ ] Detail navigation works
- [ ] Paper components (Card, List) work
- [ ] No console errors

### Attendance
- [ ] Attendance records display
- [ ] Charts render (if any)
- [ ] List scrolls smoothly
- [ ] No console errors

### Messages
- [ ] Message list renders
- [ ] Individual messages viewable
- [ ] No Paper component issues
- [ ] No console errors

### Notifications
- [ ] Notification list renders
- [ ] Mark as read works
- [ ] Delete works (if implemented)
- [ ] No console errors

### News
- [ ] News articles render
- [ ] Images load correctly
- [ ] Article detail view works
- [ ] No console errors

### Payment Overview
- [ ] Payment summary displays
- [ ] Charts render correctly
- [ ] Navigation to detail screens works
- [ ] No console errors

### Payment Method
- [ ] Payment methods list renders
- [ ] Add method works (mock)
- [ ] Edit method works (mock)
- [ ] No console errors

### Payment Detail
- [ ] Payment details display
- [ ] Receipt download works (mock)
- [ ] No console errors

### Payment Receipt
- [ ] Receipt renders correctly
- [ ] Share works (mock)
- [ ] No console errors

### Teacher Directory
- [ ] Teacher list renders
- [ ] Search/filter works
- [ ] Teacher detail view works
- [ ] No console errors

### Teacher Feedback
- [ ] Feedback form renders
- [ ] Form submission works (mock)
- [ ] No console errors

### Leave Request
- [ ] Leave request form renders
- [ ] Date picker works
- [ ] Submission works (mock)
- [ ] No console errors

### Summary
- [ ] Academic summary displays
- [ ] Charts render correctly
- [ ] Export works (mock)
- [ ] No console errors

## Student Screens (3)

### Student Dashboard
- [ ] Dashboard renders correctly
- [ ] Service icons work
- [ ] No layout issues
- [ ] No console errors

### Schedule
- [ ] Class schedule displays
- [ ] List scrolls smoothly
- [ ] No console errors

### Grades
- [ ] Grades display correctly
- [ ] Detail views work
- [ ] No console errors

## Navigation Tests

### Root Navigation
- [ ] Auth → Parent navigation works
- [ ] Auth → Student navigation works
- [ ] Parent → Auth logout works
- [ ] Student → Auth logout works

### Tab Navigation (Parent)
- [ ] All 5 tabs accessible
- [ ] Tab switching smooth
- [ ] Active tab highlighted
- [ ] No navigation state issues

### Stack Navigation
- [ ] Push navigation works
- [ ] Back button works
- [ ] Header displays correctly
- [ ] Transitions smooth (Fabric benefit)

## React Native Paper Components

### Common Components Used
- [ ] Button - renders and clickable
- [ ] Card - renders correctly
- [ ] List - renders and scrolls
- [ ] TextInput - accepts input
- [ ] Checkbox - toggles
- [ ] RadioButton - selects
- [ ] Switch - toggles
- [ ] Dialog - opens/closes
- [ ] FAB - displays and clickable
- [ ] Portal - renders overlays correctly
- [ ] Surface - renders correctly
- [ ] Title/Appbar - displays correctly
- [ ] ActivityIndicator - animates

### Theme Testing
- [ ] Light theme works
- [ ] Dark theme works
- [ ] Theme switching works
- [ ] Colors display correctly
- [ ] No theme-related crashes

## Performance Tests

### Rendering Performance
- [ ] Screen transitions smooth (60fps)
- [ ] List scrolling smooth (60fps)
- [ ] No visible jank
- [ ] Animations流畅

### Memory Usage
- [ ] No memory leaks detected
- [ ] Memory usage reasonable
- [ ] No excessive GC

## Console Error Check

### Expected: NO errors in these categories:
- [ ] No red box errors
- [ ] No yellow box warnings (unless expected)
- [ ] No Fabric-related errors
- [ ] No TurboModule errors
- [ ] No navigation errors
- [ ] No Paper component errors

## Issues Found

Document any issues here:

| Screen | Issue | Severity | Status |
|--------|-------|----------|--------|
| | | | |

Severity: Critical (blocks release), High (major UX issue), Medium (minor UX issue), Low (cosmetic)
```

### Step 2: Systematic Screen Testing

**Testing Order:**

1. **Authentication Flow** (15 min)
   ```bash
   # Launch app
   # Test LoginScreen
   # Test CustomLoginScreen
   # Verify navigation to Parent/Student dashboards
   ```

2. **Parent Tab Navigation** (30 min)
   ```bash
   # Navigate to each of 5 tabs
   # Verify tab switching smoothness
   # Check active tab highlighting
   ```

3. **Parent Dashboard** (30 min)
   ```bash
   # Test all 9 service icons
   # Verify navigation to each service
   # Check header rendering
   ```

4. **Parent Services - Scheduling** (30 min)
   ```bash
   # Test Schedule screen
   # Test Leave Request screen
   # Verify Paper components (List, Card)
   ```

5. **Parent Services - Academics** (45 min)
   ```bash
   # Test Grades screen
   # Test Attendance screen
   # Test Summary screen
   # Verify Paper components
   ```

6. **Parent Services - Communication** (30 min)
   ```bash
   # Test Messages screen
   # Test Notifications screen
   # Test News screen
   # Test Teacher Directory
   # Test Teacher Feedback
   ```

7. **Parent Services - Payments** (45 min)
   ```bash
   # Test Payment Overview
   # Test Payment Method
   # Test Payment Detail
   # Test Payment Receipt
   # Verify all Paper components
   ```

8. **Student Screens** (30 min)
   ```bash
   # Test Student Dashboard
   # Test Student Schedule
   # Test Student Grades
   ```

9. **Theme Switching** (15 min)
   ```bash
   # Test light theme
   # Test dark theme
   # Verify theme persistence
   ```

10. **Navigation Transitions** (15 min)
    ```bash
    # Test all stack transitions
    # Verify smoothness (Fabric benefit)
    # Test back navigation
    ```

### Step 3: Monitor Console Logs

```bash
# In separate terminal, monitor Metro logs
cd /c/Project/electric_contact_book/apps/mobile
npx expo start

# Watch for:
# - Red box errors
# - Yellow box warnings
# - Fabric-related messages
# - TurboModule errors
```

### Step 4: Check for React Native Paper Issues

**Common Paper Issues with New Architecture:**

1. **Rendering Glitches**
   - Check: Borders not rendering
   - Check: Shadows incorrect
   - Check: Elevation issues

2. **Touch Handling**
   - Check: Buttons not responding
   - Check: Touch targets incorrect
   - Check: Ripple effects missing

3. **Animation Issues**
   - Check: Modal transitions
   - Check: FAB animations
   - Check: Dialog animations

### Step 5: Document All Issues

Update `/apps/mobile/docs/NEW_ARCHITECTURE_TESTING.md` with findings.

### Step 6: Fix Critical Issues

If any critical issues found:

```bash
# Create fix branch
git checkout -b fix/newarch-issue-<screen-name>

# Implement fix
# Test fix

# Commit
git commit -m "fix(mobile): resolve <issue> with New Architecture"
```

## Todo List

- [ ] Create testing checklist document
- [ ] Test all 2 authentication screens
- [ ] Test all 13 parent screens
- [ ] Test all 3 student screens
- [ ] Test all navigation transitions
- [ ] Test all React Native Paper components
- [ ] Test theme switching (light/dark)
- [ ] Monitor console logs for errors
- [ ] Document all issues found
- [ ] Fix any critical issues
- [ ] Re-test fixed issues
- [ ] Verify no regressions introduced

## Success Criteria

- [ ] All 18 screens render without crashes
- [ ] All navigation works smoothly
- [ ] All React Native Paper components work
- [ ] No critical issues found
- [ ] No high-severity issues found
- [ ] Performance equal or better than old architecture
- [ ] Console logs show no errors
- [ ] Testing checklist 100% complete

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| React Native Paper rendering issues | High | Medium | Test thoroughly, monitor GitHub |
| Navigation broken | Low | High | React Navigation 7.x designed for New Arch |
| Memory leaks | Low | Medium | Monitor memory usage during testing |
| Performance degradation | Very Low | Low | New Architecture should improve performance |
| Critical bugs found | Medium | High | Fix immediately before proceeding |

## Rollback Plan

If too many critical issues found:

```bash
# Count critical issues
# If > 3 critical issues, consider rollback:

# 1. Revert to old architecture
git checkout app.json metro.config.js

# 2. Clean and rebuild
npx expo prebuild --clean
npx expo run:android
npx expo run:ios

# 3. Wait for library updates
# Monitor React Native Paper GitHub for Fabric support
```

## Next Steps

After component testing:

- All screens verified working
- Issues documented and fixed
- Proceed to [Phase 06: Integration Testing](./phase-06-integration-testing.md)
- Test complete user flows

## Validation Commands

```bash
cd /c/Project/electric_contact_book/apps/mobile

# 1. TypeScript check
npm run typecheck

# 2. Lint check
npm run lint

# 3. Testing checklist review
cat docs/NEW_ARCHITECTURE_TESTING.md

# 4. Git status (should be clean or only have test docs)
git status
```

## Testing Metrics

Track during testing:

**Time Estimates:**
- Auth screens: 15 min
- Parent screens: 3 hours
- Student screens: 30 min
- Navigation: 15 min
- Theme testing: 15 min
- **Total: ~4 hours**

**Pass Criteria:**
- 100% of screens render
- 0 critical issues
- < 3 high-severity issues
- All navigation works
- Performance ≥ old architecture

## Notes

- **CRITICAL:** Test EVERY screen - no shortcuts
- React Native Paper most likely to have issues
- Navigation should be smoother (Fabric benefit)
- Document EVERY issue found, even cosmetic
- Take screenshots of any issues for reference

## Known Issues to Watch For

### React Native Paper (GitHub #4454)
- "Significant number of small bugs"
- Focus on:
  - Border rendering
  - Shadow/elevation
  - Touch handling
  - Animations

### Navigation
- Should be smoother with Fabric
- Watch for:
  - Transition glitches
  - Header rendering
  - Back button behavior

### Performance
- Should see improvement in:
  - List scrolling
  - Screen transitions
  - Memory usage

## Reporting Issues

For each issue found, document:

1. **Screen/Component:** Which screen/component
2. **Issue Description:** What's wrong
3. **Severity:** Critical/High/Medium/Low
4. **Steps to Reproduce:** How to trigger
5. **Expected Behavior:** What should happen
6. **Actual Behavior:** What actually happens
7. **Screenshots:** If visual issue
8. **Console Logs:** Error messages if any
9. **Platform:** Android/iOS/Both
