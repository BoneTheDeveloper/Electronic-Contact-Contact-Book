// Send OTP Edge Function
// Generates and sends OTP code via SMS using Twilio

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface SendOTPRequest {
  phoneNumber: string;
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
    const { phoneNumber, type = 'login' }: SendOTPRequest = await req.json();

    // Validate phone number (Vietnam format: +84 or 0)
    const normalizedPhone = phoneNumber.startsWith('0')
      ? '+84' + phoneNumber.slice(1)
      : phoneNumber;

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Clean up any existing unverified OTP codes for this phone
    await supabase
      .from('otp_codes')
      .delete()
      .eq('phone_number', normalizedPhone)
      .eq('type', type)
      .is('verified_at', null)
      .lt('expires_at', new Date().toISOString());

    // Store new OTP code
    const { error: insertError } = await supabase
      .from('otp_codes')
      .insert({
        phone_number: normalizedPhone,
        code: otpCode,
        type: type,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error('Error storing OTP:', insertError);
      throw insertError;
    }

    // Send SMS via Twilio
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_FROM_NUMBER');

    if (accountSid && authToken && fromNumber) {
      // Send real SMS via Twilio
      const message = `Ma xac cua ban la: ${otpCode}. Ma co hieu luc trong 5 phut. KHONG chia se ma nay voi bat ky ai.`;

      const twilioResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: fromNumber,
            To: normalizedPhone,
            Body: message,
          }),
        }
      );

      if (!twilioResponse.ok) {
        const errorText = await twilioResponse.text();
        console.error('Twilio error:', errorText);
        throw new Error(`Failed to send SMS: ${errorText}`);
      }

      const twilioData = await twilioResponse.json();
      console.log('SMS sent successfully:', twilioData.sid);
    } else {
      // DEV MODE: Log OTP to console (no SMS sent)
      console.log(`🔓 DEV MODE - OTP for ${normalizedPhone}: ${otpCode}`);
      console.log(`⏰ Expires at: ${expiresAt}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'OTP sent successfully',
        expiresIn: 300, // 5 minutes in seconds
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-otp:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to send OTP',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
