import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from '../lib/router'
import { ScrollTrigger, gsap, reducedMotion, scrollTo, useGsap } from '../lib/motion'
import { RevealLines } from './text'
import { ArrowUpRight, Close } from './icons'

/* ─── Chapter pill ──────────────────────────────────────────────────────
   A small floating control at the bottom of case studies. It shows the
   chapter you're in and how far through the page you are, and opens a
   list to jump between chapters. */
type Chapter = { id: string; label: string; el: HTMLElement }

export function ChapterNav({ title }: { title: string }) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)
  const bar = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'))
    const list = els.map(el => ({ id: el.dataset.chapter!, label: el.dataset.label ?? el.dataset.chapter!, el }))
    setChapters(list)
    const triggers = list.map((c, i) => ScrollTrigger.create({
      trigger: c.el, start: 'top 55%', end: 'bottom 55%',
      onToggle: self => { if (self.isActive) setActive(i) },
    }))
    const page = ScrollTrigger.create({
      start: () => window.innerHeight * 0.9, end: 'max',
      onUpdate: self => { if (bar.current) bar.current.style.transform = `scaleX(${self.progress})` },
      onToggle: self => setShown(self.isActive),
    })
    // Hide near the footer so it never covers the closing call to action.
    const foot = document.querySelector('.footer-reveal')
    const tail = foot ? ScrollTrigger.create({ trigger: '.case-next', start: 'top 85%', onToggle: self => { if (self.isActive) setShown(false); else if (page.isActive) setShown(true) } }) : null
    return () => { triggers.forEach(t => t.kill()); page.kill(); tail?.kill() }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onDown = (e: MouseEvent) => { if (!listRef.current?.parentElement?.contains(e.target as Node)) setOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onDown)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onDown) }
  }, [open])

  if (!chapters.length) return null
  const current = chapters[active]
  return (
    <nav className={`chapters${shown ? ' is-shown' : ''}${open ? ' is-open' : ''}`} aria-label={`${title} chapters`}>
      <div ref={listRef} className="chapters__list" hidden={!open}>
        <p className="chapters__title">{title}</p>
        <ol>
          {chapters.map((c, i) => (
            <li key={c.id}>
              <button type="button" className={i === active ? 'is-active' : ''} aria-current={i === active ? 'true' : undefined}
                onClick={() => { setOpen(false); scrollTo(c.el, { offset: c.el.classList.contains('eco') ? 0 : -24 }) }}>
                <span className="t-stencil chapters__n">{i + 1}</span>{c.label}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <button type="button" className="chapters__pill" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span className="chapters__now"><span className="chapters__idx">{active + 1}/{chapters.length}</span>{current?.label}</span>
        <span className="chapters__toggle" aria-hidden="true">{open ? <Close size={14} /> : <Lines />}</span>
        <span className="chapters__bar" aria-hidden="true"><span ref={bar} /></span>
      </button>
    </nav>
  )
}

const Lines = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 4h10M2 7h10M2 10h6" /></svg>
)

/* ─── Section heading ─────────────────────────────────────────────────── */
export function Head({ k, title, children, id, className = '' }: { k?: string; title: ReactNode; children?: ReactNode; id?: string; className?: string }) {
  return (
    <header className={`case-head ${className}`}>
      {k && <p className="t-label case-head__k">{k}</p>}
      <RevealLines as="h2" id={id} className="t-display case-head__title">{title}</RevealLines>
      {children && <div className="t-lead case-head__lead">{children}</div>}
    </header>
  )
}

/* ─── Rows that rise in one after another ─────────────────────────────── */
export function useRise(selector: string, deps: unknown[] = []) {
  const ref = useRef<HTMLElement>(null)
  useGsap(() => {
    if (reducedMotion()) return
    const items = gsap.utils.toArray<HTMLElement>(selector, ref.current!)
    items.forEach(el => {
      gsap.from(el, { y: 48, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
    })
  }, deps, ref)
  return ref
}

/* ─── Next case study ─────────────────────────────────────────────────── */
export function NextCase({ to, name, summary, theme, children }: { to: string; name: string; summary: string; theme: 'lilac' | 'wine'; children?: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)
  useGsap(() => {
    if (reducedMotion()) return
    const el = ref.current!
    gsap.fromTo(el.querySelector('.case-next__name'), { yPercent: 40 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 30%', scrub: true } })
    gsap.fromTo(el.querySelector('.case-next__art'), { yPercent: 18, rotate: 6 }, { yPercent: 0, rotate: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true } })
  }, [], ref)
  return (
    <section className="case-next-wrap" aria-label="Next case study">
      <Link ref={ref} to={to} className={`case-next case-next--${theme}`} data-cursor="Open">
        <div className="wrap case-next__inner">
          <div className="case-next__copy">
            <p className="t-label case-next__k">Next case study</p>
            <p className="t-display case-next__name">{name}</p>
            <p className="case-next__summary">{summary}</p>
            <span className={`btn ${theme === 'wine' ? 'btn--gold' : 'btn--ink'}`}>Read the case study<span className="btn__icon"><ArrowUpRight /></span></span>
          </div>
          <div className="case-next__art" aria-hidden="true">{children}</div>
        </div>
      </Link>
    </section>
  )
}

/* ─── A labelled fact list (role, timeline...) ───────────────────────── */
export function Facts({ items, className = '' }: { items: [string, ReactNode][]; className?: string }) {
  return (
    <dl className={`facts ${className}`}>
      {items.map(([k, v]) => (
        <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
      ))}
    </dl>
  )
}
