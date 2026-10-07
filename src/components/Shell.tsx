import { FitText } from './FitText'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, pageKey, useRouter } from '../lib/router'
import { gsap, ScrollTrigger, finePointer, lockScroll, scrollTo, startSmoothScroll, useGsap } from '../lib/motion'
import { ToneContext, useLocalTime, type Tone } from '../lib/hooks'
import { parentOf, site } from '../content/site'
import { Door } from './Door'
import { ArrowLeft, ArrowUp, ArrowUpRight, Close } from './icons'

const nav = [
  { label: 'Work', to: '/work', match: ['/work'] },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

/* ─── Back button ────────────────────────────────────────────────────── */
function BackButton({ light }: { light: boolean }) {
  const { pathname, back, canGoBack } = useRouter()
  if (pathname === '/') return null
  return (
    <button type="button" onClick={() => back(parentOf(pathname))}
      className={`back ${light ? 'back--light' : ''}`}
      aria-label={canGoBack ? 'Go back to the previous page' : 'Go back'}>
      <span className="back__icon"><ArrowLeft size={18} /></span>
      <span className="back__text">Back</span>
    </button>
  )
}

/* ─── Resume picker in the header ───────────────────────────────────── */
function ResumeMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: Event) => { if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false) }
    window.addEventListener('mousedown', close)
    window.addEventListener('keydown', close)
    return () => { window.removeEventListener('mousedown', close); window.removeEventListener('keydown', close) }
  }, [open])
  if (!site.resumeUrl) return null
  return (
    <div ref={ref} className={`resume-menu${open ? ' is-open' : ''}`}>
      <button type="button" className="header__link resume-menu__btn" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        Resume
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <div className="resume-menu__list">
          <a href={site.resumeUrl} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Product manager<ArrowUpRight size={14} /></a>
          {site.designResumeUrl && <a href={site.designResumeUrl} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Product designer<ArrowUpRight size={14} /></a>}
        </div>
      )}
    </div>
  )
}

/* ─── Header ─────────────────────────────────────────────────────────── */
function Header({ tone, onMenu }: { tone: Tone; onMenu: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const [solid, setSolid] = useState(false)
  const { pathname } = useRouter()

  useEffect(() => {
    const el = ref.current!
    let last = 0
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: self => {
        const y = self.scroll()
        setSolid(y > 24)
        const goingDown = y > last && y > 160
        el.classList.toggle('is-hidden', goingDown)
        last = y
      },
    })
    return () => st.kill()
  }, [pathname])

  const light = tone === 'light' && !solid
  return (
    <header ref={ref} className={`header ${solid ? 'is-solid' : ''} ${light ? 'is-light' : ''}`}>
      <div className="wrap header__row">
        <div className="header__left">
          <BackButton light={light} />
          <Link to="/" className="header__name t-display" aria-label={`${site.name}, home`}>
            {site.name}
          </Link>
        </div>
        <nav aria-label="Main" className="header__nav">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} match={n.match} className={a => `header__link ${a ? 'is-active' : ''}`}>
              {n.label}
            </NavLink>
          ))}
          <ResumeMenu />
        </nav>
        <button type="button" className="header__menu" onClick={onMenu} aria-haspopup="dialog">
          Menu
        </button>
      </div>
    </header>
  )
}

