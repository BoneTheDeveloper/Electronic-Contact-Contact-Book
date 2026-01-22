# Deployment Guide - School Management System

This guide provides comprehensive instructions for deploying the School Management System to production environments for both mobile and web applications.

## Overview

The School Management System consists of two main applications that need to be deployed separately:
1. **Mobile App** (React Native + Expo) - Deployed to App Store and Google Play
2. **Web App** (Next.js) - Deployed to Vercel

## Prerequisites

### System Requirements
- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher
- Expo CLI (for mobile deployment)
- EAS CLI (for mobile builds)
- Vercel CLI (for web deployment)

### Accounts Required
- **Apple Developer Account** - For iOS App Store deployment
- **Google Play Console Account** - For Android Play Store deployment
- **Vercel Account** - For web application hosting
- **Supabase Account** - For database and backend services
- **GitHub Account** - For code repository and CI/CD

## Environment Setup

### 1. Environment Variables
Create environment files for production:

#### Web App (.env.production)
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=your-production-jwt-secret-at-least-32-characters
JWT_EXPIRES_IN=7d

# Email Service (optional)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=noreply@your-school.edu
EMAIL_SERVER_PASSWORD=your-email-password

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=GA-XXXXXXXXXX
```

#### Mobile App (app.config.js)
```javascript
export default {
  expo: {
    extra: {
      supabaseUrl: 'https://your-project.supabase.co',
      supabaseAnonKey: 'your-production-anon-key',
      androidClientId: 'your-android-client-id',
      iosClientId: 'your-ios-client-id',
      authDomain: 'your-project.supabase.co',
    },
  },
};
```

### 2. Supabase Production Setup
1. Create a new Supabase project for production
2. Run all migrations:
   ```bash
   supabase db push
   ```
3. Set up proper RLS (Row Level Security) policies
4. Configure storage buckets with proper access controls
5. Set up environment variables in your hosting platform

### 3. Vercel Configuration
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set up build command: `npm run build`
4. Set output directory: `.next`
5. Configure custom domains and redirects

## Mobile App Deployment

### iOS App Store Deployment

#### 1. Development Build Setup
```bash
cd apps/mobile
npx expo install --check
npx expo login  # Sign in with Expo account
npx expo build:ios --profile production
```

#### 2. Apple Developer Account Setup
1. Create Apple Developer account ($99/year)
2. Create App ID for your app
3. Create Provisioning Profile
4. Create Certificate (Distribution or App Store)
5. Configure Xcode with your credentials

#### 3. EAS Build Configuration
Create `eas.json`:
```json
{
  "build": {
    "ios": {
      "team": "YOUR_APPLE_TEAM_ID",
      "distribution": "app-store",
      "release": {
        "channel": "production",
        "automatic": true
      }
    },
    "android": {
      "distribution": "store",
      "release": {
        "channel": "production"
      }
    }
  }
}
```

#### 4. Build and Upload
```bash
# Build for iOS
npx eas build --platform ios --profile production

# Build for Android
npx eas build --platform android --profile production
```

#### 5. Submit to App Store
1. Download the iOS IPA from EAS
2. Upload to App Store Connect
3. Fill out app information
4. Submit for review

### Android Play Store Deployment

#### 1. Google Play Console Setup
1. Create Google Play Console account
2. Create new app listing
3. Set up app content and store details
4. Configure pricing and distribution

#### 2. Firebase Project Setup
1. Create Firebase project
2. Add Android app to Firebase
3. Download `google-services.json`
4. Place in `android/app/google-services.json`

#### 3. Android Build Configuration
Update `android/build.gradle`:
```gradle
buildscript {
    ext {
        googleServicesVersion = "4.3.10"
    }
}

dependencies {
    classpath 'com.google.gms:google-services:4.3.10'
}
```

#### 4. Build and Upload
```bash
# Build for Android
npx eas build --platform android --profile production

# Download APK/AAB from EAS
# Upload to Google Play Console
```

### 5. OTA Updates
```bash
# Push update to production
npx eas update --branch production --message "Production update"

