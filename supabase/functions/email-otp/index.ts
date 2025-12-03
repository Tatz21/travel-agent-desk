import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";

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

    // Gmail SMTP Credentials
    const SMTPHOST = Deno.env.get("SMTP_HOST");
    const SMTPUSER = Deno.env.get("SMTP_USER"); // your Gmail address
    const SMTPPASS = Deno.env.get("SMTP_PASS"); // Gmail App Password

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    if (!SMTPUSER || !SMTPPASS) {
      console.error("Missing Gmail credentials");
      return new Response(
        JSON.stringify({
        success: false, message: "Email credentials not configured",}), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === 'send') {
      // Generate 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const validTime = 10; // 10 minutes
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

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

      console.log(`Email OTP ${generatedOtp} generated for ${email}`);

      // For now, just log the OTP (in production, send via email service)
      // Email sending would be implemented here with a proper email service

      const client = new SmtpClient();

      await client.connect({
        hostname: SMTPHOST,
        port: 587,
        username: SMTPUSER,
        password: SMTPPASS,
      });
      
      await client.send({
        from: SMTPUSER,
        to: email,
        subject: "Your OTP Code",
        content: `Your OTP is: ${generatedOtp}`,
      });

      await client.close();

      return new Response(
        JSON.stringify({ success: true, message: 'Email OTP sent successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
