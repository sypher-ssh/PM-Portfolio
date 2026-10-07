import { useRef } from 'react'
import { gsap, reducedMotion, useGsap, type ScrollTrigger } from '../lib/motion'

/** The field note from the floor, with a small drawing of the fix. */
export function CarrierFix() {
  const ref = useRef<HTMLElement>(null)

  useGsap(() => {
    if (reducedMotion()) return
    const root = ref.current!
    const fall = root.querySelector('.cf__part--fall')
    const swingA = root.querySelector('.cf__swing--a')
    const swingB = root.querySelector('.cf__swing--b')
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true })
    tl.to([swingA, swingB], { rotate: 7, duration: 0.35, ease: 'sine.inOut', transformOrigin: '50% 0%' })
      .to([swingA, swingB], { rotate: -6, duration: 0.45, ease: 'sine.inOut' })
      .to(fall, { y: 150, rotate: 38, opacity: 0, duration: 0.7, ease: 'power2.in' }, '-=0.2')
      .to([swingA, swingB], { rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }, '-=0.5')
      .set(fall, { y: -40, rotate: 0, opacity: 0 })
      .to(fall, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '+=0.4')
    const st = { trigger: root, start: 'top 85%', end: 'bottom 10%', onToggle: (self: ScrollTrigger) => (self.isActive ? tl.play() : tl.pause()) }
    gsap.timeline({ scrollTrigger: st })
  }, [], ref)

  return (
    <figure ref={ref} className="fieldnote">
      <div className="fieldnote__art">
        <svg viewBox="0 0 560 270" role="img" aria-labelledby="cf-title">
          <title id="cf-title">Before: a part hung on a hook falls off the moving carrier. After: the part sits in a casing and stays put.</title>
          <line x1="16" y1="28" x2="544" y2="28" className="cf__rail" />
          {[150, 410].map(x => (
            <g key={x}>
              <circle cx={x - 20} cy="22" r="7" className="cf__wheel" />
              <circle cx={x + 20} cy="22" r="7" className="cf__wheel" />
              <rect x={x - 32} y="33" width="64" height="14" rx="3" className="cf__trolley" />
            </g>
          ))}
          {/* Before: a hook */}
          <g className="cf__swing cf__swing--a">
            <line x1="150" y1="47" x2="150" y2="92" className="cf__rod" />
            <path d="M150 92 v16 a10 10 0 1 1 -12 9" className="cf__hook" />
            <g className="cf__part cf__part--fall">
              <rect x="112" y="122" width="76" height="46" rx="6" className="cf__partbody" />
              <circle cx="128" cy="145" r="6" className="cf__bolt" />
              <circle cx="172" cy="145" r="6" className="cf__bolt" />
            </g>
          </g>
          {/* After: a casing */}
          <g className="cf__swing cf__swing--b">
            <line x1="410" y1="47" x2="410" y2="92" className="cf__rod" />
            <path d="M362 92 h96" className="cf__rod" />
            <path d="M366 92 v94 a14 14 0 0 0 14 14 h60 a14 14 0 0 0 14 -14 v-94" className="cf__casing" />
            <g className="cf__part">
              <rect x="372" y="146" width="76" height="46" rx="6" className="cf__partbody" />
              <circle cx="388" cy="169" r="6" className="cf__bolt" />
              <circle cx="432" cy="169" r="6" className="cf__bolt" />
            </g>
          </g>
          <text x="150" y="252" textAnchor="middle" className="cf__cap">Before: hung on a hook</text>
          <text x="410" y="252" textAnchor="middle" className="cf__cap">After: held in a casing</text>
        </svg>
      </div>
      <figcaption className="fieldnote__copy">
        <p className="t-label fieldnote__k">Field note</p>
        <h3 className="t-display fieldnote__title">Parts that wouldn’t stay on the carrier</h3>
        <dl className="fieldnote__dl">
          <div><dt>Problem</dt><dd>Parts were hung on line carriers exactly as the process said, but the moving line kept shaking them loose. Every drop meant a part on the floor and a station waiting.</dd></div>
          <div><dt>Fix</dt><dd>I had a simple casing fabricated and mounted on the carrier, so parts sat secure all the way to their station. The fix went into the process, not onto the operators.</dd></div>
          <div><dt>Outcome</dt><dd>Parts reached their station reliably, and the drops, and the downtime that came with them, went down. The operators were never the problem. The process was.</dd></div>
        </dl>
      </figcaption>
    </figure>
  )
}
