# School Management System

A comprehensive school management platform with mobile and web applications for administrators, teachers, parents, and students.

## Overview

This monorepo contains:
- **Mobile App** (React Native + Expo) - For parents and students
- **Web App** (Next.js 15) - For administrators and teachers
- **Shared Types** - TypeScript types shared across platforms

## Tech Stack

### Mobile App
- React Native 0.73.6
- Expo ~50.0.0
- React Navigation 6.x
- React Native Paper 5.x (Material Design)
- Zustand (state management)

### Web App
- Next.js 15 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS
- shadcn/ui components

### Shared
- TypeScript shared types package
- Monorepo with pnpm workspaces
- Turborepo for build orchestration

## Project Structure

```
electric_contact_book/
├── apps/
│   ├── mobile/              # React Native mobile app
│   │   ├── src/
│   │   │   ├── screens/    # Screen components
│   │   │   ├── navigation/ # Navigation config
│   │   │   ├── stores/     # Zustand state
│   │   │   ├── theme/      # App theming
│   │   │   └── mock-data/  # Mock data for demo
│   │   └── App.tsx
│   │
│   └── web/                 # Next.js web app
│       ├── app/
│       │   ├── (admin)/    # Admin routes
│       │   ├── (auth)/     # Auth routes
│       │   └── api/        # API routes
│       ├── components/     # React components
│       └── lib/            # Utilities & mock data
│
├── packages/
│   └── shared-types/       # Shared TypeScript types
│
├── docs/                   # Project documentation
└── plans/                  # Implementation plans & reports
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Expo CLI (for mobile development)
- iOS Simulator / Android Emulator (for mobile testing)

### Installation

```bash
# Install dependencies
pnpm install

# Install mobile dependencies
cd apps/mobile
pnpm install

# Install web dependencies
cd ../web
pnpm install
```

### Running the Apps

#### Mobile App (Parent/Student Portal)

```bash
cd apps/mobile
npx expo start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app (physical device)

#### Web App (Admin/Teacher Portal)

```bash
cd apps/web
npm run dev
```

Open http://localhost:3000 in your browser.

## Demo Credentials

⚠️ **IMPORTANT:** This is a demo with mock authentication. Any password is accepted.

### Mobile App
```
Parent Login:  parent@econtact.vn
Student Login: student@econtact.vn
Password:      any (mock authentication)
```

### Web App
```
Admin Login:   admin@school.edu
Teacher Login: teacher@school.edu
Parent Login:  parent@school.edu
Student Login: student@school.edu
Password:      any (mock authentication)
```

Role is automatically detected from the email address.

## Features

### Mobile App (Parent Portal)
- 🏠 Dashboard with 9 service icons
- 📅 Schedule/Calendar view
- 📊 Grades and academic performance
- ✅ Attendance tracking
- 💳 Payment management
- 💬 Messages from teachers
- 🔔 Notifications
- 📰 News and announcements
- 👨‍🏫 Teacher directory
- 📝 Leave requests
- 📈 Academic summary reports

### Web App (Admin Portal)
- 📊 Dashboard with statistics
- 👥 User management (students, parents, teachers)
- 🏫 Class management
- 💰 Payment tracking
- 📈 Attendance analytics
- 🔔 Notification management
- 📊 Grade distribution charts

### Web App (Teacher Portal)
- 📊 Class dashboard
- ✅ Attendance marking
- 📝 Grade entry
- 💬 Parent communication
- 📅 Schedule view
- 📈 Student performance tracking

## Development

### Code Standards

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits for git history

### Type Checking

```bash
# Mobile app
cd apps/mobile
npm run typecheck

# Web app
cd apps/web
npm run typecheck
```

### Linting

```bash
# All apps
pnpm run lint

# Mobile only
cd apps/mobile
npm run lint

# Web only
cd apps/web
npm run lint
```

### Building

```bash
# All apps
pnpm run build

# Mobile (expo prebuild)
cd apps/mobile
npx expo prebuild

# Web (production build)
cd apps/web
npm run build
```

## Mock Data

Both apps use mock data for demonstration purposes:

**Mobile:** `apps/mobile/src/mock-data/`
**Web:** `apps/web/lib/mock-data.ts`

To connect to a real backend:
1. Replace mock data imports with API calls
2. Implement real authentication
3. Add proper error handling
4. Update state management for async operations

## Theme Colors

Primary brand color: **#0284C7** (Sky Blue)

Used consistently across both apps for:
- Primary buttons
- Active navigation states
- Links and CTAs
- Chart highlights
- Status indicators

## Deployment

### Mobile App

1. **Build for iOS/Android:**
   ```bash
   cd apps/mobile
   npx eas build --platform ios
   npx eas build --platform android
   ```

2. **Deploy to Stores:**
   - iOS: App Store Connect
   - Android: Google Play Console

3. **OTA Updates:**
   ```bash
   npx eas update
   ```

### Web App

1. **Deploy to Vercel:**
   ```bash
   cd apps/web
   npm run build
   vercel --prod
   ```

2. **Environment Variables:**
   - Set up in Vercel dashboard
   - or use `.env.local` for local development

## Troubleshooting

### Mobile App Issues

**Expo dev server not starting:**
```bash
# Clear cache
npx expo start --clear

# Reset node modules
rm -rf node_modules
pnpm install
```

**TypeScript errors:**
```bash
# Run type check to see specific errors
npm run typecheck

# Fix common issues:
# - Make sure all props are typed
# - Check import paths
# - Verify shared types are up to date
```

### Web App Issues

**Port 3000 already in use:**
- Server will automatically use port 3001
- Check console output for actual port
- Or kill process on port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F

  # macOS/Linux
  lsof -ti:3000 | xargs kill
  ```

**Build errors:**
```bash
# Clean build cache
rm -rf .next
npm run build
```

## Roadmap

### Current Status (v1.0.0)
- ✅ Mock authentication
- ✅ Mobile parent/student portals
- ✅ Web admin/teacher portals
- ✅ Shared types package
- ✅ Demo data and flows

### Next Steps
- [ ] Real backend integration
- [ ] Production authentication (JWT/OAuth)
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] API implementation
- [ ] Comprehensive testing
- [ ] Production deployment
- [ ] Advanced features (real-time notifications, file uploads, etc.)

## Contributing

1. Follow the code standards defined in `.claude/workflows/development-rules.md`
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation as needed
5. Submit PRs for review

## License

ISC

## Support

For questions or issues:
- Check documentation in `docs/` folder
- Review implementation plans in `plans/` folder
- Check troubleshooting section above
- Contact development team

## Security Notice

⚠️ **WARNING:** This is a demonstration application with mock authentication. It is NOT suitable for production use without proper security measures:

- Any password is accepted (MOCK AUTH)
- No real backend connection
- Data is not persisted
- No input validation/sanitization
- No rate limiting
- No real security measures

Before deploying to production, you must:
1. Implement real authentication (OAuth, JWT, etc.)
2. Connect to a secure backend API
3. Add proper input validation
4. Implement rate limiting
5. Use HTTPS
6. Add security headers
7. Implement proper session management
8. Add audit logging
9. Perform security audit
10. Set up proper database with encryption

## Acknowledgments

Built with:
- React Native & Expo
- Next.js
- TypeScript
- Tailwind CSS
- React Native Paper
- And many more open-source libraries
