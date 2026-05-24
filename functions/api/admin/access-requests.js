import { fail, json, requireAdmin } from "../../_lib/api.js";

export async function onRequestGet({ request, env }) {
  if (!env.DB) return fail("D1 binding DB is not configured.", 500);
  if (!await requireAdmin(request, env)) return fail("Admin token required.", 401);

  const { results } = await env.DB.prepare(
    `SELECT access_requests.*, users.full_name
     FROM access_requests
     LEFT JOIN users ON users.id = access_requests.user_id
     WHERE access_requests.status = 'pending'
     ORDER BY access_requests.created_at DESC
     LIMIT 100`
  ).all();

  return json({ ok: true, requests: results });
}
