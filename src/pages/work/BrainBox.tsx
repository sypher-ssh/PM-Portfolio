import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, reducedMotion, useGsap } from '../../lib/motion'
import { useHeaderTone, useTitle } from '../../lib/hooks'
import { aerrand, brainbox } from '../../content/screens'
import { IPhone } from '../../components/devices'
import { FitText } from '../../components/FitText'
import { ScrubWords, useDoorOpen } from '../../components/text'
import { ChapterNav, Facts, Head, NextCase, useRise } from '../../components/Case'

/* ─── Hero ───────────────────────────────────────────────────────────── */
function Hero() {
  const ref = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)
  useHeaderTone('light')

  useGsap(() => {
    const root = ref.current!
    if (reducedMotion()) return
    const q = gsap.utils.selector(root)
    const tl = gsap.timeline({ paused: true })
    tl.from(q('.bh__title .fit > span'), { yPercent: 100, duration: 1.3, ease: 'expo.out' })
      .from(q('[data-fade]'), { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07 }, 0.3)
      .from(q('.bh__phone'), { y: 220, rotate: 0, opacity: 0, duration: 1.6, ease: 'expo.out', stagger: 0.1 }, 0.3)
    intro.current = tl
    // The fan of phones opens as you scroll past.
    const fan = gsap.timeline({ scrollTrigger: { trigger: q('.bh__stage')[0], start: 'top 75%', end: 'bottom top', scrub: true } })
    fan.fromTo(q('.bh__phone--l'), { rotate: -8, xPercent: 0 }, { rotate: -16, xPercent: -22, yPercent: 6, ease: 'none' }, 0)
      .fromTo(q('.bh__phone--r'), { rotate: 8, xPercent: 0 }, { rotate: 16, xPercent: 22, yPercent: 6, ease: 'none' }, 0)
      .fromTo(q('.bh__phone--c'), { yPercent: 0 }, { yPercent: -10, ease: 'none' }, 0)
      .fromTo(q('.bh__glow'), { scale: 0.8, opacity: 0.6 }, { scale: 1.25, opacity: 1, ease: 'none' }, 0)
  }, [], ref)
  useDoorOpen(() => intro.current?.play())

  return (
    <section ref={ref} className="bh" data-chapter="overview" data-label="Overview" aria-labelledby="bh-title">
      <div className="wrap bh__top">
        <p className="t-label bh__k" data-fade>Case study: exam preparation</p>
        <h1 id="bh-title" className="t-display bh__title" aria-label="Brain Box">
          <FitText max={420}><span className="bh__line" aria-hidden="true">Brain Box</span></FitText>
        </h1>
        <div className="bh__intro">
          <div data-fade>
            <p className="t-lead bh__lead">One calm, accessible app for the tests that move a newcomer’s life forward: language, driving and citizenship. Mock exams feel like the real thing because you can’t cheat on them.</p>
            <p className="bh__note">Brain Box is a working name.</p>
          </div>
          <div data-fade>
            <Facts items={[
              ['My role', 'Product manager'],
              ['Timeline', '2026 to now'],
              ['Launch exams', 'CELPIP and the Ontario G1'],
              ['Status', 'MVP scoped. Interactive prototype built.'],
            ]} />
          </div>
        </div>
      </div>
      <div className="bh__stage" aria-hidden="true">
        <div className="bh__glow" />
        <IPhone className="bh__phone bh__phone--l" src={brainbox.plan} alt="" statusBar={false} width="var(--bh-phone)" finish="black" loading="eager" />
        <IPhone className="bh__phone bh__phone--c" src={brainbox.home} alt="" statusBar={false} width="var(--bh-phone)" finish="black" loading="eager" />
        <IPhone className="bh__phone bh__phone--r" src={brainbox.question} alt="" statusBar={false} width="var(--bh-phone)" finish="black" loading="eager" />
      </div>
    </section>
  )
}

