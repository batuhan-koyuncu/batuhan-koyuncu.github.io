import { fail, json, readBody, requireAdmin } from "../../../../_lib/api.js";

export async function onRequestPost({ request, env, params }) {
  if (!env.DB) return fail("D1 binding DB is not configured.", 500);
  if (!await requireAdmin(request, env)) return fail("Admin token required.", 401);

  const body = await readBody(request);
  const courseId = String(body.course_id || "").trim();
  const now = new Date().toISOString();

  const accessRequest = await env.DB.prepare("SELECT * FROM access_requests WHERE id = ?").bind(params.id).first();
  if (!accessRequest) return fail("Access request not found.", 404);

  await env.DB.prepare(
    `UPDATE access_requests
     SET status = 'approved', reviewed_at = ?, reviewed_by = 'admin'
     WHERE id = ?`
  ).bind(now, params.id).run();

  if (accessRequest.user_id) {
    await env.DB.prepare("UPDATE users SET status = 'approved', role = 'student', updated_at = ? WHERE id = ?").bind(now, accessRequest.user_id).run();
    if (courseId) {
      await env.DB.prepare(
        `INSERT INTO course_members (id, course_id, user_id, access_role, access_starts_at, created_at)
         VALUES (?, ?, ?, 'student', ?, ?)
         ON CONFLICT(course_id, user_id) DO UPDATE SET access_role = 'student', access_starts_at = excluded.access_starts_at`
      ).bind(crypto.randomUUID(), courseId, accessRequest.user_id, now, now).run();
    }
  }

  return json({ ok: true, status: "approved" });
}
