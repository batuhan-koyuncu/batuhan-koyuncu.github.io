import { fail, json, requireAdmin } from "../../../../_lib/api.js";

export async function onRequestPost({ request, env, params }) {
  if (!env.DB) return fail("D1 binding DB is not configured.", 500);
  if (!await requireAdmin(request, env)) return fail("Admin token required.", 401);

  await env.DB.prepare(
    `UPDATE access_requests
     SET status = 'rejected', reviewed_at = ?, reviewed_by = 'admin'
     WHERE id = ?`
  ).bind(new Date().toISOString(), params.id).run();

  return json({ ok: true, status: "rejected" });
}
