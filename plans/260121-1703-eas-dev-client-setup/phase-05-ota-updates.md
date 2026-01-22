---
title: "Phase 05: OTA Updates Configuration"
description: "Configure over-the-air updates for rapid JavaScript iteration without rebuilding"
status: pending
priority: P2
effort: 45m
dependencies: ["phase-04-first-development-build"]
created: 2026-01-21
---

# Phase 05: OTA Updates Configuration

**Context:** `plan.md` | **Prev:** `phase-04-first-development-build.md` | **Next:** `phase-06-testing-verification.md`

## Overview

Configure EAS Update for over-the-air (OTA) updates, enabling rapid JavaScript changes without rebuilding the native app.

## What Are OTA Updates?

**OTA (Over-The-Air) Updates** allow you to update JavaScript, assets, and configuration without:

- ❌ Rebuilding native code
- ❌ Going through app store review
- ❌ Users reinstalling the app

**Perfect For:**
- Bug fixes
- UI changes
- Feature updates
- Asset updates
- Configuration changes

**NOT For:**
- Native module changes
- New dependencies requiring native code
- Android/iOS version updates

## Current State

**Prerequisites:**
- ✅ Development build installed
- ✅ Device connects to dev server
- ✅ Basic functionality working

**Next:** Configure OTA updates

## Key Insights

1. **EAS Update:** Free service for OTA updates
2. **Branch Strategy:** Use different branches for dev/prod
3. **Update Bundles:** JavaScript + assets only
4. **Rollout Control:** Roll out to percentage of users
5. **Instant Updates:** Changes appear in seconds

## Requirements

### Before Configuring

- [ ] Development build running on device
- [ ] Project configured with EAS
- [ ] EAS project ID in app.json
- [ ] Basic app functionality working

### Branch Strategy

**Development Branch:**
- For development builds
- Rapid iteration
- Testing features

**Production Branch:**
- For production builds
- Stable updates
- Bug fixes for users

## Implementation Steps

### Step 1: Verify EAS Update Configuration

```bash
cd C:\Project\electric_contact_book\apps\mobile

# Check if EAS Update configured
npx expo config --type json | grep -i "updates"

# Expected in app.json:
# "updates": {
#   "url": "https://u.expo.dev/34d17c6d-8e17-4a4c-a2d7-f38d943667f3"
# }
```

**If Not Configured:**

```json
// Add to app.json
{
  "expo": {
    // ... existing config ...
    "updates": {
      "url": "https://u.expo.dev/34d17c6d-8e17-4a4c-a2d7-f38d943667f3"
    }
  }
}
```

---

### Step 2: Configure Update Branches

**Check Existing Branches:**

```bash
# List existing branches
eas branch:list

# Expected: Default branch may exist
```

**Create Development Branch:**

```bash
# Create development branch
eas branch:create development

# This branch will be used for:
# - Development build updates
# - Testing features
# - Beta releases
```

**Create Production Branch:**

```bash
# Create production branch
eas branch:create production

# This branch will be used for:
# - Production build updates
# - Stable releases
# - Bug fixes for users
```

---

### Step 3: Update Runtime Version (if needed)

**Check Runtime Version:**

```bash
# View current runtime version
eas branch:runtime --branch development

# Runtime version format: [sdk-version]-[build-number]
# Example: 52.0.0-1
```

**Runtime Version vs App Version:**

- **App Version:** User-facing version (1.0.0)
- **Runtime Version:** Tracks native changes (52.0.0-1)

**When to Update Runtime Version:**
- After rebuilding native app
- After adding native modules
- After updating Expo SDK

**When to Keep Same:**
- JavaScript-only changes (most updates)

---

### Step 4: Publish First OTA Update

**Make a Small Change:**