/* ─── Problem ────────────────────────────────────────────────────────── */
const problems = [
  { t: 'One person, a different app for every test.', d: 'Every exam has its own app, its own login and its own habits to build, even though the same person is studying for all of them.' },
  { t: 'Practice tests don’t feel like the real thing.', d: 'A mock you can pause, leave and look things up during produces a score that means very little. People walk into the real exam with false confidence.' },
  { t: 'Speaking practice needs a partner.', d: 'CELPIP Speaking is graded on fluency and structure, but practising out loud usually means finding a tutor or a patient friend.' },
  { t: 'Accessibility is an afterthought.', d: 'Learners with ADHD, dyslexia or autism are left to fight interfaces built for someone else, on tests where the stakes are already high.' },
]

function Problem() {
  const ref = useRise('.problem')
  return (
    <section ref={ref} className="case-sec" data-chapter="problem" data-label="The problem" aria-labelledby="bp-title">
      <div className="wrap split">
        <div className="split__side">
          <Head id="bp-title" k="The problem" title="High-stakes tests, low-quality practice" />
        </div>
        <ol className="problems">
          {problems.map(p => (
            <li key={p.t} className="problem">
              <h3 className="problem__t">{p.t}</h3>
              <p className="problem__d">{p.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ─── Audiences ──────────────────────────────────────────────────────── */
const audiences = [
  { when: 'Primary audience', who: 'Newcomers and immigrants', about: 'People settling into a new country who need to pass a language, driving and citizenship test, often while working.', need: 'One place to prepare, a plan that fits their test date, and mocks that predict the real result.' },
  { when: 'Designed in from day one', who: 'Learners with ADHD, dyslexia or autism', about: 'Not a separate audience so much as a lens: if the app works for them, it works better for everyone.', need: 'Shorter chunks, clear progress, readable type, calm layouts and no surprises.' },
  { when: 'Later', who: 'Students and institutions', about: 'Academic studying, school logins, and licences for language schools, driving schools and settlement agencies.', need: 'These build on a working product and an existing user base, so they come after the exam app is proven.' },
]

function Audiences() {
  const ref = useRise('.bb-aud')
  return (
    <section ref={ref} className="case-sec case-sec--tint" data-chapter="audiences" data-label="Who it’s for" aria-labelledby="ba-title">
      <div className="wrap">
        <Head id="ba-title" k="Who it’s for" title="Built for newcomers first" />
        <div className="bb-auds">
          {audiences.map(a => (
            <article key={a.who} className="bb-aud">
              <p className="t-label bb-aud__when">{a.when}</p>
              <h3 className="t-display bb-aud__who">{a.who}</h3>
              <p className="bb-aud__about">{a.about}</p>
              <Facts items={[[a.when === 'Later' ? 'Why later' : 'What they need', a.need]]} className="facts--stack" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Wedge: two exams, one engine ───────────────────────────────────── */
function Wedge() {
  const ref = useRef<HTMLElement>(null)
  useGsap(() => {
    const root = ref.current!
    if (reducedMotion()) return
    const q = gsap.utils.selector(root)
    const tl = gsap.timeline({ scrollTrigger: { trigger: q('.wedge__art')[0], start: 'top 75%', end: 'bottom 55%', scrub: 0.6 } })
    tl.from(q('.ticket--g1'), { xPercent: -30, rotate: -10, opacity: 0, ease: 'none' }, 0)
      .from(q('.ticket--celpip'), { xPercent: 30, rotate: 10, opacity: 0, ease: 'none' }, 0)
    q('.wedge__wire').forEach((p: Element) => {
      const path = p as SVGPathElement
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      tl.to(path, { strokeDashoffset: 0, ease: 'none' }, 0.4)
    })
    tl.from(q('.engine__part'), { y: 30, opacity: 0, stagger: 0.08, ease: 'none' }, 0.8)
  }, [], ref)

  return (
    <section ref={ref} className="case-sec wedge" data-chapter="wedge" data-label="Where to start" aria-labelledby="bw-title">
      <div className="wrap">
        <Head id="bw-title" k="Where to start" title="One free test, and one that’s worth paying for">
          The launch pairs the Ontario G1 test, offered free, with CELPIP, offered paid. Both run on the same engine, so every exam added later reuses what’s already built.
        </Head>
        <div className="wedge__art">
          <div className="tickets">
            <article className="ticket ticket--g1">
              <p className="ticket__price">Free</p>
              <h3 className="t-display ticket__name">Ontario G1</h3>
              <p className="ticket__d">High volume and low stakes. The entry point that brings newcomers in.</p>
            </article>
            <article className="ticket ticket--celpip">
              <p className="ticket__price">Paid</p>
              <h3 className="t-display ticket__name">CELPIP</h3>
              <p className="ticket__d">High stakes and tied directly to permanent residence, so it’s where people most want better preparation.</p>
            </article>
          </div>
          <svg className="wedge__wires" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
            <path className="wedge__wire" d="M250 0 C 250 70, 500 50, 500 120" />
            <path className="wedge__wire" d="M750 0 C 750 70, 500 50, 500 120" />
          </svg>
          <div className="engine">
            <p className="engine__label">One shared engine</p>
            <ul className="engine__parts">
              {['Lessons', 'Flashcards', 'Mock exams', 'Integrity mode', 'Readiness score'].map(p => <li key={p} className="engine__part">{p}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Onboarding: a sticky phone with scroll-swapped screens ─────────── */
const setup = [
  { src: brainbox.welcome, t: 'Pick the exams that matter', d: 'CELPIP, the G1 driving test and the citizenship test sit side by side from the first screen.' },
  { src: brainbox.plan, t: 'Set a date, get a plan', d: 'The test date and target score turn into a countdown and a daily plan: about 30 minutes a day, with a full mock every weekend.' },
  { src: brainbox.needs, t: 'Say how you study best', d: 'Focus mode, reading support and calm mode are chosen during setup, not buried in settings.' },
  { src: brainbox.home, t: 'Open the app to one clear task', d: 'Home leads with today’s lesson and how much is left, then the rest of the plan.' },
]

function Setup() {
  const ref = useRef<HTMLElement>(null)
  useGsap(() => {
    const root = ref.current!
    const q = gsap.utils.selector(root)
    const shots = q('.setup__shot') as HTMLElement[]
    const steps = q('.setup__step') as HTMLElement[]
    gsap.set(shots.slice(1), { autoAlpha: 0 })
    const calm = reducedMotion()
    if (calm) steps.forEach(s => s.classList.add('is-active'))
    let current = 0
    const show = (i: number) => {
      if (i === current) return
      const prev = current
      current = i
      if (calm) { gsap.set(shots[prev], { autoAlpha: 0 }); gsap.set(shots[i], { autoAlpha: 1 }); return }
      gsap.to(shots[prev], { autoAlpha: 0, yPercent: i > prev ? -6 : 6, duration: 0.5, ease: 'power2.inOut' })
      gsap.fromTo(shots[i], { autoAlpha: 0, yPercent: i > prev ? 6 : -6 }, { autoAlpha: 1, yPercent: 0, duration: 0.6, ease: 'expo.out' })
      steps.forEach((s, j) => s.classList.toggle('is-active', j === i))
    }
    if (!calm) steps[0].classList.add('is-active')
    steps.forEach((s, i) => ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: self => { if (self.isActive) show(i) } }))
  }, [], ref)

  return (
    <section ref={ref} className="case-sec setup" data-chapter="setup" data-label="Getting started" aria-labelledby="bs-title">
      <div className="wrap">
        <Head id="bs-title" k="Getting started" title="Three questions, then a plan" />
        <div className="setup__grid">
          <ol className="setup__steps">
            {setup.map((s, i) => (
              <li key={s.t} className="setup__step">
                <span className="t-stencil setup__n">{i + 1}</span>
                <h3 className="setup__t">{s.t}</h3>
                <p className="setup__d">{s.d}</p>
                <IPhone className="setup__inline" src={s.src} alt={s.t} statusBar={false} width="min(64vw, 280px)" finish="black" />
              </li>
            ))}
          </ol>
          <div className="setup__stick" aria-hidden="true">
            <IPhone alt="" statusBar={false} width="var(--setup-phone)" finish="black" depth>
              {setup.map(s => <img key={s.t} className="setup__shot" src={s.src} alt="" />)}
            </IPhone>
          </div>
        </div>
      </div>
    </section>
  )
}


/* ─── Integrity mode ─────────────────────────────────────────────────── */
function Integrity() {
  const ref = useRef<HTMLElement>(null)
  useGsap(() => {
    const root = ref.current!
    const q = gsap.utils.selector(root)
    const clock = q('.report__clock')[0] as HTMLElement
    const marks = q('.report__marks')[0] as HTMLElement
    const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
    const state = { t: 0 }
    const render = () => {
      // Ten-minute mock; the learner leaves the app from 4:12 to 5:00.
      const t = state.t
      clock.textContent = fmt(Math.max(0, 600 - t))
      const away = Math.max(0, Math.min(t, 300) - 252)
      marks.textContent = away > 3 ? `−${Math.ceil(away / 60) * 5} marks` : 'No time away'
      root.classList.toggle('is-away', t > 252 && t < 300)
    }
    if (reducedMotion()) { state.t = 600; render(); gsap.set(q('.report__fill, .report__away'), { scaleX: 1 }); root.classList.add('is-done'); return }
    render()
    const tl = gsap.timeline({ scrollTrigger: { trigger: q('.integrity__stage')[0], start: 'top 65%', end: 'bottom 40%', scrub: 0.6 }, defaults: { ease: 'none' } })
    tl.to(state, { t: 600, duration: 1, onUpdate: render }, 0)
      .fromTo(q('.report__fill'), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
      .fromTo(q('.report__away'), { scaleX: 0 }, { scaleX: 1, duration: 0.08 }, 0.42)
      .fromTo(q('.report__flag'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.5)
      .to(q('.integrity__phone .integrity__alert'), { autoAlpha: 1, duration: 0.04 }, 0.42)
      .to(q('.integrity__phone .integrity__alert'), { autoAlpha: 0, duration: 0.04 }, 0.52)
      .add(() => {}, 1)
  }, [], ref)

  return (
    <section ref={ref} className="integrity" data-chapter="integrity" data-label="Integrity mode" aria-labelledby="bi-title">
      <div className="wrap">
        <div className="integrity__head">
          <p className="t-label integrity__k">The headline feature</p>
          <h2 id="bi-title" className="t-display integrity__title">Integrity mode</h2>
          <p className="t-lead integrity__lead">A readiness score is only worth something if the conditions match the real exam. During a full mock, leaving the app is detected, costs marks for the time away, and shows up in a report at the end. That’s what makes “you’d pass today” believable.</p>
        </div>
        <div className="integrity__stage">
          <div className="integrity__phones">
            <IPhone className="integrity__rules" src={brainbox.mock} alt="Mock test rules shown before it starts" statusBar={false} width="var(--int-phone)" finish="black" />
            <IPhone className="integrity__phone" src={brainbox.question} alt="A mock test question in integrity mode" statusBar={false} width="var(--int-phone)" finish="black">
              <span className="integrity__alert" aria-hidden="true">Timer still running. Come back to keep your marks.</span>
            </IPhone>
          </div>
          <figure className="report" aria-label="Illustration: a ten-minute mock where the learner left the app for 48 seconds">
            <figcaption className="report__title">Integrity report</figcaption>
            <div className="report__row">
              <span className="report__clock t-stencil">10:00</span>
              <span className="report__marks">No time away</span>
            </div>
            <div className="report__bar">
              <span className="report__fill" />
              <span className="report__away" />
              <span className="report__flag">Left the app at 4:12</span>
            </div>
            <ul className="report__rules">
              <li>Rules are shown before the mock starts.</li>
              <li>Each minute outside the app costs 5 marks, and the timer keeps running.</li>
              <li>Interruptions under 3 seconds don’t count.</li>
            </ul>
          </figure>
        </div>
      </div>
    </section>
  )
}

/* ─── Accessibility: a live demo ─────────────────────────────────────── */
function Access() {
  const [focus, setFocus] = useState(false)
  const [reading, setReading] = useState(true)
  const [calm, setCalm] = useState(false)
  const ref = useRise('.access__card')
  const modes = [
    { k: 'focus', on: focus, set: setFocus, t: 'Focus mode', who: 'ADHD', d: 'Shorter sessions, more breaks, progress on every task.' },
    { k: 'reading', on: reading, set: setReading, t: 'Reading support', who: 'Dyslexia', d: 'Larger text with extra letter and line spacing.' },
    { k: 'calm', on: calm, set: setCalm, t: 'Calm mode', who: 'Autism', d: 'Reduced motion, predictable layouts, no surprise sounds.' },
  ]
  return (
    <section ref={ref} className="case-sec access" data-chapter="access" data-label="Accessibility" aria-labelledby="bac-title">
      <div className="wrap">
        <Head id="bac-title" k="Accessibility" title="Asked at onboarding, not buried in settings">
          The people who need these modes most are the least likely to dig through settings to find them. Asking up front also tells every learner the app was built with them in mind. Try them here.
        </Head>
        <div className="access__grid">
          <div className="access__modes" role="group" aria-label="Study modes">
            {modes.map(m => (
              <button key={m.k} type="button" className={`access__card${m.on ? ' is-on' : ''}`} aria-pressed={m.on} onClick={() => m.set(!m.on)}>
                <span className="access__toggle" aria-hidden="true"><span /></span>
                <span className="access__t">{m.t}<em>{m.who}</em></span>
                <span className="access__d">{m.d}</span>
              </button>
            ))}
          </div>
          <div className={`sample${focus ? ' is-focus' : ''}${reading ? ' is-reading' : ''}${calm ? ' is-calm' : ''}`}>
            <div className="sample__top">
              <span className="sample__pill">Reading · question 1 of 5</span>
              <span className="sample__dot" aria-hidden="true" />
            </div>
            <p className="sample__notice">Starting November 3, the pool will close at 8 p.m. on weekdays for maintenance. Weekend hours stay the same. Members with evening swim passes can switch to a morning pass at no extra cost.</p>
            <p className="sample__q">What can evening pass holders do?</p>
            <div className="sample__progress" aria-hidden="true">
              {[0, 1, 2, 3, 4].map(i => <span key={i} className={i < 2 ? 'is-done' : ''} />)}
            </div>
            <p className="sample__hint">{focus ? 'Two of five done. A short break is coming up.' : calm ? 'Nothing on this screen will move or make a sound.' : 'Text adjusts as you switch modes.'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Features ───────────────────────────────────────────────────────── */
const features = [
  ['Onboarding and study plan', 'Pick an exam and a test date to get a plan and countdown. Choose accessibility needs up front, then a short diagnostic sets the starting level.'],
  ['Learning content', 'Bite-sized lessons for each exam section, a summarized G1 handbook, and curated videos for each topic.'],
  ['Flashcards', 'Spaced repetition so weak cards come back more often, plus streaks, timed rounds and match-the-pairs.'],
  ['Practice and mock exams', 'Topic quizzes and full-length timed mocks that mirror the real format, with explanations and a readiness score.'],
  ['Integrity mode', 'Leaving the app during a full mock is detected and costs marks. A report shows any time away.'],
  ['Voice AI', 'Spoken quizzing, and CELPIP Speaking mocks graded on fluency, vocabulary and structure, with a full transcript.'],
  ['Focus sessions', 'A Pomodoro-style timer with focus lockdown, XP, badges, unlockable themes and daily streaks.'],
  ['Accessibility modes', 'Dyslexia-friendly type and spacing, ADHD and calm modes, focus sounds, text-to-speech and reduced motion.'],
  ['Study buddies', 'Pair up for the same exam with a shared countdown and streak. Scores are private by default, with a cooperative-only mode.'],
]

function Features() {
  const ref = useRef<HTMLElement>(null)
  useGsap(() => {
    const root = ref.current!
    if (reducedMotion()) return
    const q = gsap.utils.selector(root)
    gsap.fromTo(q('.features__phone--a'), { yPercent: 14, rotate: -4 }, { yPercent: -10, rotate: -8, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } })
    gsap.fromTo(q('.features__phone--b'), { yPercent: 30, rotate: 6 }, { yPercent: -18, rotate: 9, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } })
    q('.feature').forEach((f: Element) => gsap.from(f, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 92%', once: true } }))
  }, [], ref)
  return (
    <section ref={ref} className="case-sec case-sec--tint features" data-chapter="features" data-label="The MVP" aria-labelledby="bf-title">
      <div className="wrap features__grid">
        <div>
          <Head id="bf-title" k="The MVP" title="Everything the first version does" />
          <div className="features__phones" aria-hidden="true">
            <IPhone className="features__phone--a" src={brainbox.learn} alt="" statusBar={false} width="var(--feat-phone)" finish="black" />
            <IPhone className="features__phone--b" src={brainbox.practice} alt="" statusBar={false} width="var(--feat-phone)" finish="black" />
          </div>
        </div>
        <ul className="feature-list">
          {features.map(([t, d]) => (
            <li key={t} className="feature"><h3 className="feature__t">{t}</h3><p className="feature__d">{d}</p></li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ─── Roadmap ────────────────────────────────────────────────────────── */
const roadmap = [
  { t: 'MVP', h: 'Prove the engine on two exams', items: ['CELPIP and Ontario G1', 'All core features above', 'Integrity mode and voice AI speaking mocks'], why: 'Prove the engine and the differentiators on two exams before spreading thin.' },
  { t: 'Phase 2', h: 'More exams, deeper features', items: ['IELTS General, TEF and TCF Canada, the citizenship test', 'Upload your own material', 'AI-graded writing and head-to-head duels', 'A multilingual interface'], why: 'Reuse the same engine for more exams, and add features that need more content or users.' },
  { t: 'Later', h: 'Beyond newcomer exams', items: ['Academic mode and institutions', 'A learning feed and community library', 'UK and European exams, professional certifications'], why: 'These build on a proven product and an existing user base.' },
]

function Roadmap() {
  const ref = useRef<HTMLElement>(null)
  useGsap(() => {
    const root = ref.current!
    if (reducedMotion()) return
    gsap.fromTo(root.querySelector('.road__line span'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.querySelector('.road'), start: 'top 75%', end: 'bottom 60%', scrub: true } })
    gsap.utils.toArray<HTMLElement>('.road__stop', root).forEach((s, i) => gsap.from(s, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', delay: i * 0.08, scrollTrigger: { trigger: root.querySelector('.road'), start: 'top 75%', once: true } }))
  }, [], ref)
  return (
    <section ref={ref} className="case-sec roadmap" data-chapter="roadmap" data-label="Roadmap" aria-labelledby="br-title">
      <div className="wrap">
        <Head id="br-title" k="Roadmap" title="Narrow first, without boxing the product in" />
        <div className="road">
          <div className="road__line" aria-hidden="true"><span /></div>
          <ol className="road__stops">
            {roadmap.map((r, i) => (
              <li key={r.t} className="road__stop">
                <span className="road__dot" aria-hidden="true" />
                <p className="road__phase"><span className="t-stencil">{i + 1}</span>{r.t}</p>
                <h3 className="road__h">{r.h}</h3>
                <ul className="road__items">{r.items.map(it => <li key={it}>{it}</li>)}</ul>
                <p className="road__why">{r.why}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ─── Decisions and guardrails ───────────────────────────────────────── */
const decisions = [
  { t: 'Integrity mode as the headline feature', d: 'Full mocks run in a locked mode, because a readiness score only means something when the conditions match the real exam.' },
  { t: 'Accessibility at onboarding', d: 'Learners pick their needs during setup and can change them anytime, instead of hunting through settings.' },
  { t: 'Free where the stakes are civic, paid where they’re higher', d: 'Driving and citizenship prep stays generous or free. Language exams and certifications are paid, through a subscription, a one-time exam pass or AI credit packs. Basic preparation never sits behind a paywall.' },
  { t: 'Compete on what’s unique, not on parity', d: 'A newcomer product won’t win a feature race against established single-exam apps. It can win by being the only one that does four things together: integrity mode, voice AI, accessibility and many exams in one app.' },
]
const guardrails: [string, string][] = [
  ['Platform limits', 'iOS only allows app blocking through Apple’s Screen Time API, so focus lockdown works within that rather than taking over the phone.'],
  ['Content rights', 'Outside material is linked or embedded, never copied and redistributed.'],
  ['Community uploads', 'Shared decks and notes are rated and moderated to remove copyrighted material.'],
  ['Privacy and pressure', 'Scores are private by default, and competition is always optional.'],
]

function Decisions() {
  const ref = useRise('.bb-dec, .guard-row')
  return (
    <section ref={ref} className="case-sec bb-decisions" data-chapter="decisions" data-label="Key decisions" aria-labelledby="bd-title">
      <div className="wrap">
        <Head id="bd-title" k="Key decisions" title="The calls that shape the product" />
        <div className="bb-decs">
          {decisions.map(d => (
            <article key={d.t} className="bb-dec">
              <h3 className="bb-dec__t">{d.t}</h3>
              <p className="bb-dec__d">{d.d}</p>
            </article>
          ))}
        </div>
        <div className="guards">
          <h3 className="t-display guards__title">What it won’t do</h3>
          <p className="guards__intro">Some of the most important decisions are about limits. These were set early so they shape the design instead of being patched in later.</p>
          <ul className="guards__list">
            {guardrails.map(([k, v]) => <li key={k} className="guard-row"><span className="guard-row__k">{k}</span><span className="guard-row__v">{v}</span></li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ─── Metrics and status ─────────────────────────────────────────────── */
const supporting = [
  'Onboarding completed with an exam and test date set',
  'Diagnostic quiz completion rate',
  'Weekly active learners',
  'Full mocks completed in integrity mode',
  'Exam pass and AI credit pack purchases',
  'Readiness score compared with the real result learners report',
  'Mocks abandoned after a penalty',
]

function Metrics() {
  const ref = useRise('.bb-metric')
  return (
    <section ref={ref} className="case-sec case-sec--tint bb-metrics" data-chapter="metrics" data-label="Measuring it" aria-labelledby="bm-title">
      <div className="wrap">
        <Head id="bm-title" k="Measuring it" title="One number that matters most">
          Brain Box is pre-launch, so these are the measures the MVP is designed to track, not results.
        </Head>
        <div className="north">
          <p className="north__k">North star</p>
          <p className="t-display north__m">Learners who reach “ready” before their test date</p>
          <p className="north__d">It ties engagement to the outcome people actually came for. Lessons and streaks only matter if they lead to a readiness score the learner can trust on test day.</p>
        </div>
        <ul className="bb-metric-list">
          {supporting.map(m => <li key={m} className="bb-metric">{m}</li>)}
        </ul>
        <div className="bb-status">
          <h3 className="t-display bb-status__title">Where it stands</h3>
          <Facts items={[
            ['Feature scope and roadmap', 'Defined: MVP, Phase 2 and later'],
            ['Business model', 'Defined: subscription, exam pass, AI credits, and licences for institutions'],
            ['Interactive prototype', 'Built: onboarding, the daily study home and integrity-mode mock tests'],
          ]} />
        </div>
      </div>
    </section>
  )
}

export default function BrainBox() {
  useTitle('Brain Box case study', 'Brain Box: an accessible exam-prep app for newcomers, with integrity-mode mock tests for CELPIP and the Ontario G1.')
  return (
    <div className="case case--brainbox">
      <Hero />
      <Problem />
      <div className="wrap bb-insight">
        <ScrubWords className="insight__text">Newcomers don’t need another quiz app. They need practice that tells them the truth about whether they’re ready, in an app that doesn’t fight how their mind works.</ScrubWords>
      </div>
      <Audiences />
      <Wedge />
      <Setup />
      <Integrity />
      <Access />
      <Features />
      <Roadmap />
      <Decisions />
      <Metrics />
      <NextCase to="/work/aerrand" name="AERRAND" theme="lilac" summary="Same-day delivery for Windsor, Ontario, built around trust. Live on the App Store and Google Play.">
        <IPhone src={aerrand.customer.home} alt="" statusBar={false} width="var(--next-phone)" finish="black" />
      </NextCase>
      <ChapterNav title="Brain Box" />
    </div>
  )
}
