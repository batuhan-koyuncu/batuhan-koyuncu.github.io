import { fail, sha256 } from "../../../_lib/api.js";

function sessionCookie(request) {
  const cookie = request.headers.get("cookie") || "";
  return cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("ka_session="))?.slice("ka_session=".length);
}

export async function onRequestGet({ request, env, params }) {
  if (!env.DB || !env.MATERIALS_BUCKET) return fail("D1 DB and R2 MATERIALS_BUCKET bindings are required.", 500);
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

  const material = await env.DB.prepare("SELECT * FROM materials WHERE id = ?").bind(params.id).first();
  if (!material || !material.r2_key) return fail("Material not found.", 404);

  const access = user.role === "admin" || material.visibility === "public" || await env.DB.prepare(
    `SELECT 1 FROM material_access WHERE material_id = ? AND user_id = ?
     UNION
     SELECT 1 FROM course_members WHERE course_id = ? AND user_id = ? AND access_role IN ('student','assistant','admin')`
  ).bind(material.id, user.id, material.course_id, user.id).first();
  if (!access) return fail("You do not have access to this material.", 403);

  const object = await env.MATERIALS_BUCKET.get(material.r2_key);
  if (!object) return fail("File not found.", 404);

  return new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType || "application/octet-stream",
      "content-disposition": `attachment; filename="${material.slug || material.id}"`,
    },
  });
}
