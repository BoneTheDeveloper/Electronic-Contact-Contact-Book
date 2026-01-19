/**
 * Login Screen
 * Handles user authentication with email and password (role auto-detected)
 *
 * SECURITY NOTICE: This is MOCK authentication.
 * Accepts any password. Role is auto-detected from email.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useAuthStore } from '../../stores';
import { colors } from '../../theme';
import type { AuthStackNavigationProp } from '../../navigation/types';

interface LoginScreenProps {
  navigation: AuthStackNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      clearError();
      await login(email, password);
      // Navigation will be handled automatically by RootNavigator based on role
    } catch (err) {
      Alert.alert('Login Failed', error || 'Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            EContact School
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            School Management System
          </Text>
        </View>

        <View style={styles.warningBanner}>
          <Text variant="bodySmall" style={styles.warningText}>
            ⚠️ DEMO MODE - MOCK AUTHENTICATION
          </Text>
          <Text variant="bodySmall" style={styles.warningSubtext}>
            Any password will be accepted
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
            placeholder="parent@school.edu"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
            placeholder="Any password"
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading || !email || !password}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
          >
            Sign In
          </Button>

          <View style={styles.hintSection}>
            <Text variant="bodySmall" style={styles.hintTitle}>
              Demo Accounts (any password):
            </Text>
            <Text variant="bodySmall" style={styles.hintText}>
              • parent@school.edu → Parent Portal
            </Text>
            <Text variant="bodySmall" style={styles.hintText}>
              • student@school.edu → Student Portal
            </Text>
            <Text variant="bodySmall" style={styles.hintText}>
              • teacher@school.edu → Teacher Portal
            </Text>
            <Text variant="bodySmall" style={styles.hintText}>
              • admin@school.edu → Admin Portal
            </Text>
            <Text variant="bodySmall" style={styles.hintNote}>
              Role is auto-detected from email address
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  title: {
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  warningBanner: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFC107',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  warningText: {
    color: '#856404',
    fontWeight: '600',
    marginBottom: 4,
  },
  warningSubtext: {
    color: '#856404',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginButtonContent: {
    height: 52,
  },
  hintSection: {
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  hintTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  hintText: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
  hintNote: {
    color: colors.textHint,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default LoginScreen;
