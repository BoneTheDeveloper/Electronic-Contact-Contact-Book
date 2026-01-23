# Metro Configuration Research Report

## Current Configuration Analysis

**File:** `C:\Project\electric_contact_book\apps\mobile\metro.config.js`

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Block watching of Next.js and other app directories in monorepo
config.resolver.blockList = /(.*\.next\/.*|.*\/apps\/(web|server)\/.*)/;

module.exports = config;
```

## Expo's Default Metro Configuration

Since Expo SDK 52, Metro configuration is handled automatically with the following defaults:

- **Source Exts**: `['js', 'json', 'ts', 'tsx', 'jsx']`
- **Watch Folders**: Automatically detected from monorepo structure
- **Resolver**: Enhanced with Web, Server, and tsconfig aliases support
- **Server**: Default Metro server configuration

## BlockList Regex Breakdown

The current regex pattern `/.*(\\.next\\/.*|.*\\/apps\\/(web|server)\\/.*)/` targets:

1. **`.next/` directories** - Next.js build output
2. **`apps/web/`** - Next.js web application directory
3. **`apps/server/`** - Server application directory (doesn't exist in current codebase)

## Project Structure Context

The monorepo contains:
- `apps/mobile/` - Expo React Native app
- `apps/web/` - Next.js web app
- No `apps/server/` directory exists

## Key Findings

1. **Default Behavior**: Expo's `getDefaultConfig()` provides sufficient Metro configuration for monorepos
2. **BlockList Purpose**: Prevents Metro from watching non-mobile app directories
3. **Current BlockList**:
   - Targets Next.js build output (.next/)
   - Blocks web app directory (apps/web/)
   - References non-existent server directory (apps/server/)

## Recommendation

The blockList configuration may be overly restrictive since:
- Expo SDK 52+ handles monorepo watching automatically
- The web app directory is not needed for mobile app bundling
- The server directory doesn't exist

**Consideration**: Test removal of blockList to verify Expo's default behavior handles the monorepo correctly.

---

**Sources:**
- [Expo Metro Configuration Docs](https://docs.expo.dev/versions/latest/config/metro/)
- [Expo Monorepo Guide](https://docs.expo.dev/guides/monorepos/)
- [Metro Bundler Documentation](https://metrobundler.dev/docs/configuration/)