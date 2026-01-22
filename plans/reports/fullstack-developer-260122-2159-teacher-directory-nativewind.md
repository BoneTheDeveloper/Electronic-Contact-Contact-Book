# TeacherDirectory NativeWind Migration Report

**Date**: 2026-01-22
**File**: `apps/mobile/src/screens/parent/TeacherDirectory.tsx`
**Task**: Migrate from React Native Paper to NativeWind

## Changes Made

### Removed Dependencies
- `react-native-paper` imports (Text, Card, Avatar, Divider)
- `StyleSheet` from React Native

### Added Components
- Native RN components: `View`, `FlatList`, `TouchableOpacity`, `ScrollView`
- Tailwind classes via `className` prop

### Style Migration

| Original (Paper/StyleSheet) | NativeWind (Tailwind) |
|----------------------------|----------------------|
| `backgroundColor: colors.primary` | `bg-sky-600` |
| `backgroundColor: '#F8FAFC'` | `bg-slate-50` |
| `backgroundColor: '#FFFFFF'` | `bg-white` |
| `borderRadius: 12` | `rounded-xl` |
| `borderRadius: 20` | `rounded-b-2xl` |
| `flexDirection: 'row'` | `flex-row` |
| `fontSize: 24, fontWeight: '700'` | `text-2xl font-bold` |
| `color: '#FFFFFF'` | `text-white` |
| `color: 'rgba(255,255,255,0.8)'` | `text-white/80` |
| `elevation: 1, shadow...` | `shadow-sm` |
| `backgroundColor: '#E0F2FE'` | `bg-sky-100` |
| `color: colors.primary` | `text-sky-600` |
| `gap: 4` | `gap-1` |
| `width: 45` | `w-[45px]` |

### Key Transformations

1. **Avatar**: Replaced `<Avatar.Text>` with `<View>` with rounded-full and centered text
2. **Card**: Replaced `<Card>` with `<View>` + bg-white + rounded-xl
3. **Divider**: Replaced `<Divider>` with `<View className="h-px bg-gray-200">`
4. **Text Components**: Direct `<View>` with text classes (Text component not needed in NativeWind v4)

## Business Logic
- ✅ Unchanged - All data handling, props, and component logic preserved
- ✅ Teacher initial generation logic intact
- ✅ Mock data integration maintained
- ✅ All Vietnamese text preserved

## Testing Notes
- Visual layout should match original
- Primary color (#0284C7) maps to `sky-600`
- All spacing and typography preserved via Tailwind equivalents

## File Stats
- Lines before: 157
- Lines after: 108
- Reduction: 49 lines (31%)
