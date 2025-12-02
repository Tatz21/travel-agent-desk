import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory OTP storage (for production, use a database)
const otpStore = new Map<string, { otp: string; expiry: number }>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, phone, otp } = await req.json();
    const FAST2SMS_API_KEY = Deno.env.get('FAST2SMS_API_KEY');

    if (!FAST2SMS_API_KEY) {
      console.error('FAST2SMS_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, message: 'SMS service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'send') {
      // Generate 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP with 10-minute expiry
      otpStore.set(phone, {
        otp: generatedOtp,
        expiry: Date.now() + 10 * 60 * 1000
      });

      console.log(`Sending OTP ${generatedOtp} to phone: ${phone}`);

      // Send OTP via Fast2SMS using quick route (no verification needed)
      const message = `Your OTP for Travelopedia registration is: ${generatedOtp}. Valid for 10 minutes. Do not share this code.`;
      
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message: message,
          language: 'english',
          flash: 0,
          numbers: phone
        })
      });

      const result = await response.json();
      console.log('Fast2SMS response:', JSON.stringify(result));

      if (result.return === true || result.status_code === 200) {
        return new Response(
          JSON.stringify({ success: true, message: 'OTP sent successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.error('Fast2SMS error:', result);
        return new Response(
          JSON.stringify({ success: false, message: result.message || 'Failed to send OTP' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (action === 'verify') {
      const storedData = otpStore.get(phone);

      if (!storedData) {
        return new Response(
          JSON.stringify({ success: false, message: 'OTP not found. Please request a new one.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (Date.now() > storedData.expiry) {
        otpStore.delete(phone);
        return new Response(
          JSON.stringify({ success: false, message: 'OTP expired. Please request a new one.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (storedData.otp === otp) {
        otpStore.delete(phone);
        return new Response(
          JSON.stringify({ success: true, message: 'OTP verified successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid OTP' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sms-otp function:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
