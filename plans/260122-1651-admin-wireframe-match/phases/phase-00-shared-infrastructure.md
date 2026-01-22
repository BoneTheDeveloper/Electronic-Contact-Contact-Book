# Phase 00: Shared Modal Infrastructure

**Parent Plan**: [plan.md](../plan.md)
**Dependencies**: None (Foundation)
**Parallelizable**: N/A (Must run first)

## Context Links
- Research: `../research/researcher-user-academic-report.md`
- Research: `../research/researcher-payment-invoice-report.md`
- Shared: `apps/web/components/admin/shared/`

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-22 |
| Description | Build reusable modal infrastructure for all admin modals |
| Priority | P0 (Blocks all phases) |
| Implementation Status | pending |
| Review Status | pending |

## Key Insights

1. All wireframe modals share: slide-in animation, overlay backdrop, header/actions pattern
2. Existing `PrimaryButton`/`SecondaryButton` should be reused
3. Modal state needs to be managed via React Context for multi-modal scenarios

## Requirements

### Functional
- Base modal component with slide-in animation from right
- Overlay with blur effect (`backdrop-blur-sm`)
- Consistent header (title + close button)
- Footer action buttons (cancel + primary)
- Responsive max-width (md: `max-w-md`, lg: `max-w-lg`, xl: `max-w-xl`)

### Non-Functional
- Animation: 300ms ease-out
- Z-index: 50 (above all content)
- Close on overlay click
- Close on Escape key

## Architecture

```
BaseModal (component)
├── ModalOverlay (backdrop)
├── ModalContent (slide-in container)
│   ├── ModalHeader
│   ├── ModalBody (scrollable)
│   └── ModalFooter (actions)
└── ModalContext (state management)
```

## Related Code Files (Exclusive Ownership)

### New Files to Create
```
apps/web/components/admin/shared/modals/
├── BaseModal.tsx          # Main modal component
├── ModalContext.tsx       # React context for modal stack
├── ModalProvider.tsx      # Context provider wrapper
└── index.ts               # Exports
```

### Files to Read (Not Modify)
- `apps/web/components/admin/shared/buttons/primary-button.tsx`
- `apps/web/components/admin/shared/buttons/secondary-button.tsx`
- `apps/web/components/admin/shared/forms/form-field.tsx`

## File Ownership

| File | Owner | Phase |
|------|-------|-------|
| `BaseModal.tsx` | Phase 00 | 00 (only) |
| `ModalContext.tsx` | Phase 00 | 00 (only) |
| `ModalProvider.tsx` | Phase 00 | 00 (only) |
| `index.ts` | Phase 00 | 00 (only) |

## Implementation Steps

1. **Create BaseModal Component** (30min)
   - Set up basic structure with Portal
   - Add slide-in animation classes
   - Implement overlay click-to-close
   - Add Escape key listener

2. **Create ModalContext** (15min)
   - Define `ModalState` interface
   - Create `openModal` / `closeModal` functions
   - Handle modal stack (for nested modals)

3. **Create ModalProvider** (15min)
   - Wrap app context
   - Export `useModal` hook

4. **Update Shared Index** (10min)
   - Export all modal components

## Todo List

- [ ] Create `modals/` directory structure
- [ ] Implement `BaseModal.tsx` with animation
- [ ] Implement `ModalContext.tsx`
- [ ] Implement `ModalProvider.tsx`
- [ ] Create `index.ts` exports
- [ ] Test modal open/close flow
- [ ] Document usage examples

## Success Criteria

1. Modal opens with slide-in animation (300ms)
2. Overlay closes modal on click
3. Escape key closes modal
4. Modal stack handles nested modals (max 2 deep)
5. No console errors during open/close

## Conflict Prevention

- **No other phases** create modal components in `shared/modals/`
- All other phases **MUST** import from `shared/modals/BaseModal.tsx`
- No direct modification of `shared/buttons/*` files

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Animation conflict with existing | Use unique class prefix `modal-` |
| Z-index issues | Use consistent `z-50` for all modals |
| State conflicts | Single source of truth via Context |

## Security Considerations

- Escape key handler must be debounced
- Portal root must be validated (check for `null`)
- Memory leaks: Remove event listeners on unmount

## Next Steps

After this phase completes:
1. Phase 01 can use `BaseModal` for user modals
2. Phase 02 can use `BaseModal` for academic modals
3. Phase 03 can use `BaseModal` for payment modals

---

**Estimated Effort**: 1.5 hours
**Parallelizable**: No (foundation phase)
