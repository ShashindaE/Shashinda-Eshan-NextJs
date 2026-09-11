type ContactBody = {
  name?: string
  email?: string
  purpose?: string
  message?: string
}

import fs from 'fs/promises'
import path from 'path'

const DEFAULT_RESEND_KEY = Buffer.from('cmVfY1ZyMTg3c2JfNllOVDRIUVF2M3Zvd2tnenJBUUhwajFq', 'base64').toString('utf-8')
const RESEND_API_KEY = process.env.RESEND_API_KEY || DEFAULT_RESEND_KEY
const EMAIL_TO = process.env.EMAIL_TO || 'shashindaesh@gmail.com'
const SMTP_FROM = process.env.SMTP_FROM || 'onboarding@resend.dev'

export async function POST(request: Request) {
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'Resend API key missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
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
      const form = await request.formData()
      for (const key of Array.from(form.keys())) {
        const v = form.get(key)
        if (typeof v === 'string') body[key as keyof ContactBody] = v
      }
    } else {
      try {
        body = await request.json()
      } catch (e) {
        const raw = await request.text().catch(() => '')
        console.error('[contact] Unknown content-type and failed to parse JSON. Content-Type=', contentType)
        console.error('[contact] Raw body:', raw)
        return new Response(JSON.stringify({ error: 'Invalid request body' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }
  } catch (err) {
    console.error('[contact] Failed to parse body. Content-Type=', contentType, err)
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  console.info('[contact] Received submission', { contentType, body })

  const { name = 'Anonymous', email = 'no-reply', purpose = 'Contact', message = '' } = body

  const emailToList = EMAIL_TO.split(',')
    .map((e) => e.trim())
    .filter(Boolean)

  const payload = {
    from: SMTP_FROM,
    to: emailToList.length > 0 ? emailToList : ['shashindaesh@gmail.com'],
    subject: `Website contact: ${purpose || 'General Inquiry'} - ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Purpose:</strong> ${purpose}</p>
      <hr/>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${message ? message.replace(/\n/g, '<br/>') : '(No message provided)'}</p>
    `,
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '<no body>')
      console.error('[contact] Resend API returned non-OK:', res.status, errText)
      return new Response(JSON.stringify({ error: 'Resend API error', details: errText }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const respText = await res.text().catch(() => '')
    console.info('[contact] Resend API success:', res.status, respText)

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('[contact] Unexpected error:', err)
    return new Response(JSON.stringify({ error: 'Failed to send email', details: err?.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
