# Deployment Guide - EContact School Management

**Version**: 1.0
**Last Updated**: 2026-01-19
**Status**: Mobile Entry Point Configuration Fixed

## Table of Contents

1. [Overview](#overview)
2. [Development Environment Setup](#development-environment-setup)
3. [Mobile App Deployment](#mobile-app-deployment)
4. [Web App Deployment](#web-app-deployment)
5. [Production Deployment](#production-deployment)
6. [Environment Variables](#environment-variables)
7. [Troubleshooting](#troubleshooting)
8. [Continuous Integration](#continuous-integration)

## Overview

This guide provides comprehensive instructions for deploying the EContact school management system. The system consists of two main applications:

- **Mobile App**: React Native + Expo for parents and students
- **Web App**: Next.js 15 for administrators and teachers

## Development Environment Setup

### Prerequisites

```bash
# Node.js (v18.0.0 or higher)
node --version  # Should be >= 18.0.0

# pnpm (v8.0.0 or higher)
pnpm --version  # Should be >= 8.0.0

# Expo CLI (for mobile development)
npm install -g @expo/cli

# iOS Simulator / Android Emulator
# - Xcode (for iOS)
# - Android Studio (for Android)
```

### Project Installation

```bash
# Clone and install dependencies
git clone <repository-url>
cd electric_contact_book

# Install all workspace dependencies
pnpm install

# Install mobile dependencies
cd apps/mobile
pnpm install

# Install web dependencies
cd ../web
pnpm install

# Return to root directory
cd ../..
```

### Development Setup Verification

```bash
# Test mobile app startup
cd apps/mobile
npx expo start

# Test web app startup
cd ../web
npm run dev
```

## Mobile App Deployment

### Development Build

```bash
cd apps/mobile

# Start Expo development server
npx expo start

# For specific platforms
npx expo start --android  # Android emulator
npx expo start --ios     # iOS simulator
npx expo start --web     # Web browser
```

### Prebuild Configuration

```bash
cd apps/mobile

# Generate native code
npx expo prebuild

# Clean build cache
npx expo prebuild --clean
```

### Production Builds

#### Using EAS Build

```bash
cd apps/mobile

# Install EAS CLI
npm install -g eas-cli

# Login to EAS
eas login

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Build for both platforms
eas build --platform all --profile production
```

#### Build Profiles

```json
// eas.json
{
  "cli": {
    "version": ">= 8.11.0"
  },
  "build": {
    "ios": {
      "development": {
        "developmentClient": true,
        "distribution": "development",
        "iosSimulator": true,
        "teamId": "your-team-id"
      },
      "production": {
        "distribution": "app-store",
        "teamId": "your-team-id"
      }
    },
    "android": {
      "development": {
        "developmentClient": true,
        "distribution": "internal"
      },
      "production": {
        "gradleCommand": ":app:assembleRelease"
      }
    }
  }
}
```

### App Store Deployment

#### iOS App Store

1. **Upload to App Store Connect**
   ```bash
   eas build --platform ios --profile production
   ```

2. **Submit for Review**
   - Log in to App Store Connect
   - Locate the build under "TestFlight" or "App Store"
   - Complete submission process
   - Add metadata, screenshots, and privacy info

3. **Release Checklist**
   - App Store review notes
   - Privacy policy URL
   - Age rating justification
   - App preview video
   - App screenshots (multiple sizes)

#### Google Play Store

1. **Upload to Google Play Console**
   ```bash
   eas build --platform android --profile production
   ```

2. **Generate Signed APK/AAB**
   ```bash
   # Locally for testing
   eas build --platform android --profile preview --local
   ```

3. **Store Listing Requirements**
   - App title and description
   - Feature graphic
   - App screenshots (4-10 images)
   - Icon and feature graphic
   - Privacy policy compliance

### OTA Updates

```bash
cd apps/mobile

# Push update to Expo
eas update --branch production --message "Bug fix update"

# Push development update
eas update --branch development --message "Development build"
```

## Web App Deployment

### Development Build

```bash
cd apps/web

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Static Export

```bash
# Enable static export in next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

# Build and export
npm run build
```

### Deployment Platforms

#### Vercel Deployment

1. **Connect GitHub Repository**
   - Link repo to Vercel
   - Configure automatic deployments

2. **Environment Variables**
   ```bash
   # Vercel dashboard
   # Settings → Environment Variables
   ```
   - `NEXTAUTH_SECRET`
   - `DATABASE_URL`
   - `API_BASE_URL`

3. **Deploy**
   ```bash
   # Manual deploy
   npx vercel --prod

   # Preview deployment
   npx vercel
   ```

#### Other Deployment Options

**Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

**GitHub Pages**
```bash
# Build and deploy to gh-pages branch
npm run build
npx gh-pages -d out
```

## Production Deployment

### Environment Variables

#### Mobile App (.env)
```bash
# apps/mobile/.env
EXPO_PUBLIC_API_URL=https://api.econtact.vn/v1
EXPO_PUBLIC_AUTH_URL=https://auth.econtact.vn
```

#### Web App (.env.local)
```bash
# apps/web/.env.local
NEXTAUTH_URL=https://econtact.vn
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=postgresql://user:pass@host/db
API_BASE_URL=https://api.econtact.vn/v1
```

### CDN Configuration

**Vercel (Recommended)**
- Automatic image optimization
- Global CDN distribution
- Edge functions support
- Automatic SSL certificates

**Custom CDN**
```nginx
# nginx.conf
server {
  listen 443 ssl http2;
  server_name econtact.vn;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  location / {
    proxy_pass http://your-web-app;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### Database Migration (Future)

```bash
# When implementing real database
# apps/web/migrate-database.sh
npm run db:migrate
npm run db:seed
```

## Environment Variables

### Mobile App Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Base API URL | `https://api.econtact.vn/v1` |
| `EXPO_PUBLIC_AUTH_URL` | Authentication service URL | `https://auth.econtact.vn` |
| `EXPO_PUBLIC_VERSION` | App version | `1.0.0` |

### Web App Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | Application base URL | `https://econtact.vn` |
| `NEXTAUTH_SECRET` | NextAuth secret key | `your-256-bit-secret` |
| `DATABASE_URL` | Database connection string | `postgresql://...` |
| `API_BASE_URL` | Backend API URL | `https://api.econtact.vn/v1` |

## Troubleshooting

### Common Mobile App Issues

**Metro Bundler Not Starting**
```bash
# Clear Metro cache
npx expo start --clear

# Reset node modules
rm -rf node_modules
pnpm install
```

**Entry Point Configuration Error**
```bash
# Verify package.json main field
cat apps/mobile/package.json | grep main

# Should output: "main": "./App.tsx"
```

**Asset Not Found Error**
```bash
# Verify app.json asset configuration
cat apps/mobile/app.json

# Assets should be configured correctly
# or using Expo defaults
```

**Build Issues**
```bash
# Clean build
eas build --platform all --profile production --clear-cache

# Check build logs
eas build:logs --platform ios --profile production
```

### Common Web App Issues

**Port Already in Use**
```bash
# Find process
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

**Build Errors**
```bash
# Clean .next directory
rm -rf .next
npm run build
```

**Static Export Issues**
```bash
# Verify next.config.js
# output: 'export' should be enabled
```

### Production Deployment Issues

**SSL Certificate Problems**
```bash
# Check certificate
openssl s_client -connect econtact.vn:443

# Renew certificate
certbot --renew --nginx
```

**Database Connection Issues**
```bash
# Test database connection
npm run db:test

# Check environment variables
cat apps/web/.env.local
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm run test
      - run: pnpm run lint

  mobile-build:
    runs-on: macos-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: cd apps/mobile && pnpm install
      - run: cd apps/mobile && eas build --platform ios --profile preview

  web-build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: cd apps/web && npm run build
      - run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### Deployment Strategies

**Blue-Green Deployment**
1. Deploy to staging environment
2. Run integration tests
3. Deploy to production
4. Verify health checks
5. Switch traffic

**Canary Releases**
1. Deploy to 5% of users
2. Monitor performance metrics
3. Gradually increase traffic
4. Rollback if issues detected

### Monitoring and Logging

**Error Tracking**
```bash
# Sentry integration (future)
npm install @sentry/nextjs
npm install @sentry/react-native

# Configure in App.tsx
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

**Performance Monitoring**
```bash
# Lighthouse CI
npm install -g @lhci/cli

# Run CI tests
lhci autorun
```

## Security Considerations

### Production Security Checklist

1. **Environment Variables**
   - Store secrets in secure vaults
   - Rotate regularly
   - Never commit to git

2. **SSL/TLS**
   - Use Let's Encrypt certificates
   - Enable HSTS headers
   - Configure OCSP stapling

3. **Authentication**
   - JWT tokens with expiration
   - Refresh token rotation
   - Secure cookie settings

4. **Rate Limiting**
   - Implement API rate limits
   - DDoS protection
   - Web Application Firewall (WAF)

5. **Database Security**
   - Use SSL connections
   - Regular backups
   - Encrypted at rest

## Backup and Recovery

### Database Backups

```bash
# Daily backup schedule
0 2 * * * pg_dump $DATABASE_URL > backup_$(date +\%Y\%m\%d).sql

# Upload to cloud storage
aws s3 cp backup_$(date +\%Y\%m\%d).sql s3://econtact-backups/
```

### Application Backups

```bash
# Backup source code
tar -czf econtact_backup_$(date +\%Y\%m\%d).tar.gz apps/ packages/ docs/

# GitHub repository as backup
git push origin main
```

## Maintenance

### Regular Tasks

**Daily**
- Check build status
- Monitor error rates
- Review user feedback

**Weekly**
- Run security scans
- Update dependencies
- Review performance metrics

**Monthly**
- Database optimization
- Certificate renewal
- Feature roadmap review

### Dependency Updates

```bash
# Update all packages
npm update

# Security audit
npm audit fix

# Check for outdated packages
npm outdated
```

## Conclusion

This deployment guide covers the complete process for setting up, building, and deploying the EContact school management system. The recent mobile app entry point configuration fix ensures smooth development and production workflows. Always follow security best practices and maintain regular backups for production deployments.