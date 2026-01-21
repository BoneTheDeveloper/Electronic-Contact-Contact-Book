# Production Build Guide

**Last Updated:** 2026-01-21
**New Architecture:** DISABLED (Expo Go Compatible)
**Expo SDK:** 52.0.0
**React Native:** 0.76.9

## Prerequisites

### Required Accounts
- **EAS Account:** [https://expo.dev](https://expo.dev) (Free tier available)
- **Apple Developer Account:** [https://developer.apple.com](https://developer.apple.com) ($99/year)
- **Google Play Console:** [https://play.google.com/console](https://play.google.com/console) ($25 one-time)

### Required Tools
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to EAS
eas login

# Configure project
eas build:configure
```

## Build Commands

### Android Production Build

```bash
# Navigate to mobile app directory
cd C:\Project\electric_contact_book\apps\mobile

# Build Android App Bundle (.aab) for Play Store
eas build --platform android --profile production

# Build APK for direct distribution (testing)
eas build --platform android --profile preview

# Build with local credentials
eas build --platform android --profile production --local
```

**Expected Output:**
- Build takes 10-20 minutes on EAS
- Produces `.aab` file for Play Store
- Build URL provided in console
- Download link sent via email

### iOS Production Build

```bash
# Navigate to mobile app directory
cd C:\Project\electric_contact_book\apps\mobile

# Build iOS Archive (.ipa) for App Store
eas build --platform ios --profile production

# Build with local credentials
eas build --platform ios --profile production --local
```

**Expected Output:**
- Build takes 15-30 minutes on EAS
- Produces `.ipa` file for App Store
- Build URL provided in console
- Download link sent via email

## Build Configuration

### Current Configuration

| Setting | Value |
|---------|-------|
| **Expo SDK** | ~52.0.0 |
| **React Native** | 0.76.9 |
| **New Architecture** | Disabled (Expo Go Compatible) |
| **Android SDK** | 35 |
| **Android Build Tools** | 35.0.0 |
| **iOS Deployment Target** | 15.1 |
| **JavaScript Engine** | Hermes |
| **Bundle ID** | com.schoolmanagement.econtact |

### Build Profiles

#### Development Build
```bash
eas build --profile development --platform ios      # iOS Simulator
eas build --profile development --platform android # Android APK
```
- Uses development client
- Fast refresh enabled
- Internal distribution
- For development testing

#### Preview Build
```bash
eas build --profile preview --platform ios      # iOS Device
eas build --profile preview --platform android # Android APK
```
- Production client
- Internal distribution
- For testing on real devices

#### Production Build
```bash
eas build --profile production --platform ios      # iOS .ipa
eas build --profile production --platform android # Android .aab
```
- Production client
- Release configuration
- Minified and optimized
- For app store submission

## Signing Setup

### Android Signing

#### Option A: Let EAS Manage Keystore (Recommended)

```bash
# Configure EAS to manage keystore
eas credentials:manage:android --platform android

# EAS will generate and store keystore securely
# No local file management needed
```

**Advantages:**
- No local keystore management
- Secure cloud storage
- Easy team collaboration
- Automatic backups

#### Option B: Use Your Own Keystore

```bash
# Generate keystore locally
keytool -genkeypair -v -storetype PKCS12 \
  -keystore econtact-school-release.keystore \
  -alias econtact-school-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD \
  -dname "CN=EContact School, OU=Development, O=School Management, C=VN"

# Upload to EAS
eas credentials:manage:android --platform android
```

**Important:**
- Store keystore file securely (NEVER commit to git)
- Keep passwords in secure location
- Backup keystore file
- Required for app updates

### iOS Signing

```bash
# Configure EAS with Apple credentials
eas credentials:manage:ios --platform ios

# EAS will guide you through:
# 1. Apple ID email
# 2. App-specific password (generate at appleid.apple.com)
# 3. Team ID
# 4. Distribution certificate
# 5. Provisioning profile
```

**Required Information:**
- Apple ID email
- App-specific password (not account password)
- Team ID (from Apple Developer account)
- Distribution certificate (managed by EAS)
- Provisioning profile (managed by EAS)

## Testing Production Builds

### Android Production Build Test

```bash
# Download .aab from EAS build URL

# Option 1: Upload to Google Play Internal Testing
# - Go to Play Console
# - Create new release in Internal Testing track
# - Upload .aab file
# - Add tester email addresses
# - Testers install from Play Store app

# Option 2: Convert .aab to .apk for local testing (not recommended for production)
# Use bundletool or upload to Play Console for testing

# Install and test on physical device
# Run all integration test scenarios
# Verify New Architecture is enabled
# Check performance metrics
```

### Test Checklist - Android

- [ ] App launches without crashes
- [ ] Splash screen displays correctly
- [ ] All screens render properly
- [ ] Navigation works smoothly
- [ ] All features function correctly
- [ ] No console errors
- [ ] Performance is acceptable (<3s cold start)
- [ ] Memory usage is reasonable
- [ ] Network requests work
- [ ] Push notifications work (if applicable)
- [ ] Permissions handled correctly
- [ ] New Architecture verified enabled

### iOS Production Build Test

```bash
# Download .ipa from EAS build URL

# Option 1: TestFlight Distribution
# - Go to App Store Connect
# - Create new test in TestFlight
# - Upload .ipa via Transporter or EAS Submit
# - Add tester email addresses
# - Testers install from TestFlight app

# Option 2: Direct Installation (requires provisioning)
# - Use Apple Configurator or Xcode
# - Install .ipa on test device
# - Test all scenarios

# Install and test on physical device
# Run all integration test scenarios
# Verify New Architecture is enabled
# Check performance metrics
```

### Test Checklist - iOS

- [ ] App launches without crashes
- [ ] Splash screen displays correctly
- [ ] All screens render properly
- [ ] Navigation works smoothly
- [ ] All features function correctly
- [ ] No console errors
- [ ] Performance is acceptable (<3s cold start)
- [ ] Memory usage is reasonable
- [ ] Network requests work
- [ ] Push notifications work (if applicable)
- [ ] Permissions handled correctly
- [ ] New Architecture verified enabled
- [ ] App works on all supported iOS versions (15.1+)
- [ ] App works on different device sizes

### Verify New Architecture in Production

**Method 1: Runtime Verification (Development Only)**

```typescript
// Add temporary verification in App.tsx (REMOVE before production)
import { NativeModules } from 'react-native';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    if (__DEV__) {
      const constants = NativeModules.PlatformConstants;
      console.log('React Native Version:', constants?.reactNativeVersion);
      console.log('TurboModule Registry:', !!NativeModules.TurboModuleRegistry);
      console.log('Fabric Enabled:', !!constants?.fabric);
    }
  }, []);

  // ... rest of App component
}
```

**Expected in development logs:**
```
TurboModule Registry: true
Fabric Enabled: true
```

**Method 2: Build Verification**

```bash
# Check build configuration (after download)
# The production build should include:
# - Fabric render layer
# - TurboModule support
# - JSI bindings
# - Hermes engine

