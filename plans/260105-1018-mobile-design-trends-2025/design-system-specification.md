# Design System Specification - Professional Education App

## Color Palette

### Primary Colors
- **Primary**: #6366F1 (Indigo - modern, professional)
- **Primary Dark**: #4F46E5 (Dark indigo for dark mode)
- **Secondary**: #EC4899 (Pink accent for highlights)
- **Success**: #10B981 (Green for achievements)
- **Warning**: #F59E0B (Orange for attention)
- **Error**: #EF4444 (Red for errors)

### Neutral Colors
- **Background**: #FFFFFF / #111827 (White/Dark)
- **Surface**: #F9FAFB / #1F2937
- **Card**: #FFFFFF / #374151
- **Border**: #E5E7EB / #4B5563
- **Text Primary**: #111827 / #F3F4F6
- **Text Secondary**: #6B7280 / #9CA3AF
- **Text Tertiary**: #9CA3AF / #6B7280

### Semantic Colors
- **Info**: #3B82F6 (Blue for information)
- **Elevated Surface**: #F3F4F6 / #1F2937

## Typography System

### Headings
- **H1**: Plus Jakarta Sans 32px/36px - Bold
- **H2**: Plus Jakarta Sans 24px/28px - Semibold
- **H3**: Plus Jakarta Sans 20px/24px - Medium
- **H4**: Plus Jakarta Sans 16px/20px - Medium

### Body Text
- **Body Large**: Geist 16px/24px
- **Body**: Geist 14px/20px
- **Body Small**: Geist 12px/16px
- **Caption**: Space Grotesk 11px/16px

### Display Text
- **Display**: Plus Jakarta Sans 40px/48px - Light (Hero sections)

## Spacing System

- **4px**: xs (micro adjustments)
- **8px**: s (padding, margins)
- **12px**: sm
- **16px**: m (standard spacing)
- **24px**: l (card padding, section spacing)
- **32px**: xl (large containers)
- **48px**: 2xl (hero sections)

## Border Radius

- **None**: 0px
- **Small**: 4px (inputs, some buttons)
- **Medium**: 8px (standard - cards, buttons)
- **Large**: 12px (large cards, modals)
- **XL**: 16px (avatars, special components)
- **Full**: 999px (circular elements)

## Shadow System

- **None**: No shadow
- **Sm**: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- **Medium**: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- **Large**: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
- **XL**: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
- **2XL**: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

## Component Specifications

### Cards
- **Standard**: 12px border radius, Medium shadow
- **Elevated**: 12px border radius, Large shadow
- **Outlined**: 12px border radius, 1px border
- **Padding**: 16px horizontal, 24px vertical

### Buttons
- **Height**: 48px (touch target minimum)
- **Padding**: 16px horizontal, 0px vertical
- **Border Radius**: 8px (Medium)
- **States**: 80% opacity on press

### Navigation
- **Bottom Tab Bar**:
  - Height: 60px
  - Icon size: 24px
  - Active indicator: 3px height
  - Padding: 8px horizontal
- **Header Height**: 56px (standard)

### Inputs
- **Height**: 48px
- **Border Radius**: 8px (Medium)
- **Border Width**: 1px
- **Padding**: 12px horizontal

## Animation

### Transitions
- **Fast**: 150ms (button taps)
- **Medium**: 300ms (card movements)
- **Slow**: 500ms (page transitions)

### Easing Functions
- **Standard**: cubic-bezier(0.4, 0, 0.2, 1)
- **Emphasized**: cubic-bezier(0.4, 0, 0.2, 1.4)

## Icon System

### Icon Set
- **Outline**: Primary for standard states
- **Filled**: Secondary for active/states
- **Size**: 24px standard, 18px for tabs, 32px for hero

### Usage Guidelines
- Max 2 icon styles per app
- Consistent stroke width (2px)
- Single color variants only