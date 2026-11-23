import { useRef, useState } from 'react'
import { gsap, reducedMotion, useGsap } from '../../lib/motion'
import { useTitle } from '../../lib/hooks'
import { site, SHOW_TODOS } from '../../content/site'
import { aerrand, brainbox } from '../../content/screens'
import { IPhone, Laptop, Browser } from '../../components/devices'
import { FitText } from '../../components/FitText'
import { RevealLines, ScrubWords, useDoorOpen } from '../../components/text'
import { ChapterNav, Facts, Head, NextCase, useRise } from '../../components/Case'
import { Ecosystem } from '../../components/Ecosystem'
import { Apple, Play } from '../../components/icons'

/* ─── Hero ───────────────────────────────────────────────────────────── */
function Hero() {
  const ref = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)

  useGsap(() => {
    const root = ref.current!
    if (reducedMotion()) return
    const q = gsap.utils.selector(root)
    const tl = gsap.timeline({ paused: true })
    tl.from(q('.ah__title .fit > span'), { yPercent: 100, duration: 1.3, ease: 'expo.out' })
      .from(q('[data-fade]'), { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07 }, 0.3)
      .from(q('.ah__laptop'), { y: 120, rotateX: 28, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0.25)
      .from(q('.ah__phone--a'), { x: -60, y: 140, rotate: -14, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0.4)
      .from(q('.ah__phone--b'), { x: 60, y: 160, rotate: 14, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0.5)
    intro.current = tl

    // Scrolling out: the laptop opens up toward you while the phones step aside.
    const out = gsap.timeline({ scrollTrigger: { trigger: q('.ah__stage')[0], start: 'top 70%', end: 'bottom top', scrub: true } })
    out.fromTo(q('.ah__laptop'), { rotateX: 14, scale: 0.94 }, { rotateX: 0, scale: 1.04, ease: 'none' }, 0)
      .fromTo(q('.ah__phone--a'), { rotateY: 18, rotateZ: -4 }, { rotateY: -8, rotateZ: -9, xPercent: -26, yPercent: -10, ease: 'none' }, 0)
      .fromTo(q('.ah__phone--b'), { rotateY: -18, rotateZ: 4 }, { rotateY: 8, rotateZ: 9, xPercent: 26, yPercent: -16, ease: 'none' }, 0)
  }, [], ref)
  useDoorOpen(() => intro.current?.play())

  return (
    <section ref={ref} className="ah" data-chapter="overview" data-label="Overview" aria-labelledby="ah-title">
      <div className="wrap ah__top">
        <div className="ah__meta" data-fade>
          <img src={aerrand.icon} alt="" width={48} height={48} className="ah__icon" />
          <p className="t-label">Case study: local delivery</p>
        </div>
        <h1 id="ah-title" className="t-display ah__title" aria-label="Aerrand">
          <FitText max={420}><span className="ah__line" aria-hidden="true">Aerrand</span></FitText>
        </h1>
        <div className="ah__intro">
          <p className="t-lead ah__lead" data-fade>Same-day delivery for Windsor, Ontario, built around trust. Five connected surfaces for customers, Aerranders, businesses and the team that runs it. In beta on the App Store and Google Play since August 2026. A pilot of 100+ deliveries showed us what to fix, and the 2.0 redesign is now live.</p>
          <div data-fade>
            <Facts items={[
              ['My role', 'Product manager and product designer. I lead the product, design it and build it.'],
              ['Team', 'A small team, with John Paul Sani and Victoria Ikpeze'],
              ['Timeline', '2025 to now'],
              ['Platforms', 'iOS, Android and web'],
              ['Status', 'In beta on the App Store and Google Play since August 2026. 2.0 is live. Public launch next.'],
            ]} />
            <StoreLinks />
          </div>
        </div>
      </div>
      <div className="ah__stage" aria-hidden="true">
        <div className="ah__laptop"><Laptop src={aerrand.admin} alt="" /></div>
        <IPhone className="ah__phone ah__phone--a" src={aerrand.customer.home} alt="" statusBar={false} finish="black" depth width="var(--ah-phone)" loading="eager" />
        <IPhone className="ah__phone ah__phone--b" src={aerrand.aerrander.home} alt="" statusBar={false} finish="natural" depth width="var(--ah-phone)" loading="eager" />
      </div>
      <p className="wrap ah__caption t-small">The 2.0 customer app, the Aerrander app and the admin dashboard.</p>
    </section>
  )
}

function StoreLinks() {
  const apps = [
    { name: 'Aerrand', note: 'Customer app', ios: site.aerrandAppStore, android: site.aerrandGooglePlay },
    { name: 'Aerrander', note: 'Driver app', ios: site.aerranderAppStore, android: site.aerranderGooglePlay },
  ].filter(a => a.ios || a.android)
  if (!apps.length) return SHOW_TODOS ? <p className="todo">Add the App Store and Google Play links in src/content/site.ts</p> : null
  return (
    <div className="stores">
      {apps.map(a => (
        <div key={a.name} className="stores__app">
          <p className="stores__name">{a.name}<span>{a.note}</span></p>
          <div className="stores__links">
            {a.ios && <a href={a.ios} className="store" target="_blank" rel="noreferrer" aria-label={`${a.name} on the App Store`}><Apple size={17} /><span>App Store</span></a>}
            {a.android && <a href={a.android} className="store" target="_blank" rel="noreferrer" aria-label={`${a.name} on Google Play`}><Play size={16} /><span>Google Play</span></a>}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Beta so far ────────────────────────────────────────────────────── */
const betaStats: { n: number; plus: boolean; about?: boolean; label: string }[] = [
  { n: 100, plus: true, label: 'deliveries in the pilot' },
  { n: 100, plus: true, label: 'Aerranders signed up, with documents being reviewed' },
  { n: 20, plus: false, label: 'Aerrand Guard deliveries in the pilot' },
  { n: 4, plus: true, label: 'businesses onboarded in the beta' },
]

function Beta() {
  const ref = useRise('.beta__stat')
  return (
    <section ref={ref} className="beta" data-chapter="beta" data-label="Beta so far" aria-labelledby="beta-title">
      <div className="wrap">
        <div className="beta__head">
          <p className="t-label beta__k">Beta so far</p>
          <h2 id="beta-title" className="t-display beta__title">On the stores since August 2026</h2>
          <p className="beta__note">We’re in beta while we finish marketing for the public launch, so these are pilot and beta numbers, not growth numbers.</p>
        </div>
        <dl className="beta__stats">
          {betaStats.map(s => (
            <div key={s.label} className="beta__stat">
              <dt>{s.label}</dt>
              <dd className="t-stencil">{s.about ? '~' : ''}{s.n}{s.plus ? '+' : ''}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ─── Research ───────────────────────────────────────────────────────── */
const learned = [
  { t: 'Newcomers can’t get things home.', d: 'In their first years in Canada, a lot of people, especially immigrants and students, don’t have a car. Marketplace is full of things they need, but there’s no easy way to get them home, especially through a long, cold winter. I’ve been in Canada for two years and haven’t bought anything on Marketplace for the same reason.' },
  { t: 'Checking an item is a wasted trip.', d: 'Going across town to see an item, only to find it isn’t what was listed, is the part people hated most. With AI-generated and edited photos, a listing can look perfect and still be wrong.' },
  { t: 'Nobody offers a trust layer.', d: 'We looked at Uber’s courier service and other delivery apps: what they cover and what they don’t. They move the item, but none of them checks it. That gap became Aerrand Guard.' },
  { t: 'Second-hand is growing.', d: 'More people buy used, but delivery tools are still built for stores and restaurants, not for two strangers trading on Marketplace.' },
]

function Research() {
  const ref = useRise('.problem')
  return (
    <section ref={ref} className="case-sec" data-chapter="research" data-label="Research" aria-labelledby="rs-title">
      <div className="wrap split">
        <div className="split__side">
          <Head id="rs-title" k="Research" title="We asked students first">
            Before designing anything, we ran a survey for University of Windsor students, shared through student unions, student groups and engineering group chats. We asked whether they’d use a service like this and how they’d want it to work.
          </Head>
          <div className="rs-stat">
            <p className="t-stencil rs-stat__n">55<span>/72</span></p>
            <p className="rs-stat__l">students said they’d skipped buying something because they had no way to get it home.</p>
          </div>
        </div>
        <ol className="problems">
          {learned.map(p => (
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

/* ─── The pilot ──────────────────────────────────────────────────────── */
const findings = [
  { saw: 'About 30% of people who started booking didn’t finish. We were also collecting more than before, like item details and the Guard checklist, and each new detail had its own screen.', did: 'Related details are now collected together instead of one per screen, and everything comes back to one summary page. Tapping pickup, drop-off or the item opens it in an overlay to edit, then drops you back.' },
  { saw: 'People couldn’t find Aerrand Guard, or tell it apart from a regular delivery. It was one tile among several.', did: 'A two-way switch at the top of Home, Aerrand or Aerrand Guard, plus short explanations across the app of what each thing does.' },
  { saw: 'Aerranders didn’t know what to check when they picked an item up.', did: 'A Guard checklist built from what the buyer asked for, with a photo per item. Buyers who aren’t sure what to ask for get a checklist drafted by AI that they edit in a few taps.' },
  { saw: 'The pilot was Windsor only, but an Aerrander in Brantford, two cities away, was able to accept a Windsor delivery.', did: 'Proper geofencing, so a job only goes to Aerranders who can actually reach it.' },
  { saw: 'On the first deliveries, routing in the Aerrander app wasn’t accurate.', did: 'We rebuilt routing on the Google Maps API, set up properly this time.' },
  { saw: 'When a job came in, Aerranders only saw a summary.', did: 'They can open the full aerrand details before deciding to accept.' },
  { saw: 'Home showed tiles for services that weren’t ready yet.', did: 'We took them off until they launch. A button that leads nowhere costs trust.' },
  { saw: 'Businesses send in batches, not one delivery at a time.', did: 'Businesses can book up to 10 aerrands at once.' },
]

function Pilot() {
  const ref = useRise('.finding')
  return (
    <section ref={ref} className="case-sec case-sec--tint" data-chapter="pilot" data-label="The pilot" aria-labelledby="pl-title">
      <div className="wrap">
        <Head id="pl-title" k="The pilot" title="100+ deliveries, and what they taught us">
          We ran a pilot in Windsor with 15 Aerranders. Every delivery was completed, about 20 of them with Aerrand Guard. The pilot also showed us exactly where 1.0 was letting people down, and each finding below became part of 2.0.
        </Head>
        <div className="pl-quotes">
          <figure className="pl-quote">
            <blockquote className="t-display">“I never knew how much I needed this.”</blockquote>
            <figcaption>Jeremiah, during the pilot</figcaption>
          </figure>
          <figure className="pl-quote pl-quote--alt">
            <blockquote>“Everything went smoothly. I’ll definitely leave a review. Wishing you guys success with Aerrand!”</blockquote>
            <figcaption>A Facebook Marketplace seller after a pilot delivery, shared with permission</figcaption>
          </figure>
        </div>
        <div className="findings" role="table" aria-label="What we saw in the pilot and what we changed">
          <div className="finding finding--head" role="row">
            <span role="columnheader">What we saw</span><span role="columnheader">What we changed</span>
          </div>
          {findings.map(f => (
            <div key={f.saw} className="finding" role="row">
              <span role="cell" className="finding__saw">{f.saw}</span>
              <span role="cell" className="finding__did">{f.did}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Problem ────────────────────────────────────────────────────────── */
const problems = [
  { t: 'Customers lose sight of their delivery.', d: 'Once an order is placed, communication collapses. People call, wait and hope. The experience ends at checkout and only starts again when something goes wrong.' },
  { t: 'Drivers work without real tools.', d: 'Most driver software is a list of jobs and a phone number. No help with routes, no support when a delivery goes wrong, nothing that makes the job easier.' },
  { t: 'Businesses can’t see what’s happening.', d: 'Operators run deliveries through spreadsheets, calls and late reports. There’s no live view and no alerts connecting a business to its own deliveries.' },
  { t: 'Buying from a stranger is a gamble.', d: 'People buying second-hand online either pay first and hope the item matches, or meet a stranger to check it themselves. Delivery services move the item but take no part in whether it was the right one.' },
]

function Problem() {
  const ref = useRise('.problem')
  return (
    <section ref={ref} className="case-sec" data-chapter="problem" data-label="The problem" aria-labelledby="problem-title">
      <div className="wrap split">
        <div className="split__side">
          <Head id="problem-title" k="The problem" title="Four places trust breaks down" />
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
      <div className="wrap insight">
        <ScrubWords className="insight__text">The gap in the market isn’t speed. It’s trust. The big platforms have optimized for volume, speed and coverage. None of them made trust the product, and that’s the opening Aerrand is built for.</ScrubWords>
      </div>
    </section>
  )
}

/* ─── Audiences ──────────────────────────────────────────────────────── */
const audiences = [
  { who: 'Customers', job: 'Get it there today, without babysitting it.', about: 'People sending or receiving something across town who need it the same day.', need: 'Live status they can trust, and a way to check an item before paying for it.', risk: 'Customers will choose a delivery service for trust and visibility, not only price.', img: aerrand.customer.home, kind: 'phone' as const },
  { who: 'Aerranders', job: 'Finish more aerrands per shift, with fewer surprises.', about: 'Independent drivers whose earnings depend on how smoothly each job goes.', need: 'Clear instructions, good routing and support when something goes wrong.', risk: 'Better tools and support keep Aerranders on the platform longer.', img: aerrand.aerrander.earnings, kind: 'phone' as const },
  { who: 'Businesses', job: 'Know what’s happening without picking up the phone.', about: 'Local businesses that send deliveries regularly and answer to their own customers.', need: 'A live view of every delivery, alerts and history.', risk: 'Small businesses will pay for visibility and recurring scheduling.', img: aerrand.business, kind: 'browser' as const },
]

function Audiences() {
  const ref = useRise('.aud')
  return (
    <section ref={ref} className="case-sec case-sec--tint" data-chapter="audiences" data-label="Who it’s for" aria-labelledby="aud-title">
      <div className="wrap">
        <Head id="aud-title" k="Who it’s for" title="Three audiences, three different jobs">
          Each one comes with an assumption that has to hold for Aerrand to work. Those assumptions are what the first release is built to test.
        </Head>
        <div className="auds">
          {audiences.map(a => (
            <article key={a.who} className={`aud aud--${a.kind}`}>
              <div className="aud__art" aria-hidden="true">
                {a.kind === 'phone'
                  ? <IPhone src={a.img} alt="" statusBar={false} width="100%" finish={a.who === 'Customers' ? 'black' : 'natural'} />
                  : <div className="aud__browser"><Browser src={a.img} alt="" url="business.aerrand.com" width={1600} height={1050} /></div>}
              </div>
              <div className="aud__body">
                <p className="t-label aud__who">{a.who}</p>
                <h3 className="aud__job">{a.job}</h3>
                <p className="aud__about">{a.about}</p>
                <Facts items={[['What they need', a.need], ['Riskiest assumption', a.risk]]} className="facts--stack" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Principles ─────────────────────────────────────────────────────── */
const principles = [
  { t: 'Trust before speed', d: 'Every feature should reduce uncertainty for someone: the customer, the Aerrander or the business. If it doesn’t build trust, it doesn’t ship.' },
  { t: 'Legible at a glance', d: 'Status, location and next steps should never need interpreting. If someone has to think to understand what’s happening, the design has failed.' },
  { t: 'Designed for real conditions', d: 'Aerranders check their phones on the move. Customers glance at status between tasks. Design for where the product is actually used.' },
]

function Principles() {
  const ref = useRef<HTMLElement>(null)
  useGsap(() => {
    if (reducedMotion()) return
    const items = gsap.utils.toArray<HTMLElement>('.principle', ref.current!)
    items.forEach(el => {
      gsap.fromTo(el.querySelector('.principle__t'), { xPercent: 12, opacity: 0.15 }, { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 55%', scrub: true } })
    })
  }, [], ref)
  return (
    <section ref={ref} className="case-sec principles" data-chapter="principles" data-label="Principles" aria-labelledby="pr-title">
      <div className="wrap">
        <Head id="pr-title" k="Principles" title="The filter every decision went through">
          Before any interface was designed, three principles were set. Every product decision after that was tested against them.
        </Head>
        <div className="principle-list">
          {principles.map(p => (
            <div key={p.t} className="principle">
              <h3 className="t-display principle__t">{p.t}</h3>
              <p className="principle__d">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Journey: pinned horizontal gallery ─────────────────────────────── */
type Shot = { src: string; t: string; d: string; finish?: 'black' | 'natural' | 'white' }
const customerJourney: Shot[] = [
  { src: aerrand.customer.welcome, t: 'Start with the promise', d: 'Onboarding sets expectations, including “Inspect before you accept.”' },
  { src: aerrand.customer.home, t: 'Choose how to send', d: 'The first decision on Home is Aerrand or Aerrand Guard. “Later” sits inside the search bar.' },
  { src: aerrand.customer.guard, t: 'Guard explains itself', d: 'Three steps and the CA$9.99 price, shown before anyone commits.' },
  { src: aerrand.customer.send, t: 'Where it’s going', d: 'Pickup and drop-off with saved places and recent addresses one tap away.' },
  { src: aerrand.customer.approve, t: 'Check the inspection', d: 'Photos and a checklist from the Aerrander. Approve and ship, or say something’s wrong.' },
  { src: aerrand.customer.delivered, t: 'Delivered, with proof', d: 'A drop-off photo, then rate the Aerrander and add a tip.' },
]
const aerranderJourney: Shot[] = [
  { src: aerrand.aerrander.home, t: 'Go online', d: 'Busy areas on the map and today’s numbers at a glance.', finish: 'natural' },
  { src: aerrand.aerrander.inspect, t: 'Inspect the item', d: 'A checklist built from what the buyer asked for, with a photo for each item.', finish: 'natural' },
  { src: aerrand.aerrander.done, t: 'Finish the aerrand', d: 'See exactly what was earned, including the tip, then rate the customer.', finish: 'natural' },
  { src: aerrand.aerrander.earnings, t: 'Track earnings', d: 'The week by day, every aerrand listed, and cash out when it suits them.', finish: 'natural' },
]

function Journey() {
  const ref = useRef<HTMLElement>(null)
  useGsap(() => {
    const root = ref.current!
    if (reducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const track = root.querySelector<HTMLElement>('.reel__track')!
      const dist = () => track.scrollWidth - window.innerWidth + 80
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: root.querySelector('.reel'), start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.7, invalidateOnRefresh: true },
      })
      gsap.utils.toArray<HTMLElement>('.reel__item .iphone', root).forEach(ph => {
        gsap.fromTo(ph, { rotateY: -24, rotateZ: 3 }, {
          rotateY: 18, rotateZ: -3, ease: 'none',
          scrollTrigger: { trigger: ph, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        })
      })
      const bar = root.querySelector<HTMLElement>('.reel__progress span')!
      gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.querySelector('.reel'), start: 'top top', end: () => `+=${dist()}`, scrub: true } })
    })
    // The Aerrander strip drifts against the scroll direction.
    gsap.fromTo(root.querySelector('.strip__track'), { xPercent: 4 }, { xPercent: -14, ease: 'none', scrollTrigger: { trigger: root.querySelector('.strip'), start: 'top bottom', end: 'bottom top', scrub: true } })
    return () => mm.revert()
  }, [], ref)

  return (
    <section ref={ref} className="journey" data-chapter="journey" data-label="Customer journey" aria-labelledby="jr-title">
      <div className="reel">
        <div className="reel__head wrap">
          <Head id="jr-title" k="The 2.0 customer app" title="An Aerrand Guard delivery, screen by screen" />
          <div className="reel__progress" aria-hidden="true"><span /></div>
        </div>
        <ol className="reel__track">
          {customerJourney.map((s, i) => (
            <li key={s.t} className="reel__item">
              <IPhone src={s.src} alt={s.t} statusBar={false} width="var(--reel-phone)" finish="black" depth />
              <div className="reel__cap">
                <span className="t-stencil reel__n">{i + 1}</span>
                <div><h3 className="reel__t">{s.t}</h3><p className="reel__d">{s.d}</p></div>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="strip">
        <div className="wrap strip__head">
          <h3 className="t-display strip__title">On the other side: the Aerrander app 2.0</h3>
          <p className="strip__intro">Redesigned alongside the customer app, so both sides of every aerrand speak the same language.</p>
        </div>
        <div className="strip__viewport">
          <ul className="strip__track">
            {aerranderJourney.map(s => (
              <li key={s.t} className="strip__item">
                <IPhone src={s.src} alt={s.t} statusBar={false} width="var(--strip-phone)" finish="natural" />
                <div><h4 className="strip__t">{s.t}</h4><p className="strip__d">{s.d}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ─── Dashboards ─────────────────────────────────────────────────────── */
function Dashboards() {
  const ref = useRef<HTMLElement>(null)
  useGsap(() => {
    const root = ref.current!
    if (reducedMotion()) return
    gsap.utils.toArray<HTMLElement>('.dash__frame', root).forEach((f, i) => {
      gsap.fromTo(f, { rotateX: 22, scale: 0.86, y: 80 }, { rotateX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'center 60%', scrub: true } })
      void i
    })
  }, [], ref)
  return (
    <section ref={ref} className="case-sec dash" data-chapter="dashboards" data-label="Dashboards" aria-labelledby="dash-title">
      <div className="wrap">
        <Head id="dash-title" k="Business and operations" title="The parts customers never see">
          Businesses get a live view of every aerrand they send. The platform team gets the tools to run Aerrand without doing everything by hand.
        </Head>
        <figure className="dash__item">
          <div className="dash__frame"><Browser src={aerrand.business} alt="Aerrand business dashboard home: live tracking, upcoming and completed aerrands, and recent deliveries" url="business.aerrand.com" width={1600} height={1050} /></div>
          <figcaption className="dash__cap"><b>Business dashboard.</b> Live tracking, upcoming and completed aerrands, and delivery history. Live now, with local businesses onboarding.</figcaption>
        </figure>
        <figure className="dash__item dash__item--laptop">
          <div className="dash__frame"><Laptop src={aerrand.admin} alt="Aerrand admin dashboard for the platform team" /></div>
          <figcaption className="dash__cap"><b>Admin and operations.</b> Users, Aerranders, live activity and platform health in one place.</figcaption>
        </figure>
      </div>
    </section>
  )
}

/* ─── Build order ────────────────────────────────────────────────────── */
const phases = [
  { t: 'Complete one trusted delivery', items: ['Customer app: request, track, confirm (live on iOS and Android)', 'Aerrander app: accept, navigate, complete', 'Aerrand Guard: inspect before you accept', 'Scheduled aerrands'], why: 'A delivery can’t happen without both sides, and Guard is the trust promise, so it shipped with the first version rather than after it. 2.0 now redesigns this phase.' },
  { t: 'Give operators control', items: ['Business dashboard: live tracking, history, analytics', 'Admin and operations tooling'], why: 'Once deliveries flow, businesses need visibility and the platform team needs tools to run it without manual work.' },
  { t: 'Widen the reach', items: ['Customer web for people who prefer a browser'], why: 'Mobile covers the core use case. Web adds reach rather than new capability, so it waits.' },
]

function BuildOrder() {
  const ref = useRef<HTMLElement>(null)
  useGsap(() => {
    const root = ref.current!
    if (reducedMotion()) return
    const q = gsap.utils.selector(root)
    gsap.fromTo(q('.parade__fleet'), { xPercent: -30 }, { xPercent: 60, ease: 'none', scrollTrigger: { trigger: q('.parade')[0], start: 'top bottom', end: 'bottom top', scrub: true } })
    gsap.utils.toArray<HTMLElement>('.phase', root).forEach(p => {
      gsap.fromTo(p.querySelector('.phase__line span'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: p, start: 'top 75%', end: 'bottom 60%', scrub: true } })
      gsap.from(p.querySelectorAll('.phase__items li'), { x: -24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: p, start: 'top 75%', once: true } })
    })
  }, [], ref)
  return (
    <section ref={ref} className="case-sec build" data-chapter="build" data-label="Build order" aria-labelledby="build-title">
      <div className="wrap">
        <Head id="build-title" k="Build order" title="Five surfaces can’t ship at once">
          The order is a product decision in its own right. The rule: build the smallest thing that completes one trusted delivery end to end, then widen it.
        </Head>
      </div>
      <div className="parade" aria-hidden="true">
        <div className="parade__road" />
        <div className="parade__fleet">
          <img src={aerrand.vehicles.scooter} alt="" />
          <img src={aerrand.vehicles.moto} alt="" />
          <img src={aerrand.vehicles.car} alt="" />
          <img src={aerrand.vehicles.truck} alt="" />
        </div>
      </div>
      <div className="wrap">
        <ol className="phases">
          {phases.map((p, i) => (
            <li key={p.t} className="phase">
              <div className="phase__rail"><span className="t-stencil phase__n">{i + 1}</span><span className="phase__line"><span /></span></div>
              <div className="phase__body">
                <h3 className="phase__t">{p.t}</h3>
                <ul className="phase__items">{p.items.map(it => <li key={it}>{it}</li>)}</ul>
                <p className="phase__why">{p.why}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ─── 1.0 to 2.0 ─────────────────────────────────────────────────────── */
const changes = [
  { v1: 'Aerrand Guard is one of three service tiles on the home screen.', v2: 'A two-way switch at the top: Aerrand (send anything) or Aerrand Guard (inspected first).', why: 'How to send becomes the first decision, and Guard gets equal billing with regular delivery.' },
  { v1: 'Scheduling has its own service tile.', v2: 'A “Later” button sits inside the search bar.', why: 'Booking ahead becomes part of the same flow instead of a separate path.' },
  { v1: 'A static map fills the lower half of the home screen.', v2: 'Vehicle choice (scooter, moto, car, truck) and a pinned card for the aerrand in progress.', why: 'Home shows things people can act on, including a delivery that’s already moving.' },
  { v1: 'Booking asked for one detail per screen, so every new detail added a screen.', v2: 'Related details collected together, with one summary page. Tap pickup, drop-off or the item to edit it in an overlay.', why: 'About 30% of people who started booking in the pilot didn’t finish.' },
  { v1: 'Guard opens straight into an address form.', v2: 'Guard mode explains itself in three steps and shows the CA$9.99 price up front.', why: 'People see what they get and what it costs before they commit.' },
  { v1: 'Icon-only tab bar.', v2: 'Labelled floating navigation: Home, Aerrands, Account.', why: 'Labels remove the guesswork, and “Aerrands” names the list for what it holds.' },
  { v1: 'The Aerrander app opens on a full-screen map with an online toggle.', v2: 'Busy areas, today’s earnings and a clear online state, with Earnings as its own tab.', why: 'Aerranders can decide where to go and see what a shift is worth without leaving Home.' },
]

function Versions() {
  const ref = useRef<HTMLElement>(null)
  const [v, setV] = useState<'1.0' | '2.0'>('1.0')
  const wipe = useRef<gsap.core.Tween | null>(null)
  const auto = useRef(true)

  const go = (to: '1.0' | '2.0', immediate = false) => {
    const root = ref.current!
    setV(to)
    wipe.current?.kill()
    const target = to === '2.0' ? 100 : 0
    if (immediate || reducedMotion()) { root.style.setProperty('--wipe', String(target)); return }
    const state = { w: parseFloat(getComputedStyle(root).getPropertyValue('--wipe')) || 0 }
    wipe.current = gsap.to(state, { w: target, duration: 1.4, ease: 'power3.inOut', onUpdate: () => root.style.setProperty('--wipe', state.w.toFixed(2)) })
  }

  useGsap(() => {
    const root = ref.current!
    root.style.setProperty('--wipe', '0')
    if (reducedMotion()) { go('2.0', true); return }
    gsap.from(root.querySelectorAll('.vs__phone'), { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: root.querySelector('.vs__stage'), start: 'top 80%', once: true } })
    const st = gsap.timeline({ scrollTrigger: { trigger: root.querySelector('.vs__stage'), start: 'top 45%', once: true, onEnter: () => { if (auto.current) go('2.0') } } })
    return () => { st.kill(); wipe.current?.kill() }
  }, [], ref)

  return (
    <section ref={ref} className="case-sec vs" data-chapter="versions" data-label="1.0 to 2.0" aria-labelledby="vs-title">
      <div className="wrap">
        <Head id="vs-title" k="1.0 to 2.0" title="What changed, and why">
          2.0 is a full redesign of both apps, built from what the pilot showed us, and it’s now live. Each pair below is the customer app beside the Aerrander app from the same version.
        </Head>
        <div className="vs__switch" role="group" aria-label="Show version">
          {(['1.0', '2.0'] as const).map(x => (
            <button key={x} type="button" aria-pressed={v === x} className={v === x ? 'is-on' : ''} onClick={() => { auto.current = false; go(x) }}>
              Version {x}
            </button>
          ))}
          <span className="vs__switch-thumb" aria-hidden="true" />
        </div>
        <div className="vs__stage">
          <div className="vs__pair">
            <IPhone className="vs__phone" alt={v === '1.0' ? 'Aerrand 1.0 customer home with service tiles and a map' : 'Aerrand 2.0 customer home with a mode switch and vehicle choice'} src={aerrand.customer.home} statusBar={false} width="var(--vs-phone)" finish="black">
              <img className="vs__old" src={aerrand.v1.home} alt="" />
              <span className="vs__scan" />
            </IPhone>
            <IPhone className="vs__phone" alt={v === '1.0' ? 'Aerrand 1.0 Aerrander home: a full-screen map with an online toggle' : 'Aerrander app 2.0 home with busy areas and today’s numbers'} src={aerrand.aerrander.home} statusBar={false} width="var(--vs-phone)" finish="natural">
              <img className="vs__old" src={aerrand.v1.aerrander} alt="" />
              <span className="vs__scan" />
            </IPhone>
          </div>
          <p className="vs__label" aria-live="polite"><span className="t-stencil">{v}</span>{v === '1.0' ? 'Before the pilot' : 'Live now'}</p>
        </div>
        <div className="changes" role="table" aria-label="Changes from 1.0 to 2.0">
          <div className="changes__row changes__row--head" role="row">
            <span role="columnheader">In 1.0</span><span role="columnheader">In 2.0</span><span role="columnheader">Why it changed</span>
          </div>
          {changes.map(c => (
            <div key={c.v2} className="changes__row" role="row">
              <span role="cell" className="changes__v1">{c.v1}</span>
              <span role="cell" className="changes__v2">{c.v2}</span>
              <span role="cell" className="changes__why">{c.why}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Decisions ──────────────────────────────────────────────────────── */
function Decisions() {
  const ref = useRise('.decision')
  return (
    <section ref={ref} className="case-sec decisions" data-chapter="decisions" data-label="Key decisions" aria-labelledby="dec-title">
      <div className="wrap">
        <Head id="dec-title" k="Key decisions" title="The choices you don’t see in the interface">
          The most important product decisions are rarely visible in the final screens. These shaped how Aerrand is being built, and why.
        </Head>

        <article className="decision decision--guard">
          <div className="guard__copy">
            <p className="t-label decision__k">Trust as a product feature, not a policy</p>
            <h3 className="t-display decision__t">Aerrand Guard</h3>
            <p className="decision__d">Most platforms handle problems through terms of service and claims, which puts the burden on the customer after something has already gone wrong. Guard moves the moment of trust to before the item moves, the only point where a bad purchase is still easy to undo.</p>
            <ol className="guard__steps">
              <li><b>Tell us what to check.</b> Condition, model, anything the listing promised.</li>
              <li><b>We inspect at pickup.</b> The Aerrander checks the item with the seller and sends photos before leaving.</li>
              <li><b>Approve, then it ships.</b> Payment is held until the buyer accepts delivery.</li>
            </ol>
            <p className="guard__price"><span className="t-stencil">CA$9.99</span> added to the delivery fare, shown before you commit.</p>
          </div>
          <div className="guard__art" aria-hidden="true">
            <IPhone src={aerrand.aerrander.inspect} alt="" statusBar={false} width="var(--guard-phone)" finish="natural" className="guard__phone guard__phone--back" />
            <IPhone src={aerrand.customer.approve} alt="" statusBar={false} width="var(--guard-phone)" finish="black" className="guard__phone guard__phone--front" />
          </div>
        </article>

        <div className="decision-grid">
          <article className="decision">
            <h3 className="decision__h">One shared platform, not five apps</h3>
            <p className="decision__d">Every surface reads from and writes to the same data layer. When an Aerrander confirms a delivery, the customer’s status and the business dashboard update at the same moment. That only works if the architecture is shared from the start.</p>
          </article>
          <article className="decision">
            <h3 className="decision__h">Scheduling as a core feature</h3>
            <p className="decision__d">Same-day delivery is often treated as an impulse product, but many delivery needs are predictable and repeating. “Later” sits right next to search, so booking ahead is part of the standard flow, not an add-on or a pricier tier.</p>
          </article>
          <article className="decision">
            <h3 className="decision__h">Designing the Aerrander side first</h3>
            <p className="decision__d">Delivery quality is decided on the driver side. If an Aerrander has a poor experience, the customer suffers no matter how good the customer app is. So the Aerrander app was designed before the customer app.</p>
          </article>
        </div>
      </div>
    </section>
  )
}

/* ─── Metrics ────────────────────────────────────────────────────────── */
const metrics: [string, 'up' | 'down' | 'zero', string][] = [
  ['Booking abandonment (about 30% in the pilot)', 'down', 'Customers'],
  ['“Where is my order?” contacts per 100 aerrands', 'down', 'Customers'],
  ['30-day repeat customer rate', 'up', 'Customers'],
  ['Time from request to an Aerrander accepting', 'down', 'Aerranders'],
  ['8-week Aerrander retention', 'up', 'Aerranders'],
  ['Weekly active business accounts', 'up', 'Businesses'],
  ['Share of aerrands booked ahead or on a schedule', 'up', 'Businesses'],
  ['Aerrand Guard deliveries approved on the first inspection', 'up', 'Guard'],
  ['Problems reported after approval', 'zero', 'Guard'],
]
const dirLabel = { up: 'Should rise', down: 'Should fall', zero: 'Near zero' }

function Metrics() {
  const ref = useRise('.metric')
  return (
    <section ref={ref} className="case-sec case-sec--tint metrics" data-chapter="metrics" data-label="Measuring it" aria-labelledby="met-title">
      <div className="wrap split">
        <div className="split__side">
          <Head id="met-title" k="Measuring it" title="How we’ll know 2.0 is working">
            Each measure maps back to one of the problems. The pilot gave us a starting point for booking: about 30% of people dropped out. Now that 2.0 is live, these are the numbers it has to move.
          </Head>
        </div>
        <ul className="metric-list">
          {metrics.map(([m, d, who]) => (
            <li key={m} className="metric">
              <span className={`metric__dir metric__dir--${d}`} aria-hidden="true"><Dir d={d} /></span>
              <span className="metric__m">{m}</span>
              <span className="metric__meta">{dirLabel[d]}<span className="metric__who">{who}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const Dir = ({ d }: { d: 'up' | 'down' | 'zero' }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d === 'up' && <path d="M11 17V5M5.5 10.5 11 5l5.5 5.5" />}
    {d === 'down' && <path d="M11 5v12M5.5 11.5 11 17l5.5-5.5" />}
    {d === 'zero' && <path d="M5 11h12" />}
  </svg>
)

/* ─── Status ─────────────────────────────────────────────────────────── */
const surfaces: [string, string, 'live' | 'built' | 'build' | 'design'][] = [
  ['Customer app', 'In beta on both stores since August 2026. 2.0 is live.', 'live'],
  ['Aerrander app', 'Built. In beta on both stores, with 100+ Aerranders signed up.', 'live'],
  ['Business dashboard', 'Live. Onboarding local businesses now.', 'live'],
  ['Admin and operations', 'Live. The team uses it to run and track the platform.', 'live'],
  ['Customer web', 'Built. Refinements in progress.', 'build'],
]

function Status() {
  const ref = useRise('.status-row')
  return (
    <section ref={ref} className="case-sec status" data-chapter="status" data-label="Where it stands" aria-labelledby="st-title">
      <div className="wrap">
        <Head id="st-title" k="Where it stands" title="A shipped product, not a concept">
          Both apps, the business dashboard and the admin tools are live, with businesses onboarding now. The customer web app is in its final refinements. The 2.0 redesign of both apps is live.
        </Head>
        <ul className="status-list">
          {surfaces.map(([s, d, k]) => (
            <li key={s} className="status-row">
              <span className={`status-pill status-pill--${k}`}>{k === 'live' ? 'Live' : k === 'built' ? 'Built' : k === 'build' ? 'In build' : 'In design'}</span>
              <span className="status-row__s">{s}</span>
              <span className="status-row__d">{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Lesson() {
  const ref = useRise('.reflect__body p')
  return (
    <section ref={ref} className="case-sec case-sec--tint reflect" data-chapter="lesson" data-label="Looking back" aria-labelledby="ls-title">
      <div className="wrap split">
        <div className="split__side">
          <Head id="ls-title" k="Looking back" title="What I’d do differently">
            We started building from the first idea. The design was finished before we found out the features wouldn’t carry the product.
          </Head>
        </div>
        <div className="reflect__body t-lead">
          <p>That came from a hard conversation with a potential angel investor. We went back to the drawing board and redid everything, starting with the design. That’s when Aerrand really started. Taking a product from zero to market is a different job from managing a project for someone else.</p>
          <p>Next time I’d talk to people before building: people already working in the field, and people who advise startups. Research tells you what exists. People with experience tell you what the market actually wants, and when what they say makes sense, it’s stronger validation than anything I can read.</p>
          <p>I wouldn’t undo it, though. Without that rebuild I wouldn’t have learned what I know now.</p>
        </div>
      </div>
    </section>
  )
}

export default function Aerrand() {
  useTitle('Aerrand case study', 'How Aerrand, a same-day delivery platform for Windsor, Ontario, was designed around trust: five surfaces, Aerrand Guard, student research, a 100+ delivery pilot and the 2.0 redesign it led to.')
  return (
    <div className="case case--aerrand">
      <Hero />
      <Beta />
      <Research />
      <Problem />
      <Audiences />
      <Principles />
      <Ecosystem />
      <Journey />
      <Dashboards />
      <BuildOrder />
      <Pilot />
      <Versions />
      <Decisions />
      <Metrics />
      <Status />
      <Lesson />
      <NextCase to="/work/brain-box" name="Brain Box" theme="wine" summary="One calm, accessible app for the tests newcomers face: language, driving and citizenship.">
        <IPhone src={brainbox.home} alt="" statusBar={false} width="var(--next-phone)" finish="black" />
      </NextCase>
      <ChapterNav title="Aerrand" />
    </div>
  )
}
