# Code Standards - School Management System

This document outlines the coding standards and best practices for the School Management System project. All developers must adhere to these standards to ensure code quality, maintainability, and consistency across the codebase.

## Table of Contents
1. [General Principles](#general-principles)
2. [TypeScript Standards](#typescript-standards)
3. [React/React Native Standards](#reactreact-native-standards)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Testing Standards](#testing-standards)
8. [Git Workflow](#git-workflow)
9. [Project Structure](#project-structure)

## General Principles

### YAGNI (You Ain't Gonna Need It)
- Only implement features that are currently needed
- Avoid over-engineering solutions
- Focus on MVP first, then add enhancements

### KISS (Keep It Simple, Stupid)
- Prefer simple solutions over complex ones
- Avoid unnecessary abstractions
- Write code that's easy to understand

### DRY (Don't Repeat Yourself)
- Extract common functionality into reusable components
- Create shared utilities and hooks
- Avoid duplicating code across similar features

## TypeScript Standards

### Strict Mode
All TypeScript projects must have strict mode enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Type Definitions
- Always type function parameters and return values
- Use interfaces for object shapes
- Prefer type aliases for unions and intersections
- Avoid `any` type - use `unknown` or create proper types

### Boolean Prop Compliance (Phase 01 & 02 Complete)
All React Native boolean props MUST use proper JavaScript expressions:

```typescript
// ✅ Correct
<ScrollView showsVerticalScrollIndicator={false} />
<Pressable disabled={isLoading} />
<TextInput secureTextEntry={!showPassword} />

// ❌ Incorrect (string literals)
<ScrollView showsVerticalScrollIndicator="false" />
<Pressable disabled="true" />
<TextInput secureTextEntry="false" ```
```

**Phase 02 Implementation**: Automated Compliance Checking
- **Standalone Script**: `npm run check:boolean-props` - Executes `apps/mobile/scripts/check-boolean-props.js`
- **ESLint Integration**: Custom rule `no-string-boolean-props` in `.eslintrc.js`
- **Full Validation**: `npm run validate` - Runs lint + typecheck + boolean props check
- **Comprehensive Coverage**: Scans all TSX files in `src/` directory for boolean prop violations

### Function Signatures
```typescript
// ✅ Good
const fetchUserData = async (userId: string): Promise<User> => {
  // implementation
};

// ❌ Bad
const fetchUserData = async (id) => {
  // implementation
};
```

## React/React Native Standards

### Component Structure
```typescript
// Functional Components
interface ComponentProps {
  title: string;
  isLoading?: boolean;
  onAction?: () => void;
}

const MyComponent: React.FC<ComponentProps> = ({ title, isLoading = false, onAction }) => {
  return (
    <View>
      <Text>{title}</Text>
      {isLoading && <ActivityIndicator />}
      <Button onPress={onAction} title="Action" disabled={isLoading} />
    </View>
  );
};

export default MyComponent;
```

### Prop Types
- Always use TypeScript interfaces for component props
- Provide default values for optional props
- Use JSDoc comments for complex props
- Group related props logically

### React Native Best Practices
1. **Boolean Props**: Always use expressions, never strings
2. **Flatlist**: Use `ItemSeparatorComponent` for spacing
3. **Styling**: Use StyleSheet.create for consistency
4. **Images**: Use `require()` for local images, proper sizing
5. **Navigation**: Use typed navigation parameters

### Styling Standards
```typescript
// ✅ Good
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0284C7',
  },
});

// ❌ Bad
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0284C7',
    marginBottom: 10,
  },
};
```

## Component Architecture

### Component Hierarchy
```
App.tsx
├── Navigation/
│   ├── AuthNavigator.tsx
│   ├── ParentTabs.tsx
│   ├── StudentTabs.tsx
│   └── TeacherTabs.tsx
├── Screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── CustomLoginScreen.tsx
│   ├── parent/
│   │   ├── Dashboard.tsx
│   │   ├── Grades.tsx
│   │   ├── Attendance.tsx
│   │   └── ...
│   ├── student/
│   │   ├── Dashboard.tsx
│   │   ├── Schedule.tsx
│   │   ├── Grades.tsx
│   │   ├── Attendance.tsx
│   │   ├── StudyMaterials.tsx
│   │   ├── LeaveRequest.tsx
│   │   ├── TeacherFeedback.tsx
│   │   ├── News.tsx
│   │   ├── Summary.tsx
│   │   ├── Payment.tsx
│   │   └── index.ts
│   ├── teacher/
│   │   ├── Dashboard.tsx
│   │   ├── Attendance.tsx
│   │   └── ...
│   └── admin/
│       ├── Dashboard.tsx
│       ├── Users.tsx
│       └── ...
└── Components/
    ├── common/
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   └── LoadingSpinner.tsx
    └── custom/
        ├── CustomCard.tsx
        └── CustomList.tsx
