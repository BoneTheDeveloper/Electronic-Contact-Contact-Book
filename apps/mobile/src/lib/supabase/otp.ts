/**
 * OTP Service
 * Handles sending and verifying OTP codes via Supabase Edge Functions
 */

import { supabase } from './client';

interface SendOTPResponse {
  success: boolean;
  message?: string;
  expiresIn?: number;
  error?: string;
}

interface VerifyOTPResponse {
  success: boolean;
  message?: string;
  error?: string;
  remainingAttempts?: number;
}

/**
 * Send OTP code to a phone number
 * @param phoneNumber - Phone number (can start with 0 or +84)
 * @param type - OTP type ('login' | 'reset_password' | 'verify_phone')
 * @returns Response with success status
 */
export const sendOTP = async (
  phoneNumber: string,
  type: 'login' | 'reset_password' | 'verify_phone' = 'login'
): Promise<SendOTPResponse> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    // Get Supabase URL from env
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('EXPO_PUBLIC_SUPABASE_URL not set');
    }

    // Extract project reference from URL
    const urlMatch = supabaseUrl.match(/https:\/\/([^\.]+)\.supabase\.co/);
    if (!urlMatch) {
      throw new Error('Invalid Supabase URL format');
    }
    const projectRef = urlMatch[1];

    const functionUrl = `https://${projectRef}.supabase.co/functions/v1/send-otp`;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        phoneNumber,
        type,
      }),
    });

    const data = await response.json();
    return data as SendOTPResponse;
  } catch (error) {
    console.error('[OTP Service] Error sending OTP:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send OTP',
    };
  }
};

/**
 * Verify OTP code
 * @param phoneNumber - Phone number
 * @param code - 6-digit OTP code
 * @param type - OTP type
 * @returns Response with success status
 */
export const verifyOTP = async (
  phoneNumber: string,
  code: string,
  type: 'login' | 'reset_password' | 'verify_phone' = 'login'
): Promise<VerifyOTPResponse> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    // Get Supabase URL from env
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('EXPO_PUBLIC_SUPABASE_URL not set');
    }

    // Extract project reference from URL
    const urlMatch = supabaseUrl.match(/https:\/\/([^\.]+)\.supabase\.co/);
    if (!urlMatch) {
      throw new Error('Invalid Supabase URL format');
    }
    const projectRef = urlMatch[1];

    const functionUrl = `https://${projectRef}.supabase.co/functions/v1/verify-otp`;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        phoneNumber,
        code,
        type,
      }),
    });

    const data = await response.json();
    return data as VerifyOTPResponse;
  } catch (error) {
    console.error('[OTP Service] Error verifying OTP:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify OTP',
    };
  }
};
