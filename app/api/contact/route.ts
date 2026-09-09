type ContactBody = {
  name?: string
  email?: string
  purpose?: string
  message?: string
}

import fs from 'fs/promises'
import path from 'path'

function missingEnv() {
  return !process.env.RESEND_API_KEY || !process.env.EMAIL_TO || !process.env.SMTP_FROM
}

export async function POST(request: Request) {
  if (missingEnv()) {
    return new Response(JSON.stringify({ error: 'Resend configuration missing' }), { status: 500 })
  }

  let body: ContactBody = {}
  const contentType = (request.headers.get('content-type') || '').toLowerCase()
  try {
    if (contentType.includes('application/json')) {
      body = await request.json()
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const txt = await request.text()
      const params = new URLSearchParams(txt)
      for (const [k, v] of params.entries()) body[k as keyof ContactBody] = v
    } else if (contentType.includes('multipart/form-data')) {
      // Request.formData() is supported in Next.js App Router
      const form = await request.formData()
      for (const key of Array.from(form.keys())) {
        const v = form.get(key)
        if (typeof v === 'string') body[key as keyof ContactBody] = v
      }
    } else {
      // Fallback: try JSON, then raw text
      try {
        body = await request.json()
      } catch (e) {
        const raw = await request.text().catch(() => '')
        console.error('[contact] Unknown content-type and failed to parse JSON. Content-Type=', contentType)
        console.error('[contact] Raw body:', raw)
        return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
      }
    }
  } catch (err) {
    // Attempt to capture raw body for debugging
    try {
      const raw = await request.text()
      console.error('[contact] Failed to parse body. Content-Type=', contentType)
      console.error('[contact] Raw body:', raw)
    } catch (e) {
      console.error('[contact] Failed to read raw body for debugging', e)
    }
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
  }

  // Always log parsed body and content type for easier debugging
  try {
    console.info('[contact] Received submission', { contentType, body })
  } catch (e) {
    console.error('[contact] Failed to log parsed body', e)
  }

  // Persist a debug record so we can inspect failing browser submissions
  try {
    const headersObj = Object.fromEntries(Array.from(request.headers.entries()))
    const logEntry = JSON.stringify({ time: new Date().toISOString(), contentType, body, headers: headersObj }) + '\n'
    const logPath = path.join(process.cwd(), 'contact-debug.log')
    await fs.appendFile(logPath, logEntry)
  } catch (e) {
    console.error('[contact] Failed to write debug log', e)
  }

  const { name = 'Anonymous', email = 'no-reply', purpose = 'Contact', message = '' } = body

  const payload = {
    from: process.env.SMTP_FROM || 'onboarding@resend.dev',
    to: process.env.EMAIL_TO!.split(','),
    subject: `Website contact: ${purpose}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Purpose:</strong> ${purpose}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '<no body>')
      console.error('[contact] Resend API returned non-OK:', res.status, errText)
      return new Response(JSON.stringify({ error: 'Resend API error' }), { status: 502 })
    }

    const respText = await res.text().catch(() => '')
    console.info('[contact] Resend API success:', res.status, respText)

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 })
  }
}