```

### Component Guidelines
1. **Single Responsibility**: Each component should do one thing well
2. **Pure Functions**: Components should be predictable and side-effect free
3. **Composition**: Prefer composition over inheritance
4. **Performance**: Use `React.memo`, `useCallback`, and `useMemo` appropriately

## Student Screen Patterns

### Naming Conventions
- **Internal Component Name**: `Student{Feature}Screen` (e.g., `StudentScheduleScreen`)
- **Export Name**: `{Feature}Screen` (e.g., `ScheduleScreen`)
- **File Name**: `{Feature}.tsx` (e.g., `Schedule.tsx`)

### File Structure Pattern
```typescript
/**
 * {Feature} Screen
 * {Brief description of screen purpose}
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStudentStore } from '../../stores';
import { ScreenHeader } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface {Feature}ScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

const {Feature}Screen: React.FC<{}Feature}ScreenProps> = ({ navigation }) => {
  // Screen implementation using appropriate hooks and components
  return (
    <View style={styles.container}>
      <ScreenHeader title="{Feature}" onBack={() => navigation?.goBack()} />
      {/* Screen content */}
    </View>
  );
};

export default {Feature}Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
```

### Navigation Integration
All student screens are integrated through the navigation structure:
- **Tab Navigation**: Two main tabs - "Trang chủ" (Home) and "Cá nhân" (Profile)
- **Stack Navigation**: Home tab contains stack of all student screens with hidden headers
- **Screen Registration**: Each screen registered in `StudentTabs.tsx` with appropriate naming

### Export Pattern
Export all screens from `/apps/mobile/src/screens/student/index.ts`:
```typescript
export { StudentDashboardScreen as DashboardScreen } from './Dashboard';
export { StudentScheduleScreen as ScheduleScreen } from './Schedule';
export { StudentGradesScreen as GradesScreen } from './Grades';
// ... continue for all screens
```

### State Management Patterns
```typescript
// Student-specific data fetching
const useStudentData = () => {
  return useQuery({
    queryKey: ['student', 'dashboard'],
    queryFn: fetchStudentDashboardData,
  });
};

// Local component state
const {Feature}Screen = () => {
  const [localState, setLocalState] = useState(initialValue);
  const globalState = useStudentStore(state => state.someValue);

  return (
    // Component implementation
  );
};
```

### Mock Data Implementation
During development phase, use mock data structures:
```typescript
const MOCK_{FEATURE}_DATA = {
  // Define data structure matching API response
};

// Replace with real Supabase queries when integrated
const fetch{Feature}Data = async () => {
  // Temporarily return mock data
  return MOCK_{FEATURE}_DATA;

  // Future implementation:
  // const { data, error } = await supabase
  //   .from('table_name')
  //   .select('*')
  //   .eq('student_id', studentId);
};
```

### Custom Hooks
```typescript
// ✅ Good
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // fetch user logic
  }, []);

  return { user, isLoading };
};

