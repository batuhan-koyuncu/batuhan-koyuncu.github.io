import { appOrigin, fail, sha256 } from "../../_lib/api.js";

export async function onRequestGet({ request, env }) {
  if (!env.DB) return fail("D1 binding DB is not configured.", 500);

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) return fail("Missing token.");

  const tokenHash = await sha256(token);
  const row = await env.DB.prepare(
    `SELECT login_tokens.id, login_tokens.user_id, login_tokens.expires_at, users.status
     FROM login_tokens
     JOIN users ON users.id = login_tokens.user_id
     WHERE login_tokens.token_hash = ? AND login_tokens.used_at IS NULL`
  ).bind(tokenHash).first();

  if (!row || new Date(row.expires_at).getTime() < Date.now()) {
    return fail("Login link is invalid or expired.", 401);
  }

  const rawSession = crypto.randomUUID() + crypto.randomUUID();
  const sessionHash = await sha256(rawSession);
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  await env.DB.batch([
    env.DB.prepare("UPDATE login_tokens SET used_at = ? WHERE id = ?").bind(now, row.id),
    env.DB.prepare(
      `INSERT INTO sessions (id, user_id, session_hash, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(crypto.randomUUID(), row.user_id, sessionHash, expiresAt, now),
    env.DB.prepare("UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?").bind(now, now, row.user_id),
  ]);

  return new Response(null, {
    status: 302,
    headers: {
      location: `${appOrigin(env, request)}/student-area.html`,
      "set-cookie": `ka_session=${rawSession}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${14 * 24 * 60 * 60}`,
    },
  });
}
