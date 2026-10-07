import { useEffect, useRef } from 'react'
import { Link } from '../lib/router'
import { gsap, reducedMotion, scrollVelocity } from '../lib/motion'
import { IPhone } from './devices'

export type ConveyorItem = {
  src: string
  alt: string
  to: string
  product: string
  screen: string
  finish?: 'natural' | 'black' | 'white'
}

/**
 * An overhead conveyor: phones hang from trolleys on a rail and travel across
 * the screen, the way parts move between stations on an assembly line.
 * Scrolling speeds the line up; hovering a phone slows it to a stop.
 * Each phone swings a little when the line changes speed.
 */
export function Conveyor({ items, label }: { items: ConveyorItem[]; label: string }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current!
    const carriers = Array.from(el.querySelectorAll<HTMLElement>('.carrier'))
    const hangers = carriers.map(c => c.querySelector<HTMLElement>('.carrier__hanger')!)
    const tags = carriers.map(c => c.querySelector<HTMLElement>('.carrier__tag')!)
    const n = carriers.length
    let spacing = 0, width = 0, total = 0

    const measure = () => {
      width = el.clientWidth
      const phone = carriers[0].querySelector<HTMLElement>('.iphone')!.offsetWidth
      spacing = Math.max(phone + 120, phone * 1.62)
      total = spacing * n
    }
    measure()

    if (reducedMotion()) {
      carriers.forEach((c, i) => { c.style.transform = `translate3d(${i * spacing + 24}px,0,0)` })
      return
    }

    let offset = 0
    let speed = 0
    let target = 1
    let hover = false
    const angle = new Array(n).fill(0)
    const omega = new Array(n).fill(0)
    const tagAngle = new Array(n).fill(0)
    const tagOmega = new Array(n).fill(0)
    let visible = true

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { rootMargin: '200px' })
    io.observe(el)

    const onEnter = () => { hover = true }
    const onLeave = () => { hover = false }
    carriers.forEach(c => { c.addEventListener('pointerenter', onEnter); c.addEventListener('pointerleave', onLeave) })

    const base = () => (width < 700 ? 26 : 42) // px per second

    const update = (_t: number, deltaMs: number) => {
      if (!visible) return
      const dt = Math.min(deltaMs, 50) / 1000
      const v = scrollVelocity()
      target = hover ? 0 : 1 + Math.min(Math.abs(v) * 0.22, 7) * Math.sign(v || 1)
      const prev = speed
      speed += (target - speed) * Math.min(1, dt * (hover ? 5 : 3))
      const accel = (speed - prev) / Math.max(dt, 0.001)
      offset -= speed * base() * dt

      for (let i = 0; i < n; i++) {
        let x = (i * spacing + offset) % total
        if (x < -spacing) x += total
        if (x > total - spacing) x -= total
        carriers[i].style.transform = `translate3d(${x.toFixed(2)}px,0,0)`

        // Damped pendulum, pushed by the line's acceleration.
        const k = 26, c = 3.4
        omega[i] += (-k * angle[i] - c * omega[i] - accel * 9) * dt
        angle[i] += omega[i] * dt
        angle[i] = Math.max(-9, Math.min(9, angle[i]))
        hangers[i].style.transform = `rotate(${angle[i].toFixed(3)}deg)`

        const k2 = 18, c2 = 2.2
        tagOmega[i] += (-k2 * tagAngle[i] - c2 * tagOmega[i] - accel * 16) * dt
        tagAngle[i] += tagOmega[i] * dt
        tagAngle[i] = Math.max(-16, Math.min(16, tagAngle[i]))
        tags[i].style.transform = `rotate(${(tagAngle[i] - 4).toFixed(3)}deg)`
      }
    }
    gsap.ticker.add(update)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      gsap.ticker.remove(update)
      io.disconnect(); ro.disconnect()
      carriers.forEach(c => { c.removeEventListener('pointerenter', onEnter); c.removeEventListener('pointerleave', onLeave) })
    }
  }, [items])

  return (
    <div ref={root} className="conveyor" aria-label={label} role="region">
      <div className="conveyor__rail" aria-hidden="true" />
      {items.map((it, i) => (
        <div className="carrier" key={i}>
          <svg className="carrier__trolley" viewBox="0 0 72 34" aria-hidden="true">
            <circle cx="18" cy="7" r="6.5" fill="#16211c" />
            <circle cx="54" cy="7" r="6.5" fill="#16211c" />
            <circle cx="18" cy="7" r="2" fill="#edefea" />
            <circle cx="54" cy="7" r="2" fill="#edefea" />
            <rect x="6" y="16" width="60" height="12" rx="3" fill="#16211c" />
            <rect x="33" y="27" width="6" height="7" fill="#16211c" />
          </svg>
          <div className="carrier__hanger">
            <span className="carrier__rod" aria-hidden="true" />
            <div className="carrier__tag" aria-hidden="true">
              <span className="carrier__tag-hole" />
              <span className="carrier__tag-product">{it.product}</span>
              <span className="carrier__tag-screen">{it.screen}</span>
            </div>
            <Link to={it.to} className="carrier__link" data-cursor="View case study" aria-label={`${it.product}: ${it.screen}. Open the case study`}>
              <span className="carrier__clamp" aria-hidden="true" />
              <IPhone src={it.src} alt={it.alt} finish={it.finish} width="var(--phone-w)" loading={i < 4 ? 'eager' : 'lazy'} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
