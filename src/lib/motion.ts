import { useLayoutEffect, type DependencyList, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin)
gsap.defaults({ ease: 'power3.out', duration: 0.9 })

export { gsap, ScrollTrigger, SplitText }

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/* ─── Smooth scroll (Lenis), driven by GSAP's ticker ─────────────────── */
let lenis: Lenis | null = null
const tick = (time: number) => lenis?.raf(time * 1000)

export function startSmoothScroll() {
  if (lenis || reducedMotion()) return lenis
  lenis = new Lenis({ lerp: 0.105, smoothWheel: true, wheelMultiplier: 0.95 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
  return lenis
}

export function stopSmoothScroll() {
  if (!lenis) return
  gsap.ticker.remove(tick)
  lenis.destroy()
  lenis = null
}

export const getLenis = () => lenis

export function scrollTo(target: number | HTMLElement, opts: { offset?: number; immediate?: boolean } = {}) {
  const { offset = 0, immediate = false } = opts
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, force: true, duration: immediate ? 0 : 1.2 })
    return
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: immediate || reducedMotion() ? 'auto' : 'smooth' })
}

export function lockScroll(locked: boolean) {
  if (lenis) locked ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

/** Current scroll velocity in px per frame (smoothed by Lenis when active). */
export const scrollVelocity = () => lenis?.velocity ?? 0

/* ─── React glue ─────────────────────────────────────────────────────── */
/**
 * Runs GSAP code inside a context scoped to `scope`, and reverts every
 * tween and ScrollTrigger it created when the component unmounts or deps change.
 */
export function useGsap(
  fn: (self: gsap.Context) => void | (() => void),
  deps: DependencyList = [],
  scope?: RefObject<Element | null>,
) {
  useLayoutEffect(() => {
    const ctx = gsap.context(fn, scope?.current ?? undefined)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** Refresh ScrollTrigger once images inside the document have loaded (debounced). */
let refreshTimer = 0
export function queueRefresh(delay = 120) {
  window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), delay)
}

if (typeof window !== 'undefined') {
  document.addEventListener('load', e => { if ((e.target as HTMLElement)?.tagName === 'IMG') queueRefresh() }, true)
  if (document.fonts?.ready) document.fonts.ready.then(() => queueRefresh(0))
}
