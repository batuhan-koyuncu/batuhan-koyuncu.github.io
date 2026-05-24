# Student Area Architecture

## Roles
Public visitor, registered student, approved student and admin.

## Stack
Static Cloudflare Pages frontend, Cloudflare Workers/Pages Functions API, D1 for records, R2 for private files, Turnstile for forms and secure HttpOnly session cookies.

## Tables
Users, sessions, courses, course_members, materials, material_access, access_requests, assessments, questions, submissions, grades, feedback, products and purchases.

## API Endpoints
Existing: register, login, auth verify, me, access requests, student materials and protected material download. Recommended next: student assessments, submissions, grades, admin assessments, admin grades, PayPal create/capture/webhook.

## Private R2 Strategy
Private teaching materials must never be public static files. Worker verifies session, role, enrollment, assignment or purchase before serving protected files.

## Assessment Flow
Admin creates assessments, assigns them, reviews submissions, grades, adds feedback and publishes. Students see assignments, submission status, grades and feedback.

## Security Notes
Validate roles server-side, verify Turnstile, do not trust client state, and replace bootstrap admin tokens with admin sessions before production.
