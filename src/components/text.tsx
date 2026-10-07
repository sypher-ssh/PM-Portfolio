import { createElement, useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { gsap, SplitText, reducedMotion, useGsap } from '../lib/motion'

/** Calls `cb` when the door starts rolling up on this page. */
export function useDoorOpen(cb: () => void) {
  const ref = useRef(cb)
  ref.current = cb
  useEffect(() => {
    const h = () => ref.current()
    window.addEventListener('door:open', h)
    return () => window.removeEventListener('door:open', h)
  }, [])
}

type RevealProps = {
  as?: ElementType
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Start when scrolled into view (default) or when the door opens. */
  on?: 'scroll' | 'door'
  delay?: number
  stagger?: number
  id?: string
}

/** Text that rises into place line by line, each line behind its own mask. */
export function RevealLines({ as = 'p', children, className = '', style, on = 'scroll', delay = 0, stagger = 0.09, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const play = useRef<() => void>(() => {})
  const opened = useRef(false)

  useGsap(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    let anim: gsap.core.Tween | null = null
    const split = SplitText.create(el, {
      type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
      onSplit(self: SplitText) {
        anim?.kill()
        anim = gsap.from(self.lines, {
          yPercent: 108, duration: 1.1, ease: 'expo.out', stagger, delay,
          paused: on === 'door' && !opened.current,
          scrollTrigger: on === 'scroll' ? { trigger: el, start: 'top 88%', once: true } : undefined,
        })
        return anim
      },
    })
    play.current = () => anim?.play()
    return () => split.revert()
  }, [], ref)

  useDoorOpen(() => { opened.current = true; if (on === 'door') play.current() })

  return createElement(as, { ref, className, style, id }, children)
}

/** A paragraph whose words light up one by one as you scroll through it. */
export function ScrubWords({ children, className = '' }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  useGsap(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    const split = SplitText.create(el, { type: 'words', wordsClass: 'scrub-word' })
    gsap.fromTo(split.words, { opacity: 0.16 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 42%', scrub: 0.6 },
    })
    return () => split.revert()
  }, [], ref)
  return <p ref={ref} className={className}>{children}</p>
}

/** Counts up to `value` the first time it scrolls into view. */
export function CountUp({ value, className = '' }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useGsap(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    const obj = { n: 0 }
    el.textContent = '0'
    gsap.to(obj, {
      n: value, duration: 1.6, ease: 'power3.out',
      onUpdate: () => { el.textContent = String(Math.round(obj.n)) },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
  }, [value], ref)
  return <span ref={ref} className={className}>{value}</span>
}
