# Design Phase - Mobile Econtact School App

**Project**: Mobile Econtact Mock UI
**Date**: 2026-01-05
**Designer**: UI/UX Specialist
**Target Users**: Students & Parents

---

## Design Philosophy

**Professional Academic Trust** - Clean, trustworthy design that communicates reliability, academic excellence, and ease of use for educational stakeholders.

**Core Principles**:
- **Clarity First**: Information hierarchy prioritizes what matters most
- **Trust & Credibility**: Professional aesthetic inspires confidence
- **Efficiency**: Minimal taps to access critical information
- **Accessibility**: WCAG 2.1 AA compliance throughout
- **Consistency**: Predictable patterns across all screens

---

## Color Palette

### Primary Colors

**Brand Blue** (Trust, Professionalism, Focus)
- `primary-900`: #1565C0 - Darkest (headers, important actions)
- `primary-700`: #1976D2 - Dark (buttons, links)
- `primary-500`: #2196F3 - Main (primary actions, active states)
- `primary-100`: #BBDEFB - Light (backgrounds, subtle highlights)
- `primary-50`: #E3F2FD - Lightest (input backgrounds, cards)

**Accent Green** (Success, Growth, Achievement)
- `success-700`: #388E3C - Dark (success actions, confirmations)
- `success-500`: #4CAF50 - Main (success states, positive indicators)
- `success-100`: #C8E6C9 - Light (success backgrounds)

**Supporting Orange** (Warning, Attention)
- `warning-700`: #F57C00 - Dark (warning states)
- `warning-500`: #FF9800 - Main (warnings, pending items)
- `warning-100`: #FFE0B2 - Light (warning backgrounds)

**Alert Red** (Errors, Critical, Overdue)
- `error-700`: #D32F2F - Dark (critical errors)
- `error-500`: #F44336 - Main (errors, negative indicators)
- `error-100`: #FFCDD2 - Light (error backgrounds)

### Neutral Colors

**Text Hierarchy**
- `text-primary`: #212121 - Primary text (headings, body)
- `text-secondary`: #757575 - Secondary text (labels, descriptions)
- `text-disabled`: #BDBDBD - Disabled text (placeholders, inactive)
- `text-hint`: #9E9E9E - Hint text (helper text)

**Backgrounds & Surfaces**
- `bg-primary`: #FFFFFF - Primary background (main content)
- `bg-secondary`: #F5F5F5 - Secondary background (cards, sections)
- `bg-tertiary`: #EEEEEE - Tertiary background (dividers, subtle separation)
- `surface`: #FFFFFF - Surface color (elevated cards, modals)

**Dividers & Borders**
- `divider`: #E0E0E0 - Standard dividers
- `border`: #BDBDBD - Form borders, card outlines

### Semantic Color Usage

**Grades Performance**
- A (90-100%): #4CAF50 (success-500)
- B (80-89%): #8BC34A (light green)
- C (70-79%): #FFEB3B (yellow)
- D (60-69%): #FF9800 (warning-500)
- F (0-59%): #F44336 (error-500)

**Attendance Status**
- Present: #4CAF50 (success-500)
- Absent: #F44336 (error-500)
- Late: #FF9800 (warning-500)
- Excused: #2196F3 (primary-500)

**Fee Status**
- Paid: #4CAF50 (success-500)
- Pending: #FF9800 (warning-500)
- Overdue: #F44336 (error-500)

---

## Typography System

### Font Family

**Primary**: `Inter` (Google Fonts)
- Clean, modern, highly legible
- Excellent Vietnamese character support
- Variable font family (weights 400-700)
- Optimized for UI display

**Alternative**: `Roboto` (fallback)
- Material Design standard
- Good readability
- Wide language support

**Monospace**: `Roboto Mono` (for codes, IDs)
- Admission numbers, reference codes

### Type Scale

**Mobile Typography Scale** (sp units)

```text
H1 - Display Large    : 32sp / 700 / 40px line-height
H2 - Display Medium   : 28sp / 700 / 36px line-height
H3 - Heading 1        : 24sp / 600 / 32px line-height
H4 - Heading 2        : 20sp / 600 / 28px line-height
H5 - Heading 3        : 18sp / 600 / 28px line-height
H6 - Heading 4        : 16sp / 600 / 24px line-height

Body 1 - Large        : 16sp / 400 / 24px line-height
Body 2 - Medium       : 14sp / 400 / 20px line-height
Body 3 - Small        : 12sp / 400 / 16px line-height

Subtitle 1            : 14sp / 500 / 20px line-height
Subtitle 2            : 12sp / 500 / 16px line-height

Button               : 14sp / 500 / 20px line-height (all-caps)
Caption              : 12sp / 400 / 16px line-height
Overline             : 10sp / 400 / 16px line-height (all-caps)
```

