import { fail, json, sha256 } from "../_lib/api.js";

function sessionCookie(request) {
  const cookie = request.headers.get("cookie") || "";
  return cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("ka_session="))?.slice("ka_session=".length);
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return fail("D1 binding DB is not configured.", 500);
  const session = sessionCookie(request);
  if (!session) return json({ ok: true, user: null });

  const sessionHash = await sha256(session);
  const user = await env.DB.prepare(
    `SELECT users.id, users.email, users.full_name, users.preferred_language, users.role, users.status
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.session_hash = ? AND sessions.expires_at > ?`
  ).bind(sessionHash, new Date().toISOString()).first();

  return json({ ok: true, user: user || null });
}
