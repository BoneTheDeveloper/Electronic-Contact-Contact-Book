# Component Migration Reference

## Quick Reference: Paper → Gluestack/NativeWind

## Button Component

### Paper
```typescript
import { Button } from 'react-native-paper';

<Button mode="contained" onPress={handlePress} loading={isLoading}>
  Submit
</Button>

<Button mode="outlined" onPress={handlePress}>
  Cancel
</Button>

<Button mode="text" onPress={handlePress} textColor="#0284C7">
  Learn More
</Button>
```

### Gluestack UI
```typescript
import { Button, ButtonText } from '@gluestack-ui/themed';

<Button onPress={handlePress} isDisabled={isLoading}>
  <ButtonText>Submit</ButtonText>
</Button>

<Button variant="outline" onPress={handlePress}>
  <ButtonText>Cancel</ButtonText>
</Button>

<Button variant="link" onPress={handlePress}>
  <ButtonText color="$primary">Learn More</ButtonText>
</Button>
```

### NativeWind (Recommended)
```typescript
import { Pressable, Text, ActivityIndicator } from 'react-native';

<Pressable
  className="bg-primary rounded-xl p-4 items-center"
  onPress={handlePress}
  disabled={isLoading}
>
  {isLoading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text className="text-white font-semibold text-base">Submit</Text>
  )}
</Pressable>

<Pressable
  className="border border-primary rounded-xl p-4 items-center"
  onPress={handlePress}
>
  <Text className="text-primary font-semibold text-base">Cancel</Text>
</Pressable>
```

---

## TextInput Component

### Paper
```typescript
import { TextInput } from 'react-native-paper';

<TextInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  mode="outlined"
  left={<TextInput.Icon icon="email" />}
  error={hasError}
/>

<TextInput
  label="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  mode="flat"
/>
```

### Gluestack UI
```typescript
import { Input, InputField, InputIcon, InputSlot } from '@gluestack-ui/themed';

<Input>
  <InputField
    placeholder="Email"
    value={email}
    onChangeText={setEmail}
  />
  <InputSlot>
    <InputIcon as={EmailIcon} />
  </InputSlot>
</Input>
```

### NativeWind (Recommended)
```typescript
import { TextInput, View, Text } from 'react-native';

<View className="mb-4">
  <Text className="text-gray-700 mb-2 font-medium">Email</Text>
  <TextInput
    className="border border-gray-300 rounded-xl p-4 bg-white"
    placeholder="email@example.com"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
    autoCapitalize="none"
  />
</View>

<View className="mb-4">
  <Text className="text-gray-700 mb-2 font-medium">Password</Text>
  <TextInput
    className="border border-gray-300 rounded-xl p-4 bg-white"
    placeholder="••••••••"
    value={password}
    onChangeText={setPassword}
    secureTextEntry
  />
</View>
```

---

## Card Component

### Paper
```typescript
import { Card, Text } from 'react-native-paper';

<Card style={styles.card}>
  <Card.Content>
    <Text variant="titleLarge">Card Title</Text>
    <Text variant="bodyMedium" style={styles.subtitle}>
      Subtitle
    </Text>
    <Divider style={styles.divider} />
    <Text variant="bodyMedium">
      Card content goes here...
    </Text>
  </Card.Content>
  <Card.Actions>
    <Button mode="text">Cancel</Button>
    <Button mode="contained">OK</Button>
  </Card.Actions>
</Card>
```

### Gluestack UI
```typescript
import { Box, Text, Button, Divider, VStack, HStack } from '@gluestack-ui/themed';

<Box bg="$white" borderRadius="$xl" p="$4" shadowColor="$shadow" shadowOffset={0} shadowOpacity={0.1} shadowRadius={4}>
  <VStack space="sm">
    <Text fontSize="$xl" fontWeight="$bold">Card Title</Text>
    <Text fontSize="$sm" color="$gray500">Subtitle</Text>
    <Divider my="$2" />
    <Text>Card content goes here...</Text>
  </VStack>
  <HStack space="sm" mt="$4">
    <Button variant="outline"><ButtonText>Cancel</ButtonText></Button>
    <Button><ButtonText>OK</ButtonText></Button>
  </HStack>
</Box>
```

### NativeWind (Recommended)
```typescript
import { View, Text, Pressable, Divider } from 'react-native';

<View className="bg-white rounded-2xl p-4 shadow-sm">
  <View className="mb-2">
    <Text className="text-xl font-bold text-gray-900">Card Title</Text>
    <Text className="text-sm text-gray-500">Subtitle</Text>
  </View>
  <Divider className="my-2 bg-gray-200 h-px" />
  <Text className="text-base text-gray-700 mb-4">
    Card content goes here...
  </Text>
  <View className="flex-row gap-2">
    <Pressable className="flex-1 border border-primary rounded-xl p-3 items-center">
      <Text className="text-primary font-semibold">Cancel</Text>
    </Pressable>
    <Pressable className="flex-1 bg-primary rounded-xl p-3 items-center">
      <Text className="text-white font-semibold">OK</Text>
    </Pressable>
  </View>
</View>
```

