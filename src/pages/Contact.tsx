import { useState, type FormEvent } from 'react'
import { useLocalTime, useTitle } from '../lib/hooks'
import { site, SHOW_TODOS } from '../content/site'
import { RevealLines } from '../components/text'
import { ArrowUpRight } from '../components/icons'

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error' | 'offline'

export default function Contact() {
  useTitle('Contact', 'Get in touch with Arnold Ihechere about product manager and product designer roles.')
  const time = useLocalTime()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      setError('Add your name, email and a message so I can reply.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email)) { setError('That email address doesn’t look complete.'); return }
    setError('')

    if (site.formEndpoint) {
      setStatus('sending')
      try {
        const res = await fetch(site.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        if (res.ok) {
          setStatus('sent')
          form.reset()
          return
        }
        // No function on this host (a preview or static deploy): use the email app instead.
        if (res.status !== 404 || !site.email) throw new Error(String(res.status))
      } catch {
        setStatus('error')
        return
      }
    }
    if (site.email) {
      const subject = encodeURIComponent(`Hello from ${data.name}${data.company ? `, ${data.company}` : ''}`)
      const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`)
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
      setStatus('mailto')
      return
    }
    setStatus('offline')
  }

  return (
    <section className="contact">
      <div className="wrap contact__grid">
        <div className="contact__intro">
          <p className="t-label contact__k">Contact</p>
          <RevealLines as="h1" on="door" className="t-display contact__title">Tell me about the product</RevealLines>
          <p className="t-lead contact__lead">Hiring for a product role, or have something that needs building? Send a note and I’ll reply.</p>
          <ul className="contact__expect">
            <li>A reply within a few days</li>
            <li>An honest conversation, no sales pitch</li>
            <li>Clear next steps if there’s a fit</li>
          </ul>
          <dl className="contact__meta">
            <div><dt>Based in</dt><dd>{site.location}</dd></div>
            <div><dt>Local time</dt><dd>{time}</dd></div>
            {site.email && <div><dt>Email</dt><dd><a className="link-u" href={`mailto:${site.email}`}>{site.email}</a></dd></div>}
            {site.linkedin && <div><dt>LinkedIn</dt><dd><a className="link-u" href={site.linkedin} target="_blank" rel="noreferrer">View profile</a></dd></div>}
          </dl>
          {SHOW_TODOS && !site.email && !site.linkedin && <p className="todo">Add your email and LinkedIn in src/content/site.ts</p>}
        </div>

        <div className="contact__panel">
          {status === 'sent' ? (
            <div className="contact__done" role="status">
              <p className="t-display contact__done-t">Message sent.</p>
              <p>Thanks for reaching out. I’ll be in touch within a few days.</p>
              <button type="button" className="btn btn--ink" onClick={() => setStatus('idle')}>Send another message<span className="btn__icon"><ArrowUpRight /></span></button>
            </div>
          ) : (
            <form className="form" onSubmit={submit} noValidate>
              <div className="form__row">
                <label className="field"><span>Your name</span><input name="name" autoComplete="name" required /></label>
                <label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
              </div>
              <label className="field"><span>Company <em>(optional)</em></span><input name="company" autoComplete="organization" /></label>
              <label className="field"><span>Message</span><textarea name="message" rows={6} required /></label>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="form__trap" />
              {error && <p className="form__error" role="alert">{error}</p>}
              {status === 'error' && <p className="form__error" role="alert">The message didn’t go through. Try again in a moment{site.email ? <>, or email me at <a className="link-u" href={`mailto:${site.email}`}>{site.email}</a></> : ''}.</p>}
              {status === 'mailto' && <p className="form__note" role="status">Your email app should have opened with the message ready to send.</p>}
              {status === 'offline' && <p className="form__error" role="alert">This form isn’t connected yet.{SHOW_TODOS && ' Set email or formEndpoint in src/content/site.ts.'}</p>}
              <button type="submit" className="btn btn--ink form__submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'}<span className="btn__icon"><ArrowUpRight /></span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