```typescript
// apps/mobile/src/screens/parent/Dashboard.tsx

// Add visible change for testing
export default function Dashboard({ route, navigation }: DashboardProps) {
  // ... existing code ...

  return (
    <ScrollView style={styles.container}>
      {/* ADD THIS FOR TESTING */}
      <Card style={styles.testCard}>
        <Card.Content>
          <Text variant="bodyLarge">✅ OTA Update Working!</Text>
          <Text variant="bodySmall">Updated: {new Date().toLocaleString()}</Text>
        </Card.Content>
      </Card>
      {/* END TEST */}

      {/* Existing dashboard content */}
      {/* ... */}
    </ScrollView>
  );
}
```

**Publish Update to Development Branch:**

```bash
# Publish update
eas update --branch development --message "Test OTA update"

# Expected output:
# › Manifest: ...
# › Building bundle...
# › Uploading assets...
# › Update published!
# › URL: https://expo.dev/...
```

**Alternative (npm script):**

```json
// Add to package.json
{
  "scripts": {
    "update": "eas update --branch production --message 'Production update'",
    "update:dev": "eas update --branch development --message 'Dev update'"
  }
}
```

---

### Step 5: Verify OTA Update on Device

**On Device (Development Build):**

1. **Close the app** (not just background)
2. **Reopen the app**
3. **Wait 5-10 seconds**
4. **Check for changes:**
   - New test card appears
   - Shows "✅ OTA Update Working!"
   - Shows current timestamp

**Force Update Check:**

```typescript
// Add to App.tsx for testing (REMOVE after verification)
import * as Updates from 'expo-updates';

useEffect(() => {
  if (__DEV__) {
    // Manually check for updates
    Updates.checkForUpdateAsync().then((update) => {
      if (update.isAvailable) {
        Updates.fetchUpdateAsync().then(() => {
          Updates.reloadAsync();
        });
      }
    });
  }
}, []);
```

**Alternative: Shake Device > Reload**

---

### Step 6: Test Update Rollout

**Create Another Update:**

```typescript
// Make another change
<Text variant="bodyLarge">🎉 OTA Update #2!</Text>
```

**Publish with Rollout:**

```bash
# Roll out to 100% of users
eas update --branch development --message "Update #2"

# Roll out to 50% gradually
eas update --branch development --message "Update #2 - gradual" --rollout 50
```

**Verify Rollout:**
- Some users see old version
- Some users see new version
- Gradually increases to 100%

---

### Step 7: Configure Production Updates

**Setup Production Branch Updates:**

```bash
# Publish to production branch
eas update --branch production --message "Production bug fix"

# View production updates
eas update:list --branch production
```

**Rollout Strategy:**

```bash
# 1. Roll out to 10% first
eas update --branch production --message "v1.0.1 - critical fix" --rollout 10

# 2. Monitor for issues (wait 1-2 hours)

# 3. Gradually increase
eas update --branch production --message "v1.0.1 - critical fix" --rollout 50

# 4. Full rollout if no issues
eas update --branch production --message "v1.0.1 - critical fix" --rollout 100
```

---

### Step 8: Document OTA Workflow

**Create `apps/mobile/docs/OTA_UPDATES.md`:**

```markdown
# OTA Updates Workflow

## Development Updates

### Publish Development Update
```bash
cd apps/mobile
eas update --branch development --message "Dev update"
```

### Check Development Updates
```bash
eas update:list --branch development
```

## Production Updates

### Publish Production Update
```bash
eas update --branch production --message "Production fix"
```

### Rollout Strategy
```bash
# Gradual rollout (recommended)
eas update --branch production --message "Fix" --rollout 10
# Monitor, then increase:
eas update --branch production --message "Fix" --rollout 50
# Finally:
eas update --branch production --message "Fix" --rollout 100
```

## What Updates CAN Do

- Fix bugs
- Update UI
- Add features
- Change assets
- Update configuration
- Fix crashes (JS-level)

## What Updates CANNOT Do

- Add native modules
- Update Expo SDK
- Update React Native version
- Change Android/iOS version
- Add new permissions

## Update Verification

1. Publish update
2. Close app on device
3. Reopen app
4. Wait 5-10 seconds
5. Verify changes appear

## Troubleshooting

**Update not appearing:**
- Check device connected to internet
- Force close and reopen app
- Shake device > Reload
- Check update was published successfully

**Rollback if needed:**
```bash
eas update:list --branch production
# Find previous update ID
eas update:rollback [UPDATE_ID]
```
```

