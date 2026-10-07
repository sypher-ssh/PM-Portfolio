import { useRef } from 'react'
import { gsap, reducedMotion, useGsap } from '../lib/motion'
import { CarrierFix } from './CarrierFix'

const lessons = [
  { title: 'Prioritizing under pressure', floor: 'Output, quality and safety compete every shift. You decide fast with partial information, and you own the call.', product: 'The same muscle behind roadmap trade-offs and scope cuts.' },
  { title: 'Getting many people aligned', floor: 'Seventeen team leads, one plan. Nothing moves until everyone knows the goal and their part in it.', product: 'Aligning engineering, design and stakeholders around one outcome.' },
  { title: 'Root cause over quick fixes', floor: 'A problem patched at the end of the line comes back tomorrow. You trace it to where it starts.', product: 'Finding the real problem before writing a single requirement.' },
  { title: 'Designing for real conditions', floor: 'Operators work at line speed. A process that ignores that gets worked around, or breaks.', product: 'Designing for how a product is actually used, not the ideal case.' },
]

/** What a year supervising production added to the product and design work. */
export function FloorLessons() {
  const ref = useRef<HTMLElement>(null)
  useGsap(() => {
    if (reducedMotion()) return
    gsap.utils.toArray<HTMLElement>('.lesson', ref.current!).forEach(row => {
      gsap.from(row.querySelector('.lesson__rule'), { scaleX: 0, transformOrigin: '0 50%', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 88%', once: true } })
      gsap.from(row.querySelectorAll('.lesson__cell'), { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: row, start: 'top 85%', once: true } })
    })
  }, [], ref)

  return (
    <section ref={ref} id="the-floor" className="floor on-night" aria-labelledby="floor-title">
      <div className="wrap">
        <p className="t-label floor__k">The past year, on the night shift</p>
        <h2 id="floor-title" className="t-display floor__title">What the production floor added</h2>
        <p className="t-lead floor__lead">Since 2025 I’ve also supervised automotive production, first at Stellantis and now at Peterson Spring, leading up to 79 people on a single line and coordinating 17 team leads. It didn’t replace the design and build work. It sharpened it.</p>
        <div className="lessons" role="table" aria-label="What the floor taught me, and where it shows up in product work">
          <div className="lessons__head" role="row">
            <span role="columnheader">Lesson</span><span role="columnheader">On the floor</span><span role="columnheader">In product and design</span>
          </div>
          {lessons.map(l => (
            <div key={l.title} className="lesson" role="row">
              <span className="lesson__rule" aria-hidden="true" />
              <h3 className="lesson__cell lesson__title t-display" role="cell">{l.title}</h3>
              <p className="lesson__cell" role="cell">{l.floor}</p>
              <p className="lesson__cell lesson__product" role="cell">{l.product}</p>
            </div>
          ))}
        </div>
        <CarrierFix />
      </div>
    </section>
  )
}
