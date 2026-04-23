# Shelly Frontend

This is the public Vercel project for Shelly.

## What it contains
- Static landing page
- Unsubscribe confirmation page at `/unsubscribe`
- Vercel serverless endpoints:
  - `POST /api/subscribe`
  - `POST /api/feedback`
  - `POST /api/unsubscribe`
- Server-to-server forwarding to the VPS intake service

## Environment variables
Set these in Vercel:
- `VPS_SUBSCRIBE_URL`
- `VPS_FEEDBACK_URL`
- `VPS_UNSUBSCRIBE_URL`
- `INTAKE_FORWARD_SECRET`
- `INTAKE_AUTH_HEADER` (default: `x-forward-secret`)

Unsubscribe links use a token-only query string (`/unsubscribe?token=...`) so subscriber email addresses are not exposed in URLs.

## Local dev
You can run the static site with any simple server and test the API routes with Vercel dev.