---

## Todo List

- [ ] Verify EAS Update configuration
- [ ] Create development branch
- [ ] Create production branch
- [ ] Make test code change
- [ ] Publish first OTA update
- [ ] Verify update on device
- [ ] Test rollout percentages
- [ ] Configure production updates
- [ ] Document OTA workflow

## Success Criteria

**Phase Complete When:**
- EAS Update configured
- Development branch created
- Production branch created
- First OTA update published
- Update verified on device
- Rollout testing complete
- Documentation created

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Update not appearing | Medium | Low | Check internet, force restart |
| Broken update deployed | Low | High | Gradual rollout, monitor |
| Rollback needed | Low | Medium | Use eas update:rollback |
| Conflicts with native | Low | High | Understand limitations |

## Troubleshooting

### Issue: "Update not appearing on device"

**Solutions:**
```bash
# 1. Check internet connection on device
# 2. Force close app (not just background)
# 3. Reopen app and wait 10 seconds
# 4. Shake device > Reload
# 5. Verify update published:
eas update:list --branch development
```

---

### Issue: "Update breaks app"

**Solutions:**
```bash
# 1. Rollback immediately
eas update:rollback [UPDATE_ID]

# 2. Or publish new update
eas update --branch development --message "Hotfix"

# 3. Investigate issue
# Check device logs
# Reproduce in development
```

---

### Issue: "Cannot publish update"

**Solutions:**
```bash
# 1. Check EAS project configured
eas project:info

# 2. Check branch exists
eas branch:list

# 3. Verify app.json has updates URL
npx expo config --type json | grep updates

# 4. Create branch if missing
eas branch:create development
```

---

## Validation Commands

```bash
cd C:\Project\electric_contact_book\apps\mobile

# 1. Check EAS Update configuration
npx expo config --type json

# 2. List branches
eas branch:list

# 3. Check runtime version
eas branch:runtime --branch development

# 4. Publish test update
eas update --branch development --message "Test update"

# 5. List updates
eas update:list --branch development

# 6. Verify on device
# Close app > Reopen > Check for changes
```

## OTA Update Best Practices

### Gradual Rollout

```bash
# 1. Start with 10%
eas update --branch production --message "Feature X" --rollout 10

# 2. Monitor for 1-2 hours

# 3. Increase to 50%
eas update --branch production --message "Feature X" --rollout 50

# 4. Monitor for 1-2 hours

# 5. Full rollout
eas update --branch production --message "Feature X" --rollout 100
```

### Update Message Guidelines

**Good Messages:**
- "Fix login crash"
- "Add dark mode"
- "Update payment flow"

**Bad Messages:**
- "Update"
- "Fix"
- "Changes"

### When to Use OTA vs Rebuild

**Use OTA Updates:**
- JavaScript changes
- Asset updates
- Bug fixes
- UI improvements
- Feature additions

**Rebuild Native App:**
- New native modules
- Expo SDK upgrade
- New permissions
- Android/iOS version updates
- Performance optimizations (native)

## Related Files

- `apps/mobile/app.json` - Update configuration
- `apps/mobile/package.json` - Update scripts
- `apps/mobile/docs/OTA_UPDATES.md` - OTA documentation (to create)

## Next Steps

After OTA updates configured, proceed to **Phase 06: Testing & Verification** to complete testing and document the workflow.

## Important Notes

**Update Limitations:**
- JavaScript and assets only
- Cannot update native code
- Cannot change app permissions
- Cannot update Expo SDK

**Rollback Strategy:**
- Keep previous updates
- Can rollback within 30 days
- After 30 days, updates expire

**Branch Strategy:**
- **development:** For dev builds and testing
- **production:** For production builds and users

**Monitoring:**
- Monitor update success rate
- Monitor crash reports
- Monitor user feedback
- Rollback if issues detected

---

**Status:** Pending
**Last Updated:** 2026-01-21
