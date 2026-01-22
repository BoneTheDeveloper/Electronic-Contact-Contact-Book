# Design Guidelines - School Management System

This document provides comprehensive design guidelines for the School Management System, ensuring consistency, usability, and accessibility across all platforms and user roles.

## Design Philosophy

### Core Principles
- **User-Centered**: Design for the specific needs of each user role
- **Consistent**: Maintain visual and interaction consistency across the platform
- **Accessible**: Ensure compliance with WCAG 2.1 AA standards
- **Performant**: Optimize for speed and efficiency
- **Scalable**: Create a design system that can grow with the platform

### Design System Goals
- Reduce development time through reusable components
- Ensure consistent user experience across all interfaces
- Improve accessibility and inclusivity
- Facilitate rapid prototyping and iteration
- Support future platform expansions

## Brand Identity

### Color System
#### Primary Colors
```css
/* Sky Blue - Primary Brand Color */
--primary-50: #f0f9ff;
--primary-100: #e0f2fe;
--primary-200: #bae6fd;
--primary-300: #7dd3fc;
--primary-400: #38bdf8;
--primary-500: #0ea5e9;  /* Main primary color */
--primary-600: #0284c7;  /* Used for primary buttons */
--primary-700: #0369a1;
--primary-800: #075985;
--primary-900: #0c4a6e;
```

#### Secondary Colors
```css
/* Success - Green */
--success-500: #10b981;
--success-600: #059669;

/* Warning - Yellow */
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error - Red */
--error-500: #ef4444;
--error-600: #dc2626;

/* Info - Blue */
--info-500: #3b82f6;
--info-600: #2563eb;
```

#### Neutral Colors
```css
/* Grayscale */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### Typography

#### Font Hierarchy
```css
/* Display - Headlines */
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Body - Main text */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

#### Typography Scale
```css
/* Mobile App - React Native Paper */
--display-size: 32px;
--heading-size: 24px;
--title-size: 20px;
--subtitle-size: 16px;
--body-size: 14px;
--caption-size: 12px;

/* Web App - Tailwind CSS */
text-xs: 12px,   /* Caption */
text-sm: 14px,   /* Body */
text-base: 16px,  /* Subtitle */
text-lg: 18px,   /* Title */
text-xl: 20px,   /* Heading */
text-2xl: 24px,  /* Display */
```

#### Weights
```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System
```css
/* Base unit: 4px */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

## Component Design System

### Mobile App Components (React Native Paper)

#### Button Component
```typescript
import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    borderRadius: 8,
  },
  contained: {
    backgroundColor: '#0284C7',
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#0284C7',
  },
  text: {
    color: '#0284C7',
  },
});

const Button = ({ mode = 'contained', children, ...props }) => {
  return (
    <PaperButton
      mode={mode}
      style={[styles.button, styles[mode]]}
      labelStyle={styles.text}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

export default Button;
```

#### Card Component
```typescript
import React from 'react';
import { Card as PaperCard, Title, Paragraph } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
  },
});

const Card = ({ title, description, children }) => {
  return (
    <PaperCard style={styles.card}>
      <PaperCard.Content>
        {title && <Title style={styles.title}>{title}</Title>}
        {description && <Paragraph style={styles.description}>{description}</Paragraph>}
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
};

export default Card;
```

### Web App Components (shadcn/ui + Tailwind CSS)

#### Button Component
```tsx
import React from 'react';
import { Button } from '@/components/ui/button';

const ButtonComponent = () => {
  return (
    <div className="space-x-2">
      <Button className="bg-blue-600 hover:bg-blue-700">
        Primary
      </Button>
      <Button variant="outline" className="border-blue-600 text-blue-600">
        Secondary
      </Button>
      <Button variant="ghost">
        Ghost
      </Button>
    </div>
  );
};
```

#### Card Component
```tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const CardComponent = () => {
  return (
    <Card className="w-full max-w-md border border-gray-200 shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Card Title
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          This is the card content with proper styling.
        </p>
      </CardContent>
    </Card>
  );
};
```

## Layout Guidelines

### Mobile App Layout

#### Screen Structure
```typescript
// Standard screen template
const ScreenTemplate = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScreenHeader title="Screen Title" />
      </View>
      <ScrollView style={styles.content}>
        {children}
      </ScrollView>
      <View style={styles.footer}>
        <BottomNavigation />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
});
```

#### Grid System
```typescript
// 2-column grid for mobile
const Grid = ({ children }) => {
  return (
    <View style={styles.grid}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={styles.gridItem}>
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -8,
  },
  gridItem: {
    width: '50%',
    padding: 8,
  },
});
```

### Web App Layout

#### Responsive Grid
```tsx
import { cn } from '@/lib/utils';

interface GridProps {
  children: React.ReactNode;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const Grid: React.FC<GridProps> = ({ children, cols = { default: 1 } }) => {
  return (
    <div className={cn(
      'grid gap-4',
      `grid-cols-${cols.default}`,
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
      cols.xl && `xl:grid-cols-${cols.xl}`
    )}>
      {children}
    </div>
  );
};
```

#### Container Component
```tsx
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className
}) => {
  const sizes = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
  };

  return (
    <div className={cn(
      'mx-auto px-4 sm:px-6 lg:px-8',
      sizes[size],
      className
    )}>
      {children}
    </div>
  );
};
```

## Navigation Design

### Mobile Navigation

#### Tab Navigation
```typescript
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Tab } from '@rneui/base';

const Tab = createMaterialTopTabNavigator();

const ParentTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      tabBarOptions={{
        activeTintColor: '#0284C7',
        inactiveTintColor: '#6b7280',
        indicatorStyle: {
          backgroundColor: '#0284C7',
        },
        style: {
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Grades"
        component={GradesScreen}
        options={{ tabBarLabel: 'Grades' }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{ tabBarLabel: 'Attendance' }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ tabBarLabel: 'Messages' }}
      />
    </Tab.Navigator>
  );
};
```

