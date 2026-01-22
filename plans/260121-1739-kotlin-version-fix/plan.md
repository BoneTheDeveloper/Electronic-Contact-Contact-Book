---
title: "Fix EAS Android Build - Kotlin Version Mismatch"
description: "Resolve Compose Compiler error by updating Kotlin version to 1.9.25"
status: pending
priority: P1
effort: 30m
issue: null
branch: master
tags: [bugfix, android, eas, kotlin]
created: 2026-01-21
---

# Fix EAS Android Build - Kotlin Version Mismatch

## Overview

EAS Android build failing due to Kotlin version incompatibility with Compose Compiler.

**Error:** `Compose Compiler 1.5.15 requires Kotlin 1.9.25 but Kotlin 1.9.24 is being used`

## Phases

| # | Phase | Status | Effort | Link |
|---|-------|--------|--------|------|
| 1 | Diagnose Kotlin Version | Pending | 10m | [phase-01](./phase-01-diagnose-kotlin-version.md) |
| 2 | Update Kotlin Version | Pending | 10m | [phase-02](./phase-02-update-kotlin-version.md) |
| 3 | Verify Build | Pending | 10m | [phase-03](./phase-03-verify-build.md) |

## Root Cause

Expo SDK 52 uses `expo-modules-core` with Compose Compiler 1.5.15 which requires Kotlin 1.9.25+. Current build uses Kotlin 1.9.24.

## Solution

Override Kotlin version via Gradle configuration in Expo project.