---

## Avatar Component

### Paper
```typescript
import { Avatar } from 'react-native-paper';

// Text avatar
<Avatar.Text label="JD" size={40} />

// Image avatar
<Avatar.Image
  source={{ uri: 'https://example.com/avatar.png' }}
  size={60}
/>

// Icon avatar
<Avatar.Icon icon="account" size={50} />
```

### Gluestack UI
```typescript
import { Avatar, AvatarFallbackText, AvatarImage } from '@gluestack-ui/themed';

// Text avatar
<Avatar size="md">
  <AvatarFallbackText>JD</AvatarFallbackText>
</Avatar>

// Image avatar
<Avatar size="lg">
  <AvatarImage source={{ uri: 'https://example.com/avatar.png' }} />
  <AvatarFallbackText>JD</AvatarFallbackText>
</Avatar>
```

### NativeWind (Recommended)
```typescript
import { View, Text, Image } from 'react-native';

// Text avatar
<View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
  <Text className="text-white font-semibold text-base">JD</Text>
</View>

// Image avatar with fallback
<View className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 items-center justify-center">
  <Image
    source={{ uri: 'https://example.com/avatar.png' }}
    className="w-full h-full"
    onError={() => console.log('Image load failed')}
  />
</View>
```

---

## Chip Component

### Paper
```typescript
import { Chip } from 'react-native-paper';

<Chip mode="flat" onPress={handlePress}>
  Default
</Chip>

<Chip mode="outlined" selected>
  Selected
</Chip>

<Chip mode="flat" onClose={handleClose} closeIcon="close">
  Dismissible
</Chip>

<Chip icon="check" mode="flat">
  With Icon
</Chip>
```

### Gluestack UI
```typescript
import { Badge, BadgeText, BadgeIcon } from '@gluestack-ui/themed';

<Badge bg="$lightBlue" className="rounded-full">
  <BadgeText color="$primary">Default</BadgeText>
</Badge>

<Badge
  bg="$lightBlue"
  borderColor="$primary"
  borderWidth={1}
  className="rounded-full px-3 py-1"
>
  <BadgeText color="$primary">Selected</BadgeText>
</Badge>
```

### NativeWind (Recommended)
```typescript
import { View, Text, Pressable } from 'react-native';

<View className="bg-light-blue px-3 py-1.5 rounded-full items-center">
  <Text className="text-primary text-sm font-medium">Default</Text>
</View>

<Pressable className="bg-light-blue border border-primary px-3 py-1.5 rounded-full items-center">
  <Text className="text-primary text-sm font-medium">Selected</Text>
</Pressable>

<View className="flex-row items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
  <Text className="text-green-700 text-sm font-medium">Paid</Text>
  <Pressable onPress={handleClose}>
    <Text className="text-green-700">×</Text>
  </Pressable>
</View>
```

---

## Modal Component

### Paper
```typescript
import { Portal, Modal, ActivityIndicator } from 'react-native-paper';

const [visible, setVisible] = useState(false);

<Portal>
  <Modal
    visible={visible}
    onDismiss={() => setVisible(false)}
    contentContainerStyle={styles.modalContainer}
  >
    <Text variant="titleLarge">Modal Title</Text>
    <Text variant="bodyMedium">Modal content...</Text>
    <Button mode="contained" onPress={() => setVisible(false)}>
      Close
    </Button>
  </Modal>
</Portal>
```

### Gluestack UI
```typescript
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, ButtonText } from '@gluestack-ui/themed';

<Modal isOpen={visible} onClose={() => setVisible(false)}>
  <ModalBackdrop />
  <ModalContent>
    <ModalHeader>
      <Text fontSize="$xl">Modal Title</Text>
    </ModalHeader>
    <ModalBody>
      <Text>Modal content...</Text>
    </ModalBody>
    <ModalFooter>
      <Button onPress={() => setVisible(false)}>
        <ButtonText>Close</ButtonText>
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### NativeWind (Recommended)
```typescript
import { Modal, View, Text, Pressable } from 'react-native';

<Modal
  visible={visible}
  transparent
  animationType="fade"
  onRequestClose={() => setVisible(false)}
>
  <View className="flex-1 bg-black/50 items-center justify-center p-4">
    <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
      <Text className="text-xl font-bold mb-4">Modal Title</Text>
      <Text className="text-base text-gray-700 mb-6">Modal content...</Text>
      <Pressable
        className="bg-primary rounded-xl p-4 items-center"
        onPress={() => setVisible(false)}
      >
        <Text className="text-white font-semibold">Close</Text>
      </Pressable>
    </View>
  </View>
</Modal>
```

---

## Divider Component

### Paper
```typescript
import { Divider } from 'react-native-paper';

<Divider style={styles.divider} />
```

### Gluestack UI
```typescript
import { Divider } from '@gluestack-ui/themed';

<Divider my="$2" />
```

### NativeWind (Recommended)
```typescript
import { View } from 'react-native';

