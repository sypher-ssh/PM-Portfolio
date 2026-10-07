import { useEffect, useRef, useState } from 'react'
import { useRouter } from '../lib/router'
import { gsap, ScrollTrigger, lockScroll, reducedMotion, scrollTo } from '../lib/motion'
import { pageLabels, site } from '../content/site'

/**
 * A roll-up shop door. It covers the screen on first load (with a short
 * progress line) and between pages: it rolls down, the page swaps behind it,
 * and it rolls back up.
 */
export function Door() {
  const { phase, pending, pathname, commit, settle } = useRouter()
  const panel = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [text, setText] = useState(site.name)

  // First load: door starts closed, then rolls up.
  useEffect(() => {
    if (phase !== 'boot') return
    let cancelled = false, started = false
    const p = panel.current!, l = label.current!, b = bar.current!
    lockScroll(true)
    if (reducedMotion()) {
      gsap.set(p, { yPercent: -101 }); lockScroll(false); settle()
      window.dispatchEvent(new Event('door:open')); return
    }
    gsap.set(p, { yPercent: 0 })
    gsap.set(b, { scaleX: 0 })
    const fonts = document.fonts?.ready ?? Promise.resolve()
    const tl = gsap.timeline({ paused: true })
    tl.fromTo(l, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'expo.out' })
      .to(b, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0.1)
      .add(() => { ScrollTrigger.refresh() })
      .to(l, { yPercent: -60, opacity: 0, duration: 0.5, ease: 'power3.in' }, '+=0.1')
      .add(() => { window.dispatchEvent(new Event('door:open')) }, '-=0.25')
      .to(p, { yPercent: -101, duration: 0.95, ease: 'power4.inOut' }, '-=0.3')
      .add(() => { lockScroll(false); settle() }, '-=0.35')
    const start = performance.now()
    Promise.race([fonts, new Promise(r => setTimeout(r, 1500))]).then(() => {
      const wait = Math.max(0, 150 - (performance.now() - start))
      setTimeout(() => { if (!cancelled) { started = true; tl.play() } }, wait)
    })
    // Once the door is moving, let it finish even though settle() changes the phase.
    return () => { cancelled = true; if (!started) tl.kill() }
  }, [phase, settle])

  // Close: roll down, then swap the page.
  useEffect(() => {
    if (phase !== 'closing') return
    const p = panel.current!, l = label.current!, b = bar.current!
    setText(pending ? pageLabels[pending] ?? '' : '')
    lockScroll(true)
    if (reducedMotion()) {
      gsap.set(p, { yPercent: -101 }); commit(); return
    }
    const tl = gsap.timeline()
    gsap.set(b, { scaleX: 0 })
    tl.fromTo(p, { yPercent: -101 }, { yPercent: 0, duration: 0.62, ease: 'power3.inOut' })
      .fromTo(l, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, 0.32)
      .to(b, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 0.35)
      .add(() => commit(), '+=0.02')
    return () => { tl.kill() }
  }, [phase, pending, commit])

  // Open: once the new page has rendered behind the door.
  useEffect(() => {
    if (phase !== 'opening') return
    const p = panel.current!, l = label.current!
    scrollTo(0, { immediate: true })
    if (reducedMotion()) {
      lockScroll(false); ScrollTrigger.refresh(); settle()
      window.dispatchEvent(new Event('door:open')); return
    }
    let tl: gsap.core.Timeline | null = null
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      tl = gsap.timeline()
      tl.add(() => { window.dispatchEvent(new Event('door:open')) }, 0.1)
        .to(l, { yPercent: -60, opacity: 0, duration: 0.45, ease: 'power3.in' }, 0)
        .to(p, { yPercent: -101, duration: 0.85, ease: 'power4.inOut' }, 0.12)
        .add(() => { lockScroll(false); settle() }, '-=0.35')
    }))
    return () => { if (!tl) cancelAnimationFrame(raf) }
  }, [phase, settle, pathname])

  return (
    <div className="door" aria-hidden={phase === 'idle'}>
      <div ref={panel} className="door__panel">
        <div className="door__slats" />
        <div ref={label} className="door__label">
          <span className="t-display">{text}</span>
        </div>
        <div className="door__rail">
          <div ref={bar} className="door__progress" />
          <span className="door__handle" />
        </div>
      </div>
      {phase !== 'idle' && <span className="sr-only" role="status">Loading {text}</span>}
    </div>
  )
}
