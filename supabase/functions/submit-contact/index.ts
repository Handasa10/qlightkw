// Contact form endpoint: validates a visitor's message, stores it in the admin inbox
// and notifies info@qlightkw.com. Public (verify_jwt = false), so it validates everything.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.93.2";
import { escapeHtml } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const INBOX = "info@qlightkw.com";
const MAX_PER_EMAIL_PER_HOUR = 5;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();

    // Honeypot: real visitors never see or fill this field
    if (clean(body.website, 200)) return json({ success: true });

    const name = clean(body.name, 100);
    const email = clean(body.email, 255).toLowerCase();
    const phone = clean(body.phone, 20);
    const subject = clean(body.subject, 100);
    const message = clean(body.message, 1000);

    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !subject || message.length < 10) {
      return json({ error: "Please check the form fields" }, 400);
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("admin_inbox_messages")
      .select("id", { count: "exact", head: true })
      .eq("from_email", email)
      .eq("direction", "received")
      .gte("created_at", since);
    if ((count ?? 0) >= MAX_PER_EMAIL_PER_HOUR) {
      return json({ error: "Too many messages, please try again later" }, 429);
    }

    const text = `${message}\n\n— ${name}${phone ? ` · ${phone}` : ""} · ${email}`;
    const { error: insertError } = await supabase.from("admin_inbox_messages").insert({
      direction: "received",
      from_email: email,
      from_name: name,
      to_email: INBOX,
      subject: `[Contact] ${subject}`,
      body: text,
      is_read: false,
      status: "received",
      metadata: { source: "contact_form", phone: phone || null, topic: subject },
    });
    if (insertError) throw insertError;

    // Email notification is best effort: the message is already saved in the inbox
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Quality Light Website <info@qlightkw.com>",
          to: [INBOX],
          reply_to: email,
          subject: `New contact message: ${subject}`,
          html: `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}${phone ? `, ${escapeHtml(phone)}` : ""})</p>
                 <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
                 <p style="color:#888">Reply to this email to answer the customer, or open Admin → Messages.</p>`,
        }),
      });
      if (!res.ok) console.error("Contact notification email failed:", await res.text());
    }

    return json({ success: true });
  } catch (error) {
    console.error("submit-contact error:", error);
    return json({ error: "Could not send your message, please try WhatsApp" }, 500);
  }
});