// ❌ Bad
const useAuth = () => {
  const user = useSelector(state => state.auth.user);
  return user;
};
```

## State Management

### Zustand (Mobile App)
```typescript
// Store definition
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const user = await authService.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
```

### React Query (Web App)
```typescript
// API service
const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation
const useCreateUser = () => {
  return useMutation({
    mutationFn: (userData: User) => api.post('/users', userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

### State Guidelines
1. **Global State**: Use Zustand/React Query for shared state
2. **Local State**: Use React hooks for component-level state
3. **Immutability**: Never mutate state directly
4. **Optimization**: Memoize expensive computations

## API Integration

### Supabase Integration
```typescript
// Client setup
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// API service
export const userService = {
  getUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student');

    if (error) throw error;
    return data;
  },

  createUser: async (userData: User) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
```

### Error Handling
```typescript
// Global error handler
const handleApiError = (error: unknown) => {
  if (error instanceof SupabaseError) {
    console.error('Database error:', error.message);
    toast.error('Failed to connect to database');
  } else if (error instanceof Error) {
    console.error('Network error:', error.message);
    toast.error('Network error occurred');
  } else {
    console.error('Unknown error:', error);
    toast.error('An unexpected error occurred');
  }
};

// Usage in components
const handleCreateUser = async (userData: User) => {
  try {
    await userService.createUser(userData);
    toast.success('User created successfully');
  } catch (error) {
    handleApiError(error);
  }
};
```

### API Guidelines
1. **Consistency**: Use standardized API service modules
2. **Error Handling**: Implement comprehensive error handling
3. **Loading States**: Show loading indicators during API calls
4. **Caching**: Use React Query for automatic caching and refetching

## Testing Standards

### Testing Structure
```
tests/
├── __tests__/
│   ├── utils.test.ts
│   └── validation.test.ts
├── components/
│   ├── Button.test.tsx
│   └── LoginScreen.test.tsx
├── services/
│   └── api.test.ts
└── mocks/
    └── data.ts
```

### Unit Testing
```typescript
// Service test
describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return users', async () => {
      // Arrange
      mockSupabaseGet.mockResolvedValue({ data: mockUsers, error: null });

      // Act
      const result = await userService.getUsers();

      // Assert
      expect(result).toEqual(mockUsers);
      expect(mockSupabaseGet).toHaveBeenCalledWith(
        expect.objectContaining({
          eq: ['role', 'student'],
        })
      );
    });
  });
});
```

### Component Testing
```typescript
// Component test
describe('LoginScreen', () => {
  it('should render correctly', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Login')).toBeTruthy();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
  });

  it('should handle login submission', async () => {
    const mockLogin = vi.fn().mockResolvedValueOnce({});
    render(<LoginScreen onLogin={mockLogin} />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.press(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
```

### Testing Guidelines
1. **Coverage**: Aim for 80%+ test coverage
2. **Mocking**: Use mocks for external dependencies
3. **Assertions**: Test both success and error cases
4. **Component Tests**: Test rendering, user interactions, and props

## Git Workflow

### Commit Convention
Follow Conventional Commits:
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test-related changes
- `chore`: Build process or auxiliary tool changes

Examples:
```bash
feat(auth): add JWT token refresh mechanism
fix(grades): display calculation error for letter grades
docs(api): update user management API documentation
style(buttons): fix padding consistency
```

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature development branches
- `fix/*`: Bug fix branches
- `hotfix/*`: Emergency production fixes

### Pull Requests
1. **Description**: Clear description of changes
2. **Testing**: Include test results
3. **Documentation**: Update relevant docs
4. **Review**: At least one reviewer required
5. **CI/CD**: Must pass all checks

## Project Structure

### File Naming
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Services: camelCase (e.g., `userService.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)
- Types: PascalCase (e.g., `User.ts`)
- Tests: Same as source files with `.test` suffix

### Directory Structure
```
apps/
├── mobile/
│   ├── src/
│   │   ├── screens/          # Screen components
│   │   ├── components/       # Reusable components
│   │   ├── navigation/       # Navigation setup
│   │   ├── stores/          # Zustand stores
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   └── mock-data/       # Mock data for development
│   └── App.tsx
│
├── web/
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── (auth)/          # Auth routes
│   │   ├── (admin)/         # Admin routes
│   │   ├── (teacher)/       # Teacher routes
│   │   └── (student)/       # Student routes
│   ├── components/          # Reusable components
│   ├── lib/                # Utilities and config
│   └── types/              # TypeScript types
│
└── shared-types/           # Shared TypeScript types
```

### Import Order
```typescript
// 1. Node.js packages
import React from 'react';
import { View, Text } from 'react-native';

// 2. Third-party packages
import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';

// 3. Internal imports
import { useAuthStore } from '../stores/auth';
import { Button } from './Button';

// 4. Relative imports (near bottom)
import styles from './styles';
```

## Security Guidelines

### Data Validation
- Validate all user inputs
- Sanitize data before storage
- Use Zod or similar for runtime validation

### Authentication
- Never store sensitive data in localStorage
- Use secure HTTP-only cookies for tokens
- Implement proper token expiration

### Environment Variables
- Never commit secrets to git
- Use environment variables for configuration
- Document required environment variables

## Performance Optimization

### React Native
- Use `React.memo` for expensive components
- Optimize images with `resizeMode` and `source`
- Use `FlatList` for large datasets
- Avoid inline functions in `useEffect` dependencies

### Web App
- Implement code splitting with Next.js
- Use dynamic imports for heavy components
- Optimize images with Next.js Image component
- Implement proper caching strategies

## Code Review Checklist

- [ ] Follows TypeScript strict mode
- [ ] Boolean props use proper expressions
- [ ] Error handling is comprehensive
- [ ] Components follow naming conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Performance considerations addressed
- [ ] Security best practices followed

---

**Document Version**: 1.0.0
**Last Updated**: January 23, 2026
**Enforced From**: January 23, 2026