# Verify by checking app bundle contents (Android)
unzip -l android-production.aab | grep -i fabric

# Or check IPA contents (iOS)
unzip -l ios-production.ipa | grep -i fabric
```

## Store Submission

### Google Play Store Submission

#### Preparation

1. **Create Google Play Console Account**
   - Go to [Play Console](https://play.google.com/console)
   - Pay $25 one-time fee
   - Complete account registration

2. **Create App Listing**
   - Click "Create app"
   - Enter app name: "EContact School"
   - Bundle ID: com.schoolmanagement.econtact
   - Select app type (Free/Paid)
   - Complete store listing

#### Store Listing Requirements

- [ ] **Title:** EContact School
- [ ] **Short Description:** Brief app description (80 chars max)
- [ ] **Full Description:** Detailed app features and functionality
- [ ] **Screenshots:**
  - Phone screenshots (minimum 2)
  - Tablet screenshots (recommended)
  - 1024x500 or 1920x1080 resolution
- [ ] **App Icon:** 512x512 PNG
- [ ] **Feature Graphic:** 1024x500 PNG
- [ ] **Content Rating:** Complete questionnaire
- [ ] **Privacy Policy URL:** Provide link
- [ ] **Contact Details:** Email and website
- [ ] **Category:** Education
- [ ] **Tags:** Relevant keywords

#### Upload and Submit

```bash
# Option 1: Manual Upload
# 1. Download .aab from EAS
# 2. Go to Play Console
# 3. Navigate to Release > Production (or Internal Testing)
# 4. Create new release
# 5. Upload .aab file
# 6. Add release notes
# 7. Submit for review

