/// <reference types="node" />
/**
 * Contact form handler (Vercel Function).
 * Emails each message to you through Twilio SendGrid.
 *
 * Set these in Vercel → Project → Settings → Environment Variables:
 *   SENDGRID_API_KEY    SendGrid API key with "Mail Send" access
 *   CONTACT_FROM_EMAIL  A sender you verified in SendGrid
 *   CONTACT_TO_EMAIL    Where messages land (defaults to the from address)
 */

const MAX = { name: 120, email: 200, company: 160, message: 5000 }

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

const reasons: Record<number, string> = {
  401: 'SendGrid rejected the API key. Check SENDGRID_API_KEY in Vercel.',
  403: 'SendGrid refused the sender or key permission. Verify CONTACT_FROM_EMAIL as a Single Sender and give the key Mail Send access.',
}

const sendgrid = (key: string, body: object) =>
  fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

/** Setup check: open /api/contact in a browser. Uses SendGrid's sandbox, so nothing is emailed. */
export async function GET() {
  const key = process.env.SENDGRID_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  const to = process.env.CONTACT_TO_EMAIL || from
  const config = { SENDGRID_API_KEY: Boolean(key), CONTACT_FROM_EMAIL: Boolean(from), CONTACT_TO_EMAIL: Boolean(process.env.CONTACT_TO_EMAIL) }
  if (!key || !from || !to) return json({ ok: false, config, problem: 'Missing environment variables in Vercel. Add them, then redeploy.' })
  const res = await sendgrid(key, {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from },
    subject: 'Setup check',
    content: [{ type: 'text/plain', value: 'Setup check' }],
    mail_settings: { sandbox_mode: { enable: true } },
  })
  const detail = res.ok ? null : ((await res.json().catch(() => null))?.errors ?? []).map((e: { message?: string }) => e.message)
  return json({ ok: res.ok, config, sendgridStatus: res.status, problem: res.ok ? null : reasons[res.status] || 'SendGrid returned an error.', detail })
}

export async function POST(request: Request) {
  const key = process.env.SENDGRID_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  const to = process.env.CONTACT_TO_EMAIL || from
  if (!key || !from || !to) return json({ error: 'Email is not configured' }, 500)

  let data: Record<string, unknown>
  try { data = await request.json() } catch { return json({ error: 'Invalid request' }, 400) }

  // Bots fill in the hidden field. Pretend it worked and drop the message.
  if (clean(data.website, 200)) return json({ ok: true })

  const name = clean(data.name, MAX.name)
  const email = clean(data.email, MAX.email)
  const company = clean(data.company, MAX.company)
  const message = clean(data.message, MAX.message)
  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'Missing fields' }, 400)

  const res = await sendgrid(key, {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from, name: 'Portfolio contact form' },
    reply_to: { email, name },
    subject: `Portfolio message from ${name}${company ? `, ${company}` : ''}`,
    content: [{ type: 'text/plain', value: `${message}\n\n${name}\n${email}${company ? `\n${company}` : ''}` }],
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error('SendGrid error', res.status, detail)
    return json({ error: 'Could not send', sendgridStatus: res.status }, 502)
  }
  return json({ ok: true })
}
