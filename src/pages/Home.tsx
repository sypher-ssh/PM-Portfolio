import { useEffect, useRef } from 'react'
import { Link, useRouter } from '../lib/router'
import { gsap, ScrollTrigger, SplitText, reducedMotion, scrollTo, useGsap } from '../lib/motion'
import { useLocalTime, useTitle } from '../lib/hooks'
import { site } from '../content/site'
import { aerrand, brainbox } from '../content/screens'
import { Conveyor, type ConveyorItem } from '../components/Conveyor'
import { FitText } from '../components/FitText'
import { IPhone } from '../components/devices'
import { CountUp, RevealLines, ScrubWords, useDoorOpen } from '../components/text'
import { ArrowUpRight } from '../components/icons'

const line: ConveyorItem[] = [
  { src: aerrand.customer.home, alt: 'AERRAND customer app home screen', to: '/work/aerrand', product: 'AERRAND', screen: 'Customer app' },
  { src: brainbox.home, alt: 'Brain Box home screen with today’s study plan', to: '/work/brain-box', product: 'Brain Box', screen: 'Daily plan', finish: 'black' },
  { src: aerrand.aerrander.home, alt: 'Aerrander app home screen with busy areas on a map', to: '/work/aerrand', product: 'AERRAND', screen: 'Aerrander app' },
  { src: brainbox.question, alt: 'Brain Box mock test question in integrity mode', to: '/work/brain-box', product: 'Brain Box', screen: 'Mock test', finish: 'black' },
  { src: aerrand.customer.approve, alt: 'AERRAND Guard inspection waiting for approval', to: '/work/aerrand', product: 'AERRAND', screen: 'Guard inspection' },
  { src: brainbox.needs, alt: 'Brain Box onboarding: choose how you study best', to: '/work/brain-box', product: 'Brain Box', screen: 'Study needs', finish: 'black' },
  { src: aerrand.aerrander.inspect, alt: 'Aerrander app checklist for inspecting an item', to: '/work/aerrand', product: 'AERRAND', screen: 'Inspect the item' },
  { src: aerrand.customer.welcome, alt: 'AERRAND onboarding welcome screen', to: '/work/aerrand', product: 'AERRAND', screen: 'Onboarding' },
]

/* ─── Hero ───────────────────────────────────────────────────────────── */
function Hero() {
  const ref = useRef<HTMLElement>(null)
  const time = useLocalTime()
  const intro = useRef<gsap.core.Timeline | null>(null)

  useGsap(() => {
    const root = ref.current!
    if (reducedMotion()) return
    const first = root.querySelector('.hero__first')!, last = root.querySelector('.hero__last')!
    const split = SplitText.create([first, last], { type: 'chars', mask: 'chars' })
    const tl = gsap.timeline({ paused: true })
    tl.from(split.chars, { yPercent: 115, duration: 1.25, ease: 'expo.out', stagger: 0.035 })
      .from(root.querySelectorAll('[data-hero-fade]'), { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.35)
      .from(root.querySelector('.conveyor'), { yPercent: 18, opacity: 0, duration: 1.4, ease: 'expo.out' }, 0.25)
    intro.current = tl

    // Leaving the hero: the two names drift apart.
    gsap.to(first, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } })
    gsap.to(last, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } })
    return () => split.revert()
  }, [], ref)

  useDoorOpen(() => intro.current?.play())

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-name">
      <div className="wrap hero__top">
        <h1 id="hero-name" className="hero__name t-display" aria-label={site.name}>
          <FitText className="hero__fit" max={340}>
            <span className="hero__line" aria-hidden="true">
              <span className="hero__first">{site.firstName}</span>{' '}
              <span className="hero__last">{site.lastName}</span>
            </span>
          </FitText>
        </h1>
        <div className="hero__intro">
          <div className="hero__lead">
            <p className="hero__role t-display" data-hero-fade>{site.role}</p>
            <p className="t-lead hero__text" data-hero-fade>
              I’ve designed and built software since 2022. My delivery app, AERRAND, is live on the App Store and Google Play,
              and for the past year I’ve also led automotive production on the night shift.
            </p>
          </div>
          <dl className="hero__meta" data-hero-fade>
            <div><dt>Based in</dt><dd>{site.location}</dd></div>
            <div><dt>Local time</dt><dd>{time}</dd></div>
            <div><dt>Status</dt><dd><span className="status-dot" aria-hidden="true" />{site.availability}</dd></div>
          </dl>
        </div>
      </div>
      <Conveyor items={line} label="Screens from AERRAND and Brain Box moving along an overhead conveyor" />
    </section>
  )
}

