# Contact Form & Email Integration Summary

This document details the architecture, implementation, and troubleshooting of the fully operational contact form email integration in the Shashinda portfolio website.

## 1. Directory Structure & Key Files

The integration is established across the following files:
- Backend API Endpoint: [app/api/contact/route.ts](app/api/contact/route.ts)
- Frontend Client Form: [app/PortfolioClient.jsx](app/PortfolioClient.jsx)
- Debug Persistence: [contact-debug.log](contact-debug.log)
- Configuration: [.env.local](.env.local) and [.env.local.example](.env.local.example)

---

## 2. API Endpoint Architecture

To bypass SDK peer dependency conflicts and missing package versions with standard packages like `resend` or `nodemailer` in the local Next.js workspace, a clean, direct HTTP standard POST integration was established.

### Core Features

- **Direct HTTP Integration with Resend REST API**: Uses standard `fetch` calling `https://api.resend.com/emails` with Bearer auth (`RESEND_API_KEY`).
- **Robust Parsing & Fallbacks**: The route parser extracts payload parameters gracefully from standard `application/json`, `application/x-www-form-urlencoded`, and raw fallbacks.
- **Dynamic Configuration**: Recipient addresses are configured in a comma-separated list (`EMAIL_TO`), and the verified domain sender is configured via standard variables (`SMTP_FROM`).
- **Debugging & Audit Trails**: Every incoming payload is permanently written to a local file, [contact-debug.log](contact-debug.log), in standard parsed JSON logs alongside the server execution flow. This makes debugging client fields extremely simple in local dev.

---

## 3. Client Form Implementation & Bug Fixes

The client-side form is embedded within [app/PortfolioClient.jsx](app/PortfolioClient.jsx).

### Form Logic Flow
- Uses asynchronous submissions, indicating status with `sending` and custom states.
- Automatically handles dropdown categories for contact reasons (`brand`, `digital`, `3d`, `general`, etc.).
- Evaluates the JSON body sent back from the server response:
```javascript
const text = await res.text().catch(() => '')
let parsed
try { parsed = JSON.parse(text) } catch (e) { parsed = null }
const success = parsed && parsed.ok === true
```

### Crucial Synthetic Event Bug Fix

An issue arose where browser submissions were successfully delivered/received on the server, yet the frontend UI error was displayed:
- **Symptom**: The developer console reported a `TypeError: Cannot read properties of null (reading 'reset')` at the point of calling `event.currentTarget.reset()`.
- **Root Cause**: React pools synthetic events. Because of asynchronous awaits (`await fetch` and `await res.text()`), the submission event became nullified prior to completing the execution flow. Thus, `event.currentTarget` resolved to null.
- **Resolution**: Captured the form element reference synchronously at the start of the handler:
```javascript
const form = event.currentTarget;
```
By resetting the reference `form.reset()`, the form field clearing works correctly after any asynchronous flow finishes, and the user UI safely navigates to the success feedback message instead of throwing an error.

---

## 4. Local Deployment & Env Settings

Ensure your [.env.local](.env.local) file has the following configurations:
- `RESEND_API_KEY=re_your_api_key_here` (The direct Resend token)
- `EMAIL_TO=shashindaesh@gmail.com` (Target inbox)
- `SMTP_FROM=onboarding@resend.dev` (Verified sending address)