# Check update status
npx eas update:status
```

## Web App Deployment

### Vercel Deployment

#### 1. Connect Repository
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel

# Set production environment
vercel --prod
```

#### 2. Configuration
Create `vercel.json`:
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  },
  "crons": [
    {
      "path": "/api/cleanup-attendance",
      "schedule": "0 2 * * *"
    }
  ]
}
```

#### 3. Deploy
```bash
# Deploy to production
vercel --prod

# Deploy preview deployments
vercel

# View deployment history
vercel ls
```

#### 4. Environment Variables Setup
In Vercel dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add all production environment variables
4. Set to "Encrypted" for sensitive values

### Alternative Deployment Options

#### Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Build and deploy:
```bash
docker build -t school-management-web .
docker run -p 3000:3000 -e DATABASE_URL=your-db-url school-management-web
```

## CI/CD Pipeline Setup

### GitHub Actions Configuration

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm test
      - run: pnpm typecheck
      - run: pnpm lint

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}

  deploy-mobile:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
```

### Environment Variables for CI/CD
Set these secrets in your GitHub repository settings:
- `VERCEL_TOKEN` - Vercel deployment token
- `EXPO_TOKEN` - Expo build token
- `APPLE_ID` - Apple Developer account ID
- `APPLE_PASSWORD` - Apple Developer account password
- `GOOGLE_PLAY_SERVICE_ACCOUNT_KEY` - Google Play service account JSON

## Post-Deployment Checklist

### Mobile App
- [ ] Test all features on physical devices
- [ ] Check app store listing and screenshots
- [ ] Verify push notifications work
- [ ] Test payment integration (if applicable)
- [ ] Check app performance and crash reports
- [ ] Submit to app review (Apple/Google)

### Web App
- [ ] Test all user flows in production
- [ ] Verify all API endpoints work
- [ ] Check SSL certificate is active
- [ ] Test responsive design on all devices
- [ ] Verify email integrations
- [ ] Set up monitoring and error tracking

### Common Issues and Solutions

#### iOS App Store Rejection
- **Common**: Missing privacy policy
  - Solution: Add privacy policy URL in app store connect
- **Common**: Guideline violations
  - Solution: Review Apple App Store Review Guidelines
- **Common**: Bugs or crashes
  - Solution: Test thoroughly, use TestFlight

#### Android Play Store Rejection
- **Common**: Security vulnerabilities
  - Solution: Keep dependencies updated, scan for vulnerabilities
- **Common**: Content policy violations
  - Solution: Review Google Play policies
- **Common**: APK signing issues
  - Solution: Ensure proper signing configuration

#### Vercel Deployment Issues
- **Common**: Build errors
  - Solution: Check build logs, ensure all environment variables are set
- **Common: Runtime errors**
  - Solution: Verify database connections, check API routes
- **Common: Performance issues**
  - Solution: Enable caching, optimize images

## Monitoring and Maintenance

### App Store Monitoring
- Monitor app store reviews
- Track download and usage statistics
- Respond to user feedback
- Update app regularly

### Web App Monitoring
- Set up Vercel analytics
- Use Sentry for error tracking
- Monitor Uptime with UptimeRobot
- Set up log aggregation

### Database Maintenance
- Regular backups
- Performance monitoring
- Security audits
- Schema updates

## Cost Optimization

### Mobile App
- Use EAS free tier for small projects
- Monitor build minutes
- Optimize app size to reduce download costs

### Web App
- Use Vercel Hobby/Pro plan based on traffic
- Enable Vercel Analytics for insights
- Optimize images to reduce bandwidth
- Use caching to reduce database queries

## Scaling Considerations

### Horizontal Scaling
- Load balancer for multiple web servers
- Database read replicas
- CDN for static assets
- Auto-scaling groups

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching layer
- Use edge computing

---

**Deployment Guide Version**: 1.0.0
**Last Updated**: January 23, 2026
**Maintenance Schedule**: Quarterly reviews