### Typography Usage Guidelines

**Screen Headers**: H3 (24sp) - Page titles
**Card Titles**: H4 (20sp) - Section headers
**List Items**: Subtitle 1 (14sp) - List content
**Body Text**: Body 2 (14sp) - Primary content
**Labels**: Body 3 (12sp) - Form labels
**Helper Text**: Caption (12sp) - Secondary information

---

## Spacing System

**4px Base Grid** - All spacing multiples of 4px

```text
spacing-0:  0px    (none)
spacing-1:  4px    (xxs)
spacing-2:  8px    (xs)
spacing-3:  12px   (sm - rarely used, prefer 8 or 16)
spacing-4:  16px   (md - standard unit)
spacing-5:  20px   (lg - rarely used, prefer 16 or 24)
spacing-6:  24px   (xl - section spacing)
spacing-7:  32px   (xxl - major sections)
spacing-8:  40px   (xxxl - screen margins)
spacing-9:  48px   (hero spacing)
spacing-10: 64px   (exceptional spacing)
```

### Standard Spacing Patterns

**Screen Padding**: 16px (spacing-4) - All screen edges
**Card Padding**: 16px (spacing-4) - Internal card spacing
**Card Spacing**: 12px (spacing-3) - Between stacked cards
**Form Spacing**: 8px (spacing-2) - Between form fields
**Icon Padding**: 8px (spacing-2) - Around icons
**Button Padding**: 12px vertical, 16px horizontal
**List Item Height**: 56px or 72px (standard Material)
**Divider Thickness**: 1px

---

## Border Radius System

**Rounded Corners** - Soft, approachable aesthetic

```text
radius-none:  0px     (sharp edges - dividers, full-width)
radius-xs:    2px     (subtle - tags, chips)
radius-sm:    4px     (small - buttons, inputs)
radius-md:    8px     (medium - cards, dialogs)
radius-lg:    12px    (large - featured cards, modals)
radius-xl:    16px    (xlarge - hero cards, bottom sheets)
radius-full:  9999px  (pill - buttons, badges)
```

### Usage Guidelines

**Buttons & Inputs**: radius-sm (4px) - Standard Material Design
**Cards**: radius-md (8px) - Card containers
**Dialogs**: radius-lg (12px) - Modal dialogs
**Bottom Sheets**: radius-xl (16px) - Bottom navigation, sheets
**Avatars**: radius-full (circular) - User images
**Chips/Badges**: radius-full (pill) - Status indicators

---

## Icon System

### Icon Library

**Material Symbols Outlined** (Google Fonts)
- 2,000+ icons covering all education use cases
- Consistent 24dp design grid
- Optimized for legibility
- Vietnamese language compatible

### Icon Sizing

```text
icon-xs:  16px  (inline icons, compact lists)
icon-sm:  18px  (small buttons, tertiary actions)
icon-md:  20px  (standard size, buttons, tabs)
icon-lg:  24px  (large size, navigation, list items)
icon-xl:  32px  (xlarge, featured icons)
icon-2x:  48px  (2x, empty states, illustrations)
```

### Key Icons by Screen

**Auth**: lock, email, visibility, visibility_off
**Dashboard**: home, trending_up, notifications, account_balance_wallet
**Profile**: person, edit, phone, email, location_on
**Grades**: school, assignment, grade, leaderboard
**Attendance**: calendar_today, check_circle, cancel, schedule
**Notifications**: notifications, mark_email_read, delete, filter_list
**Fees**: receipt, payment, credit_card, history

---

## Component Specifications

### Buttons

