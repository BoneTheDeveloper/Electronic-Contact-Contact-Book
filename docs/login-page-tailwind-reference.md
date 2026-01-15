# Login Page - Tailwind CSS Reference

**Component**: Login Page Redesign
**Date**: 2026-01-15
**Framework**: Tailwind CSS

---

## Layout Classes

### Container
```tsx
<div className="flex min-h-screen bg-white">
```

### Left Panel (Branding)
```tsx
<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
  style={{ background: 'linear-gradient(135deg, #0284C7 0%, #075985 100%)' }}>
```

### Right Panel (Form)
```tsx
<div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
```

---

## Typography Classes

### Page Title
```tsx
<h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
  Đăng nhập
</h2>
```

### Subtitle
```tsx
<p className="text-gray-500 font-medium">
  Vui lòng đăng nhập vào cổng thông tin của bạn.
</p>
```

### ECONTACT Title
```tsx
<h1 className="text-6xl font-black text-white tracking-tighter mb-4">
  ECONTACT
</h1>
```

### Description
```tsx
<p className="text-blue-100 text-xl font-medium max-w-md leading-relaxed">
  Hệ thống Quản lý Sổ liên lạc điện tử
</p>
```

### Form Labels
```tsx
<label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
  Mã giáo viên / Email
</label>
```

### Feature Badges
```tsx
<div className="px-6 py-3 rounded-2xl text-white text-sm font-semibold">
  Trực quan
</div>
```

### Footer Text
```tsx
<p className="text-xs font-bold uppercase tracking-widest">
  ECONTACT v1.0.2
</p>
```

---

## Button Classes

### Role Toggle (Active)
```tsx
<button className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all bg-[#0284C7] text-white shadow-lg">
  Giáo viên
</button>
```

### Role Toggle (Inactive)
```tsx
<button className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all text-gray-400 hover:text-gray-600">
  Quản trị viên
</button>
```

### Submit Button
```tsx
<button className="w-full py-5 bg-[#0284C7] hover:bg-[#0369a1] text-white font-black text-lg rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3">
  ĐĂNG NHẬP HỆ THỐNG
</button>
```

### Link Button
```tsx
<button className="text-xs font-bold text-[#0284C7] hover:underline">
  Quên mật khẩu?
</button>
```

---

## Input Classes

### Email Input
```tsx
<input
  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-semibold text-gray-900 placeholder-gray-400"
/>
```

### Password Input
```tsx
<input
  type={showPassword ? 'text' : 'password'}
  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-semibold text-gray-900 placeholder-gray-400"
  placeholder="••••••••"
/>
```

---

## Icon Container Classes

### Input Icon (Left)
```tsx
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
  <svg>...</svg>
</span>
```

### Password Toggle (Right)
```tsx
<button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
  <svg>...</svg>
</button>
```

---

## Glassmorphism Classes

### Logo Container
```tsx
<div
  className="mb-8 p-6 rounded-[40px] shadow-2xl"
  style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }}
>
```

### Feature Badges
```tsx
<div
  className="px-6 py-3 rounded-2xl text-white text-sm font-semibold"
  style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }}
>
```

---

## Animation Classes

### Floating Circles
```tsx
<div className="animate-[floating_6s_ease-in-out_infinite]">
```

With custom CSS:
```css
@keyframes floating {
  0% { transform: translate(0, 0px); }
  50% { transform: translate(0, 15px); }
  100% { transform: translate(0, -0px); }
}
```

### Button Hover
```tsx
transform hover:-translate-y-1
transition-all
```

---

## Spacing Classes

### Container Padding
```tsx
<div className="p-8">        {/* Right panel */}
<div className="p-12">       {/* Left panel */}
```

### Form Spacing
```tsx
<div className="mb-10">      {/* Header section */}
<div className="mb-8">       {/* Role toggle */}
<div className="space-y-6">  {/* Form inputs */}
```

### Input Padding
```tsx
<input className="py-4 pl-12 pr-4">    {/* Email */}
<input className="py-4 pl-12 pr-12">   {/* Password */}
```

### Button Padding
```tsx
<button className="py-3">   {/* Role toggle */}
<button className="py-5">   {/* Submit */}
```

---

## Border Radius Classes

```tsx
rounded-2xl      /* 16px - Inputs, buttons, containers */
rounded-xl       /* 12px - Role toggle buttons */
rounded-[40px]   /* Logo container */
rounded-2xl      /* Feature badges */
```

---

## Shadow Classes

```tsx
shadow-xl        {/* Submit button, logo container */}
shadow-2xl       {/* Logo container */}
shadow-lg        {/* Active role toggle */}
```

---

## Color Classes

