import { useRef } from 'react'
import { gsap, reducedMotion, useGsap } from '../lib/motion'
import { useTitle } from '../lib/hooks'
import { site, SHOW_TODOS } from '../content/site'
import { aerrand, brainbox } from '../content/screens'
import { Link } from '../lib/router'
import { RevealLines, ScrubWords } from '../components/text'
import { Head, useRise } from '../components/Case'
import { FloorLessons } from '../components/FloorLessons'
import { ArrowUpRight } from '../components/icons'
import portrait from '../assets/about/arnold.webp'

/* ─── Intro ──────────────────────────────────────────────────────────── */
function Intro() {
  return (
    <section className="ab-hero">
      <div className="wrap">
        <p className="t-label ab-hero__k">About</p>
        <div className="ab-hero__top">
          <RevealLines as="h1" on="door" className="t-display ab-hero__title" stagger={0.08}>Designing and building since 2022</RevealLines>
          <figure className="ab-hero__photo">
            <img src={portrait} alt="Arnold Ihechere in a graduation cap, holding roses" width={960} height={1200} />
          </figure>
        </div>
        <div className="ab-hero__grid">
          <p className="t-lead ab-hero__lead">I’m {site.name}, a product manager and designer in {site.location}. I’ve designed and built digital products for four years, first at Right Click IT Solutions and now on my own: AERRAND, my delivery app, is live on the App Store and Google Play. For the past year I’ve also supervised automotive production on the night shift.</p>
          <dl className="ab-hero__facts">
            <div><dt>Years designing and building software</dt><dd className="t-stencil">4</dd></div>
            <div><dt>Apps live on both stores</dt><dd className="t-stencil">2</dd></div>
            <div><dt>Year supervising production</dt><dd className="t-stencil">1</dd></div>
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ─── Path: four stations, in order ──────────────────────────────────── */
const path = [
  { t: 'Engineering, 2018 to 2026', h: 'Learning how things are built', d: 'A bachelor’s in electrical and computer engineering at Afe Babalola University in Ado Ekiti, Nigeria, gave me systems thinking, problem decomposition and a working knowledge of how software behaves at the implementation level. A master’s in the same field at the University of Windsor, Ontario followed.' },
  { t: 'Design and build, 2022 to 2024', h: 'Shipping digital products', d: 'At Right Click IT Solutions, a contractor to government organizations in Nigeria, I designed and built products end to end, including enterprise resource planning (ERP) software for government bodies in the oil and gas sector. That work is confidential, so it isn’t shown here.' },
  { t: 'Product, 2025 to now', h: 'Building my own', d: 'I co-founded AERRAND and took it from concept to two apps live on the App Store and Google Play. Now I’m leading its 2.0 redesign and shaping Brain Box, an exam-prep app for newcomers.' },
  { t: 'Operations, 2025 to now', h: 'A year on the production floor', d: 'Alongside the product work, I’ve supervised automotive production at Stellantis and now Peterson Spring. It sharpened how I prioritize, align people and design for real conditions.' },
]

function Path() {
  const ref = useRef<HTMLElement>(null)
  useGsap(() => {
    const root = ref.current!
    if (reducedMotion()) return
    gsap.fromTo(root.querySelector('.path__line span'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root.querySelector('.path__list'), start: 'top 60%', end: 'bottom 60%', scrub: true } })
    gsap.utils.toArray<HTMLElement>('.path__stop', root).forEach(s => {
      gsap.fromTo(s, { opacity: 0.25 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: s, start: 'top 75%', end: 'top 50%', scrub: true } })
    })
  }, [], ref)
  return (
    <section ref={ref} className="case-sec path" aria-labelledby="path-title">
      <div className="wrap">
        <Head id="path-title" k="The path" title="How I got here" />
        <div className="path__wrap">
          <div className="path__line" aria-hidden="true"><span /></div>
          <ol className="path__list">
            {path.map((p, i) => (
              <li key={p.t} className="path__stop">
                <span className="t-stencil path__n">{i + 1}</span>
                <div>
                  <p className="t-label path__t">{p.t}</p>
                  <h3 className="t-display path__h">{p.h}</h3>
                  <p className="path__d">{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ─── Experience ─────────────────────────────────────────────────────── */
const experience = [
  { org: 'AERRAND', role: 'Co-founder and product lead', field: 'Local delivery, live on iOS and Android', when: '2025 to now', to: '/work/aerrand', img: aerrand.customer.home },
  { org: 'Brain Box', role: 'Product manager', field: 'Exam preparation, MVP scoped', when: '2026 to now', to: '/work/brain-box', img: brainbox.home },
  { org: 'Right Click IT Solutions', role: 'Full-stack engineer and UI/UX designer', field: 'ERP software for government bodies in oil and gas, confidential', when: '2022 to 2024' },
  { org: 'Peterson Spring', role: 'Production supervisor', field: 'Automotive spring components', when: '2026 to now' },
  { org: 'Stellantis', role: 'Production supervisor', field: 'Windsor Assembly Plant, 400+ vehicles a shift', when: '2025 to 2026' },
]

function Experience() {
  const ref = useRise('.xp')
  return (
    <section ref={ref} className="case-sec case-sec--tint" aria-labelledby="xp-title">
      <div className="wrap">
        <Head id="xp-title" k="Experience" title="Where I’ve done the work" />
        <ul className="xps">
          {experience.map(x => {
            const body = (
              <>
                <span className="t-display xp__org">{x.org}</span>
                <span className="xp__role">{x.role}</span>
                <span className="xp__field">{x.field}</span>
                <span className="xp__when">{x.when}{x.to && <span className="xp__go" aria-hidden="true"><ArrowUpRight size={16} /></span>}</span>
                {x.img && <img className="xp__peek" src={x.img} alt="" aria-hidden="true" />}
              </>
            )
            return (
              <li key={x.org} className="xp">
                {x.to ? <Link to={x.to} className="xp__row xp__row--link" data-cursor="Case study">{body}</Link> : <div className="xp__row">{body}</div>}
              </li>
            )
          })}
        </ul>
        {site.resumeUrl
          ? (
            <div className="xp__resumes">
              <a href={site.resumeUrl} className="btn btn--ink" target="_blank" rel="noreferrer">Product manager resume<span className="btn__icon"><ArrowUpRight /></span></a>
              {site.designResumeUrl && <a href={site.designResumeUrl} className="btn btn--ink" target="_blank" rel="noreferrer">Product designer resume<span className="btn__icon"><ArrowUpRight /></span></a>}
            </div>
          )
          : SHOW_TODOS && <p className="todo">Add your resume to /public and set resumeUrl in src/content/site.ts</p>}
      </div>
    </section>
  )
}

/* ─── Education ──────────────────────────────────────────────────────── */
const education = [
  { org: 'University of Windsor', role: 'MEng, Electrical and Computer Engineering', field: 'Windsor, Ontario', when: '2025 to 2026' },
  { org: 'Afe Babalola University', role: 'BEng, Electrical and Computer Engineering', field: 'Ado Ekiti, Nigeria', when: '2018 to 2023' },
]

function Education() {
  const ref = useRise('.xp')
  return (
    <section ref={ref} className="case-sec" aria-labelledby="edu-title">
      <div className="wrap">
        <Head id="edu-title" k="Education" title="Trained as an engineer" />
        <ul className="xps">
          {education.map(x => (
            <li key={x.org} className="xp">
              <div className="xp__row">
                <span className="t-display xp__org">{x.org}</span>
                <span className="xp__role">{x.role}</span>
                <span className="xp__field">{x.field}</span>
                <span className="xp__when">{x.when}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ─── Capabilities ───────────────────────────────────────────────────── */
const caps = [
  { h: 'Decides what matters', items: ['Product strategy', 'Discovery and user research', 'Prioritization and roadmaps', 'Requirements and user stories', 'Success metrics'] },
  { h: 'Defines how it works', items: ['Information architecture', 'Interaction and UI design', 'Design systems', 'Prototyping'] },
  { h: 'Makes it real', items: ['React and TypeScript', 'Frontend builds', 'Working with engineers on scope', 'Shipping to the App Store and Google Play'] },
  { h: 'Gets it done', items: ['Leading teams of up to 79', 'Coordinating 17 team leads', 'Quality and root-cause analysis', 'Shift planning and handoffs', 'Process improvement'] },
]

function Capabilities() {
  const ref = useRise('.cap')
  return (
    <section ref={ref} className="case-sec" aria-labelledby="cap-title">
      <div className="wrap">
        <Head id="cap-title" k="What I bring" title="Product, design, code and the floor">
          These aren’t separate jobs to me. Each one makes the others sharper, and moving between them is what lets me be the bridge between users and the team building for them.
        </Head>
        <div className="caps">
          {caps.map(c => (
            <div key={c.h} className="cap">
              <h3 className="cap__h">{c.h}</h3>
              <ul>{c.items.map(i => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function About() {
  useTitle('About', 'Arnold Ihechere has designed and built software since 2022, co-founded AERRAND, and spent the past year leading automotive production lines.')
  return (
    <div className="about">
      <Intro />
      <div className="wrap ab-scrub">
        <ScrubWords className="insight__text">Design and code are my craft. The production floor added something I didn’t expect: the people doing the work usually know where the problem is. My job is to listen, find the root cause, cut what doesn’t matter and ship something that holds up under real conditions.</ScrubWords>
      </div>
      <Path />
      <Experience />
      <Education />
      <FloorLessons />
      <Capabilities />
    </div>
  )
}