**Primary Button**
- Background: primary-500 (#2196F3)
- Text: White, 14sp/500, all-caps, 1px letter-spacing
- Height: 40px (small), 48px (standard)
- Padding: 12px vertical, 24px horizontal
- Radius: 4px (radius-sm)
- Elevation: 2px (md) - 8% alpha black

**Secondary Button**
- Background: Transparent
- Border: 1px solid primary-500 (#2196F3)
- Text: primary-500, 14sp/500, all-caps
- Same dimensions as primary

**Text Button**
- Background: Transparent
- Text: primary-500, 14sp/500, all-caps
- Padding: 8px vertical, 12px horizontal
- Radius: 4px (radius-sm)

### Cards

**Standard Card**
- Background: bg-primary (#FFFFFF)
- Elevation: 1px (sm) - 4% alpha black shadow
- Radius: 8px (radius-md)
- Padding: 16px (spacing-4)
- Margin-bottom: 12px (spacing-3)

**Featured Card**
- Background: bg-primary (#FFFFFF)
- Elevation: 4px (md) - 16% alpha black shadow
- Radius: 12px (radius-lg)
- Padding: 20px (spacing-5)
- Accent: 4px primary-500 top border

### Inputs

**Text Input**
- Background: bg-secondary (#F5F5F5)
- Border: 1px solid border (#BDBDBD)
- Border-focused: 2px solid primary-500 (#2196F3)
- Border-error: 2px solid error-500 (#F44336)
- Radius: 4px (radius-sm)
- Height: 48px
- Padding: 12px horizontal
- Label: 12sp text-secondary, 4px from top
- Input: 16sp text-primary
- Helper: 12sp text-secondary, 4px from bottom

### Chips/Badges

**Status Badge**
- Height: 24px
- Padding: 0 8px
- Radius: radius-full (pill)
- Font: 10sp/500, all-caps, 2px letter-spacing

**Grade Chip**
- Background: Performance color (see semantic colors)
- Text: White, 14sp/700
- Width: 40px, Height: 40px
- Radius: radius-full (circular)

### Navigation

**Bottom Navigation Bar**
- Height: 56px
- Background: surface (#FFFFFF)
- Elevation: 8px (lg)
- Active icon: primary-500, 24px
- Active label: primary-500, 12sp/500
- Inactive icon: text-secondary, 24px
- Inactive label: text-secondary, 12sp/400

**App Bar**
- Height: 56px (standard), 64px (with tabs)
- Background: primary-500 (#2196F3)
- Text: White, 20sp/600
- Elevation: 4px (md)

---

## Elevation System

**Material Design 3 Elevation** (box-shadow layers)

```text
level-0:  none
level-1:  0 1px 2px rgba(0,0,0,0.04)    - Subtle cards
level-2:  0 2px 4px rgba(0,0,0,0.08)    - Standard cards, buttons
level-3:  0 4px 8px rgba(0,0,0,0.12)    - Raised cards, dialogs
level-4:  0 8px 16px rgba(0,0,0,0.16)   - Bottom sheets, menus
level-5:  0 12px 24px rgba(0,0,0,0.20)  - Modals
```

---

## Accessibility Standards

**Color Contrast**
- Normal text: 4.5:1 minimum (WCAG AA)
- Large text (18sp+): 3:1 minimum
- Interactive elements: 3:1 minimum

**Touch Targets**
- Minimum: 44x44px (iOS), 48x48dp (Android)
- Recommended: 48x48px for all interactive elements

**Focus States**
- 2px primary-500 outline
- 4px offset for visibility

**Screen Reader Support**
- Semantic HTML elements
- ARIA labels for icons
- Descriptive button/link text
- Logical reading order

**Font Scaling**
- Support up to 200% text scaling
- Layout remains usable at 150%
- Critical information never truncated

---

## Animation & Micro-interactions

**Duration Scale**
- Fast: 150ms - Button presses, toggles
- Standard: 250ms - Card reveals, modal opens
- Slow: 350ms - Screen transitions

**Easing Curves**
- Standard: cubic-bezier(0.4, 0.0, 0.2, 1)
- Decelerate: cubic-bezier(0.0, 0.0, 0.2, 1)
- Accelerate: cubic-bezier(0.4, 0.0, 1, 1)

**Interaction Feedback**
- Touch ripple on all buttons (Material Design)
- 2% alpha overlay on press
- Scale: 0.98 on touch, 1.0 on release

---

## Responsive Breakpoints

**Mobile-First Design**
- Small: 320px - 359px (iPhone SE, older Android)
- Medium: 360px - 399px (most Android, iPhone 12/13)
- Large: 400px - 430px (iPhone 14 Pro Max, large Android)
- Default: 375px (design reference - iPhone 12/13/14)

**Layout Adaptation**
- Single column layout (320-430px)
- Content max-width: 100%
- Flexible padding: 12px (small), 16px (medium+)
- Touch-optimized spacing throughout

---

## Design Assets

**Fonts**
- Inter: https://fonts.google.com/specimen/Inter
- Material Symbols: https://fonts.google.com/icons

**Design Tools**
- Figma (recommended for component library)
- Adobe XD (alternative)
- Sketch (alternative)

**Icon Export**
- PNG @1x, @2x, @3x for React Native
- SVG for web (if needed)

---

## Unresolved Questions

1. Should dark mode be included in initial mock scope?
2. What's the tablet strategy (if any) for this mobile-first app?
3. Are there specific school branding colors to incorporate?

---

## Next Steps

1. ✅ Design phase plan approved
2. ⏳ Create design guidelines document
3. ⏳ Generate HTML wireframes for all screens
4. ⏳ Create component library documentation
5. ⏳ Design validation with stakeholders
