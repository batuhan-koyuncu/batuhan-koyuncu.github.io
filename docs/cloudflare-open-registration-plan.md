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
2. Account is created with `status = pending` or `role = registered`.
3. Visitor submits an access request with course/topic context.
4. Admin reviews the request.
5. Admin assigns a course, group or individual material.
6. Student dashboard displays only approved materials.

## D1 Tables

```sql
users(id, email, password_hash, full_name, preferred_language, role, status, created_at)
courses(id, title, slug, subject, level, language, is_active, created_at)
course_members(id, course_id, user_id, access_role, access_starts_at, access_ends_at)
materials(id, course_id, title, slug, subject, topic, language, material_type, visibility, r2_key, public_url, created_at)
material_access(id, material_id, user_id, course_id, created_at)
access_requests(id, user_id, email, requested_course, message, status, reviewed_by, created_at, reviewed_at)
bookmarks(id, user_id, material_id, created_at)
```

## API Endpoints

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `POST /api/password-reset`
- `POST /api/access-requests`
- `GET /api/me`
- `GET /api/student/courses`
- `GET /api/student/materials`
- `GET /api/materials/:id/download`
- `GET /api/admin/access-requests`
- `POST /api/admin/access-requests/:id/approve`
- `POST /api/admin/materials`

## File Security

Private files must not be committed to GitHub. Store private files in R2 and deliver them only through a Worker after checking D1 permissions. Public previews may be static HTML pages or public R2 objects.

## First Backend PR

The next PR should add Cloudflare Pages Functions, D1 schema migrations, R2 binding documentation, Turnstile placeholders, and real request handling for registration and access requests.
