import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, reducedMotion, useGsap } from '../../lib/motion'
import { useHeaderTone, useTitle } from '../../lib/hooks'
import { aerrand, brainbox } from '../../content/screens'
import { IPhone } from '../../components/devices'
import { FitText } from '../../components/FitText'
import { ScrubWords, useDoorOpen } from '../../components/text'
import { ChapterNav, Facts, Head, NextCase, useRise } from '../../components/Case'
import { site } from '../../content/site'
import { ArrowUpRight } from '../../components/icons'

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
            <p className="t-lead bh__lead">One app for the Ontario G1, the G2 road test and CELPIP. Practise in the real format, get feedback, then fix the weak spot.</p>
            <p className="bh__note">Brain Box is a working name.</p>
            {site.brainboxPrototype && <div className="stores__links"><a className="store store--outline" href={site.brainboxPrototype} target="_blank" rel="noreferrer"><span>Try the prototype</span><ArrowUpRight size={16} /></a></div>}
          </div>
          <div data-fade>
            <Facts items={[
              ['My role', 'Product designer'],
              ['Timeline', '2026 to now'],
              ['Exams built', 'Ontario G1, G2 road test and CELPIP'],
              ['Status', 'All three modules built. Pre-launch, with reviews and testing still to do.'],
            ]} />
          </div>
        </div>
      </div>
      <div className="bh__stage" aria-hidden="true">
        <div className="bh__glow" />
        <IPhone className="bh__phone bh__phone--l" src={brainbox.learn} alt="" statusBar={false} width="var(--bh-phone)" finish="black" loading="eager" />
        <IPhone className="bh__phone bh__phone--c" src={brainbox.home} alt="" statusBar={false} width="var(--bh-phone)" finish="black" loading="eager" />
        <IPhone className="bh__phone bh__phone--r" src={brainbox.question} alt="" statusBar={false} width="var(--bh-phone)" finish="black" loading="eager" />
      </div>
    </section>
  )
}

/* ─── Problem ────────────────────────────────────────────────────────── */
const problems = [
  { t: 'People piece their prep together.', d: 'Studying for the G1, the G2 road test or CELPIP usually means a mix of PDFs, random practice sites and YouTube.' },
  { t: 'Practice rarely matches the real test.', d: 'Few tools let people practise in the real format, with the real timing and the real pass rules.' },
  { t: 'Nothing says what to fix.', d: 'A score on its own doesn’t tell anyone which skill is holding them back, especially for CELPIP writing and speaking.' },
  { t: 'No one guides the passenger.', d: 'For the road test, the person supervising a practice drive has nothing telling them what to say or what to watch for.' },
]

