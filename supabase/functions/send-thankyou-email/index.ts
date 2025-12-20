import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const MSG91_AUTH_KEY = Deno.env.get("MSG91_AUTH_KEY");

    if (!MSG91_AUTH_KEY) {
      return new Response(
        JSON.stringify({ success: false, message: "MSG91 config missing" }),
        { status: 500, headers: corsHeaders }
      );
    }    
    
    if (!email || !name) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing email or name" }),
        { status: 400 }
      );
    }

    const res = await fetch("https://control.msg91.com/api/v5/email/send", {
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
                  name: name,
                  email: email
                },
              ],
              variables: {
                name: name,
              },
            },
          ],
          from: {
            name: "Phoenix Travelopedia",
            email: "no-reply@phoenixtravelopedia.com"
          },
          domain: "phoenixtravelopedia.com",
          template_id: 13122025
        }),
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

