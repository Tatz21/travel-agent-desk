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
    const { action, email, otp } = await req.json();
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const MSG91_AUTH_KEY = Deno.env.get('MSG91_AUTH_KEY');

    if (!MSG91_AUTH_KEY) {
      console.error('MSG91_AUTH_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, message: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    if (action === 'send') {
      // Generate 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
      const cName = "Phoenix Travelopedia";

      // Delete any existing OTPs for this email
      await supabase
        .from('otp_verifications')
        .delete()
        .eq('identifier', email)
        .eq('type', 'email');

      // Store OTP in database
      const { error: insertError } = await supabase
        .from('otp_verifications')
        .insert({
          identifier: email,
          otp_code: generatedOtp,
          type: 'email',
          expires_at: expiresAt
        });

      if (insertError) {
        console.error('Error storing OTP:', insertError);
        return new Response(
          JSON.stringify({ success: false, message: 'Failed to store OTP' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Email Sending OTP ${generatedOtp} generated for ${email}`);

      // For now, just log the OTP (in production, send via email service)
      // Email sending would be implemented here with a proper email service
       
      const response = await fetch("https://control.msg91.com/api/v5/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authkey: MSG91_AUTH_KEY
        },
        body: JSON.stringify({
          recipients: [
            {
              to: [
                {
                  name: "User",
                  email: email
                },
              ],
              variables: {
                company_name: cName,
                otp: generatedOtp
              },
            },
          ],
          from: {
            email: "no-reply@phoenixtravelopedia.com"
          },
          domain: "phoenixtravelopedia.com",
          template_id: "global_otp"
        }),
      });

      const result = await response.json();
      console.log('MSG91 Email response:', JSON.stringify(result));

      if (result.return === true || result.status_code === 200) {
        return new Response(
          JSON.stringify({ success: true, message: 'Email OTP sent successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.error('MSG91 Email error:', result);
        return new Response(
          JSON.stringify({ success: false, message: result.message || 'Failed to send Email OTP' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (action === 'verify') {
      // Get OTP from database
      const { data: otpData, error: fetchError } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('identifier', email)
        .eq('type', 'email')
        .eq('verified', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !otpData) {
        console.log('OTP not found for email:', email);
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
        await supabase.from('otp_verifications').delete().eq('id', otpData.id);
        console.log('OTP verified successfully for email:', email);
        return new Response(
          JSON.stringify({ success: true, message: 'OTP verified successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.log('Invalid OTP provided for email:', email);
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
    console.error('Error in email otp function:', error);
    return new Response(
      JSON.stringify({ success: false, message: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
