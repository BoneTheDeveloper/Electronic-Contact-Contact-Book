---
title: "Phase 06: Testing and Verification"
description: "Complete end-to-end testing of development builds and OTA updates"
status: pending
priority: P1
effort: 1h
dependencies: ["phase-05-ota-updates"]
created: 2026-01-21
---

# Phase 06: Testing and Verification

**Context:** `plan.md` | **Prev:** `phase-05-ota-updates.md` | **Next:** Complete

## Overview

Complete end-to-end testing of development client builds and OTA updates to ensure workflow is production-ready.

## Testing Scope

**Core Functionality:**
- App launches and runs
- All screens render
- Navigation works
- Authentication works
- Fast Refresh works
- OTA updates work

**Platform Testing:**
- Android physical device
- iOS physical device (TestFlight)

## Key Insights

1. **Test Real Scenarios:** Use actual user workflows
2. **Test Both Platforms:** Android and iOS behavior may differ
3. **Test OTA Updates:** Critical workflow for rapid iteration
4. **Document Issues:** Track all bugs and fixes
5. **User Testing:** Get feedback from actual users

## Requirements

### Testing Devices

**Android:**
- Physical device with development build installed
- Android 5.0+ (Lollipop) or higher
- 100MB free space
- Same network as development machine

**iOS:**
- Physical device with TestFlight build installed
- iOS 15.1 or higher
- 200MB free space
- Same network as development machine

### Test Scenarios

**User Flows:**
- Parent login and navigation
- Student login and navigation
- All service screens
- Settings and preferences

**Technical Flows:**
- Development server connection
- Fast Refresh
- OTA updates
- Error handling

## Implementation Steps

### Step 1: Setup Testing Environment

```bash
cd C:\Project\electric_contact_book\apps\mobile

# 1. Start development server
npx expo start --dev-client

# 2. Note computer IP address
# Windows: ipconfig
# macOS/Linux: ifconfig

# 3. Ensure devices on same network

# 4. Test connection speed
# Ping device from computer
```

**Expected:**
- Dev server running without errors
- IP address noted
- Devices accessible on network

---

### Step 2: Android Testing

**Launch and Connection:**

- [ ] Development build opens without crash
- [ ] Connects to dev server
- [ ] Shows login screen
- [ ] No red box errors on launch

**Authentication:**

- [ ] Parent login works (parent@econtact.vn)
- [ ] Student login works (student@econtact.vn)
- [ ] Password field shows/hides correctly
- [ ] Login button responsive
- [ ] Navigation to correct screen

**Parent Dashboard:**

- [ ] 9 service icons display
- [ ] All icons pressable
- [ ] Child selector works
- [ ] News preview renders
- [ ] Notification badge shows
- [ ] Header displays correctly

**Navigation:**

- [ ] Schedule screen opens
- [ ] Grades screen opens
- [ ] Attendance screen opens
- [ ] Messages screen opens
- [ ] Notifications screen opens
- [ ] News screen opens
- [ ] Payment screens open
- [ ] Back button works
- [ ] Tab navigation works

**Fast Refresh Test:**

```bash
# 1. Open src/screens/parent/Dashboard.tsx
# 2. Change text: "Dashboard" → "Test Dashboard"
# 3. Save file
# 4. Check app updates within 1-2 seconds
# 5. Change text back
```

- [ ] Fast Refresh works
- [ ] Changes appear within 2 seconds
- [ ] No app restart required
- [ ] State preserved after refresh

**OTA Update Test:**

```bash
# 1. Make code change
# 2. Publish update
eas update --branch development --message "Test update"
# 3. Close app on device
# 4. Reopen app
# 5. Verify changes appear
```

- [ ] OTA update publishes successfully
- [ ] Update appears on device
- [ ] Changes visible after restart

---

### Step 3: iOS Testing

**Repeat all Android tests on iOS:**

- [ ] Launch and connection
- [ ] Authentication
- [ ] Dashboard
- [ ] Navigation
- [ ] Fast Refresh
- [ ] OTA updates

**iOS-Specific Tests:**

- [ ] TestFlight app works correctly
- [ ] App installs without issues
- [ ] App works on different iOS versions (15.1+)
- [ ] App works on different device sizes
- [ ] Safe areas render correctly
- [ ] Home indicator doesn't overlap UI

---

### Step 4: Error Handling

**Test Error Scenarios:**

**Network Issues:**

- [ ] Turn off wifi on device
- [ ] App shows "Cannot connect to server" message
- [ ] No crashes or red boxes
- [ ] Turn wifi back on
- [ ] App reconnects automatically

**Development Server Offline:**

