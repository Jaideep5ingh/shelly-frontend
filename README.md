# Shelly Frontend

This is the public Vercel project for Shelly.

## What it contains
- Static landing page
- Vercel serverless endpoints:
  - `POST /api/subscribe`
  - `POST /api/feedback`
- Server-to-server forwarding to the VPS intake service

## Environment variables
Set these in Vercel:
- `VPS_SUBSCRIBE_URL`
- `VPS_FEEDBACK_URL`
- `INTAKE_FORWARD_SECRET`
- `INTAKE_AUTH_HEADER` (default: `x-forward-secret`)

## Local dev
You can run the static site with any simple server and test the API routes with Vercel dev.
