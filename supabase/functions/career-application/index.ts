import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      position,
      message,
      cv
    } = body;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 🔐 Generate Application Code
    const applicationCode = `APP-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    // 📁 Upload CV
    const filePath = `${applicationCode}/${cv.name}`;

    const cvBuffer = Uint8Array.from(atob(cv.content), c => c.charCodeAt(0));

    const { error: uploadError } = await supabase.storage
      .from("career-cv")
      .upload(filePath, cvBuffer, {
        contentType: cv.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // 🔗 Get private file URL
    const { data: signedUrl } = await supabase.storage
      .from("career-cv")
      .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days

    // 📝 Insert into DB
    const { error: dbError } = await supabase
      .from("career_applications")
      .insert({
        application_code: applicationCode,
        name,
        email,
        phone,
        position,
        message,
        cv_url: signedUrl.signedUrl,
      });

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({
        success: true,
        applicationCode,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Application submission failed" }),
      { status: 500 }
    );
  }
});
