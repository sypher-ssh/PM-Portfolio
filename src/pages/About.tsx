import { useRef } from 'react'
import { gsap, reducedMotion, useGsap } from '../lib/motion'
import { useTitle } from '../lib/hooks'
import { site, SHOW_TODOS } from '../content/site'
import { aerrand, brainbox, junkcycle } from '../content/screens'
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
          <p className="t-lead ab-hero__lead">I’m {site.name}, a product designer and product manager in {site.location}. I’ve designed and built software for four years: enterprise software at Right Click IT Solutions, and now Aerrand, a delivery app live on the App Store and Google Play, where I lead design and product. I also created the brand identity JunkCycle still uses. Alongside that, I’ve supervised automotive production on the night shift for the past year.</p>
          <dl className="ab-hero__facts">
            <div><dt>Years designing and building software</dt><dd className="t-stencil">4</dd></div>
            <div><dt>Apps live on both stores</dt><dd className="t-stencil">2</dd></div>
            <div><dt>Deliveries in the Aerrand pilot</dt><dd className="t-stencil">100+</dd></div>
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ─── Path: four stations, in order ──────────────────────────────────── */
const path = [
  { t: 'Engineering, 2018 to 2026', h: 'Learning how things are built', d: 'A bachelor’s in electrical and computer engineering at Afe Babalola University in Ado Ekiti, Nigeria, gave me systems thinking, problem decomposition and a working knowledge of how software behaves at the implementation level. A master’s in the same field at the University of Windsor, Ontario followed.' },
  { t: 'Design and build, 2022 to 2024', h: 'Designing and shipping software', d: 'At Right Click IT Solutions, a contractor to government and oil and gas organizations in Nigeria, I worked on the brand redesign for NNPC Ltd, Nigeria’s national oil company, and redesigned and built ERP software for NNPC and NUPRC, covering offshore work like rig management.' },
  { t: 'Design and product, 2025 to now', h: 'Leading design and product', d: 'I lead design and product at Aerrand and took it from a student survey to two apps live on the App Store and Google Play. A 100+ delivery pilot shaped the 2.0 redesign, now live. I’m also designing Brain Box, an exam-prep app for newcomers.' },
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
  { org: 'Aerrand', role: 'Product manager and product designer', field: 'Local delivery, live on iOS and Android', when: '2025 to now', to: '/work/aerrand', img: aerrand.customer.home },
  { org: 'Brain Box', role: 'Product designer', field: 'Exam preparation, prototype built', when: '2026 to now', to: '/work/brain-box', img: brainbox.home },
  { org: 'JunkCycle', role: 'Brand and web designer, freelance', field: 'Brand identity, still in use, and the first website', when: '2025', to: '/work/junkcycle', img: junkcycle.mobile.hero },
  { org: 'Right Click IT Solutions', role: 'Design engineer', field: 'NNPC brand redesign, and ERP software for NNPC and NUPRC', when: '2022 to 2024' },
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
  { h: 'Designs how it works', items: ['User research and surveys', 'Information architecture and flows', 'Interaction and UI design', 'Design systems', 'Brand identity', 'Prototyping'] },
  { h: 'Decides what matters', items: ['Product strategy', 'Competitive analysis', 'Prioritization and roadmaps', 'Requirements and user stories', 'Pilots and success metrics'] },
  { h: 'Makes it real', items: ['React and TypeScript', 'Frontend builds', 'Working with engineers on scope', 'Shipping to the App Store and Google Play'] },
  { h: 'Gets it done', items: ['Leading teams of up to 79', 'Coordinating 17 team leads', 'Quality and root-cause analysis', 'Shift planning and handoffs', 'Process improvement'] },
]

function Capabilities() {
  const ref = useRise('.cap')
  return (
    <section ref={ref} className="case-sec" aria-labelledby="cap-title">
      <div className="wrap">
        <Head id="cap-title" k="What I bring" title="Design, product, code and the floor">
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
  useTitle('About', 'Arnold Ihechere is a product designer and product manager who has designed and built software since 2022, leads design and product at Aerrand, and created the JunkCycle brand.')
  return (
    <div className="about">
      <Intro />
      <div className="wrap ab-scrub">
        <ScrubWords className="insight__text">Design and code are my craft. I start with the people who’ll use the product, cut what doesn’t matter, and ship something that holds up in real life. The production floor taught me the same thing from another angle: the people doing the work usually know where the problem is.</ScrubWords>
      </div>
      <Path />
      <Experience />
      <Education />
      <FloorLessons />
      <Capabilities />
    </div>
  )
}
