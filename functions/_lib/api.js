export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

export function fail(message, status = 400) {
  return json({ ok: false, error: message }, status);
}

export async function readBody(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return request.json();
  }
  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

export function cleanEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function sha256(value) {
  const encoded = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function verifyTurnstile({ request, env, token }) {
  if (!env.TURNSTILE_SECRET_KEY) {
    return { ok: true, skipped: true };
  }
  if (!token) {
    return { ok: false, error: "Missing Turnstile token." };
  }

  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET_KEY);
  form.append("response", token);
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) form.append("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  const result = await response.json();
  return result.success ? { ok: true } : { ok: false, error: "Turnstile validation failed." };
}

export async function requireAdmin(request, env) {
  const provided = request.headers.get("x-admin-token");
  if (!env.ADMIN_API_TOKEN || !provided || provided !== env.ADMIN_API_TOKEN) {
    return false;
  }
  return true;
}

export function appOrigin(env, request) {
  return env.APP_ORIGIN || new URL(request.url).origin;
}
