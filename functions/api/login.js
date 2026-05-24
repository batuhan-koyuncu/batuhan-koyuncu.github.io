import { appOrigin, cleanEmail, fail, isEmail, json, readBody, sha256, verifyTurnstile } from "../_lib/api.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB) return fail("D1 binding DB is not configured.", 500);

  const body = await readBody(request);
  const email = cleanEmail(body.email);
  if (!isEmail(email)) return fail("A valid email is required.");

  const turnstile = await verifyTurnstile({
    request,
    env,
    token: body["cf-turnstile-response"] || body.turnstile_token,
  });
  if (!turnstile.ok) return fail(turnstile.error, 403);

  const user = await env.DB.prepare("SELECT id, email, status FROM users WHERE email = ?").bind(email).first();
  if (user) {
    const rawToken = crypto.randomUUID() + crypto.randomUUID();
    const tokenHash = await sha256(rawToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await env.DB.prepare(
      `INSERT INTO login_tokens (id, user_id, token_hash, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(crypto.randomUUID(), user.id, tokenHash, expiresAt, new Date().toISOString()).run();

    const loginUrl = `${appOrigin(env, request)}/api/auth/verify?token=${encodeURIComponent(rawToken)}`;
    if (env.LOGIN_LINK_WEBHOOK_URL) {
      await fetch(env.LOGIN_LINK_WEBHOOK_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: user.email, login_url: loginUrl, expires_at: expiresAt }),
      });
    }
  }

  return json({
    ok: true,
    message: "If this email is registered, a login link will be sent.",
    email_delivery_configured: Boolean(env.LOGIN_LINK_WEBHOOK_URL),
    turnstile_skipped: Boolean(turnstile.skipped),
  });
}