### Web Navigation

#### Sidebar Navigation
```tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
    { name: 'Users', href: '/users', icon: UsersIcon },
    { name: 'Classes', href: '/classes', icon: ClassesIcon },
    { name: 'Payments', href: '/payments', icon: PaymentsIcon },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navigation.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
```

## Form Design

### Mobile Forms
```typescript
import React from 'react';
import { TextInput, HelperText } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
  },
});

const FormInput = ({
  label,
  value,
  onChangeText,
  error,
  helperText,
}) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
      mode="outlined"
      error={!!error}
      helperText={helperText}
      helperTextType="error"
    />
  );
};
```

### Web Forms
```tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
}) => {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className={cn(error && 'text-red-600')}
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={cn(error && 'border-red-500')}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
```

## Data Visualization

### Mobile Charts
```typescript
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
];

const GradeChart = () => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#0284C7" />
      </BarChart>
    </ResponsiveContainer>
  );
};
```

### Web Charts
```tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AttendanceChart = () => {
  const data = [
    { date: '2024-01', present: 90, absent: 10 },
    { date: '2024-02', present: 85, absent: 15 },
    { date: '2024-03', present: 88, absent: 12 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="present"
            stroke="#0284C7"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="absent"
            stroke="#ef4444"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
```

## Animation Guidelines

### Mobile Animations
```typescript
import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const FadeInView = (props) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### Web Animations
```tsx
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      {children}
    </motion.div>
  );
};
```

## Accessibility Guidelines

### Mobile Accessibility
```typescript
import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const AccessibleButton = ({ children, ...props }) => {
  return (
    <PaperButton
      {...props}
      accessibilityLabel={props.accessibilityLabel || children}
      accessibilityRole="button"
      accessibilityHint={props.accessibilityHint}
      style={styles.button}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48, // Minimum touch target size
    borderRadius: 8,
  },
});
```

### Web Accessibility
```tsx
import React from 'react';
import { Button } from '@/components/ui/button';

const AccessibleButton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      aria-label={props.ariaLabel || children}
      aria-describedby={props.ariaDescribedBy}
      className="min-h-[48px] rounded-md"
    >
      {children}
    </Button>
  );
};
```

## Dark Mode Design

### Mobile Dark Mode
```typescript
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

const darkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: '#0284C7',
    background: '#1f2937',
    surface: '#374151',
    text: '#f9fafb',
  },
};

const App = () => {
  return (
    <PaperProvider theme={darkTheme}>
      <YourAppContent />
    </PaperProvider>
  );
};
```

### Web Dark Mode
```tsx
import React from 'react';

const darkModeStyles = {
  background: '#1f2937',
  surface: '#374151',
  text: '#f9fafb',
  primary: '#0284C7',
};

const DarkModeComponent = () => {
  return (
    <div
      className="bg-gray-900 text-white"
      style={darkModeStyles}
    >
      {/* Dark mode content */}
    </div>
  );
};
```

## Performance Considerations

### Mobile Performance
1. **Image Optimization**
   ```typescript
   import { Image } from 'react-native';

   <Image
     source={{ uri: imageUrl }}
     style={{ width: 100, height: 100 }}
     resizeMode="contain"
   />
   ```

2. **List Optimization**
   ```typescript
   import { FlatList } from 'react-native';

   <FlatList
     data={data}
     renderItem={renderItem}
     keyExtractor={item => item.id}
     getItemLayout={(data, index) => (
       { length: 80, offset: 80 * index, index }
     )}
   />
   ```

### Web Performance
1. **Image Optimization**
   ```tsx
   import Image from 'next/image';

   <Image
     src="/path/to/image.jpg"
     alt="Description"
     width={100}
     height={100}
     priority={false}
   />
   ```

2. **Code Splitting**
   ```tsx
   import dynamic from 'next/dynamic';

   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <p>Loading...</p>,
   });
   ```

## Design System Documentation

### Component Library Structure
```
components/
├── shared/              # Components used by both platforms
│   ├── Button/
│   ├── Card/
│   └── Input/
├── mobile/             # Mobile-specific components
│   ├── BottomNav/
│   ├── ScreenHeader/
│   └── TabBar/
└── web/               # Web-specific components
    ├── Sidebar/
    ├── Modal/
    └── Table/
```

### Design Tokens
Create a centralized design token file:
```typescript
// design-tokens.ts
export const designTokens = {
  colors: {
    primary: {
      50: '#f0f9ff',
      500: '#0ea5e9',
      600: '#0284c7',
      900: '#0c4a6e',
    },
    // ... other color tokens
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
};
```

## Implementation Checklist

### Component Development
- [ ] Follow established naming conventions
- [ ] Use proper TypeScript typing
- [ ] Implement accessibility features
- [ ] Include responsive design
- [ ] Add appropriate animations
- [ ] Write tests for component

### Design Implementation
- [ ] Use design system colors
- [ ] Follow spacing system
- [ ] Maintain typography consistency
- [ ] Implement proper touch targets
- [ ] Ensure dark mode compatibility
- [ ] Optimize for performance

### Quality Assurance
- [ ] Test on multiple devices
- [ ] Verify accessibility compliance
- [ ] Check responsive behavior
- [ ] Validate performance metrics
- [ ] Review accessibility scores
- [ ] Test with screen readers

---

**Design Guidelines Version**: 1.0.0
**Last Updated**: January 23, 2026
**Next Review**: Quarterly updates
**Enforcement**: Mandatory for all new features