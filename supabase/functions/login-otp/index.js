import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, agent_code, password, otp } = await req.json();

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const FAST2SMS_API_KEY = Deno.env.get('FAST2SMS_API_KEY');
    const MSG91_AUTH_KEY = Deno.env.get('MSG91_AUTH_KEY');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // ---------- STEP 1: Validate Agent Login ----------
    if (action === "send") {
      const { data: user, error } = await supabase
        .from("agents")
        .select("*")
        .eq("agent_code", agent_code)
        .eq("password", password)
        .single();

      if (error || !user) {
        return new Response(
          JSON.stringify({ success: false,  message: 'Agent Not Found' }),
          {status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // ---------- STEP 2: Create OTP ----------
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const validTime = 10; // 10 minutes
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
      const cName = "Phoenix Travelopedia";

      // Store OTP with expiry 10 mins
      const { error: insertError } = await supabase.from("daily_login_otp").insert({
        agent_code: agent_code,
        otp: generatedOtp,
        expires_at: expiresAt,
      });      
      
      if (insertError) {
        console.error('Error storing OTP:', insertError);
        return new Response(
          JSON.stringify({ success: false, message: 'Failed to store OTP' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // ---------- STEP 3: Send OTP via Email + SMS ----------
      // Use your SMS provider API (FAST2SMS)    
      await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'dlt',
          sender_id: 'PHOETR',
          message: 204605,
          variables_values: `${generatedOtp}|${validTime}`,
          language: 'english',
          flash: 0,
          numbers: user.phone
        })
      });

      // Email via Supabase internal email service (MSG91) 
      await fetch("https://control.msg91.com/api/v5/email/send", {
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
                  email: user.email
                },
              ],
              variables: {
                company_name: cName,
                otp: generatedOtp
              },
            },
          ],
          from: {
            name: "Phoenix Travelopedia",
            email: "no-reply@phoenixtravelopedia.com"
          },
          domain: "phoenixtravelopedia.com",
          template_id: "global_otp"
        }),
      }); 

      return new Response(
        JSON.stringify({ success: true,  message: "OTP sent successfully" }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // ---------- STEP 4: VERIFY OTP ----------
    if (action === "verify") {
      const { data: record } = await supabase
        .from("daily_login_otp")
        .select("*")
        .eq("agent_code", agent_code)
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (!record || record.otp !== otp) {
        return new Response(JSON.stringify({ success: false, message: "Invalid OTP" }), { status: 400 });
      }

      if (new Date(record.expiry) < new Date()) {
        return new Response(JSON.stringify({ success: false, message: "OTP expired" }), { status: 400 });
      }

      return new Response(
        JSON.stringify({ success: true, message: "OTP verified" }), 
        await supabase.from('otp_verifications').update({ verified: 'true' }).eq('id', record.id);
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    return new Response("Invalid action", { status: 400 });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});



