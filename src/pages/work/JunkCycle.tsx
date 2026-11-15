import { useRef } from 'react'
import { gsap, reducedMotion, useGsap } from '../../lib/motion'
import { useTitle } from '../../lib/hooks'
import { aerrand, junkcycle } from '../../content/screens'
import { IPhone } from '../../components/devices'
import { FitText } from '../../components/FitText'
import { useDoorOpen } from '../../components/text'
import { ArrowUpRight } from '../../components/icons'
import { ChapterNav, Facts, Head, NextCase, useRise } from '../../components/Case'

const LIVE = 'https://junkcycle.ca'

/* ─── Hero ───────────────────────────────────────────────────────────── */
function Hero() {
  const ref = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)

  useGsap(() => {
    const root = ref.current!
    if (reducedMotion()) return
    const q = gsap.utils.selector(root)
    const tl = gsap.timeline({ paused: true })
    tl.from(q('.jh__title .fit > span'), { yPercent: 100, duration: 1.3, ease: 'expo.out' })
      .from(q('[data-fade]'), { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07 }, 0.3)
      .from(q('.jh__shot'), { y: 120, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0.4)
    intro.current = tl
    gsap.fromTo(q('.jh__shot'), { rotateX: 10 }, { rotateX: 0, ease: 'none', scrollTrigger: { trigger: q('.jh__stage')[0], start: 'top 80%', end: 'center 40%', scrub: true } })
  }, [], ref)
  useDoorOpen(() => intro.current?.play())

  return (
    <section ref={ref} className="jh" data-chapter="overview" data-label="Overview" aria-labelledby="jh-title">
      <div className="wrap jh__top">
        <p className="t-label jh__k" data-fade>Case study: brand and website</p>
        <h1 id="jh-title" className="t-display jh__title" aria-label="JunkCycle">
          <FitText max={380}><span className="jh__line" aria-hidden="true">JunkCycle</span></FitText>
        </h1>
        <div className="jh__intro">
          <div data-fade>
            <p className="t-lead jh__lead">The brand and website for JunkCycle, a junk removal company from Winnipeg that sends what it picks up to reuse first and landfill last. Households book a pickup in the app. Businesses get recurring pickups with proof of where everything went.</p>
            <a href={LIVE} className="btn btn--ink jh__live" target="_blank" rel="noreferrer">Visit junkcycle.ca<span className="btn__icon"><ArrowUpRight /></span></a>
          </div>
          <div data-fade>
            <Facts items={[
              ['My role', 'Brand and web designer, freelance'],
              ['Timeline', 'First site in early 2025, redesigned in 2026'],
              ['What I made', 'Logo, logotype, typography, brand guidelines, and the website’s UX and UI'],
              ['Built with', 'React and Next.js. I built the site as well as designing it.'],
            ]} />
          </div>
        </div>
      </div>
      <div className="wrap jh__stage">
        <img className="jh__shot shot" src={junkcycle.desktop.hero} alt="The JunkCycle homepage: We haul your junk and find it a second life." width={1440} height={860} loading="eager" />
      </div>
    </section>
  )
}

/* ─── The brief ──────────────────────────────────────────────────────── */
const jobs = [
  { t: 'Make booking feel effortless for households.', d: 'The headline says what JunkCycle does in one line, and “Book a pickup” is the first button you see. A short numbered walkthrough shows how booking works in the app, from snapping a photo to tracking the crew.' },
  { t: 'Give businesses something they can report on.', d: 'Businesses care about schedules and paperwork. The site gives them their own path: industry pages, recurring pickups, and a sample certificate of diversion they can take to an ESG report or a procurement bid.' },
  { t: 'Show where the junk actually goes.', d: 'Reuse first is the whole point, so the site proves it: the AI waste sorter, Cycle Green Points, a crate followed from pickup to its second life, and a real case study with Magellan Aerospace.' },
]