function Problem() {
  const ref = useRise('.problem')
  return (
    <section ref={ref} className="case-sec" data-chapter="problem" data-label="The problem" aria-labelledby="bp-title">
      <div className="wrap split">
        <div className="split__side">
          <Head id="bp-title" k="The problem" title="Scattered prep, no feedback" />
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
          The launch pairs the Ontario G1 test, free, with the G2 road test and CELPIP as paid passes. All three run on the same engine, so every exam added later reuses what’s already built.
        </Head>
        <div className="wedge__art">
          <div className="tickets">
            <article className="ticket ticket--g1">
              <p className="ticket__price">Free</p>
              <h3 className="t-display ticket__name">Ontario G1</h3>
              <p className="ticket__d">Free, so anyone can start with the written test.</p>
            </article>
            <article className="ticket ticket--celpip">
              <p className="ticket__price">Paid</p>
              <h3 className="t-display ticket__name">CELPIP</h3>
              <p className="ticket__d">A paid pass with AI marking for writing and speaking. The G2 road test is a paid pass too.</p>
            </article>
          </div>
          <svg className="wedge__wires" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
            <path className="wedge__wire" d="M250 0 C 250 70, 500 50, 500 120" />
            <path className="wedge__wire" d="M750 0 C 750 70, 500 50, 500 120" />
          </svg>
          <div className="engine">
            <p className="engine__label">One shared engine</p>
            <ul className="engine__parts">
              {['Lessons', 'Flashcards', 'Mock tests', 'AI feedback', 'Competitive mode'].map(p => <li key={p} className="engine__part">{p}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Modules: what's built ──────────────────────────────────────────── */
const modules = [
  { when: 'Ontario G1 · Free', who: 'The written knowledge test', about: 'It started as 47 signs drawn from memory, which I rated 5 out of 10. Now it has 121 signs redrawn against the MTO handbook, 249 original questions, a 7-unit course and a mock that marks the way the real test does.', facts: [['Pass rule', '16 of 20 needed on each section'], ['Flashcards', '246, with sign pictures and spaced repetition'], ['Self-rated', '9 out of 10, waiting on instructor review and a real phone test']] as [string, string][] },
  { when: 'G2 road test · Paid pass', who: 'The practice drive', about: 'It started as a study course with the drive buried as one tile, so the passenger faced 58 items at once. Now the phone runs the drive out loud in road order, and the passenger marks it only at natural stops.', facts: [['Instructions', '19 in 7 sections, in road order'], ['Score sheet', '88 items from the MTO handbook, plus approved driving-school additions'], ['Fact checks', '34 claims checked, 10 partly checked, 1 still open']] as [string, string][] },
  { when: 'CELPIP · Paid pass', who: 'All four skills, with AI feedback', about: 'It started as one reading unit and two speaking tasks, which I rated 2 out of 10. Now it covers all four skills in the real format, with a full 3-hour practice test and AI marking for writing and speaking.', facts: [['Content', '114 reading and 114 listening questions, 20 writing and 32 speaking prompts'], ['Vocabulary', '127 cards with examples, audio and a Type it mode'], ['Scores', 'A likely CLB range, with a test-day note']] as [string, string][] },
]

function Modules() {
  const ref = useRise('.bb-aud')
  return (
    <section ref={ref} className="case-sec" data-chapter="modules" data-label="What’s built" aria-labelledby="bmod-title">
      <div className="wrap">
        <Head id="bmod-title" k="What’s built" title="Three modules, one engine">
          The loop comes from how I passed CELPIP myself, with 13, 13, 11 and 12: practise every section, get feedback, then fix the weak spot. Every module follows it, and each one started smaller than it is now.
        </Head>
        <div className="bb-auds">
          {modules.map(m => (
            <article key={m.who} className="bb-aud">
              <p className="t-label bb-aud__when">{m.when}</p>
              <h3 className="t-display bb-aud__who">{m.who}</h3>
              <p className="bb-aud__about">{m.about}</p>
              <Facts items={m.facts} className="facts--stack" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How it was built ───────────────────────────────────────────────── */
const directed = [
  { t: 'I tested it the way a passenger or test-taker would', d: 'The G2 practice drive was buried as one tile, and taps were allowed while the car was moving. It became a drive in road order, marked only at natural stops. In CELPIP, the speaker button couldn’t be stopped and one voice read every speaker. Both were fixed.' },
  { t: 'I checked the content, not just the copy', d: 'I asked about one road sign, and it turned out to be made up, so it was removed with its question. Every G2 claim was checked against the handbook, and CELPIP sources were read before anything was used.' },
  { t: 'I made the cues short and action-first', d: 'Anything a driver hears while moving got shorter. “Check seat and mirrors” replaced wordy lines, “go straight through” became “go straight when it’s safe”, and an “Up next” screen fixed cues that were read too early.' },
  { t: 'I asked for honest ratings, then raised the bar', d: 'G1 went from 5 out of 10 to 9. G2 went from 7 to 8. CELPIP went from 2 to 7 in two days, before speaking feedback, the full practice test and the source check were added.' },
]

function Directed() {
  const ref = useRise('.bb-dec')
  return (
    <section ref={ref} className="case-sec case-sec--tint bb-directed" data-chapter="directed" data-label="How it was built" aria-labelledby="bdir-title">
      <div className="wrap">
        <Head id="bdir-title" k="How it was built" title="I owned the direction, not the code">
          I didn’t write the code. I owned the product: what got built, what was wrong with it, and what was allowed.
        </Head>
        <div className="bb-decs">
          {directed.map(d => (
            <article key={d.t} className="bb-dec">
              <h3 className="bb-dec__t">{d.t}</h3>
              <p className="bb-dec__d">{d.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Features ───────────────────────────────────────────────────────── */
const features = [
  ['Mock tests in the real format', 'The G1 mock marks like the real test, with 16 of 20 needed on each section. CELPIP has a full 3-hour practice test across all four skills.'],
  ['Lessons and skill cards', 'G1 has 7 units and 27 lessons. G2 has 17 short skill cards that support the drive. CELPIP has 15 legs and 34 lessons.'],
  ['Flashcards', 'Spaced repetition, with 246 G1 cards with sign pictures and CELPIP vocabulary with example sentences, audio and a Type it mode.'],
  ['AI marking', 'CELPIP writing and speaking are marked against the four rating areas and shown as a likely CLB range. The API key stays on the server.'],
  ['A spoken practice drive', 'The phone reads G2 instructions out loud in Coached or Mock mode, with voice on or off and a sound panel for voice, pace and speed.'],
  ['Pronunciation practice', 'Read a sentence aloud and see which words the phone understood.'],
  ['Focus sessions', 'A focus timer with focus sounds and a focus lock, plus match and speed-round games.'],
  ['Competitive mode', 'Friend call-outs, Brain Box taunts, daily duels, a weekly leaderboard and a head-to-head scoreboard for each friend.'],
  ['Accounts and friends', 'Real accounts and friends with Supabase, protected with row-level security.'],
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
          <Head id="bf-title" k="The MVP" title="Everything in the app today" />
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
  { t: 'Built', h: 'Three modules on one engine', items: ['Ontario G1, G2 road test and CELPIP', 'Competitive mode, accounts and friends', 'A web build of the whole app'], why: 'Everything here works today, with AI marking and accounts switched off in the demo.' },
  { t: 'Before launch', h: 'Checked by experts, tested for real', items: ['Content reviews by a CELPIP teacher and a licensed instructor', 'Natural voice recordings and the AI marking server', 'Real-phone testing and payments'], why: 'Launch is on hold for now. When it goes out, it goes to the web first to avoid app-store fees, then to the stores.' },
  { t: 'Later', h: 'More on the same drive system', items: ['GPS speed tracking on the practice drive', 'The G test, built on the G2 drive system', 'Road tests outside Ontario'], why: 'Each one reuses the practice drive that’s already built.' },
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
        <Head id="br-title" k="Roadmap" title="Built, then checked, then launched" />
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
  { t: 'G2 is a drive, not a course', d: 'The first version was a study course with the drive tucked away as one tile. I flipped it so the practice drive comes first and short skill cards support it.' },
  { t: 'Parallel parking stays required', d: 'Not every test centre checks it, but every driver should know how to do it, so it stays in the drive.' },
  { t: 'Scores show a range, never a promise', d: 'Results say things like “Likely CLB 7 to 8” or “You passed this mock”, with a note that test-day conditions can change the result.' },
  { t: 'The written test is free', d: 'G1 is free, and the G2 road test and CELPIP are paid passes.' },
]
const guardrails: [string, string][] = [
  ['Original content', 'Every question, passage and sign is original. Nothing is copied from official material or practice sites.'],
  ['Sources', 'Every internet source is reviewed by me before it’s used.'],
  ['API keys', 'No API key ships in the app. AI marking runs on a small server.'],
  ['Expert review', 'A CELPIP teacher and a licensed instructor review the content before launch.'],
  ['Approval', 'Nothing goes live without my approval.'],
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
          <p className="guards__intro">These rules were set early, so they shaped the product instead of being patched in later.</p>
          <ul className="guards__list">
            {guardrails.map(([k, v]) => <li key={k} className="guard-row"><span className="guard-row__k">{k}</span><span className="guard-row__v">{v}</span></li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ─── Metrics and status ─────────────────────────────────────────────── */
function Metrics() {
  const ref = useRise('.bb-status')
  return (
    <section ref={ref} className="case-sec case-sec--tint bb-metrics" data-chapter="status" data-label="Status" aria-labelledby="bm-title">
      <div className="wrap">
        <Head id="bm-title" k="Status" title="Where it stands" />
        <div className="bb-status">
          <Facts items={[
                        ['Business model', 'Defined: G1 free, G2 and CELPIP as paid passes, with a web launch before the app stores'],
            ['Built', 'G1, G2 road test and CELPIP modules, competitive mode, accounts and a web build'],
            ['Before launch', 'Expert content reviews, natural voice recordings, the AI marking server, real-phone testing and payments'],
          ]} />
        </div>
      </div>
    </section>
  )
}

export default function BrainBox() {
  useTitle('Brain Box case study', 'Brain Box: a study app for the Ontario G1, the G2 road test and CELPIP, with real-format mock tests and AI feedback.')
  return (
    <div className="case case--brainbox">
      <Hero />
      <Problem />
      <div className="wrap bb-insight">
        <ScrubWords className="insight__text">Practise in the real format, get feedback, fix the weak spot. That’s how I passed CELPIP, and it’s the loop the whole app is built on.</ScrubWords>
      </div>
      <Wedge />
      <Modules />
      <Directed />
      <Features />
      <Roadmap />
      <Decisions />
      <Metrics />
      <NextCase to="/work/aerrand" name="Aerrand" theme="lilac" summary="Same-day delivery for Windsor, Ontario, built around trust. Live on the App Store and Google Play.">
        <IPhone src={aerrand.customer.home} alt="" statusBar={false} width="var(--next-phone)" finish="black" />
      </NextCase>
      <ChapterNav title="Brain Box" />
    </div>
  )
}
