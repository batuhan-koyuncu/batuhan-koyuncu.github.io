# Cloudflare Open Registration With Admin Approval

Koyuncu Academy will use open registration, but private teaching materials must remain locked until an admin approves access.

## Cloudflare Stack

- Cloudflare Pages: public HTML/CSS/JS website.
- Cloudflare Workers or Pages Functions: API endpoints.
- Cloudflare D1: users, courses, materials, memberships, access requests.
- Cloudflare R2: private PDFs, notebooks, LaTeX files, code, images and course folders.
- Cloudflare Turnstile: spam protection on registration and access-request forms.

## Roles

- Public visitor: reads public resources and articles.
- Registered user: has an account, can request access and bookmark public material.
- Student: can access approved course/material assignments.
- Admin: approves accounts, uploads materials, grants/revokes access and publishes public previews.

## Approval Flow

1. Visitor registers.
2. Account is created with `status = pending_approval` and `role = registered`.
3. Visitor submits an access request with course/topic context.
4. Admin reviews the request.
5. Admin assigns a course, group or individual material.
6. Student dashboard displays only approved materials.

## D1 Tables

```sql
users(id, email, full_name, preferred_language, role, status, created_at, updated_at)
login_tokens(id, user_id, token_hash, expires_at, used_at, created_at)
sessions(id, user_id, session_hash, expires_at, created_at)
courses(id, title, slug, subject, level, language, is_active, created_at)
course_members(id, course_id, user_id, access_role, access_starts_at, access_ends_at)
materials(id, course_id, title, slug, subject, topic, language, material_type, visibility, r2_key, public_url, created_at)
material_access(id, material_id, user_id, course_id, created_at)
access_requests(id, user_id, email, requested_course, message, status, reviewed_by, created_at, reviewed_at)
bookmarks(id, user_id, material_id, created_at)
```

## Backend Foundation

This repository now includes a Cloudflare backend foundation:

- `functions/api/register.js`: creates or updates a registered user and optional first access request.
- `functions/api/login.js`: creates a short-lived magic-link token.
- `functions/api/auth/verify.js`: verifies a magic-link token and sets an HTTP-only session cookie.
- `functions/api/access-requests.js`: stores access requests for admin review.
- `functions/api/student/materials.js`: lists public and assigned materials for logged-in users.
- `functions/api/materials/[id]/download.js`: checks permissions before streaming private R2 files.
- `functions/api/admin/access-requests.js`: lists pending requests with `x-admin-token`.
- `functions/api/admin/access-requests/[id]/approve.js`: approves a request and optionally assigns a course.
- `functions/api/admin/access-requests/[id]/reject.js`: rejects a request.
- `migrations/0001_student_area.sql`: D1 schema.
- `wrangler.example.toml`: example Cloudflare Pages bindings.

## Required Cloudflare Configuration

Create these bindings/secrets in Cloudflare:

- D1 binding: `DB`
- R2 binding: `MATERIALS_BUCKET`
- Secret: `TURNSTILE_SECRET_KEY` once Turnstile is added to the forms
- Secret: `ADMIN_API_TOKEN`
- Secret or variable: `LOGIN_LINK_WEBHOOK_URL` for outbound magic-link email delivery
- Variable: `APP_ORIGIN=https://koyuncuacademy.com`

The login endpoint intentionally does not expose tokens in API responses. It stores a token hash in D1 and sends the raw login URL only through `LOGIN_LINK_WEBHOOK_URL`.

## File Security

Private files must not be committed to GitHub. Store private files in R2 and deliver them only through a Worker after checking D1 permissions. Public previews may be static HTML pages or public R2 objects.
