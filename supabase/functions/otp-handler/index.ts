import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/* ---------------- CONFIG ---------------- */
const OTP_EXPIRY_MIN = 5
const RESEND_COOLDOWN_SEC = 60
const MAX_RESEND = 3

/* ---------------- HELPERS ---------------- */
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString()

/* ---------------- FUNCTION ---------------- */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { action, user_id, email, phone, otp } = await req.json()

    if (!action || !user_id) {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400, headers: corsHeaders })
    }
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const MSG91_AUTH_KEY = Deno.env.get('MSG91_AUTH_KEY');
    const FAST2SMS_API_KEY = Deno.env.get('FAST2SMS_API_KEY');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const now = new Date()
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MIN * 60000)

    const { data: emailrecord } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("type", "email")
      .eq("user_id", user_id)
      .limit(1)
      .single()

    const { data: phoneRecord } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("type", "phone")
      .eq("user_id", user_id)
      .limit(1)
      .single()

    /* ---------------- RESEND CHECK ---------------- */
    const canEmailResend = () => {
      if (!emailrecord) return true
      if (emailrecord.resend_count >= MAX_RESEND) return false
      if (!emailrecord.last_sent_at) return true

      const diff =
        (now.getTime() - new Date(emailrecord.last_sent_at).getTime()) / 1000

      return diff >= RESEND_COOLDOWN_SEC
    }

    const canPhoneResend = () => {
      if (!phoneRecord) return true
      if (phoneRecord.resend_count >= MAX_RESEND) return false
      if (!phoneRecord.last_sent_at) return true

      const phonediff =
        (now.getTime() - new Date(phoneRecord.last_sent_at).getTime()) / 1000

      return phonediff >= RESEND_COOLDOWN_SEC
    }

    /* =========================================================
       SEND / RESEND EMAIL OTP (MSG91)
    ========================================================= */
    if (action === "send_email_otp" || action === "resend_email_otp") {
      if (!email) {
        return new Response(JSON.stringify({ error: "Email required" }), { status: 400, headers: corsHeaders })
      }

      if (!canEmailResend()) {
        return new Response(
          JSON.stringify({ error: "Resend cooldown or limit reached" }),
          { status: 429, headers: corsHeaders }
        )
      }

      const emailOtp = generateOTP()
      const cName = "Phoenix Travelopedia";
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
      await supabase.from("otp_verifications").upsert({
        user_id,
        otp_code: emailOtp,
        identifier: email,
        type: "email",
        verified: false,
        resend_count: (emailrecord?.resend_count ?? 0) + 1,
        expires_at: expiresAt,
      })

      await fetch("https://control.msg91.com/api/v5/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authkey: MSG91_AUTH_KEY
        },
        body: JSON.stringify({
          recipients:[
            {
              to: [{ email: email }],
              variables: { otp: emailOtp, company_name: cName },
            },
          ],
          from: {email: "no-reply@phoenixtravelopedia.com"},          
          domain: "phoenixtravelopedia.com",
          template_id: "global_otp",
        }),
      })

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })
    }

    /* =========================================================
       VERIFY EMAIL OTP
    ========================================================= */
    if (action === "verify_email_otp") {
      if (!emailrecord || emailrecord.email_otp !== otp) {
        return new Response(JSON.stringify({ error: "Invalid OTP" }), { status: 401, headers: corsHeaders })
      }

      if (new Date(emailrecord.expires_at) < now) {
        return new Response(JSON.stringify({ error: "OTP expired" }), { status: 401, headers: corsHeaders })
      }

      await supabase
        .from("otp_verifications")
        .update({
          verified: true,
        })
        .eq("user_id", user_id)
        .eq("verified", false)
        .eq("type", "phone")

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })
    }

    /* =========================================================
       SEND / RESEND MOBILE OTP (FAST2SMS)
    ========================================================= */
    if (action === "send_mobile_otp" || action === "resend_mobile_otp") {
      if (!phone) {
        return new Response(JSON.stringify({ error: "Mobile required" }), { status: 400, headers: corsHeaders })
      }

      if (!canPhoneResend()) {
        return new Response(
          JSON.stringify({ error: "Resend cooldown or limit reached" }),
          { status: 429, headers: corsHeaders }
        )
      }

      const mobileOtp = generateOTP();
      const validTime = 10; // 10 minutes
      await supabase.from("otp_verifications").upsert({
        user_id,
        otp_code: mobileOtp,
        identifier: phone,
        type: "phone",
        verified: false,
        resend_count: (phoneRecord?.resend_count ?? 0) + 1,
        expires_at: expiresAt,
      })

      await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'dlt',
          sender_id: 'PHOETR',
          message: 204605,
          variables_values: `${mobileOtp}|${validTime}`,
          language: 'english',
          flash: 0,
          numbers: phone,
        }),
      })

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })
    }

    /* =========================================================
       VERIFY MOBILE OTP
    ========================================================= */
    if (action === "verify_mobile_otp") {
      if (!phoneRecord || phoneRecord.mobile_otp !== otp) {
        return new Response(JSON.stringify({ error: "Invalid OTP" }), { status: 401, headers: corsHeaders })
      }

      if (new Date(phoneRecord.expires_at) < now) {
        return new Response(JSON.stringify({ error: "OTP expired" }), { status: 401, headers: corsHeaders })
      }

      await supabase
        .from("otp_verifications")
        .update({
          verified: true,
        })
        .eq("user_id", user_id)
        .eq("verified", false)
        .eq("type", "phone")

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: corsHeaders })

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: corsHeaders })
  }
})
