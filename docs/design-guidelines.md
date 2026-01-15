# Econtact School App - Design Guidelines

**Version**: 1.0
**Last Updated**: 2026-01-05
**Design System**: Material Design 3 + Custom Academic Theme

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Accessibility](#accessibility)
7. [Responsive Design](#responsive-design)
8. [Animation](#animation)

---

## Design Principles

### Core Values

**Trust & Credibility**
- Professional aesthetic that inspires confidence
- Consistent patterns that build familiarity
- Clear visual hierarchy for easy scanning

**Academic Excellence**
- Clean, distraction-free interface
- Focus on content over decoration
- Purposeful use of color and typography

**User Efficiency**
- Minimal taps to access critical information
- Predictable navigation patterns
- Smart defaults and progressive disclosure

**Inclusive Design**
- Accessibility-first approach (WCAG 2.1 AA)
- Vietnamese language support throughout
- Clear feedback for all interactions

---

## Color System

### Primary Color Usage

**Brand Blue (#2196F3) - primary-500**
- **Primary Actions**: Submit, confirm, save buttons
- **Navigation**: Active bottom nav items, active tabs
- **Links**: Text links, inline actions
- **Progress Indicators**: Loading spinners, progress bars
- **Selection**: Selected items, active states

**Usage Rules**:
- One primary action per screen maximum
- Use sparingly for emphasis
- Avoid overuse (creates visual noise)
- Never use for destructive actions

### Success Color Usage

**Success Green (#4CAF50) - success-500**
- **Positive Indicators**: Grade A, Present status, Paid fees
- **Confirmation Messages**: Success toasts, confirmations
- **Success States**: Completed actions, achieved goals
- **Growth Metrics**: Upward trends, improvements

**Usage Rules**:
- Grade A (90-100%): Use success-500 background, white text
- Present attendance: Solid success-500 checkmark
- Paid fees: success-500 badge with "PAID" label

### Warning Color Usage

**Warning Orange (#FF9800) - warning-500**
- **Caution Indicators**: Grade C/D, Late attendance, Pending fees
- **Warning Messages**: Attention needed alerts
- **Pending States**: Awaiting action, in progress

**Usage Rules**:
- Grade C (70-79%): warning-100 background, warning-700 text
- Grade D (60-69%): warning-500 background, white text
- Late attendance: warning-500 icon with status label
- Pending fees: warning-500 badge with due date

### Error Color Usage

**Error Red (#F44336) - error-500**
- **Negative Indicators**: Grade F, Absent, Overdue fees
- **Error Messages**: Validation errors, failures
- **Destructive Actions**: Delete, cancel, remove

**Usage Rules**:
- Grade F (0-59%): error-500 background, white text
- Absent attendance: error-500 icon with "ABSENT" label
- Overdue fees: error-500 badge with "OVERDUE" label
- Use sparingly - loses impact with overuse

### Neutral Color Usage

**Text Hierarchy**
```css
.text-primary    { color: #212121; }  /* Headings, body text */
.text-secondary  { color: #757575; }  /* Labels, descriptions */
.text-disabled   { color: #BDBDBD; }  /* Placeholders, inactive */
.text-hint       { color: #9E9E9E; }  /* Helper text */
```

**Background Hierarchy**
```css
.bg-primary      { background: #FFFFFF; }  /* Main content */
.bg-secondary    { background: #F5F5F5; }  /* Cards, sections */
.bg-tertiary     { background: #EEEEEE; }  /* Dividers */
```

### Color Combinations

**Recommended Pairs**
- primary-500 + white (buttons, links)
- primary-50 + primary-700 (cards with headers)
- success-500 + white (success badges)
- warning-500 + white (warning badges)
- error-500 + white (error badges)

**Avoid**
- primary-500 + error-500 (confusing)
- warning-500 + error-500 ( unclear severity)
- Multiple primary colors on one screen

### Accessibility Compliance

**Contrast Ratios**
- primary-500 on white: 4.5:1 ✅ (AA compliant)
- text-primary on white: 16.1:1 ✅ (AAA compliant)
- text-secondary on white: 4.7:1 ✅ (AA compliant)
- success-500 on white: 3.9:1 ⚠️ (Use white text on success-500)
- warning-500 on white: 2.9:1 ❌ (Use white text on warning-500)
- error-500 on white: 3.8:1 ❌ (Use white text on error-500)

**Solution**: For colored badges, use white text (contrast > 7:1)

---

## Typography

### Font Loading

**Inter Font Family**
```html
<!-- Regular 400 -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap" rel="stylesheet">
```

**Font Weights Available**
- 400: Regular (body text)
- 500: Medium (subtitles, buttons)
- 600: Semi-bold (headings)
- 700: Bold (display headings)

### Type Scale Usage

**Screen Headers** (H3 - 24sp/600)
- Page titles in app bar
- Section headings in dashboard
- Main screen titles

```html
<h1 class="text-h3">Dashboard</h1>
```

**Card Titles** (H4 - 20sp/600)
- Card headings
- List section headers
- Modal titles

```html
<h2 class="text-h4">Recent Grades</h2>
```

**Body Text** (Body 2 - 14sp/400)
- Primary content
- Paragraphs
- List items
- Form labels

```html
<p class="body-2">Your current attendance is 95%</p>
```

**Captions & Helpers** (Caption - 12sp/400)
- Secondary information
- Timestamps
- Helper text
- Metadata

```html
<span class="caption">Last updated: Jan 5, 2026</span>
```

**Button Text** (14sp/500, all-caps)
- All button labels
- 1px letter-spacing
- Uppercase transformation

```css
.button {
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

### Vietnamese Language Support

**Font Selection**
- ✅ Inter: Full Vietnamese character support
- ✅ Roboto: Full Vietnamese character support
- ✅ Material Symbols: Language-neutral icons

**Character Rendering**
- Ensure proper rendering of: ă, â, đ, ê, ô, ơ, ư, Ả, Ấ, Ắ, etc.
- Test with sample Vietnamese text
- Verify diacritical marks display correctly

**Line Height**
- Body text: 1.4 (14sp → 20px line-height)
- Headings: 1.2 (24sp → 32px line-height)
- Ensures diacritical marks don't overlap

---

## Spacing & Layout

### Standard Spacing Units

**4px Grid System**
- All spacing measured in 4px increments
- Ensures visual rhythm and consistency
- Works across all screen sizes

### Common Patterns

**Screen Layout**
```css
.screen {
  padding: 16px; /* spacing-4 */
  max-width: 430px;
  margin: 0 auto;
}
```

**Card Layout**
```css
.card {
  background: #FFFFFF;
  border-radius: 8px; /* radius-md */
  padding: 16px; /* spacing-4 */
  margin-bottom: 12px; /* spacing-3 */
  box-shadow: 0 1px 2px rgba(0,0,0,0.04); /* elevation-1 */
}
```

**Form Layout**
```css
.form-group {
  margin-bottom: 16px; /* spacing-4 */
}

.form-label {
  font-size: 12px; /* Body 3 */
  margin-bottom: 4px; /* spacing-1 */
  display: block;
}

.form-input {
  height: 48px;
  padding: 0 12px;
  border: 1px solid #BDBDBD;
  border-radius: 4px; /* radius-sm */
}
```

**List Layout**
```css
.list-item {
  display: flex;
  align-items: center;
  min-height: 56px;
  padding: 12px 16px; /* spacing-3 spacing-4 */
  border-bottom: 1px solid #E0E0E0;
}
```

**Button Layout**
```css
.button-primary {
  height: 48px;
  padding: 0 24px; /* spacing-6 */
  border-radius: 4px; /* radius-sm */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Responsive Spacing

**Small Screens (320-359px)**
- Screen padding: 12px
- Card padding: 12px
- Button padding: 0 20px

**Medium+ Screens (360px+)**
- Screen padding: 16px
- Card padding: 16px
- Button padding: 0 24px

---

## Components

### Buttons

**Primary Button**
```html
<button class="button button-primary">
  Login
</button>
```

**Usage**: Main action, form submission, navigation
**Rules**: One primary button per screen

**Secondary Button**
```html
<button class="button button-secondary">
  Cancel
</button>
```

**Usage**: Alternative actions, secondary options

**Text Button**
```html
<button class="button button-text">
  Forgot Password?
</button>
```

**Usage**: Low-emphasis actions, inline actions

### Cards

**Standard Card**
```html
<div class="card">
  <h4 class="card-title">Card Title</h4>
  <p class="card-content">Card content goes here</p>
</div>
```

**Usage**: Grouping related information, sections

**Featured Card**
```html
<div class="card card-featured">
  <div class="card-accent"></div>
  <h4 class="card-title">Featured Card</h4>
  <p class="card-content">Important information</p>
</div>
```

**Usage**: Highlighted information, important sections

### Form Inputs

**Text Input**
```html
<div class="form-group">
  <label class="form-label">Email Address</label>
  <input type="email" class="form-input" placeholder="student@school.edu">
  <span class="form-helper">Enter your school email</span>
</div>
```

**Validation States**
- Error: Red border, error message
- Success: Green border, success icon
- Disabled: Gray background, disabled cursor

### Chips & Badges

**Status Badge**
```html
<span class="badge badge-success">PAID</span>
<span class="badge badge-warning">PENDING</span>
<span class="badge badge-error">OVERDUE</span>
```

**Grade Chip**
```html
<div class="grade-chip grade-a">A</div>
<div class="grade-chip grade-b">B</div>
<div class="grade-chip grade-c">C</div>
```

### Navigation

**Bottom Navigation Bar**
```html
<nav class="bottom-nav">
  <a href="/dashboard" class="nav-item nav-item-active">
    <span class="material-symbols">home</span>
    <span class="nav-label">Home</span>
  </a>
  <a href="/grades" class="nav-item">
    <span class="material-symbols">school</span>
    <span class="nav-label">Grades</span>
  </a>
  <a href="/attendance" class="nav-item">
    <span class="material-symbols">calendar_today</span>
    <span class="nav-label">Attendance</span>
  </a>
  <a href="/notifications" class="nav-item">
    <span class="material-symbols">notifications</span>
    <span class="nav-label">Alerts</span>
  </a>
  <a href="/profile" class="nav-item">
    <span class="material-symbols">person</span>
    <span class="nav-label">Profile</span>
  </a>
</nav>
```

**Usage**: Primary navigation between main sections

---

## Accessibility

### Color Contrast

**WCAG 2.1 AA Compliance**
- Normal text: 4.5:1 minimum
- Large text (18sp+): 3:1 minimum
- Interactive elements: 3:1 minimum

**Testing Tools**
- Chrome DevTools Contrast Checker
- WAVE Browser Extension
- axe DevTools

### Touch Targets

**Minimum Size**
- 44x44px (iOS guidelines)
- 48x48dp (Android guidelines)
- Recommended: 48x48px for consistency

**Spacing Between Targets**
- Minimum 8px between adjacent targets
- Prevents accidental taps

### Focus States

**Visible Focus Indicators**
```css
:focus-visible {
  outline: 2px solid #2196F3;
  outline-offset: 4px;
}
```

**Tab Order**
- Logical left-to-right, top-to-bottom
- Skip links for main content
- Focus traps in modals

### Screen Reader Support

**Semantic HTML**
- Use proper heading hierarchy (h1-h6)
- Use <nav> for navigation
- Use <button> for actions, <a> for links
- Use aria-label for icon-only buttons

**ARIA Labels**
```html
<button aria-label="Close dialog">
  <span class="material-symbols">close</span>
</button>
```

**Live Regions**
```html
<div aria-live="polite" aria-atomic="true">
  Success message
</div>
```

### Font Scaling

**Support Up to 200%**
- Layout remains usable at 150%
- Text doesn't truncate or overflow
- Touch targets remain accessible
- Use relative units (sp, dp) not pixels

---

## Responsive Design

### Breakpoints

**Mobile-First Strategy**
- Design for smallest screen (320px) first
- Enhance for larger screens (360px, 375px, 414px, 430px)
- Single column layout throughout

**Target Devices**
- iPhone SE: 320px width
- iPhone 12/13: 375px width (default)
- iPhone 14 Pro Max: 430px width
- Android (various): 360px, 412px width

### Layout Adaptation

**Flexible Widths**
```css
.container {
  max-width: 430px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (max-width: 359px) {
  .container {
    padding: 0 12px;
  }
}
```

**Responsive Typography**
- Font sizes scale with viewport
- Line heights remain proportional
- Text reflows, never overflows

**Responsive Images**
- Max-width: 100%
- Height: auto
- Maintain aspect ratio

---

## Animation

### Duration

**Fast (150ms)**
- Button press feedback
- Toggle switches
- Checkbox/radio interactions

**Standard (250ms)**
- Card expansion
- Modal open/close
- Page transitions

**Slow (350ms)**
- Complex screen transitions
- Multi-element animations

### Easing Curves

**Standard** - Most animations
```css
transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
```

**Decelerate** - Entering elements
```css
transition: all 350ms cubic-bezier(0.0, 0.0, 0.2, 1);
```

**Accelerate** - Leaving elements
```css
transition: all 150ms cubic-bezier(0.4, 0.0, 1, 1);
```

### Micro-interactions

**Touch Feedback**
```css
.button:active {
  transform: scale(0.98);
  opacity: 0.9;
}
```

**Hover States** (desktop only)
```css
.button:hover {
  background: #1976D2; /* primary-700 */
}
```

**Focus States**
```css
.button:focus-visible {
  outline: 2px solid #2196F3;
  outline-offset: 4px;
}
```

**Loading States**
- Progress indicators for async actions
- Skeleton screens for content loading
- Optimistic UI updates where appropriate

### Accessibility

**Respect Prefers-Reduced-Motion**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Component Library Documentation

### Button Component

**Props**
- `variant`: 'primary' | 'secondary' | 'text'
- `size`: 'small' (40px) | 'medium' (48px) | 'large' (56px)
- `disabled`: boolean
- `loading`: boolean
- `fullWidth`: boolean

**Usage Example**
```jsx
<Button variant="primary" size="medium" fullWidth>
  Submit Assignment
</Button>
```

### Card Component

**Props**
- `variant`: 'standard' | 'featured' | 'interactive'
- `padding`: 'none' | 'small' (12px) | 'medium' (16px) | 'large' (20px)
- `elevation`: 0 | 1 | 2 | 3
- `onClick`: function (for interactive cards)

**Usage Example**
```jsx
<Card variant="featured" padding="medium">
  <CardHeader title="Recent Grades" />
  <CardContent>
    <GradeCard grade="A" subject="Mathematics" />
  </CardContent>
</Card>
```

### Input Component

**Props**
- `type`: 'text' | 'email' | 'password' | 'number'
- `label`: string
- `placeholder`: string
- `error`: string
- `helperText`: string
- `disabled`: boolean
- `required`: boolean

**Usage Example**
```jsx
<Input
  type="email"
  label="Email Address"
  placeholder="student@school.edu"
  helperText="Use your school-provided email"
  required
/>
```

---

## Design Token Reference

### Color Tokens
```css
--color-primary-500: #2196F3;
--color-success-500: #4CAF50;
--color-warning-500: #FF9800;
--color-error-500: #F44336;
--color-text-primary: #212121;
--color-text-secondary: #757575;
--color-bg-primary: #FFFFFF;
--color-bg-secondary: #F5F5F5;
```

### Typography Tokens
```css
--font-family: 'Inter', sans-serif;
--font-size-h3: 24px;
--font-size-h4: 20px;
--font-size-body: 14px;
--font-size-caption: 12px;
```

### Spacing Tokens
```css
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-6: 24px;
```

### Radius Tokens
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```

---

## Unresolved Questions

1. Should dark mode be included in initial design scope?
2. Are there custom brand colors to incorporate?
3. What level of typography scaling should be supported (200% max)?

---

## Changelog

**v1.0 (2026-01-05)**
- Initial design guidelines
- Color system established
- Typography scale defined
- Component specifications documented
- Accessibility standards outlined
