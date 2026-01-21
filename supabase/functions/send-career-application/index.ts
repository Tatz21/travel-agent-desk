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
        const { name, email, phone, position, message, cv } = await req.json();
        console.log("Received application from:", name, email, position);
        const hrEmail = "mukteswar@phoenixtravelopedia.com";
        const MSG91_AUTH_KEY = Deno.env.get("MSG91_AUTH_KEY");

        if (!MSG91_AUTH_KEY) {
            return new Response(
                JSON.stringify({ success: false, message: "MSG91 config missing" }),
                { status: 500, headers: corsHeaders }
            );
        }

        if (!email) {
            return new Response(
                JSON.stringify({ success: false, message: "Missing email" }),
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
                        to: [{ email: hrEmail }],
                        variables: {
                            VAR2: name,
                            VAR3: email,
                            VAR4: phone,
                            VAR1: position,
                            VAR5: message,
                        }
                    },
                ],
                from: {
                    name: "Website Careers",
                    email: "no-reply@phoenixtravelopedia.com"
                },
                attachments: [
                    {
                        name: cv.name,
                        content: cv.content,
                        type: cv.type,
                    }
                ],
                domain: "phoenixtravelopedia.com",
                template_id: 1112202512
            }),
        });

        const result = await res.json();
        console.log("Email send result:", result);
        return new Response(
            JSON.stringify({ success: true, result }),
            { headers: corsHeaders }
        );
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
    }
});
