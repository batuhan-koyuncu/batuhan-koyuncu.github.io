import { cleanEmail, fail, isEmail, json, readBody, verifyTurnstile } from "../_lib/api.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB) return fail("D1 binding DB is not configured.", 500);

  const body = await readBody(request);
  const email = cleanEmail(body.email);
  const fullName = String(body.full_name || "").trim();
  const preferredLanguage = String(body.preferred_language || "English").trim();
  const message = String(body.message || "").trim();

  if (!fullName || !isEmail(email)) {
    return fail("Full name and a valid email are required.");
  }

  const turnstile = await verifyTurnstile({
    request,
    env,
    token: body["cf-turnstile-response"] || body.turnstile_token,
  });
  if (!turnstile.ok) return fail(turnstile.error, 403);

  const now = new Date().toISOString();
  const userId = crypto.randomUUID();

  await env.DB.prepare(
    `INSERT INTO users (id, email, full_name, preferred_language, role, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'registered', 'pending_approval', ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       full_name = excluded.full_name,
       preferred_language = excluded.preferred_language,
       updated_at = excluded.updated_at`
  ).bind(userId, email, fullName, preferredLanguage, now, now).run();

  const user = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (message) {
    await env.DB.prepare(
      `INSERT INTO access_requests (id, user_id, email, requested_course, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`
    ).bind(crypto.randomUUID(), user.id, email, "Registration request", message, now).run();
  }

  return json({
    ok: true,
    status: "pending_approval",
    message: "Account registered. Private material access requires admin approval.",
    turnstile_skipped: Boolean(turnstile.skipped),
  });
}