# Option 2: EAS Submit (Automated)
# Update submit profile in eas.json with service account key
eas submit --platform android --profile production --track production
```

**Review Timeline:**
- Internal Testing: 1-2 days
- Closed Testing: 1-2 days
- Open Testing: 1-3 days
- Production: 1-7 days

### Apple App Store Submission

#### Preparation

1. **Apple Developer Account**
   - Enroll in [Apple Developer Program](https://developer.apple.com/programs)
   - Pay $99/year
   - Complete account setup

2. **Create App in App Store Connect**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Click "My Apps" > "+"
   - Create new app
   - Bundle ID: com.schoolmanagement.econtact
   - SKU: ECONTACT001 (or your SKU)
   - Platform: iOS

#### Store Listing Requirements

- [ ] **App Name:** EContact School
- [ ] **Subtitle:** Brief description (30 chars max)
- [ ] **Description:** Detailed app features
- [ ] **Screenshots:**
  - iPhone 6.7" Display (1290x2796)
  - iPhone 6.5" Display (1242x2688)
  - iPad Pro 12.9" Display (2048x2732)
  - Minimum required: iPhone 6.7" (1 screenshot)
- [ ] **App Icon:** 1024x1024 (all sizes generated)
- [ ] **App Privacy Details:** Complete privacy questionnaire
- [ ] **Age Rating:** Calculate based on content
- [ ] **Category:** Education
- [ ] **Keywords:** Relevant keywords (100 chars max)
- [ ] **Support URL:** Your support website
- [ ] **Marketing URL:** (Optional)
- [ ] **Copyright:** Your copyright notice

#### Upload and Submit

```bash
# Option 1: Manual Upload via Transporter
# 1. Download .ipa from EAS
# 2. Open Transporter app (Mac)
# 3. Sign in with Apple ID
# 4. Drag and drop .ipa file
# 5. Upload to App Store Connect

# Option 2: EAS Submit (Automated)
# Update submit profile in eas.json with Apple credentials
eas submit --platform ios --profile production
```

**Review Timeline:**
- Initial submission: 1-3 days
- Updates: 1-2 days

## Version Management

### Current Version

- **Version:** 1.0.0
- **Build Number:** Auto-incremented by EAS
- **Release Track:** Production

### Version Bump Process

```bash
# Update version in app.json
{
  "expo": {
    "version": "1.0.1"  // Increment version
  }
}

# EAS will auto-increment build number
# Build number format: YYYYMMDD.HHMM
```

### Semantic Versioning

- **MAJOR:** Incompatible API changes
- **MINOR:** Backwards-compatible functionality
- **PATCH:** Backwards-compatible bug fixes

## Rollback Plan

### If Production Build Has Issues

#### Option 1: Fix and Rebuild

```bash
# Fix issues in code
# Test fixes in development build
# Create new production build
eas build --platform android --profile production
eas build --platform ios --profile production
```

#### Option 2: Revert to Previous Version

```bash
# Revert to previous commit
git revert HEAD

# Create new production build with old code
eas build --platform android --profile production
eas build --platform ios --profile production
```

#### Option 3: Emergency OTA Update

```bash
# If critical bug found after release:
# Fix bug in code
# Create OTA update (no new build required)
eas update --branch production --message "Critical fix"

# Note: OTA updates only work for JavaScript changes
# Native changes require full build
```

## Post-Release Monitoring

### 1. Monitor Crashes

**Recommended Tools:**
- Firebase Crashlytics
- Sentry
- Bugsnag

**Actions:**
- Set up crash reporting before release
- Review crash reports daily for first week
- Fix critical crashes immediately
- Release emergency update if needed

### 2. Monitor Performance

**Metrics to Track:**
- App startup time
- ANR rates (Android)
- Crash-free users
- Screen load times
- API response times
- Memory usage

### 3. Monitor Reviews

**Actions:**
- Respond to user reviews within 24 hours
- Address reported issues publicly
- Track ratings trends
- Use feedback for improvements

### 4. Prepare Updates

**Hotfix Workflow:**
```bash
# Create hotfix branch
git checkout -b hotfix/critical-issue