/* ─── Statement ──────────────────────────────────────────────────────── */
function Statement() {
  return (
    <section className="statement" aria-label="What I do">
      <div className="wrap statement__inner">
        <ScrubWords className="statement__text">
          I’ve spent four years designing and building software people actually use, and the last one also leading production lines of up to 79 people. Both jobs come down to the same thing: listen to the people doing the work, cut what doesn’t matter, and ship something that holds up in real life.
        </ScrubWords>
      </div>
    </section>
  )
}

/* ─── Work: stacked project panels ──────────────────────────────────── */
type Panel = {
  id: string
  to: string
  name: string
  note?: string
  icon?: string
  summary: string
  facts: { k: string; v: string }[]
  cta: string
  phones: { src: string; alt: string; finish?: 'natural' | 'black' | 'white' }[]
  theme: 'lilac' | 'wine'
}

const panels: Panel[] = [
  {
    id: 'aerrand', to: '/work/aerrand', name: 'AERRAND', icon: aerrand.icon, theme: 'lilac',
    summary: 'Same-day delivery for Windsor, Ontario, built around trust. Five connected surfaces for customers, Aerranders (drivers), businesses and operations.',
    facts: [
      { k: 'Status', v: 'Live on the App Store and Google Play in beta since August 2026. 2.0 in design.' },
      { k: 'My role', v: 'Co-founder and product lead. I design and build it.' },
      { k: 'Since', v: '2025' },
    ],
    cta: 'Read the AERRAND case study',
    phones: [
      { src: aerrand.customer.home, alt: 'AERRAND 2.0 customer home screen' },
      { src: aerrand.aerrander.home, alt: 'Aerrander 2.0 home screen, online' },
    ],
  },
  {
    id: 'brain-box', to: '/work/brain-box', name: 'Brain Box', note: 'Working name', theme: 'wine',
    summary: 'One calm, accessible app for the tests newcomers face: language, driving and citizenship. Mock exams feel like the real thing because you can’t cheat on them.',
    facts: [
      { k: 'Status', v: 'MVP scoped. Interactive prototype built.' },
      { k: 'My role', v: 'Product manager.' },
      { k: 'Since', v: '2026' },
    ],
    cta: 'Read the Brain Box case study',
    phones: [
      { src: brainbox.home, alt: 'Brain Box home screen with the daily plan', finish: 'black' },
      { src: brainbox.question, alt: 'Brain Box mock test question with a timer', finish: 'black' },
    ],
  },
]

function ProjectPanel({ p, index }: { p: Panel; index: number }) {
  return (
    <article className={`panel panel--${p.theme}`} data-panel={index} aria-labelledby={`panel-${p.id}`}>
      <div className="panel__inner">
        <div className="wrap panel__grid">
          <div className="panel__copy">
            <div className="panel__head">
              {p.icon && <img src={p.icon} alt="" width={64} height={64} className="panel__icon" />}
              <p className="t-label panel__count">Project {index + 1} of {panels.length}</p>
            </div>
            <h3 id={`panel-${p.id}`} className="panel__name t-display">{p.name}</h3>
            {p.note && <p className="t-label panel__note">{p.note}</p>}
            <p className="t-lead panel__summary">{p.summary}</p>
            <dl className="panel__facts">
              {p.facts.map(f => <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>)}
            </dl>
            <Link to={p.to} className={`btn ${p.theme === 'wine' ? 'btn--gold' : 'btn--ink'}`}>
              {p.cta} <span className="btn__icon"><ArrowUpRight /></span>
            </Link>
          </div>
          <Link to={p.to} className="panel__stage" data-cursor="View case study" aria-label={p.cta} tabIndex={-1}>
            <div className="panel__phones">
              {p.phones.map((ph, i) => (
                <IPhone key={i} src={ph.src} alt={ph.alt} finish={ph.finish} depth width="var(--panel-phone)" className={`panel__phone panel__phone--${i}`} />
              ))}
            </div>
          </Link>
        </div>
      </div>
    </article>
  )
}

