/**
 * Login Screen
 * Handles user authentication with identifier and password (role auto-detected)
 *
 * SECURITY NOTICE: This is MOCK authentication.
 * Accepts any password.
 *
 * Login identifiers:
 * - Parent: phone number or email
 * - Student: student_code (ST2024001) or email
 * - Teacher: employee_code (TC001) or email
 * - Admin: admin_code (AD001) or email
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text as RNText,
  TextInput as RNTextInput,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../../stores';
import { colors } from '../../theme';
import type { AuthStackNavigationProp } from '../../navigation/types';

interface LoginScreenProps {
  navigation: AuthStackNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please enter identifier and password');
      return;
    }

    try {
      console.log('[LOGIN] Attempting login with:', identifier);
      clearError();
      await login(identifier, password);
      // Navigation will be handled automatically by RootNavigator based on role
    } catch (err) {
      console.error('[LOGIN] Error:', err);
      const errorMsg = error || 'Invalid credentials';
      Alert.alert('Login Failed', errorMsg);
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
          <RNText style={styles.title}>
            EContact School
          </RNText>
          <RNText style={styles.subtitle}>
            School Management System
          </RNText>
        </View>

        <View style={styles.warningBanner}>
          <RNText style={styles.warningText}>
            REAL AUTHENTICATION - Supabase
          </RNText>
          <RNText style={styles.warningSubtext}>
            Use test accounts below
          </RNText>
        </View>

        <View style={styles.form}>
          <View>
            <RNText style={styles.inputLabel}>Email / Phone / Code</RNText>
            <RNTextInput
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType="default"
              autoCapitalize="none"
              autoComplete="username"
              style={styles.input}
              placeholder="0901234569 or parent@school.edu"
              placeholderTextColor="#9CA3AF"
            />
            <RNText style={styles.inputHint}>
              Parents: phone number (0901234569){'\n'}
              Students: student code (ST2024001)
            </RNText>
          </View>

          <View>
            <RNText style={styles.inputLabel}>Password</RNText>
            <View style={styles.passwordWrapper}>
              <RNTextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.inputWithIcon}
                placeholder="Any password"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <RNText style={styles.eyeIconText}>
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </RNText>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading || !identifier || !password}
            style={[
              styles.loginButton,
              (isLoading || !identifier || !password) && styles.loginButtonDisabled,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <RNText style={styles.loginButtonText}>Sign In</RNText>
            )}
          </TouchableOpacity>

          <View style={styles.hintSection}>
            <RNText style={styles.hintTitle}>
              Test Accounts (Password: Test123456!):
            </RNText>
            <RNText style={styles.hintText}>
              • Parent: 0901234569 or parent@school.edu
            </RNText>
            <RNText style={styles.hintText}>
              • Student: ST2024001 or student@school.edu
            </RNText>
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
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
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
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
    marginBottom: 4,
  },
  warningSubtext: {
    fontSize: 12,
    color: '#856404',
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    marginBottom: 4,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  inputHint: {
    fontSize: 11,
    color: colors.textHint,
    marginLeft: 4,
    marginBottom: 16,
    lineHeight: 14,
  },
  passwordWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  inputWithIcon: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  eyeIconText: {
    fontSize: 20,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  hintSection: {
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  hintTitle: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  hintNote: {
    fontSize: 11,
    color: colors.textHint,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default LoginScreen;