# Fix issue
# Test thoroughly

# Merge to main
git checkout main
git merge hotfix/critical-issue

# Create production build
eas build --platform all --profile production

# Submit to stores
```

## Validation Commands

```bash
cd C:\Project\electric_contact_book\apps\mobile

# 1. Verify EAS configuration
eas build:list

# 2. Check build status
eas build:status [BUILD_ID]

# 3. Validate app.json
npx expo config

# 4. Check for configuration errors
eas build --profile production --platform android --non-interactive

# 5. TypeScript check
npm run typecheck

# 6. Lint check
npm run lint

# 7. Test suite
npm test
```

## Build Times

**EAS Build Times (Estimated):**

| Platform | Free Tier | Paid Tier |
|----------|-----------|-----------|
| Android | 15-25 min | 10-15 min |
| iOS | 20-35 min | 15-25 min |

**Factors Affecting Build Time:**
- Queue time (other builds)
- Project size and complexity
- Number of dependencies
- Native modules
- Network speed

## Troubleshooting

### Build Fails on EAS

**Issue:** "Build failed - generic error"

```bash
# Check build logs
eas build:view [BUILD_ID]

# Common fixes:
# 1. Verify app.json syntax
npx expo config --type json

# 2. Check node_modules integrity
rm -rf node_modules
npm install

# 3. Verify bundle ID uniqueness
# Check Apple Developer / Google Play Console

# 4. Check for deprecated APIs
# Review EAS build logs for specific errors
```

**Issue:** "Signing failed"

```bash
# Reset credentials
eas credentials:reset:android
eas credentials:reset:ios

# Reconfigure
eas credentials:manage:android
eas credentials:manage:ios

# Verify credentials
eas credentials:list
```

### Production Build Crashes

**Issue:** "Crashes on launch"

```bash
# Check device logs for stack trace
# Android: adb logcat
# iOS: Xcode > Devices > Logs

# Verify all libraries compatible with New Architecture
# Check for missing native modules

# Temporary fix: Check if works without New Architecture
# Edit app.json: "newArchEnabled": false
# Rebuild and test
```

**Issue:** "Crashes on specific screen"

```bash
# Identify problematic screen
# Check React Native Paper components
# Test without problematic component
# Report issue to library GitHub

