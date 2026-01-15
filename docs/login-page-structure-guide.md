# Login Page Structure Guide

**Component**: Login Page Redesign
**Date**: 2026-01-15

---

## Component Hierarchy

```
LoginPage (Client Component)
├── AuthBrandingPanel (Left Side)
│   ├── Floating Circle 1
│   ├── Floating Circle 2
│   ├── Logo Container (Glassmorphism)
│   │   └── SVG Logo (Layered Squares)
│   ├── Title (ECONTACT)
│   ├── Decorative Line
│   ├── Description
│   ├── Feature Badges
│   │   ├── Trực quan
│   │   ├── Chính xác
│   │   └── Bảo mật
│   └── Footer Copyright
│
└── Login Form Panel (Right Side)
    ├── Header
    │   ├── Title (Đăng nhập)
    │   └── Subtitle
    ├── Role Toggle
    │   ├── Giáo viên Button
    │   └── Quản trị viên Button
    ├── Form
    │   ├── Email Input Group
    │   │   ├── Label
    │   │   ├── Input Container
    │   │   │   ├── User Icon
    │   │   │   └── Email Input
    │   ├── Password Input Group
    │   │   ├── Label Row
    │   │   │   ├── Label
    │   │   │   └── Forgot Password Link
    │   │   └── Input Container
    │   │       ├── Lock Icon
    │   │       ├── Password Input
    │   │       └── Toggle Button
    │   └── Submit Button
    ├── Demo Notice Box
    └── Footer
        ├── Version
        └── Help Icon
```

---

## State Management

```typescript
// Client-side state
const [role, setRole] = useState<'teacher' | 'admin'>('teacher')
const [showPassword, setShowPassword] = useState(false)
const [isLoading, setIsLoading] = useState(false)
```

---

## Props Flow

```
AuthLayout
└── children → LoginPage
    ├── AuthBrandingPanel (no props)
    └── Form Panel
        ├── role state
        ├── showPassword state
        └── isLoading state
```

---

## Event Handlers

### Role Toggle
```typescript
onClick={() => setRole('teacher')}
onClick={() => setRole('admin')}
```

### Password Toggle
```typescript
onClick={() => setShowPassword(!showPassword)}
```

### Form Submit
```typescript
action={handleSubmit}
// handleSubmit wraps the login() function
```

---

## Responsive Behavior

```
Mobile (< 1024px)
├── Left Panel: hidden
└── Right Panel: w-full (100%)

Desktop (>= 1024px)
├── Left Panel: lg:w-1/2 (50%)
└── Right Panel: lg:w-1/2 (50%)
```

---

## Key Interactions

### 1. Role Selection
- **User Action**: Click role tab
- **State Update**: `setRole('teacher' | 'admin')`
- **UI Changes**:
  - Active button highlights
  - Label text updates
  - Input placeholder changes

### 2. Password Visibility
- **User Action**: Click eye icon
- **State Update**: `setShowPassword(!showPassword)`
- **UI Changes**:
  - Input type toggles (password ↔ text)
  - Icon toggles (eye ↔ eye-slash)

### 3. Form Submission
- **User Action**: Click submit button
- **State Update**: `setIsLoading(true)`
- **UI Changes**:
  - Button shows "ĐANG XỬ LÝ..."
  - Button disabled
- **Backend Call**: `login(formData)`
- **Success**: Redirects to dashboard

---

## Animation Triggers

### Floating Circles
- **Trigger**: Automatic (CSS animation)
- **Duration**: 6s
- **Timing**: ease-in-out
- **Loop**: infinite
- **Delay**: Second circle delayed by 2s

### Button Hover
- **Trigger**: Mouse hover
- **Duration**: 250ms (default transition)
- **Effect**: translateY(-1px)
- **Fallback**: Disabled on touch devices

### Input Focus
- **Trigger**: Focus event
- **Duration**: 150ms
- **Effects**:
  - Border color change
  - Background color change
  - Ring appears

---

## Accessibility Features

### Keyboard Navigation
```
Tab → Role toggle → Email → Password → Submit
Shift+Tab → Reverse order
```

### Focus Indicators
- **Role Toggle**: Blue background + shadow
- **Inputs**: Blue border + ring
- **Buttons**: Blue border (focus-visible)

### Screen Readers
- **Labels**: Properly associated with inputs
- **Buttons**: Descriptive text
- **Icons**: Decorative (no aria-label needed)
- **Status**: Loading state announced

---

## Form Validation