```bash
# Stop dev server (Ctrl+C)
# Try to use app on device
```

- [ ] App shows "Waiting for development server" message
- [ ] No crashes
- [ ] Restart dev server
- [ ] App reconnects

**Invalid Navigation:**

- [ ] Test deep links (if implemented)
- [ ] Test back button on root screen
- [ ] Test malformed routes
- [ ] No crashes or red boxes

---

### Step 5: Performance Testing

**Launch Performance:**

- [ ] App launches in <3 seconds
- [ ] No visible lag during launch
- [ ] Splash screen displays correctly
- [ ] Smooth transition to login

**Scrolling Performance:**

- [ ] Dashboard scrolls smoothly (60fps)
- [ ] Long lists scroll smoothly
- [ ] No visible jank
- [ ] No frame drops

**Navigation Performance:**

- [ ] Screen transitions smooth
- [ ] No lag on button press
- [ ] Animations run at 60fps
- [ ] No stutters

---

### Step 6: Visual Testing

**Layout Checks:**

- [ ] No overflow issues
- [ ] Text not truncated
- [ ] Images display correctly
- [ ] Icons aligned properly
- [ ] Colors display correctly
- [ ] Dark mode works (if implemented)

**Responsive Design:**

- [ ] Works on phone screens
- [ ] Works on tablet screens (Android)
- [ ] Safe areas respected (iOS)
- [ ] Notch area handled correctly
- [ ] Home indicator doesn't overlap UI

**Theme Testing:**

- [ ] Light theme works
- [ ] Dark mode works (if implemented)
- [ ] Theme switching works (if implemented)
- [ ] Colors consistent across screens

---

### Step 7: Accessibility Testing

**Basic Accessibility:**

- [ ] Text readable (contrast)
- [ ] Touch targets large enough (44x44 min)
- [ ] Icons have labels
- [ ] Navigation is intuitive
- [ ] Error messages clear

**Screen Reader (Optional):**

- [ ] Test with TalkBack (Android)
- [ ] Test with VoiceOver (iOS)
- [ ] All elements announced correctly
- [ ] Buttons are focusable

---

### Step 8: Document Test Results

**Create Test Report:**

```markdown
# Development Build Test Report

**Date:** [DATE]
**Build ID:** [BUILD_ID]
**Tester:** [NAME]

## Android Tests

### Launch & Connection
- [x] App launches without crash
- [x] Connects to dev server
- [ ] Issue: [Description]

### Authentication
- [x] Parent login works
- [x] Student login works
- [ ] Issue: [Description]

### Navigation
- [x] All screens accessible
- [x] Back button works
- [ ] Issue: [Description]

### Fast Refresh
- [x] Fast Refresh works
- [x] Updates appear within 2 seconds
- [ ] Issue: [Description]

### OTA Updates
- [x] Updates publish successfully
- [x] Updates install on device
- [ ] Issue: [Description]

## iOS Tests

### Launch & Connection
- [ ] App launches without crash
- [ ] Connects via TestFlight
- [ ] Issue: [Description]

[... repeat all tests ...]

## Issues Found

| ID | Description | Severity | Status |
|----|-------------|----------|--------|
| 1 | [Issue description] | [Severity] | [Open/Fixed] |
| 2 | [Issue description] | [Severity] | [Open/Fixed] |

## Test Artifacts

**Screenshots:**
- [ ] Login screen
- [ ] Parent dashboard
- [ ] Student dashboard
- [ ] Settings screen
- [ ] Error messages

**Videos:**
- [ ] Navigation flow
- [ ] Fast Refresh demo
- [ ] OTA update demo

## Conclusion

**Overall Status:** Pass/Fail

**Ready for Production:** Yes/No

**Recommendations:**
- [List any recommendations]

**Next Steps:**
- [List any follow-up actions]
```

---

### Step 9: Create Quick Start Guide

**Create `apps/mobile/docs/DEVELOPMENT_QUICK_START.md`:**

```markdown
# Development Build Quick Start

## For Developers

### Start Development Server
```bash
cd apps/mobile
npx expo start --dev-client
```

### Connect Device

**Android:**
1. Open development build app
2. Shake device for dev menu
3. Select "Enter URL manually"
4. Enter: `exp://[COMPUTER_IP]:8081`

**iOS:**
1. Open development build via TestFlight
2. Shake device for dev menu
3. Select "Enter URL manually"
4. Enter: `exp://[COMPUTER_IP]:8081`

### Make Changes

1. Edit code in `src/`
2. Save file
3. Fast Refresh updates app automatically

### Publish OTA Update

```bash
# Development
eas update --branch development --message "Update"

# Production
eas update --branch production --message "Fix"
```

