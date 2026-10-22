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
            <p className="t-lead jh__lead">The brand and launch website for JunkCycle, an on-demand junk removal and recycling platform from Winnipeg. Think Uber for junk: people book a pickup, and local haulers take the job.</p>
            <a href={LIVE} className="btn btn--ink jh__live" target="_blank" rel="noreferrer">Visit junkcycle.ca<span className="btn__icon"><ArrowUpRight /></span></a>
          </div>
          <div data-fade>
            <Facts items={[
              ['My role', 'Brand and web designer, freelance'],
              ['Timeline', 'Early 2025'],
              ['What I made', 'Logo, logotype, typography, brand guidelines, and the website’s UX and UI'],
              ['Built with', 'React, JavaScript, HTML and CSS. I built the site as well as designing it.'],
            ]} />
          </div>
        </div>
      </div>
      <div className="wrap jh__stage">
        <img className="jh__shot shot" src={junkcycle.desktop.hero} alt="The JunkCycle homepage: Smart Waste. Circular Solutions. Nationwide." width={1440} height={820} loading="eager" />
      </div>
    </section>
  )
}

/* ─── The brief ──────────────────────────────────────────────────────── */
const jobs = [
  { t: 'Explain a new kind of service in seconds.', d: 'Most people have never booked junk removal through an app. The headline, one short line under it and a “Request a Pickup” button had to do that work before anyone scrolled.' },
  { t: 'Speak to two audiences at once.', d: 'Customers want junk gone. Haulers want paid work. The services section gives each a clear card, and the waitlist asks which one you are.' },
  { t: 'Grow a waitlist before launch.', d: 'The page ends in a short form: name, role, province, city and contact details, so the team knows where demand is before opening in a new area.' },
]

function Brief() {
  const ref = useRise('.problem')
  return (
    <section ref={ref} className="case-sec" data-chapter="brief" data-label="The brief" aria-labelledby="jb-title">
      <div className="wrap split">
        <div className="split__side">
          <Head id="jb-title" k="The brief" title="One page, three jobs" />
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
  { k: 'Website UX and UI', t: 'A single page that answers questions in order', d: 'What it is, who it’s for, what you can do, what others say, how it works, then how to join. Numbered steps keep “How it works” easy to scan, and every section is reachable from the top menu.' },
  { k: 'Build', t: 'Designed and built by the same person', d: 'I built the site in React, so nothing was lost between design and code. On phones the layout stacks into single cards and the menu folds away.' },
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
  { src: junkcycle.desktop.services, alt: 'Services: Waste Pickup, Hauler Jobs, Material Marketplace and JunkCycle AI', cap: 'Services. One card for each audience, plus what’s coming next.', h: 1060 },
  { src: junkcycle.desktop.how, alt: 'How it works: request a pickup, get matched, confirm details, track and complete', cap: 'How it works. Four numbered steps from request to done.', h: 880 },
  { src: junkcycle.desktop.contact, alt: 'Contact details and the waitlist form', cap: 'Contact and waitlist. The form asks for role and location, so the team can see where demand is.', h: 915 },
]
const phones = [
  { src: junkcycle.mobile.hero, alt: 'JunkCycle homepage on a phone' },
  { src: junkcycle.mobile.services, alt: 'Services cards on a phone' },
  { src: junkcycle.mobile.how, alt: 'How it works steps on a phone' },
  { src: junkcycle.mobile.waitlist, alt: 'Waitlist form on a phone' },
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
  useTitle('JunkCycle case study', 'JunkCycle: brand and launch website for an on-demand junk removal and recycling platform, designed and built by Arnold Ihechere.')
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