### Background Colors
```tsx
bg-white         {/* Main background */}
bg-gray-50       {/* Input background */}
bg-gray-100      {/* Role toggle container */}
bg-[#0284C7]     {/* Primary buttons */}
hover:bg-[#0369a1]  {/* Button hover */}
```

### Text Colors
```tsx
text-gray-900    {/* Primary text */}
text-gray-500    {/* Secondary text */}
text-gray-400    {/* Labels */}
text-white       {/* On colored backgrounds */}
text-blue-100    {/* Branding description */}
text-blue-200/50 {/* Branding footer */}
text-[#0284C7]   {/* Links */}
```

### Border Colors
```tsx
border-gray-100  {/* Input borders */}
border-sky-500   {/* Focus state */}
```

---

## Responsive Classes

```tsx
hidden lg:flex          {/* Show on desktop only */}
lg:w-1/2              {/* 50% width on desktop */}
w-full                 {/* 100% width on mobile */}
```

---

## Utility Classes

### Flexbox
```tsx
flex                   {/* Enable flex */}
flex-1                 {/* Grow to fill */}
items-center           {/* Vertical center */}
justify-center         {/* Horizontal center */}
justify-between        {/* Space between */}
flex-col              {/* Column direction */}
```

### Positioning
```tsx
relative              {/* Relative positioning */}
absolute              {/* Absolute positioning */}
top-1/2               {/* Top 50% */}
-left-1/2             {/* Left 50% */}
```

### Overflow
```tsx
overflow-hidden       {/* Hide overflow */}
overflow-y-auto       {/* Vertical scroll */}
```

### Transitions
```tsx
transition-all        {/* Animate all properties */}
transition-colors     {/* Animate colors only */}
```

---

## Custom Inline Styles

### Gradient Background
```tsx
style={{ background: 'linear-gradient(135deg, #0284C7 0%, #075985 100%)' }}
```

### Glassmorphism Effect
```tsx
style={{
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)'
}}
```

### Animation Delay
```tsx
style={{ animationDelay: '2s' }}
```

---

## Focus Ring Classes

```tsx
focus:border-sky-500
focus:bg-white
focus:outline-none
focus:ring-4
focus:ring-sky-500/10
```

---

## Disabled State Classes

```tsx
disabled:opacity-50
disabled:cursor-not-allowed
disabled:transform-none
```

---

## Complete Component Example

### Role Toggle Container
```tsx
<div className="bg-gray-100 p-1.5 rounded-2xl flex mb-8">
  <button className={`
    flex-1 py-3 rounded-xl text-sm font-bold
    flex items-center justify-center gap-2
    transition-all
    ${role === 'teacher'
      ? 'bg-[#0284C7] text-white shadow-lg'
      : 'text-gray-400 hover:text-gray-600'
    }
  `}>
    Giáo viên
  </button>
  <button className={`
    flex-1 py-3 rounded-xl text-sm font-bold
    flex items-center justify-center gap-2
    transition-all
    ${role === 'admin'
      ? 'bg-[#0284C7] text-white shadow-lg'
      : 'text-gray-400 hover:text-gray-600'
    }
  `}>
    Quản trị viên
  </button>
</div>
```

---

## SVG Icon Styling

### User Icon
```tsx
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
  <circle cx="12" cy="7" r="4" />
</svg>
```

### Lock Icon
```tsx
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
</svg>
```

### Eye Icon (Show)
```tsx
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
  <circle cx="12" cy="12" r="3" />
</svg>
```

### Eye Slash Icon (Hide)
```tsx
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
  <line x1="1" y1="1" x2="23" y2="23" />
</svg>
```

---

## Demo Notice Box

```tsx
<div className="mt-8 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
  <p className="text-sm font-semibold text-yellow-800">
    ⚠️ DEMO MODE - MOCK AUTHENTICATION
  </p>
  <p className="text-xs text-yellow-700 mt-1">
    Any password will be accepted. Role is auto-detected from email.
  </p>
  <div className="mt-3 space-y-1">
    <p className="text-xs text-gray-600">
      • teacher@school.edu → Teacher Portal
    </p>
    <p className="text-xs text-gray-600">
      • admin@school.edu → Admin Portal
    </p>
  </div>
</div>
```

---

## Footer Section

```tsx
<div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center text-gray-400">
  <p className="text-xs font-bold uppercase tracking-widest">
    ECONTACT v1.0.2
  </p>
  <div className="flex gap-4">
    <Link href="#" className="hover:text-sky-500 transition-colors">
      <svg>...</svg>
    </Link>
  </div>
</div>
```

---

**Reference Complete**

For implementation details, see:
- `apps/web/app/(auth)/login/page.tsx`
- `apps/web/components/auth-branding-panel.tsx`
- `apps/web/app/(auth)/layout.tsx`
