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
        const body = await req.json();

        const MSG91_AUTH_KEY = Deno.env.get("MSG91_AUTH_KEY");
        const hrEmail = "hr@phoenixtravelopedia.com";

        const emailPayload = {
            to: [{ email: hrEmail }],
            from: { email: "noreply@phoenixtravelopedia.com", name: "Careers Portal" },
            subject: `New Job Application – ${body.position}`,
            content: [{
                type: "text/html",
                value: `
                <h3>New Career Application</h3>
                <p><b>Name:</b> ${body.name}</p>
                <p><b>Email:</b> ${body.email}</p>
                <p><b>Phone:</b> ${body.phone}</p>
                <p><b>Position:</b> ${body.position}</p>
                <p><b>Message:</b><br/>${body.message}</p>
      `
            }],
            attachments: [
                {
                    name: body.cv.name,
                    content: body.cv.content,
                    type: body.cv.type,
                }
            ]
        };

        const res = await fetch("https://control.msg91.com/api/v5/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authkey": MSG91_AUTH_KEY!,
            },
            body: JSON.stringify(emailPayload),
        });

        if (!res.ok) {
            return new Response("Email failed", { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
});
