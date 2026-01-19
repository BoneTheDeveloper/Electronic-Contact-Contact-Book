# Code Standards - EContact School Management

**Version**: 1.0
**Last Updated**: 2026-01-19
**Status**: Mobile Entry Point Configuration Fixed

## Table of Contents

1. [Overview](#overview)
2. [TypeScript Standards](#typescript-standards)
3. [React/React Native Standards](#reactreact-native-standards)
4. [Project Structure](#project-structure)
5. [Naming Conventions](#naming-conventions)
6. [Code Style Guidelines](#code-style-guidelines)
7. [Error Handling](#error-handling)
8. [Testing Standards](#testing-standards)
9. [Performance Guidelines](#performance-guidelines)
10. [Security Best Practices](#security-best-practices)
11. [Documentation Standards](#documentation-standards)

## Overview

This document outlines the coding standards and best practices for the EContact school management system. These standards ensure code quality, maintainability, and consistency across both mobile and web applications.

## TypeScript Standards

### TypeScript Configuration

#### Mobile App (apps/mobile)
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["es2020", "dom"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "App.tsx"],
  "exclude": ["node_modules"]
}
```

#### Web App (apps/web)
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### Type Definitions

#### Strict Mode Enabled
```typescript
// ✅ Always use strict mode
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'parent' | 'student';
}

// ✅ Use interfaces for objects
// ✅ Use types for unions/primitives
// ✅ Explicit null checks
const user: User | null = getUser();
if (user) {
  // ✅ Non-null assertion only when certain
  console.log(user.name);
}
```

#### Generic Types
```typescript
// ✅ Define generic interfaces
interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// ✅ Use generics for reusable components
function useApi<T>(url: string): ApiResponse<T> {
  // Implementation
}

// ❌ Avoid any type
const data: any = fetchData();
```

## React/React Native Standards

### Component Architecture

#### Functional Components with Hooks
```typescript
// ✅ Use function components
const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  // ✅ Use state hooks
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user);

  // ✅ Use effect hooks for side effects
  useEffect(() => {
    // Fetch data on mount
  }, []);

  // ✅ Use useCallback for event handlers
  const handleSave = useCallback(() => {
    onUpdate(userData);
    setIsEditing(false);
  }, [userData, onUpdate]);

  return (
    <View style={styles.container}>
      {/* Component content */}
    </View>
  );
};

// ✅ Define prop types
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

export default UserProfile;
```

#### Component Organization
```typescript
// ✅ Single file exports
export default function Component() { /* ... */ }

// ✅ Group related components
// components/user/
// ├── index.ts          (exports)
// ├── UserProfile.tsx
// ├── UserAvatar.tsx
// └── UserCard.tsx

// ✅ Use camelCase for component names
const UserProfileCard: React.FC = () => { /* ... */ };
const userCardStyles = StyleSheet.create({ /* ... */ });
```

### State Management

#### Zustand Pattern (Mobile)
```typescript
// ✅ Create store interface
interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ✅ Create store with actions
const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = await authService.login(email, password);
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  logout: () => set({ user: null, error: null }),
}));

// ✅ Use in components
const UserProfile: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);

  return (
    <View>
      {user ? <Text>{user.name}</Text> : <Button onPress={() => login()}>Login</Button>}
    </View>
  );
};
```

#### React Context (Web)
```typescript
// ✅ Create context with typed provider
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Create custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ✅ Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    // Login logic
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Project Structure

### Mobile App Structure
```
apps/mobile/
├── assets/
│   ├── icons/          # All icon files
│   ├── images/         # Images and graphics
│   └── README.md       # Asset documentation
├── src/
│   ├── components/    # Reusable components
│   │   ├── common/     # Common UI components
│   │   ├── forms/      # Form components
│   │   └── layout/     # Layout components
│   ├── screens/       # Screen components
│   │   ├── auth/       # Authentication screens
│   │   ├── dashboard/  # Dashboard screens
│   │   ├── profile/    # Profile screens
│   │   └── settings/   # Settings screens
│   ├── navigation/    # Navigation configuration
│   │   ├── Navigator.tsx
│   │   ├── types.ts
│   │   └── Stack.tsx
│   ├── stores/         # Zustand stores
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── app.ts
│   ├── mock-data/     # Mock data files
│   │   ├── users.json
│   │   ├── grades.json
│   │   └── attendance.json
│   ├── types/          # Type definitions
│   │   ├── index.ts
│   │   ├── user.ts
│   │   └── api.ts
│   ├── utils/          # Utility functions
│   │   ├── api.ts
│   │   ├── helpers.ts
│   │   └── validation.ts
│   ├── theme/          # Theme configuration
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   ├── App.tsx        # Root component
│   └── RootNavigator.tsx
├── App.tsx            # Entry point
├── package.json
├── app.json           # Expo config
└── tsconfig.json
```

### Web App Structure
```
apps/web/
├── app/
│   ├── (auth)/        # Authentication routes
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (admin)/       # Admin routes
│   │   ├── dashboard/
│   │   ├── users/
│   │   └── classes/
│   ├── (teacher)/     # Teacher routes
│   │   ├── dashboard/
│   │   ├── attendance/
│   │   └── grades/
│   └── api/           # API routes
│       ├── auth/
│       ├── users/
│       └── classes/
├── components/        # Reusable components
│   ├── ui/           # Base UI components
│   ├── forms/         # Form components
│   ├── layout/        # Layout components
│   └── charts/        # Chart components
├── lib/              # Utilities and helpers
│   ├── auth.ts
│   ├── api.ts
│   ├── utils.ts
│   └── mock-data.ts
├── types/            # Type definitions
└── next.config.js    # Next.js configuration
```

### Shared Package Structure
```
packages/shared-types/
├── index.ts          # Main exports
├── types/
│   ├── user.ts
│   ├── class.ts
│   ├── grade.ts
│   ├── attendance.ts
│   └── notification.ts
└── constants/
    └── index.ts      # Shared constants
```

## Naming Conventions

### File Names
```typescript
// ✅ Use kebab-case for files
user-profile.tsx
class-list.tsx
attendance-record.tsx

// ✅ Use PascalCase for component files
UserProfile.tsx
ClassList.tsx
AttendanceRecord.tsx

// ✅ Use PascalCase for store files
authStore.ts
userStore.ts
appStore.ts

// ✅ Use kebab-case for screen files
auth/login.tsx
dashboard/home.tsx
profile/settings.tsx
```

### Component Names
```typescript
// ✅ Use PascalCase for components
const UserProfileCard: React.FC = () => { /* ... */ };
const ClassScheduleList: React.FC = () => { /* ... */ };

// ✅ Use descriptive names
const UserLoginButton: React.FC = () => { /* ... */ };
const GradeDistributionChart: React.FC = () => { /* ... */ };

// ✅ Prefix with domain for clarity
const UserProfileCard: React.FC = () => { /* ... */ };
const StudentAttendanceList: React.FC = () => { /* ... */ };
const TeacherGradeInput: React.FC = () => { /* ... */ };
```

### Variable Names
```typescript
// ✅ Use camelCase for variables
const userProfile = { name: 'John' };
const isLoggedIn = true;
const userId = '123';

// ✅ Use descriptive names
const currentUser = getUser();
const maxAttempts = 3;
const isLoading = false;

// ✅ Use constants for fixed values
const API_BASE_URL = 'https://api.econtact.vn/v1';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DEBOUNCE_DELAY = 300; // ms
```

### Function Names
```typescript
// ✅ Use camelCase for functions
const getUserProfile = () => { /* ... */ };
const formatDate = (date: Date) => { /* ... */ };

// ✅ Use action names for mutations
const updateUserProfile = (data: Partial<User>) => { /* ... */ };
const deleteAttendanceRecord = (id: string) => { /* ... */ };

// ✅ Use hook names for custom hooks
const useUserAuth = () => { /* ... */ };
const useTheme = () => { /* ... */ };
```

## Code Style Guidelines

### React Native Style Guidelines
```typescript
// ✅ Use StyleSheet.create for styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    backgroundColor: '#0284C7',
    padding: 16,
    borderRadius: 8,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

// ✅ Use styles with reference
<Text style={styles.text}>Welcome</Text>

// ✅ Use inline styles for dynamic values
<Text style={[styles.text, { color: isActive ? '#10B981' : '#6B7280' }]}>
  Status
</Text>
```

### Tailwind CSS Guidelines (Web)
```typescript
// ✅ Use Tailwind classes for styling
<div className="bg-white rounded-lg shadow-md p-6">
  <h1 className="text-2xl font-bold text-gray-800 mb-4">
    Dashboard
  </h1>

  {/* Responsive classes */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Cards */}
  </div>
</div>

// ✅ Use utility variants
<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
  Submit
</button>
```

### React Hooks Rules
```typescript
// ✅ Use hooks at top level
function UserProfile() {
  const user = useUserStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Hooks must be called in order
  const debouncedValue = useDebounce(searchTerm, 300);

  return <div>{/* ... */}</div>;
}

// ❌ Don't call hooks in conditions
if (isAuthenticated) {
  const user = useUser(); // ❌ Wrong!
}

// ❌ Don't call hooks in loops
const items = list.map(item => {
  const [state, setState] = useState(false); // ❌ Wrong!
  return <Item key={item.id} />;
});
```

## Error Handling

### Error Boundaries
```typescript
// ✅ Create error boundary for React components
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to service
    console.error('Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Text>Something went wrong.</Text>;
    }

    return this.props.children;
  }
}
```

### API Error Handling
```typescript
// ✅ Centralized error handling
const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      // Handle unauthorized
      navigation.replace('/login');
    } else if (error.response?.status === 429) {
      // Handle rate limiting
      showMessage('Too many requests. Please try again later.');
    } else {
      // Handle other errors
      showMessage(error.response?.data.message || 'An error occurred');
    }
  } else {
    // Handle non-API errors
    showMessage('Network error. Please check your connection.');
  }
};

// ✅ Use in API calls
const fetchUserData = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
```

### Input Validation
```typescript
// ✅ Create validation schema
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'teacher', 'parent', 'student']),
});

// ✅ Validate on submit
const handleSubmit = async (values: UserFormValues) => {
  try {
    const validatedData = userSchema.parse(values);
    await updateUserProfile(validatedData);
    // Success handling
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      setErrors(error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {} as Record<string, string>));
    }
  }
};
```

## Testing Standards

### Unit Testing
```typescript
// ✅ Test utilities
import { render, fireEvent, screen } from '@testing-library/react-native';
import { UserProfileCard } from './UserProfileCard';

describe('UserProfileCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student' as const,
  };

  it('displays user information', () => {
    render(<UserProfileCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('john@example.com')).toBeTruthy();
  });

  it('calls onUpdate when edit button is pressed', () => {
    const mockOnUpdate = jest.fn();
    render(<UserProfileCard user={mockUser} onUpdate={mockOnUpdate} />);

    fireEvent.press(screen.getByText('Edit'));
    expect(mockOnUpdate).toHaveBeenCalledWith(mockUser);
  });
});
```

### Integration Testing
```typescript
// ✅ Test API integration
import { renderHook, act } from '@testing-library/react-hooks';
import { useUserAuth } from './useUserAuth';

describe('useUserAuth', () => {
  it('logs in successfully', async () => {
    const { result } = renderHook(() => useUserAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.user).toBeDefined();
    expect(result.current.error).toBeNull();
  });
});
```

### Testing Utilities
```typescript
// ✅ Mock data for tests
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    createdAt: new Date(),
  },
  // More mock users
];

// ✅ Mock API service
const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});
```

## Performance Guidelines

### React Optimization
```typescript
// ✅ Use React.memo for expensive components
const ExpensiveComponent: React.FC<{ data: HeavyData }> = React.memo(({ data }) => {
  return <ExpensiveContent data={data} />;
});

// ✅ Use useCallback for stable function references
const handleSave = useCallback(async () => {
  await saveData();
}, [dependency1, dependency2]);

// ✅ Use useMemo for expensive computations
const filteredData = useMemo(() => {
  return data.filter(item => item.category === selectedCategory);
}, [data, selectedCategory]);
```

### React Native Performance
```typescript
// ✅ Use FlatList for long lists
<FlatList
  data={items}
  renderItem={({ item }) => <ListItem item={item} />}
  keyExtractor={item => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={10}
/>

// ✅ Use Image component properly
<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  resizeMode="contain"
  // ✅ Add loading state
  onLoad={() => setIsLoading(false)}
  onError={() => setIsLoading(false)}
/>

// ✅ Use optimized lists
const SectionList = ({ sections }) => (
  <SectionList
    sections={sections}
    renderItem={({ item }) => <Item item={item} />}
    renderSectionHeader={({ section }) => <Header title={section.title} />}
    keyExtractor={item => item.id}
  />
);
```

### Bundle Optimization
```typescript
// ✅ Use dynamic imports for heavy components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false,
});

// ✅ Use lazy loading for routes
const LazyRoute = React.lazy(() => import('./LazyRoute'));

// ✅ Use webpack bundle analyzer
// npm run analyze
```

## Security Best Practices

### Input Sanitization
```typescript
// ✅ Use DOMPurify for HTML content (web)
import DOMPurify from 'dompurify';

const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
  });
};

// ✅ Validate all user inputs
const validateInput = (input: string): boolean => {
  // Remove potentially dangerous characters
  return !/<script|javascript:|data:text\/html|eval\(/i.test(input);
};
```

### Secure Storage
```typescript
// ✅ Use secure storage for sensitive data
const useSecureStorage = () => {
  const setItem = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value, {
      accessibleWhenLocked: false,
      accessibleWhenPasscodeSet: true,
    });
  };

  const getItem = async (key: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(key);
  };

  return { setItem, getItem };
};
```

### API Security
```typescript
// ✅ Add CSRF protection (web)
const addCSRFToken = () => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (token) {
    api.defaults.headers.common['X-CSRF-Token'] = token;
  }
};

// ✅ Use HTTPS only
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.econtact.vn/v1'
  : 'https://dev-api.econtact.vn/v1';

// ✅ Secure sensitive headers
api.interceptors.request.use(config => {
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});
```

## Documentation Standards

### Code Comments
```typescript
// ✅ Use JSDoc for functions
/**
 * Fetches user profile data from the API
 * @param userId - The ID of the user to fetch
 * @returns Promise resolving to user data
 * @throws {ApiError} If API request fails
 */
const fetchUserProfile = async (userId: string): Promise<User> => {
  // Implementation
};

// ✅ Use comments for complex logic
// Calculate average grade weighted by credit hours
const weightedAverage = grades.reduce((sum, grade) => {
  return sum + (grade.score * grade.credits);
}, 0) / totalCredits;
```

### README Files
```markdown
# Component README

## Overview
This component displays the user profile with edit functionality.

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| user | User | Yes | User data to display |
| onUpdate | (user: User) => void | Yes | Called when user updates |
| showActions | boolean | No | Whether to show action buttons |

## Usage
```tsx
<UserProfileCard
  user={currentUser}
  onUpdate={handleUserUpdate}
  showActions={true}
/>
```

## Testing
Run tests with: `npm test`

## Dependencies
- React Native Paper
- React Native Vector Icons
```

### API Documentation
```typescript
/**
 * @api {POST} /api/auth/login User Login
 * @description Authenticate user with email and password
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {object} User object with token
 * @example
 * POST /api/auth/login
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 */
```

### Environment Variables Documentation
```markdown
# Environment Variables

## Required Variables
- `NEXTAUTH_SECRET`: Secret key for NextAuth
- `DATABASE_URL`: Database connection string
- `API_BASE_URL`: Backend API base URL

## Optional Variables
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Logging level (error/warn/info/debug)
```

## Conclusion

These code standards ensure consistency, quality, and maintainability across the EContact project. All developers should follow these guidelines when writing code for the mobile and web applications. Regular code reviews should be conducted to ensure compliance with these standards.

### Key Takeaways
1. **TypeScript**: Always use strict mode and proper typing
2. **Components**: Use functional components with hooks
3. **State Management**: Choose appropriate state management for each use case
4. **Performance**: Optimize for both web and mobile platforms
5. **Security**: Always validate and sanitize user inputs
6. **Testing**: Write comprehensive tests for all components
7. **Documentation**: Keep code and documentation up to date