# Check for:
# - Null/undefined values
# - Missing permissions
# - Navigation errors
# - State management issues
```

### Store Rejection

**Issue:** "App rejected for guideline violations"

**Common Reasons:**
- Missing permissions explanation
- Incomplete store listing
- Guideline violations
- Bugs found during review
- Crashes during review

**Actions:**
```bash
# Review rejection reason carefully
# Fix all violations
# Test thoroughly
# Resubmit with explanation
# Use "Resolution Center" to communicate
```

## Store Submission Checklist

### Google Play Store

**Store Listing:**
- [ ] Title: EContact School
- [ ] Short description (80 chars max)
- [ ] Full description
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Phone screenshots (min 2)
- [ ] Tablet screenshots (recommended)
- [ ] Content rating complete
- [ ] Privacy policy URL
- [ ] Contact email
- [ ] Website URL
- [ ] Category: Education
- [ ] Tags/keywords

**Technical:**
- [ ] .aab uploaded
- [ ] Bundle ID: com.schoolmanagement.econtact
- [ ] Target SDK 35
- [ ] 64-bit architecture
- [ ] Signing key managed by EAS
- [ ] App permissions documented
- [ ] Content rating questionnaire
- [ ] Release notes prepared

**Testing:**
- [ ] Tested on multiple Android devices
- [ ] Tested on different Android versions
- [ ] All features working
- [ ] No crashes or ANRs
- [ ] Performance acceptable

### Apple App Store

**Store Listing:**
- [ ] App name: EContact School
- [ ] Subtitle (30 chars max)
- [ ] Description
- [ ] App icon (1024x1024)
- [ ] Screenshots for all device sizes:
  - [ ] iPhone 6.7" (1290x2796)
  - [ ] iPhone 6.5" (1242x2688)
  - [ ] iPad Pro 12.9" (2048x2732)
- [ ] Privacy details complete
- [ ] Age rating calculated
- [ ] Export compliance
- [ ] App preview videos (optional)
- [ ] Review information
- [ ] Demo account (if needed)
- [ ] Support URL
- [ ] Marketing URL (optional)
- [ ] Category: Education
- [ ] Keywords (100 chars max)

**Technical:**
- [ ] .ipa uploaded
- [ ] Bundle ID: com.schoolmanagement.econtact
- [ ] iOS 15.1+ deployment target
- [ ] Signing managed by EAS
- [ ] App permissions documented
- [ ] App uses no restricted APIs
- [ ] No private APIs used
- [ ] Release notes prepared

**Testing:**
- [ ] Tested on multiple iOS devices
- [ ] Tested on different iOS versions (15.1+)
- [ ] Tested on different screen sizes
- [ ] All features working
- [ ] No crashes
- [ ] Performance acceptable
- [ ] Passes App Store Review Guidelines

## Important Notes

### Before Submission

- [ ] **CRITICAL:** Test production builds THOROUGHLY before submission
- [ ] All features working as expected
- [ ] No console errors or warnings
- [ ] Performance is acceptable
- [ ] All store assets prepared
- [ ] Privacy policy in place
- [ ] Terms of service (if applicable)
- [ ] Support contact information
- [ ] Age rating completed
- [ ] Release notes written

### Submission Timing

- Store review can take 1-3 days (iOS) or 1-7 days (Android)
- Plan release timing accordingly
- Avoid submitting before holidays (review delays)
- Have rollback plan ready
- Monitor for issues after release

### Post-Release

- Set up crash reporting (Firebase Crashlytics recommended)
- Prepare for user support
- Monitor crashes daily
- Respond to reviews
- Track ratings
- Prepare for quick bug fix releases
- Use OTA updates for minor fixes
- Full builds for critical issues

## Credentials Management

### Security Best Practices

- **NEVER** commit credentials to git
- **NEVER** share keystore files
- **NEVER** share Apple ID passwords
- Use environment variables for sensitive data
- Use EAS-managed credentials when possible
- Keep backup of keystore files securely
- Document credential storage location
- Use password manager for credentials

### Required Credentials

**Android:**
- Google Play Console service account key (JSON)
- OR keystore file and passwords

**iOS:**
- Apple ID email
- App-specific password
- Team ID
- Distribution certificate
- Provisioning profile

## Additional Resources

### Official Documentation
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit](https://docs.expo.dev/submit/introduction/)
- [React Native New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect)

### Community
- [Expo Forums](https://forums.expo.dev/)
- [React Native Forums](https://forums.reactnative.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native-expo)

### Tools
- [EAS CLI](https://www.npmjs.com/package/eas-cli)
- [Expo Go](https://expo.dev/client)
- [Transporter (iOS)](https://apps.apple.com/app/transporter/id1450874784)
- [Bundletool (Android)](https://github.com/google/bundletool)

## Quick Reference

### Essential Commands

```bash
# Login to EAS
eas login

# Check project status
eas build:list

# Create Android build
eas build --platform android --profile production

# Create iOS build
eas build --platform ios --profile production

# Submit to store
eas submit --platform android --track production

# Check build status
eas build:status [BUILD_ID]

# View build logs
eas build:view [BUILD_ID]

# Manage credentials
eas credentials:manage:android
eas credentials:manage:ios

# Update app (OTA)
eas update --branch production --message "Update"
```

### File Locations

```
C:\Project\electric_contact_book\apps\mobile\
├── eas.json                      # Build configuration
├── app.json                      # App configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── babel.config.js               # Babel config
├── metro.config.js               # Metro bundler config
├── docs/
│   └── PRODUCTION_BUILD_GUIDE.md # This file
├── android/                      # Android native code
└── ios/                          # iOS native code (generated)
```

### Contact

For issues or questions:
- GitHub Issues: [Your Repo URL]
- Email: [Your Support Email]
- Documentation: [Your Docs URL]

---

**Document Version:** 1.0.0
**Last Updated:** 2026-01-21
**Maintained By:** Development Team