/* ─── Full-screen menu (small screens) ──────────────────────────────── */
function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const time = useLocalTime()
  const { pathname } = useRouter()

  useEffect(() => { onClose() }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  const mounted = useRef(false)
  useEffect(() => {
    const el = ref.current!
    if (!mounted.current) { mounted.current = true; if (!open) return }
    lockScroll(open)
    if (open) {
      gsap.set(el, { visibility: 'visible' })
      gsap.fromTo(el, { yPercent: -100 }, { yPercent: 0, duration: 0.6, ease: 'power3.inOut' })
      gsap.fromTo(el.querySelectorAll('.menu__link'), { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out', delay: 0.3 })
      el.querySelector<HTMLButtonElement>('.menu__close')?.focus()
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
    gsap.to(el, { yPercent: -100, duration: 0.5, ease: 'power3.inOut', onComplete: () => { gsap.set(el, { visibility: 'hidden' }) } })
  }, [open, onClose])

  return (
    <div ref={ref} className="menu on-night" role="dialog" aria-modal="true" aria-label="Menu" style={{ visibility: 'hidden' }}>
      <div className="wrap menu__top">
        <span className="t-display menu__name">{site.name}</span>
        <button type="button" className="menu__close" onClick={onClose}>
          Close <Close size={16} />
        </button>
      </div>
      <nav className="wrap menu__nav" aria-label="Menu">
        <Link to="/" className="menu__item"><span className="menu__link t-display">Home</span></Link>
        {nav.map(n => (
          <Link key={n.to} to={n.to} className="menu__item"><span className="menu__link t-display">{n.label}</span></Link>
        ))}
      </nav>
      <div className="wrap menu__foot">
        <p>{site.location}, {time}</p>
        {site.email && <a href={`mailto:${site.email}`} className="link-u">{site.email}</a>}
        {site.linkedin && <a href={site.linkedin} target="_blank" rel="noreferrer" className="link-u">LinkedIn</a>}
        {site.resumeUrl && <a href={site.resumeUrl} target="_blank" rel="noreferrer" className="link-u">Resume, product</a>}
        {site.designResumeUrl && <a href={site.designResumeUrl} target="_blank" rel="noreferrer" className="link-u">Resume, design</a>}
      </div>
    </div>
  )
}

/* ─── Footer: revealed from under the page ──────────────────────────── */
function Footer() {
  const time = useLocalTime()
  const ref = useRef<HTMLDivElement>(null)

  useGsap(() => {
    const big = ref.current!.querySelector('.footer__big')
    gsap.fromTo(big, { yPercent: 35 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
    })
  }, [], ref)

  const links = [
    site.email && { label: 'Email', href: `mailto:${site.email}` },
    site.linkedin && { label: 'LinkedIn', href: site.linkedin },
    site.resumeUrl && { label: 'Resume, product', href: site.resumeUrl },
    site.designResumeUrl && { label: 'Resume, design', href: site.designResumeUrl },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <div ref={ref} className="footer-reveal">
      <footer className="footer on-night">
        <div className="wrap footer__inner">
          <div className="footer__top">
            <p className="footer__ask t-display">Have a product that needs a steady hand on the line?</p>
            <Link to="/contact" className="btn btn--signal footer__cta">
              Get in touch <span className="btn__icon"><ArrowUpRight /></span>
            </Link>
          </div>
          <div className="footer__grid">
            <div>
              <p className="footer__k">Based in</p>
              <p>{site.location}</p>
              <p className="footer__muted">Local time {time}</p>
            </div>
            <div>
              <p className="footer__k">Pages</p>
              <ul>
                <li><Link to="/work" className="link-u">Work</Link></li>
                <li><Link to="/about" className="link-u">About</Link></li>
                <li><Link to="/contact" className="link-u">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="footer__k">Elsewhere</p>
              {links.length ? (
                <ul>{links.map(l => <li key={l.label}><a href={l.href} className="link-u" target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{l.label}</a></li>)}</ul>
              ) : <p className="footer__muted">Use the contact form for now.</p>}
            </div>
            <div className="footer__toTop">
              <button type="button" onClick={() => scrollTo(0)} className="footer__up">
                Back to top <ArrowUp size={16} />
              </button>
            </div>
          </div>
          <div className="footer__big t-display" aria-hidden="true"><FitText><span className="footer__bigline">{site.firstName} {site.lastName}</span></FitText></div>
          <p className="footer__legal">© {new Date().getFullYear()} {site.name}. Designed and built by Arnold.</p>
        </div>
      </footer>
    </div>
  )
}

/* ─── Cursor label: follows the pointer over [data-cursor] areas ───── */
function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  useEffect(() => {
    if (!finePointer()) return
    const el = ref.current!
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })
    let current = ''
    const move = (e: PointerEvent) => {
      xTo(e.clientX); yTo(e.clientY)
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null
      const next = target?.dataset.cursor ?? ''
      if (next !== current) {
        current = next
        if (next) setLabel(next)
        gsap.to(el, { scale: next ? 1 : 0, duration: 0.35, ease: next ? 'back.out(1.6)' : 'power2.in' })
      }
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return <div ref={ref} className="cursor-label" aria-hidden="true"><span>{label}</span></div>
}

/* ─── Shell ──────────────────────────────────────────────────────────── */
export function Shell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false)
  const [tone, setTone] = useState<Tone>('dark')
  const { pathname } = useRouter()
  const openMenu = useCallback(() => setMenu(true), [])
  const closeMenu = useCallback(() => setMenu(false), [])
  const toneValue = useMemo(() => ({ tone, setTone }), [tone])

  useEffect(() => { startSmoothScroll() }, [])

  return (
    <ToneContext.Provider value={toneValue}>
      <a href="#main" className="skip-link"
        onClick={e => { e.preventDefault(); const m = document.getElementById('main'); m?.focus(); if (m) scrollTo(m) }}>
        Skip to content
      </a>
      <Header tone={tone} onMenu={openMenu} />
      <Menu open={menu} onClose={closeMenu} />
      <div className="page-stack grain">
        <main id="main" tabIndex={-1} className="page" key={pageKey(pathname)}>{children}</main>
        <Footer />
      </div>
      <CursorLabel />
      <Door />
    </ToneContext.Provider>
  )
}
