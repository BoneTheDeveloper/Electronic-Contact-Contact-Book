---
title: "Phase 05: Integration & Testing"
description: "End-to-end testing, bug fixes, and deployment preparation"
status: completed
priority: P1
effort: 4h
created: 2026-01-12
completed: 2026-01-13
---

# Phase 05: Integration & Testing

## Context Links
- Parent: [plan.md](./plan.md)
- Depends: All previous phases (must complete first)
- Docs: [development-rules](../../.claude/workflows/development-rules.md)

## Parallelization Info
- **Must run after**: All phases 01-04D
- **Cannot run in parallel**: Sequential testing required
- **Final phase**: Validates all work

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 |
| Status | Pending |
| Description | Test all apps, fix bugs, prepare for demo |
| Review Status | Not Started |

## Key Insights
- Test real user flows, not just components
- Mobile and web should share mock data
- All roles (admin, teacher, parent, student) need testing

## Requirements
- All previous phases complete
- Expo Go for mobile testing
- Web browser for testing
- No fake mocks or cheats

## Architecture

### Testing Matrix
| Platform | Role | Key Flows |
|----------|------|-----------|
| Mobile | Parent | Login → Dashboard → View grades → Check attendance → View payments |
| Mobile | Student | Login → Dashboard → View schedule |
| Web | Admin | Login → Dashboard → Manage users → View payments |
| Web | Teacher | Login → Dashboard → Mark attendance → Enter grades |

## File Ownership

### Files to Modify (may touch any)
| File | Owner |
|------|-------|
| Bug fixes across all apps | Phase 05 |
| Test configuration files | Phase 05 |
| Documentation updates | Phase 05 |

## Implementation Steps

1. **Setup Testing Infrastructure**
   ```bash
   # Install testing dependencies
   cd apps/mobile && npm install --save-dev jest @testing-library/react-native
   cd apps/web && npm install --save-dev vitest @testing-library/react
   ```

2. **Test Mobile App**
   ```bash
   # Start Expo dev server
   cd apps/mobile
   npx expo start

   # Test on:
   # - iOS Simulator
   # - Android Emulator
   # - Expo Go app on physical device
   ```

   **Mobile Test Checklist:**
   - [ ] Parent login redirects to dashboard
   - [ ] 9 service icons navigate correctly
   - [ ] Child selection works
   - [ ] Grades display with proper colors
   - [ ] Attendance shows stats
   - [ ] Payment screens load
   - [ ] All navigation flows work
   - [ ] Back navigation works
   - [ ] Theme colors match design (#0284C7)

3. **Test Web App**
   ```bash
   # Start Next.js dev server
   cd apps/web
   npm run dev

   # Test at http://localhost:3000
   ```

   **Admin Test Checklist:**
   - [ ] Admin login redirects to /admin/dashboard
   - [ ] Dashboard shows all 5 stats cards
   - [ ] Charts render with data
   - [ ] User table filters by role
   - [ ] Class cards display correctly
   - [ ] Payment tracker works
   - [ ] Sidebar navigation works
   - [ ] Logout redirects to login

   **Teacher Test Checklist:**
   - [ ] Teacher login redirects to /teacher/dashboard
   - [ ] Dashboard shows teacher's classes
   - [ ] Attendance form submits
   - [ ] Grade entry validates inputs
   - [ ] Chat displays messages
   - [ ] All navigation works

4. **Integration Tests**
   ```typescript
   // apps/mobile/__tests__/integration/auth-flow.test.ts
   import { render, screen, waitFor } from '@testing-library/react-native'
   import { App } from '../../App'

   test('Parent login flow', async () => {
     render(<App />)

     // Should see login screen
     expect(screen.getByText('Đăng nhập')).toBeTruthy()

     // Enter credentials
     const emailInput = screen.getByPlaceholderText('Email')
     const passwordInput = screen.getByPlaceholderText('Mật khẩu')
     const loginButton = screen.getByText('Đăng nhập')

     fireEvent.changeText(emailInput, 'parent@econtact.vn')
     fireEvent.changeText(passwordInput, 'any')
     fireEvent.press(loginButton)

     // Should redirect to dashboard
     await waitFor(() => {
       expect(screen.getByText('Xin chào,')).toBeTruthy()
     })
   })
   ```

5. **Cross-Platform Data Validation**
   - Verify mock data loads consistently
   - Check shared types work across apps
   - Validate data transformations

6. **Performance Checks**
   - Mobile app launch time < 3 seconds
   - Web page load time < 2 seconds
   - No memory leaks (check with profiler)

7. **Accessibility Testing**
   - Screen reader works on mobile
   - Keyboard navigation works on web
   - Color contrast meets WCAG AA
   - Touch targets minimum 48x48px

8. **Bug Fixes**
   - Document all found issues
   - Fix critical bugs first
   - Log workarounds for minor issues

9. **Documentation Updates**
   - Update README with setup instructions
   - Add demo credentials documentation
   - Create troubleshooting guide

## Todo List
- [ ] Setup testing infrastructure
- [ ] Test mobile parent flows
- [ ] Test mobile student flows
- [ ] Test web admin flows
- [ ] Test web teacher flows
- [ ] Run integration tests
- [ ] Validate cross-platform data
- [ ] Check performance
- [ ] Test accessibility
- [ ] Document and fix bugs
- [ ] Update documentation
- [ ] Create demo script

## Success Criteria
- All 4 roles can login and access their features
- Mobile app runs on iOS and Android
- Web app works in Chrome and Safari
- No console errors
- Navigation flows complete without crashes
- Demo credentials documented

## Conflict Prevention
- Bug fixes should be minimal and targeted
- Document all changes
- No new features in this phase

## Risk Assessment
| Risk | Mitigation |
|------|-----------|
| Expo build issues | Test on Expo Go first |
| Web hydration errors | Check server/client boundaries |
| Data inconsistencies | Validate mock data format |
| Navigation dead-ends | Test all routes |

## Security Considerations
- Verify mock auth warnings are visible
- Check no real credentials in code
- Validate no API calls to external services
- Ensure demo data is clearly fake

## Bug Tracking Template

| ID | Description | Severity | Status | Fix |
|----|-------------|----------|--------|-----|
| BUG-001 | | | | |
| BUG-002 | | | | |

## Demo Script

**Mobile Parent Flow:**
1. Open Expo Go → scan QR
2. Login: parent@econtact.vn / any
3. Show dashboard with 9 icons
4. Tap "Bảng điểm môn học" → show grades
5. Tap back → Tap "Học phí" → show payments

**Web Admin Flow:**
1. Navigate to localhost:3000
2. Login: admin@econtact.vn / any
3. Show dashboard with stats
4. Click "Người dùng" → show user table
5. Filter by role → verify filtering

## Next Steps
- Deploy mobile to Expo (optional)
- Deploy web to Vercel (optional)
- Prepare demo presentation
- Handoff to stakeholders

## Unresolved Questions
- [ ] Production deployment strategy?
- [ ] Real backend integration timeline?
- [ ] Data migration approach from mock to real?
