import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, phone, otp } = await req.json();
    const FAST2SMS_API_KEY = Deno.env.get('FAST2SMS_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!FAST2SMS_API_KEY) {
      console.error('FAST2SMS_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, message: 'SMS service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    if (action === 'send') {
      // Generate 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const validTime = 10; // 10 minutes
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

      // Delete any existing OTPs for this phone
      await supabase
        .from('otp_verifications')
        .delete()
        .eq('identifier', phone)
        .eq('type', 'phone');

      // Store OTP in database
      const { error: insertError } = await supabase
        .from('otp_verifications')
        .insert({
          identifier: phone,
          otp_code: generatedOtp,
          type: 'phone',
          expires_at: expiresAt
        });

      if (insertError) {
        console.error('Error storing OTP:', insertError);
        return new Response(
          JSON.stringify({ success: false, message: 'Failed to store OTP' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Sending OTP ${generatedOtp} to phone: ${phone}`);

      // Send OTP via Fast2SMS using quick route
      //const message = `Your OTP for Travelopedia registration is: ${generatedOtp}. Valid for 10 minutes. Do not share this code.`;
      
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'dlt',
          sender_id: 'PHOETR',
          message: 204604,
          variables_values: `${generatedOtp}|${validTime}`,
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
      // Get OTP from database
      const { data: otpData, error: fetchError } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('identifier', phone)
        .eq('type', 'phone')
        .eq('verified', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !otpData) {
        console.log('OTP not found for phone:', phone);
        return new Response(
          JSON.stringify({ success: false, message: 'OTP not found. Please request a new one.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if expired
      if (new Date() > new Date(otpData.expires_at)) {
        await supabase.from('otp_verifications').delete().eq('id', otpData.id);
        return new Response(
          JSON.stringify({ success: false, message: 'OTP expired. Please request a new one.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify OTP
      if (otpData.otp_code === otp) {
        // Mark as verified and delete
        await supabase.from('otp_verifications').delete().eq('id', otpData.id);
        console.log('OTP verified successfully for phone:', phone);
        return new Response(
          JSON.stringify({ success: true, message: 'OTP verified successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.log('Invalid OTP provided for phone:', phone);
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
      JSON.stringify({ success: false, message: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
