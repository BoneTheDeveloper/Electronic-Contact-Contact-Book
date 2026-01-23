# Single-Session-Per-Account Implementation Research for Supabase Auth

## Overview
Research on implementing single-session-per-account for Next.js + Supabase Auth web applications.

## Key Findings

### 1. Supabase Auth Session Management Patterns

**Built-in Feature**: Supabase offers native single-session enforcement
- **Location**: Settings > Authentication dashboard toggle
- **Behavior**: Only keeps most recently active session active
- **Default**: Off by default (may require Pro plan)

**Session Structure**:
- `session_tokens` table tracks all sessions
- Automatic cleanup on new login
- Last login wins strategy

### 2. Current Implementation Analysis

**Current auth.ts setup**:
- Uses cookie-based authentication
- Manual session validation via `getUser()`
- Standard Supabase Auth flow without single-session enforcement

**Gaps identified**:
- No session token tracking beyond Supabase default
- No device/context awareness
- No old session notification system
- Missing single-session middleware

### 3. Database-Level Session Tracking Extension

**Enhanced session_tokens table structure**:
```sql
CREATE TABLE session_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  device_info JSONB,
  is_active BOOLEAN DEFAULT true,
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_session_tokens_user_active ON session_tokens(user_id, is_active);
```

### 4. Middleware/RSC Implementation Approach

**Options considered**:
1. **Route Handler**: Intercept `/api/auth/session` calls
2. **Middleware**: Validate on protected routes
3. **Server Action**: Extend login to check existing sessions

**Recommended approach**: Route handler + middleware combination

### 5. Graceful Old Session Termination

**Implementation strategy**:
- Pre-login check: `SELECT device_info FROM session_tokens WHERE user_id = ? AND is_active = true`
- If session exists, notify user via toast/alert
- On new login: Set old sessions `is_active = false`
- Redirect old session users to login with warning

**Edge case handling**:
- Same browser multiple tabs: Use session ID to detect
- Mobile + web login: Device-based differentiation
- Session refresh: Maintain session continuity

### 6. Security Considerations

**Session hijacking prevention**:
- IP address binding
- User agent validation
- Session timeout: 30 minutes idle
- Concurrent session detection

**Implementation requirements**:
- Rate limiting on login attempts
- Secure cookie attributes
- HTTPS enforcement

### 7. Supabase-Specific Implementation Pattern

**Key API endpoints**:
```typescript
// Check existing sessions
const { data: existingSessions } = await supabase
  .from('session_tokens')
  .select('device_info, created_at')
  .eq('user_id', userId)
  .eq('is_active', true);

// Terminate old sessions
await supabase
  .from('session_tokens')
  .update({ is_active: false })
  .eq('user_id', userId)
  .neq('id', currentSessionId);

// Create new session tracking
await supabase
  .from('session_tokens')
  .insert({
    user_id: userId,
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    device_info: getDeviceInfo(),
    is_active: true
  });
```

## Recommendations

1. **Enable dashboard toggle** for basic single-session enforcement
2. **Implement custom tracking** for device-aware notifications
3. **Add middleware** for route-level session validation
4. **Build graceful termination** with user notifications
5. **Implement security measures** to prevent session hijacking

## Unresolved Questions

1. Supabase Pro plan requirements for single-session feature
2. Session token storage capacity limits
3. Performance impact of additional session queries
4. Mobile app session synchronization requirements

## Resources

- [User sessions | Supabase Docs](https://supabase.com/docs/guides/auth/sessions)
- [Enforce single session per user #33656](https://github.com/orgs/supabase/discussions/33656)
- [Supabase + React: Single Device Session Enforcement #37076](https://github.com/orgs/supabase/discussions/37076)