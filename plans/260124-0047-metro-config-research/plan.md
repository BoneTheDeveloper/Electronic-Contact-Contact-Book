---
title: Metro Configuration Review
description: Research and evaluate the necessity of custom Metro configuration in the monorepo
status: completed
priority: low
effort: 1
branch: master
tags: [research, metro, expo, monorepo]
created: 2026-01-24
---

# Metro Configuration Review Plan

## Summary

Research completed on the custom Metro configuration in `apps/mobile/metro.config.js`. The current configuration adds a blockList to prevent Metro from watching Next.js and other app directories in the monorepo.

## Key Findings

1. **Current Configuration**: Simple blockList regex targeting `.next/`, `apps/web/`, and `apps/server/` directories
2. **Expo Defaults**: Since SDK 52, Expo automatically handles monorepo Metro configuration
3. **Project Structure**: Only `apps/mobile/` and `apps/web/` exist - no server directory
4. **BlockList Impact**: Prevents Metro from watching directories not relevant to mobile bundling

## Recommendations

### Option 1: Remove Custom Config (Recommended)
- Remove `metro.config.js` entirely
- Let Expo SDK 52+ handle Metro configuration automatically
- Benefits: Simplified configuration, less maintenance

### Option 2: Keep Minimal Config
- If specific Metro customizations are needed, keep the current config
- Consider simplifying the regex to only target `.next/` directories
- Test thoroughly after changes

## Next Steps

1. Test the mobile app build with default Expo configuration
2. Verify no performance or build issues occur
3. If successful, remove the custom config
4. Document the change decision

## Evaluation

The custom Metro configuration appears to be unnecessary given Expo's improved monorepo support in recent versions. The blockList may be redundant and could be safely removed.