## For Testers

### Install Development Build

**Android:**
1. Download APK from [LINK]
2. Install on device
3. Open app

**iOS:**
1. Accept TestFlight invite
2. Install "EContact School"
3. Open app

### Test App

1. Login with parent@econtact.vn (any password)
2. Navigate through screens
3. Test features
4. Report issues

### Update App

1. Close app
2. Reopen app
3. Wait 5-10 seconds
4. Changes appear automatically

## Troubleshooting

**Cannot connect to dev server:**
- Check same network
- Check computer IP address
- Restart dev server

**App crashes:**
- Check device logs
- Restart app
- Report issue with details

**Update not appearing:**
- Close and reopen app
- Check internet connection
- Wait 10 seconds
```

---

## Todo List

- [ ] Setup testing environment
- [ ] Complete Android testing
- [ ] Complete iOS testing
- [ ] Test error handling
- [ ] Test performance
- [ ] Test visual layout
- [ ] Test accessibility
- [ ] Document test results
- [ ] Create quick start guide
- [ ] Fix any critical issues found

## Success Criteria

**Phase Complete When:**
- All core functionality tested on Android
- All core functionality tested on iOS
- Fast Refresh working
- OTA updates working
- No critical bugs
- Test report created
- Quick start guide created

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Critical bug found | Medium | High | Fix and rebuild |
| Performance issues | Medium | Medium | Optimize code |
| iOS TestFlight issues | Low | Medium | Use alternative distribution |
| Network issues | Medium | Low | Use tunnel mode |

## Troubleshooting

### Issue: "Test device won't connect"

**Solutions:**
```bash
# 1. Check same network
# 2. Check IP address
# 3. Check firewall
# 4. Try tunnel mode
npx expo start --tunnel
```

---

### Issue: "Critical bug found in testing"

**Solutions:**
```bash
# 1. Fix bug in code
# 2. Test fix locally
# 3. Publish OTA update if JavaScript only
eas update --branch development --message "Bug fix"
# 4. Rebuild if native issue
eas build --profile development --platform android
```

---

### Issue: "Performance issues"

**Solutions:**
```bash
# 1. Profile with React DevTools
# 2. Check for unnecessary re-renders
# 3. Optimize heavy computations
# 4. Use React.memo for expensive components
# 5. Lazy load screens
```

---

## Validation Commands

```bash
cd C:\Project\electric_contact_book\apps\mobile

# 1. Start dev server
npx expo start --dev-client

# 2. Check build status
eas build:list

# 3. Check updates
eas update:list --branch development

# 4. Monitor app performance
# Open React DevTools on device
# Shake device > Show Perf Monitor

# 5. Check for errors
# Monitor terminal output
# Check device logs
```

## Testing Checklist Summary

### Android Checklist

- [ ] Launch and connection
- [ ] Authentication
- [ ] Parent dashboard
- [ ] Student dashboard
- [ ] All service screens
- [ ] Navigation
- [ ] Fast Refresh
- [ ] OTA updates
- [ ] Error handling
- [ ] Performance
- [ ] Visual layout

### iOS Checklist

- [ ] Launch and connection
- [ ] TestFlight installation
- [ ] All Android tests repeated
- [ ] iOS-specific features
- [ ] Different iOS versions
- [ ] Different device sizes

### Critical Tests (Must Pass)

- [ ] App launches without crash
- [ ] Authentication works
- [ ] Core navigation works
- [ ] Fast Refresh works
- [ ] OTA updates work
- [ ] No critical bugs

## Related Files

- `apps/mobile/docs/TEST_REPORT.md` - Test report (to create)
- `apps/mobile/docs/DEVELOPMENT_QUICK_START.md` - Quick start (to create)
- `apps/mobile/docs/INTEGRATION_TEST_PLAN.md` - Existing test plan

## Next Steps

After testing complete and all issues resolved:

1. **Document workflow** - Ensure team can reproduce
2. **Create onboarding guide** - For new developers
3. **Monitor production** - Set up crash reporting
4. **Iterate** - Continuously improve

## Important Notes

**Testing Priorities:**
1. **Critical:** App crashes, data loss, security issues
2. **High:** Core features broken, major UX issues
3. **Medium:** Minor bugs, visual issues
4. **Low:** Cosmetic issues, nice-to-haves

**Fix Priority:**
- Fix critical issues immediately
- Fix high issues before production
- Address medium issues in next sprint
- Track low issues for future

**Test Coverage:**
- Test all user-facing features
- Test all error scenarios
- Test edge cases
- Test on multiple devices
- Test with different network conditions

---

**Status:** Pending
**Last Updated:** 2026-01-21
