import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const MSG91_AUTH_KEY = Deno.env.get("MSG91_AUTH_KEY");

    if (!MSG91_AUTH_KEY) {
      return new Response(
        JSON.stringify({ success: false, message: "MSG91 config missing" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const payload = {
      template_id: 13122025,
      recipients: [
        {
          to: [{ email }],
          variables: {
            NAME: name,
          },
        },
      ],
    };

    const res = await fetch("https://api.msg91.com/api/v5/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: MSG91_AUTH_KEY,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("Thank you email error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Email send failed" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