### HTML5 Validation
```tsx
<input
  type="email"
  required        // Mandatory field
  autoComplete="email"  // Browser autocomplete
/>
```

### Client-Side (Optional Enhancement)
- Email format validation
- Password length check
- Real-time feedback
- Error messages

---

## Styling Breakdown

### Left Panel Styles
```css
Position: relative
Overflow: hidden
Display: flex (hidden on mobile)
Width: 50% (desktop)
Align: center
Justify: center
Padding: 3rem
Background: linear-gradient(135deg, #0284C7 0%, #075985 100%)
```

### Right Panel Styles
```css
Width: 100% (mobile), 50% (desktop)
Display: flex
Align: center
Justify: center
Padding: 2rem
Background: white
Overflow-y: auto
```

### Input Styles
```css
Width: 100%
Padding: 1rem
Padding-left: 3rem (with icon)
Padding-right: 3rem (with toggle)
Background: gray-50
Border: 2px gray-100
Border-radius: 1rem
Focus: Border sky-500, bg-white, ring
Transition: all
```

### Button Styles
```css
Primary Button:
  Width: 100%
  Padding: 1.25rem
  Background: #0284C7
  Color: white
  Font-weight: 900 (black)
  Font-size: 1.125rem (lg)
  Border-radius: 1rem
  Shadow: xl
  Hover: #0369a1, translateY(-1px)
  Disabled: opacity-50, no-transform
```

---

## Mock Authentication Flow

```typescript
// Current Implementation
1. User enters email & password
2. Form submits to login() function
3. login() detects role from email:
   - teacher@school.edu → /teacher
   - admin@school.edu → /admin
4. Any password accepted (MOCK)
5. Redirects to appropriate dashboard
```

---

## Extension Points

### Future: Forgot Password
```typescript
// Add route: /forgot-password
// Component: ForgotPasswordForm
// Features:
//   - Email/phone input
//   - OTP verification
//   - Password reset
```

### Future: Toast Notifications
```typescript
// Add context: ToastContext
// Component: Toast
// Features:
//   - Success messages
//   - Error messages
//   - Auto-dismiss
//   - Slide animations
```

### Future: Form Validation
```typescript
// Add library: react-hook-form + zod
// Features:
//   - Real-time validation
//   - Error messages
//   - Field-level errors
//   - Form-level errors
```

---

## Performance Optimization

### Current Optimizations
- Inline SVG icons (no HTTP requests)
- CSS animations (GPU accelerated)
- Tailwind purge (unused styles removed)
- Client components only where needed
- No external icon libraries

### Future Optimizations
- Lazy load auth routes
- Code splitting by role
- Image optimization (if added)
- Font optimization (Inter already loaded)

---

## Browser Compatibility

### Tested Browsers
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Safari 17+
- ✅ Edge 120+

### CSS Fallbacks
- `backdrop-filter`: Graceful degradation
- `linear-gradient`: Widely supported
- `flexbox`: IE11+ (not targeting IE)
- `grid`: Not used (flex only)

---

## Mobile Considerations

### Touch Targets
- Buttons: 48px minimum height
- Icons: 20px with padding
- Spacing: 8px between targets

### Viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Keyboard Handling
- Auto-focus on first input
- Prevent zoom on input focus
- Handle virtual keyboard

---

## Testing Checklist

### Visual Tests
- [ ] Layout matches wireframe
- [ ] Colors match specifications
- [ ] Spacing consistent
- [ ] Icons render correctly
- [ ] Animations smooth

### Functional Tests
- [ ] Role toggle works
- [ ] Password toggle works
- [ ] Form submits correctly
- [ ] Validation triggers
- [ ] Redirects work

### Responsive Tests
- [ ] Mobile layout (320px+)
- [ ] Tablet layout (768px+)
- [ ] Desktop layout (1024px+)
- [ ] Left panel shows/hides correctly

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader reads correctly
- [ ] Color contrast sufficient
- [ ] Touch targets adequate

---

## Deployment Checklist

- [ ] TypeScript compiles without errors
- [ ] No console warnings
- [ ] Production build succeeds
- [ ] Environment variables set
- [ ] API routes deployed
- [ ] DNS configured
- [ ] SSL certificate valid
- [ ] Monitoring in place

---

**Structure Guide Complete**

For implementation details, see:
- `apps/web/app/(auth)/login/page.tsx`
- `apps/web/components/auth-branding-panel.tsx`
- `docs/login-page-tailwind-reference.md`
