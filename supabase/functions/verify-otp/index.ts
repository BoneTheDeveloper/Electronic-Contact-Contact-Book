// Verify OTP Edge Function
// Validates OTP code and marks it as verified

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface VerifyOTPRequest {
  phoneNumber: string;
  code: string;
  type?: 'login' | 'reset_password' | 'verify_phone';
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { phoneNumber, code, type = 'login' }: VerifyOTPRequest = await req.json();

    // Validate phone number (Vietnam format: +84 or 0)
    const normalizedPhone = phoneNumber.startsWith('0')
      ? '+84' + phoneNumber.slice(1)
      : phoneNumber;

    // Validate OTP code
    if (!code || code.length !== 6) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid OTP code format',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limiting (attempts)
    const { data: existingOtp, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone_number', normalizedPhone)
      .eq('type', type)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching OTP:', fetchError);
      throw fetchError;
    }

    if (!existingOtp) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'OTP not found or expired',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if max attempts exceeded
    if (existingOtp.attempts >= existingOtp.max_attempts) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Maximum verification attempts exceeded. Please request a new OTP.',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Increment attempts
    await supabase
      .from('otp_codes')
      .update({ attempts: existingOtp.attempts + 1 })
      .eq('id', existingOtp.id);

    // Verify code
    if (existingOtp.code !== code) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid OTP code',
          remainingAttempts: existingOtp.max_attempts - existingOtp.attempts - 1,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from('otp_codes')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', existingOtp.id);

    if (updateError) {
      console.error('Error marking OTP as verified:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'OTP verified successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in verify-otp:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to verify OTP',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
