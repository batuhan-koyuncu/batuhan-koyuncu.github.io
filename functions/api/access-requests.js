import { cleanEmail, fail, isEmail, json, readBody, verifyTurnstile } from "../_lib/api.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB) return fail("D1 binding DB is not configured.", 500);

  const body = await readBody(request);
  const email = cleanEmail(body.email);
  const requestedCourse = String(body.requested_course || "").trim();
  const message = String(body.message || "").trim();

  if (!isEmail(email) || !requestedCourse || !message) {
    return fail("Email, course/topic and request details are required.");
  }

  const turnstile = await verifyTurnstile({
    request,
    env,
    token: body["cf-turnstile-response"] || body.turnstile_token,
  });
  if (!turnstile.ok) return fail(turnstile.error, 403);

  const user = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  await env.DB.prepare(
    `INSERT INTO access_requests (id, user_id, email, requested_course, message, status, created_at)
     VALUES (?, ?, ?, ?, ?, 'pending', ?)`
  ).bind(crypto.randomUUID(), user?.id || null, email, requestedCourse, message, new Date().toISOString()).run();

  return json({
    ok: true,
    status: "pending",
    message: "Access request received. An admin must approve private material access.",
    turnstile_skipped: Boolean(turnstile.skipped),
  });
}
