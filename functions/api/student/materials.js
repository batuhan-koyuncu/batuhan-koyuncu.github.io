import { fail, json, sha256 } from "../../_lib/api.js";

function sessionCookie(request) {
  const cookie = request.headers.get("cookie") || "";
  return cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("ka_session="))?.slice("ka_session=".length);
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return fail("D1 binding DB is not configured.", 500);
  const session = sessionCookie(request);
  if (!session) return fail("Login required.", 401);

  const sessionHash = await sha256(session);
  const user = await env.DB.prepare(
    `SELECT users.id, users.role
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.session_hash = ? AND sessions.expires_at > ?`
  ).bind(sessionHash, new Date().toISOString()).first();
  if (!user) return fail("Login required.", 401);

  const { results } = await env.DB.prepare(
    `SELECT DISTINCT materials.id, materials.title, materials.slug, materials.subject, materials.topic,
            materials.language, materials.material_type, materials.visibility, materials.created_at
     FROM materials
     LEFT JOIN material_access ON material_access.material_id = materials.id
     LEFT JOIN course_members ON course_members.course_id = materials.course_id
     WHERE materials.visibility = 'public'
        OR material_access.user_id = ?
        OR course_members.user_id = ?
        OR ? = 'admin'
     ORDER BY materials.created_at DESC`
  ).bind(user.id, user.id, user.role).all();

  return json({ ok: true, materials: results });
}
