# User Management UI Fix Plan

**Date:** 2026-01-22
**Status:** Completed
**Issue:** Fix user_management UI to match wireframe design

## Overview

Fix the UsersManagement component to match the wireframe design at `docs/wireframe/Web_app/Admin/user-management.html`. Key issues:
- AddUserModal design doesn't match wireframe (role selection, step indicators, slide-in modal)
- ImportExcelModal design doesn't match wireframe

## Phases

- [Phase 01] Fix AddUserModal design ([phase-01-add-user-modal.md](phase-01-add-user-modal.md)) - Completed
- [Phase 02] Fix ImportExcelModal design ([phase-02-import-modal.md](phase-02-import-modal.md)) - Completed
- [Phase 03] Testing ([phase-03-testing.md](phase-03-testing.md)) - Completed

## Changes Made

### AddUserModal.tsx
- Replaced tab-based role selection with radio button cards
- Added step indicator (progress dots) at top
- Added gradient background for code preview (`from-blue-50 to-indigo-50`)
- Changed from centered modal to slide-in from right
- Added proper form headers ("Bước 1: Chọn vai trò", "Thông tin học sinh")
- Replaced checkboxes with toggle switches for account settings

### ImportExcelModal.tsx
- Removed BaseModal wrapper for custom design
- Added centered modal with rounded-3xl corners
- Blue file upload area with icon
- Green template download section
- Proper success state display