function Brief() {
  const ref = useRise('.problem')
  return (
    <section ref={ref} className="case-sec" data-chapter="brief" data-label="The brief" aria-labelledby="jb-title">
      <div className="wrap split">
        <div className="split__side">
          <Head id="jb-title" k="The brief" title="One site, two audiences" />
        </div>
        <ol className="problems">
          {jobs.map(p => (
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

/* ─── What I did ─────────────────────────────────────────────────────── */
const work = [
  { k: 'Brand', t: 'A mark that says pickup and recycling', d: 'The logo, logotype and typography, plus brand guidelines so the team could stay consistent. A deep green carries the sustainability story without feeling like a charity.' },
  { k: 'Website UX and UI', t: 'A home page that splits early', d: 'Households and businesses want different things, so a simple toggle near the top lets each one follow their own story. Bold headlines, real photos and big numbers keep a long page easy to scan.' },
  { k: 'Build', t: 'Designed and built by the same person', d: 'I built the site in React with Next.js, so nothing was lost between design and code. On phones the layout stacks into single cards and the menu folds away.' },
]

function Work() {
  const ref = useRise('.jw')
  return (
    <section ref={ref} className="case-sec case-sec--tint" data-chapter="work" data-label="What I did" aria-labelledby="jw-title">
      <div className="wrap">
        <Head id="jw-title" k="What I did" title="Brand, design and build" />
        <div className="jws">
          {work.map(w => (
            <article key={w.k} className="jw">
              <p className="t-label jw__k">{w.k}</p>
              <h3 className="jw__t">{w.t}</h3>
              <p className="jw__d">{w.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── The site ───────────────────────────────────────────────────────── */
const sections = [
  { src: junkcycle.desktop.book, alt: 'Book in minutes: a numbered walkthrough of booking in the JunkCycle app', cap: 'Booking. Six numbered steps, from opening the app to earning Cycle Green Points.', h: 1380 },
  { src: junkcycle.desktop.smart, alt: 'Smart enough to know what’s what: the AI waste sorter, categories, sorting order and Cycle Green Points', cap: 'The smart part. The AI waste sorter, how items get sorted, and the points you earn for greener choices.', h: 1510 },
  { src: junkcycle.desktop.places, alt: 'Built for the places that make the most waste: industry cards for businesses', cap: 'For business. One card for each industry, each leading to its own page.', h: 1360 },
  { src: junkcycle.desktop.proof, alt: 'Proof you can put in a report: a sample certificate of diversion', cap: 'Proof for reports. A sample certificate of diversion, so businesses can see exactly what they get.', h: 810 },
  { src: junkcycle.desktop.magellan, alt: 'Magellan Aerospace case study: 30.8 tonnes kept out of landfill', cap: 'A real case study. Big numbers and a client quote do the convincing.', h: 920 },
]
const phones = [
  { src: junkcycle.mobile.hero, alt: 'JunkCycle homepage on a phone' },
  { src: junkcycle.mobile.book, alt: 'Booking walkthrough on a phone' },
  { src: junkcycle.mobile.sorter, alt: 'AI waste sorter section on a phone' },
  { src: junkcycle.mobile.places, alt: 'Business industry cards on a phone' },
]

function Site() {
  const ref = useRise('.js-rise')
  return (
    <section ref={ref} className="case-sec" data-chapter="site" data-label="The website" aria-labelledby="js-title">
      <div className="wrap">
        <Head id="js-title" k="The website" title="Live at junkcycle.ca">
          These are screenshots of the live site. <a href={LIVE} className="link-u" target="_blank" rel="noreferrer">Open it yourself</a>.
        </Head>
        <div className="jsite">
          {sections.map(s => (
            <figure key={s.cap} className="jsite__fig js-rise">
              <img className="shot" src={s.src} alt={s.alt} width={1440} height={s.h} loading="lazy" />
              <figcaption>{s.cap}</figcaption>
            </figure>
          ))}
        </div>
        <div className="jphones js-rise">
          <p className="t-label jphones__k">On a phone</p>
          <ul className="jphones__row">
            {phones.map(p => (
              <li key={p.alt}><img className="shot" src={p.src} alt={p.alt} width={360} height={740} loading="lazy" /></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function JunkCycle() {
  useTitle('JunkCycle case study', 'JunkCycle: brand and website for a reuse-first junk removal company, designed and built by Arnold Ihechere.')
  return (
    <div className="case case--junkcycle">
      <Hero />
      <Brief />
      <Work />
      <Site />
      <NextCase to="/work/aerrand" name="AERRAND" theme="lilac" summary="Same-day delivery for Windsor, Ontario, built around trust. Live on the App Store and Google Play.">
        <IPhone src={aerrand.customer.home} alt="" statusBar={false} width="var(--next-phone)" finish="black" />
      </NextCase>
      <ChapterNav title="JunkCycle" />
    </div>
  )
}