function Work({ focus }: { focus: boolean }) {
  const ref = useRef<HTMLElement>(null)

  useGsap(() => {
    const root = ref.current!
    if (reducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (min-height: 640px)', () => {
      const els = gsap.utils.toArray<HTMLElement>('.panel', root)
      els.forEach((panel, i) => {
        const phones = panel.querySelectorAll('.panel__phone')
        gsap.fromTo(phones, { y: 160, rotateX: 24, rotateY: i % 2 ? 18 : -18, rotateZ: i % 2 ? -5 : 5 }, {
          y: -20, rotateX: 6, rotateY: i % 2 ? 9 : -9, rotateZ: 0, ease: 'none', stagger: 0.05,
          scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top top', scrub: 0.8 },
        })
        const next = els[i + 1]
        if (next) {
          // The panel underneath eases back and its content fades, keeping its colour.
          const st = { trigger: next, start: 'top bottom', end: 'top top', scrub: true }
          gsap.to(panel.querySelector('.panel__inner'), { scale: 0.93, borderRadius: 32, ease: 'none', scrollTrigger: st })
          gsap.to(panel.querySelector('.panel__grid'), { opacity: 0.25, yPercent: -4, ease: 'none', scrollTrigger: { ...st } })
        }
      })
    })
    mm.add('(max-width: 899px), (max-height: 639px)', () => {
      gsap.utils.toArray<HTMLElement>('.panel__phone', root).forEach(ph => {
        gsap.from(ph, { y: 80, rotate: 4, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: ph, start: 'top 92%', once: true } })
      })
    })
    return () => mm.revert()
  }, [], ref)

  // /work lands here.
  useDoorOpen(() => {
    if (focus && ref.current) scrollTo(ref.current, { immediate: true, offset: 0 })
  })

  return (
    <section ref={ref} id="work" className="work" aria-labelledby="work-title">
      <div className="wrap work__head">
        <RevealLines as="h2" id="work-title" className="t-display work__title">Selected work</RevealLines>
        <p className="t-lead work__intro">Two products I’ve taken from a blank page to people’s phones, and what I learned deciding what to build first.</p>
      </div>
      <div className="panels">
        {panels.map((p, i) => <ProjectPanel key={p.id} p={p} index={i} />)}
      </div>
      <div className="wrap rc">
        <article className="rc__card" aria-labelledby="rc-title">
          <div className="rc__copy">
            <p className="t-label rc__k">Company experience</p>
            <h3 id="rc-title" className="t-display rc__title">Right Click IT Solutions</h3>
            <p className="rc__role">Full-stack engineer and UI/UX designer <span>2022 to 2024</span></p>
            <p className="rc__text">An IT contractor to government organizations in Nigeria. I designed and built enterprise resource planning (ERP) software for government bodies in the oil and gas sector, from requirements and Figma prototypes through front end, backend and APIs.</p>
            <ul className="rc__tags" aria-label="What the work involved">
              <li>ERP software</li><li>Government clients</li><li>Oil and gas</li><li>Design and build</li>
            </ul>
            <p className="rc__nda">The client work is confidential, so it isn’t shown here. <Link to="/contact" className="link-u">Ask me about the process</Link></p>
          </div>
          <div className="rc__art" aria-hidden="true">
            <div className="rc__win">
              <div className="rc__bar"><i /><i /><i /></div>
              <div className="rc__body">
                <div className="rc__side">{[0, 1, 2, 3, 4].map(i => <span key={i} />)}</div>
                <div className="rc__main">
                  <div className="rc__tiles">{[0, 1, 2].map(i => <span key={i} />)}</div>
                  <div className="rc__rows">{[0, 1, 2, 3, 4].map(i => <span key={i}><b /><b /><b /></span>)}</div>
                </div>
              </div>
              <span className="rc__stamp">Confidential</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

/* ─── The floor (operations leadership) ─────────────────────────────── */
function Floor() {
  return (
    <section className="floor floor--band on-night" aria-labelledby="floor-title">
      <div className="wrap floor__band">
        <div>
          <p className="t-label floor__k">Alongside the design work</p>
          <h2 id="floor-title" className="t-display floor__title floor__title--band">A year leading a production line</h2>
          <p className="floor__note">Since 2025 I’ve also supervised automotive production on the night shift. It made me faster at prioritizing and better at designing for real conditions.</p>
          <Link to="/about" className="link-u floor__more">What the floor taught me</Link>
        </div>
        <div className="floor__stats floor__stats--band">
          <div className="stat"><CountUp value={79} className="t-stencil stat__n" /><p>people led on a single line</p></div>
          <div className="stat"><CountUp value={17} className="t-stencil stat__n" /><p>team leads coordinated</p></div>
        </div>
      </div>
    </section>
  )
}

/* ─── Process: a line with five stations ────────────────────────────── */
const stations = [
  { n: 1, title: 'Discover', body: 'Talk to the people closest to the problem before deciding what to build. On the floor that meant operators and team leads. In product it means users, support and the data.' },
  { n: 2, title: 'Prioritize', body: 'Turn a long wish list into a sequence: what ships first, what waits, and what we are deliberately not doing yet.' },
  { n: 3, title: 'Specify', body: 'User stories, flows, edge cases and acceptance criteria that engineers can build from without guessing.' },
  { n: 4, title: 'Design', body: 'Information architecture, wireframes, high-fidelity UI and design systems, so the spec and the screens tell the same story.' },
  { n: 5, title: 'Ship', body: 'I write frontend code in React and TypeScript, so I know what’s costly, what’s quick, and how to unblock a team mid-sprint.' },
]

function Process() {
  const ref = useRef<HTMLElement>(null)
  useGsap(() => {
    const root = ref.current!
    if (reducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (min-height: 640px)', () => {
      const track = root.querySelector<HTMLElement>('.process__track')!
      const carrier = root.querySelector<HTMLElement>('.process__carrier')!
      const fill = root.querySelector<HTMLElement>('.process__fill')!
      const items = gsap.utils.toArray<HTMLElement>('.station', root)
      const n = items.length
      const setActive = (i: number) => items.forEach((it, j) => { it.classList.toggle('is-active', j === i); it.classList.toggle('is-done', j < i) })
      setActive(0)
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root, start: 'top top', end: () => `+=${window.innerHeight * 2.2}`, pin: true, scrub: 0.6,
          onUpdate: self => setActive(Math.min(n - 1, Math.floor(self.progress * n * 0.999))),
        },
      })
      tl.fromTo(carrier, { left: '0%' }, { left: '100%', duration: 1 }, 0)
        .fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
      void track
    })
    mm.add('(max-width: 899px), (max-height: 639px)', () => {
      gsap.utils.toArray<HTMLElement>('.station', root).forEach(s => {
        s.classList.add('is-active')
        gsap.from(s, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 90%', once: true } })
      })
    })
    return () => mm.revert()
  }, [], ref)

  return (
    <section ref={ref} className="process" aria-labelledby="process-title">
      <div className="wrap process__inner">
        <div className="process__head">
          <RevealLines as="h2" id="process-title" className="t-display process__title">How a product moves down my line</RevealLines>
          <p className="t-lead process__intro">Five stations, in order. Each one has to pass inspection before the work moves on.</p>
        </div>
        <div className="process__track" aria-hidden="true">
          <span className="process__fill" />
          <span className="process__carrier" />
        </div>
        <ol className="stations">
          {stations.map(s => (
            <li key={s.n} className="station">
              <span className="t-stencil station__n">{s.n}</span>
              <h3 className="t-display station__title">{s.title}</h3>
              <p className="station__body">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default function Home({ focusWork = false }: { focusWork?: boolean }) {
  useTitle()
  const { pathname } = useRouter()

  // Clicking "Work" while already on the home page scrolls to the list.
  useEffect(() => {
    const onSame = (e: Event) => {
      const to = (e as CustomEvent<string>).detail
      if (to === '/work') { const w = document.getElementById('work'); if (w) scrollTo(w) }
      else scrollTo(0)
    }
    window.addEventListener('route:same', onSame)
    return () => window.removeEventListener('route:same', onSame)
  }, [pathname])

  useEffect(() => { ScrollTrigger.refresh() }, [])

  return (
    <>
      <Hero />
      <Statement />
      <Work focus={focusWork} />
      <Floor />
      <Process />
    </>
  )
}