<View className="h-px bg-gray-200 my-2" />
```

---

## ActivityIndicator / Spinner

### Paper
```typescript
import { ActivityIndicator } from 'react-native-paper';

<ActivityIndicator animating={true} size="large" />
```

### Gluestack UI
```typescript
import { Spinner } from '@gluestack-ui/themed';

<Spinner size="large" color="$primary" />
```

### NativeWind (Recommended)
```typescript
import { ActivityIndicator } from 'react-native';

<ActivityIndicator size="large" color="#0284C7" />
```

---

## RadioButton Component

### Paper
```typescript
import { RadioButton } from 'react-native-paper';

<RadioButton.Group onValueChange={setValue} value={value}>
  <RadioButton value="first" />
  <RadioButton value="second" />
</RadioButton.Group>
```

### Gluestack UI
```typescript
import { RadioGroup, RadioIcon, RadioLabel, RadioIndicator, Radio } from '@gluestack-ui/themed';

<RadioGroup value={value} onChange={setValue}>
  <Radio value="first">
    <RadioIndicator>
      <RadioIcon />
    </RadioIndicator>
    <RadioLabel>First Option</RadioLabel>
  </Radio>
  <Radio value="second">
    <RadioIndicator>
      <RadioIcon />
    </RadioIndicator>
    <RadioLabel>Second Option</RadioLabel>
  </Radio>
</RadioGroup>
```

### NativeWind (Recommended)
```typescript
import { View, Pressable, Text } from 'react-native';

<Pressable
  className="flex-row items-center gap-2 mb-2"
  onPress={() => setValue('first')}
>
  <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${value === 'first' ? 'border-primary bg-light-blue' : 'border-gray-300'}`}>
    {value === 'first' && <View className="w-3 h-3 rounded-full bg-primary" />}
  </View>
  <Text className="text-base">First Option</Text>
</Pressable>
```

---

## ProgressBar Component

### Paper
```typescript
import { ProgressBar } from 'react-native-paper';

<ProgressBar progress={0.7} />
```

### Gluestack UI
```typescript
import { Progress, ProgressFilledTrack } from '@gluestack-ui/themed';

<Progress value={70} className="h-2">
  <ProgressFilledTrack className="bg-primary" />
</Progress>
```

### NativeWind (Recommended)
```typescript
import { View } from 'react-native';

<View className="h-2 bg-gray-200 rounded-full overflow-hidden">
  <View className="h-full bg-primary rounded-full" style={{ width: '70%' }} />
</View>
```

---

## Badge Component

### Paper
```typescript
import { Badge } from 'react-native-paper';

<Badge>3</Badge>
```

### Gluestack UI
```typescript
import { Badge, BadgeText } from '@gluestack-ui/themed';

<Badge bg="$error" borderRadius="$full" p="$2">
  <BadgeText color="$white">3</BadgeText>
</Badge>
```

### NativeWind (Recommended)
```typescript
import { View, Text } from 'react-native';

<View className="bg-error rounded-full px-2 py-1 absolute -top-1 -right-1">
  <Text className="text-white text-xs font-bold">3</Text>
</View>
```

---

## StyleSheet to Tailwind Conversion

### Common Patterns

| StyleSheet | Tailwind |
|------------|----------|
| `style={{ flex: 1 }}` | `className="flex-1"` |
| `style={{ flexDirection: 'row' }}` | `className="flex-row"` |
| `style={{ justifyContent: 'center' }}` | `className="justify-center"` |
| `style={{ alignItems: 'center' }}` | `className="items-center"` |
| `style={{ padding: 16 }}` | `className="p-4"` |
| `style={{ paddingHorizontal: 16 }}` | `className="px-4"` |
| `style={{ marginVertical: 8 }}` | `className="my-2"` |
| `style={{ borderRadius: 12 }}` | `className="rounded-xl"` |
| `style={{ backgroundColor: '#0284C7' }}` | `className="bg-primary"` |
| `style={{ color: '#0284C7' }}` | `className="text-primary"` |
| `style={{ fontSize: 16 }}` | `className="text-base"` |
| `style={{ fontWeight: '600' }}` | `className="font-semibold"` |
| `style={{ shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 }}` | `className="shadow-sm"` |
| `style={{ opacity: 0.5 }}` | `className="opacity-50"` |

### Wireframe-Specific Tokens

```css
/* Wireframe colors from docs/wireframe/Mobile/ */
--color-primary: #0284C7;
--color-primary-light: #38BDF8;
--color-primary-dark: #0369A1;
--color-light-blue: #E0F2FE;
--color-secondary: #64748B;
--color-success: #4CAF50;
--color-warning: #FF9800;
--color-error: #F44336;

/* Border radius */
--radius-xl: 1rem;   /* rounded-xl */
--radius-2xl: 1.5rem; /* rounded-2xl */
--radius-3xl: 2rem;   /* rounded-3xl */
--radius-custom-28: 28px; /* rounded-[28px] */
```
