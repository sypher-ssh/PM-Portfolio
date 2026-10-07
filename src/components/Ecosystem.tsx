import { useRef } from 'react'
import { gsap, reducedMotion, useGsap } from '../lib/motion'
import { aerrand } from '../content/screens'
import { IPhone } from './devices'

/**
 * One aerrand travelling through the AERRAND platform.
 * Scroll drives a single timeline: packets move along the wires between
 * five surfaces and the shared platform, the right screens change on the
 * phones, and the step list on the left follows along.
 */

type Node = 'customer' | 'aerrander' | 'web' | 'admin' | 'business'

const PATHS: Record<Node, string> = {
  customer: 'M200 320 C 290 250, 360 300, 428 318',
  aerrander: 'M800 320 C 710 390, 640 340, 572 322',
  web: 'M318 150 C 326 236, 400 262, 446 272',
  admin: 'M682 150 C 674 236, 600 262, 554 272',
  business: 'M500 478 C 500 450, 500 420, 500 392',
}

const STEPS = [
  {
    name: 'Request',
    text: 'A buyer found a used PS5 on Marketplace. In the customer app they pick Aerrand Guard and point it at the seller.',
  },
  {
    name: 'Match',
    text: 'The platform offers the job to a nearby Aerrander. The moment they accept, the customer, the business and the ops team all see the same status.',
  },
  {
    name: 'Inspect',
    text: 'At the seller’s door the Aerrander works through a checklist and sends photos. The item hasn’t moved and nobody has paid yet.',
  },
  {
    name: 'Approve',
    text: 'The buyer approves the inspection from their phone. Payment stays on hold until they accept the delivery.',
  },
  {
    name: 'Deliver',
    text: 'One “delivered” update reaches every surface at once, because every surface reads from the same source.',
  },
]

export function Ecosystem() {
  const ref = useRef<HTMLElement>(null)

  useGsap(() => {
    const root = ref.current!
    const q = gsap.utils.selector(root)
    const steps = q('.eco-step') as HTMLElement[]
    const setStep = (i: number) => {
      steps.forEach((s, j) => { s.classList.toggle('is-active', j === i); s.classList.toggle('is-done', j < i) })
      root.style.setProperty('--eco-step', String(i))
      const c = root.querySelector('.eco__count-n')
      if (c) c.textContent = String(i + 1)
    }
    setStep(0)

    const wire = (n: Node) => root.querySelector<SVGPathElement>(`.eco-wire--${n} .eco-wire__live`)!
    const node = (n: Node) => root.querySelector<HTMLElement>(`.eco-node--${n}`)!
    const packet = root.querySelector<SVGGElement>('.eco-packet')!
    const screens = (n: 'customer' | 'aerrander') => q(`.eco-node--${n} .eco-screen`) as HTMLElement[]

    // Prepare the live wires for drawing.
    ;(Object.keys(PATHS) as Node[]).forEach(n => {
      const p = wire(n)
      const len = p.getTotalLength()
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
    })
    gsap.set(screens('customer').slice(1), { autoAlpha: 0 })
    gsap.set(screens('aerrander').slice(1), { autoAlpha: 0 })

    if (reducedMotion()) {
      // A still, fully drawn system.
      ;(Object.keys(PATHS) as Node[]).forEach(n => gsap.set(wire(n), { strokeDashoffset: 0 }))
      gsap.set(packet, { autoAlpha: 0 })
      return
    }

    const pathEl = (n: Node) => root.querySelector<SVGPathElement>(`.eco-wire--${n} .eco-wire__base`)!
    const toCore = (n: Node, dur = 0.5) => ({ motionPath: { path: pathEl(n), align: pathEl(n), alignOrigin: [0.5, 0.5] as [number, number], start: 0, end: 1 }, duration: dur, ease: 'power1.inOut' })
    const fromCore = (n: Node, dur = 0.5) => ({ motionPath: { path: pathEl(n), align: pathEl(n), alignOrigin: [0.5, 0.5] as [number, number], start: 1, end: 0 }, duration: dur, ease: 'power1.inOut' })
    const draw = (dur = 0.5) => ({ strokeDashoffset: 0, duration: dur, ease: 'none' })
    const lit = () => ({ '--lit': 1, duration: 0.2 }) as gsap.TweenVars
    gsap.set(q('.eco-node'), { '--lit': 0 } as gsap.TweenVars)
    gsap.set(q('.eco-done'), { autoAlpha: 0, y: 6 })
    const swap = (list: HTMLElement[], from: number, to: number) => [
      [list[from], { autoAlpha: 0, duration: 0.25 }],
      [list[to], { autoAlpha: 1, duration: 0.25 }],
    ] as const

    const tl = gsap.timeline({ defaults: { ease: 'none' } })
    const pulse = q('.eco-core__pulse')[0]
    const ping = (at: number | string) => tl.fromTo(pulse, { scale: 0.6, autoAlpha: 0.9, transformOrigin: '50% 50%' }, { scale: 1.9, autoAlpha: 0, duration: 0.35, ease: 'power2.out', immediateRender: false }, at)

    // 1. Request: customer app to platform
    tl.addLabel('s0')
      .to(node('customer'), lit(), 's0')
      .set(packet, { autoAlpha: 1 }, 's0')
      .to(wire('customer'), draw(), 's0+=0.1')
      .to(packet, toCore('customer'), 's0+=0.1')
    ping('s0+=0.6')
    tl.add(() => {}, '+=0.25')

    // 2. Match: platform to Aerrander app, status visible to business and admin
    tl.addLabel('s1')
      .to(wire('aerrander'), draw(), 's1')
      .to(packet, fromCore('aerrander'), 's1')
      .to(node('aerrander'), lit(), 's1+=0.45')
      .to([wire('business'), wire('admin')], { strokeDashoffset: 0, duration: 0.45 }, 's1+=0.15')
      .to([node('business'), node('admin')], { '--lit': 1, duration: 0.2 } as gsap.TweenVars, 's1+=0.5')
    tl.add(() => {}, '+=0.25')

    // 3. Inspect: Aerrander back to platform, on to the customer
    tl.addLabel('s2')
    swap(screens('aerrander'), 0, 1).forEach(([el, v]) => tl.to(el, v, 's2'))
    tl.to(packet, toCore('aerrander', 0.45), 's2+=0.15')
    ping('s2+=0.6')
    tl.to(packet, fromCore('customer', 0.45), 's2+=0.62')
    swap(screens('customer'), 0, 1).forEach(([el, v]) => tl.to(el, v, 's2+=1'))
    tl.add(() => {}, '+=0.25')

    // 4. Approve: customer to platform to Aerrander
    tl.addLabel('s3')
      .to(packet, toCore('customer', 0.45), 's3')
    ping('s3+=0.45')
    tl.to(packet, fromCore('aerrander', 0.45), 's3+=0.47')
    swap(screens('aerrander'), 1, 2).forEach(([el, v]) => tl.to(el, v, 's3+=0.9'))
    tl.add(() => {}, '+=0.25')

    // 5. Deliver: Aerrander to platform, then out to every surface
    tl.addLabel('s4')
      .to(packet, toCore('aerrander', 0.45), 's4')
      .set(packet, { autoAlpha: 0 }, 's4+=0.46')
    ping('s4+=0.45')
    const fan = Array.from(root.querySelectorAll<SVGGElement>('.eco-fan'))
    const fanTo: Node[] = ['customer', 'web', 'admin', 'business']
    fan.forEach((f, i) => {
      tl.set(f, { autoAlpha: 1 }, 's4+=0.47').to(f, fromCore(fanTo[i], 0.5), 's4+=0.47').set(f, { autoAlpha: 0 }, 's4+=0.98')
    })
    tl.to(wire('web'), draw(0.5), 's4+=0.47')
      .to(node('web'), lit(), 's4+=0.95')
    swap(screens('customer'), 1, 2).forEach(([el, v]) => tl.to(el, v, 's4+=0.95'))
    tl.to(q('.eco-done'), { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.3 }, 's4+=1')
    tl.add(() => {}, '+=0.4')

    const labels = ['s0', 's1', 's2', 's3', 's4'].map(l => tl.labels[l] / tl.duration())

    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: root.querySelector('.eco__stage'), start: 'top top', end: () => `+=${window.innerHeight * 4.2}`,
          pin: true, scrub: 0.8, anticipatePin: 1,
          onUpdate: self => { let i = 0; labels.forEach((l, k) => { if (self.progress >= l - 0.001) i = k }); setStep(i) },
        },
      }).add(tl)
    })
    mm.add('(max-width: 899px)', () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: root.querySelector('.eco__stage'), start: 'top top', end: () => `+=${window.innerHeight * 3.2}`,
          pin: true, scrub: 0.8,
          onUpdate: self => { let i = 0; labels.forEach((l, k) => { if (self.progress >= l - 0.001) i = k }); setStep(i) },
        },
      }).add(tl)
    })
    return () => mm.revert()
  }, [], ref)

  return (
    <section ref={ref} className="eco" aria-labelledby="eco-title" data-chapter="system" data-label="The system">
      <div className="eco__stage">
        <div className="wrap eco__grid">
          <div className="eco__copy">
            <p className="t-label eco__k">The system</p>
            <h2 id="eco-title" className="t-display eco__title">One aerrand, five surfaces</h2>
            <p className="eco__intro">AERRAND isn’t one app. It’s five surfaces for three audiences on one shared delivery platform. Follow a single Aerrand Guard delivery through it.</p>
            <p className="eco__count" aria-hidden="true"><span className="t-stencil eco__count-n">1</span><span className="t-stencil eco__count-of">/5</span></p>
            <ol className="eco-steps">
              {STEPS.map(s => (
                <li key={s.name} className="eco-step">
                  <span className="eco-step__name">{s.name}</span>
                  <p className="eco-step__text">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="eco__diagram" role="img" aria-label="Diagram: the customer app, Aerrander app, customer web, business dashboard, and admin and operations tools all connect to one shared delivery platform.">
            <svg className="eco__svg" viewBox="0 0 1000 640" aria-hidden="true">
              <defs>
                <radialGradient id="eco-core-g" cx="50%" cy="40%" r="65%">
                  <stop offset="0" stopColor="#7a3cff" />
                  <stop offset="1" stopColor="#3a0aa3" />
                </radialGradient>
                <filter id="eco-glow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <pattern id="eco-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1.2" cy="1.2" r="1.2" fill="rgba(204,170,255,.13)" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="1000" height="640" fill="url(#eco-dots)" />
              <circle cx="500" cy="320" r="150" className="eco-ring" />
              <circle cx="500" cy="320" r="230" className="eco-ring eco-ring--2" />

              {(Object.keys(PATHS) as Node[]).map(n => (
                <g key={n} className={`eco-wire eco-wire--${n}`}>
                  <path d={PATHS[n]} className="eco-wire__base" />
                  <path d={PATHS[n]} className="eco-wire__live" />
                </g>
              ))}

              <g className="eco-core">
                <circle cx="500" cy="320" r="72" className="eco-core__pulse" />
                <circle cx="500" cy="320" r="72" fill="url(#eco-core-g)" />
                <circle cx="500" cy="320" r="72" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1.5" />
                <text x="500" y="313" textAnchor="middle" className="eco-core__t">Shared</text>
                <text x="500" y="336" textAnchor="middle" className="eco-core__t">platform</text>
              </g>

              <g className="eco-packet" filter="url(#eco-glow)" style={{ opacity: 0 }}>
                <circle r="9" fill="#ccaaff" />
                <circle r="4" fill="#fff" />
              </g>
              {[0, 1, 2, 3].map(i => (
                <g key={i} className="eco-fan" filter="url(#eco-glow)" style={{ opacity: 0 }}>
                  <circle r="7" fill="#ccaaff" />
                  <circle r="3" fill="#fff" />
                </g>
              ))}
            </svg>

            <div className="eco-node eco-node--customer">
              <IPhone alt="" width="100%" statusBar={false} finish="black">
                <img className="eco-screen" src={aerrand.customer.guard} alt="" />
                <img className="eco-screen" src={aerrand.customer.approve} alt="" />
                <img className="eco-screen" src={aerrand.customer.delivered} alt="" />
              </IPhone>
              <span className="eco-node__label">Customer app<em>Customers</em></span>
              <span className="eco-done" aria-hidden="true">Delivered</span>
            </div>
            <div className="eco-node eco-node--aerrander">
              <IPhone alt="" width="100%" statusBar={false} finish="natural">
                <img className="eco-screen" src={aerrand.aerrander.home} alt="" />
                <img className="eco-screen" src={aerrand.aerrander.inspect} alt="" />
                <img className="eco-screen" src={aerrand.aerrander.done} alt="" />
              </IPhone>
              <span className="eco-node__label">Aerrander app<em>Aerranders</em></span>
            </div>
            <div className="eco-node eco-node--web">
              <div className="mini-browser mini-browser--web">
                <div className="mini-browser__bar"><i /><i /><i /></div>
                <div className="mini-browser__web">
                  <span className="mini-browser__mark">aerrand</span>
                  <span className="mini-browser__line" /><span className="mini-browser__line mini-browser__line--s" />
                  <span className="mini-browser__field" />
                </div>
              </div>
              <span className="eco-node__label">Customer web<em>Customers</em></span>
              <span className="eco-done" aria-hidden="true">Delivered</span>
            </div>
            <div className="eco-node eco-node--admin">
              <div className="mini-browser">
                <div className="mini-browser__bar"><i /><i /><i /></div>
                <img src={aerrand.admin} alt="" />
              </div>
              <span className="eco-node__label">Admin and operations<em>Platform team</em></span>
              <span className="eco-done" aria-hidden="true">Delivered</span>
            </div>
            <div className="eco-node eco-node--business">
              <div className="mini-browser">
                <div className="mini-browser__bar"><i /><i /><i /></div>
                <img src={aerrand.business} alt="" />
              </div>
              <span className="eco-node__label">Business dashboard<em>Businesses</em></span>
              <span className="eco-done" aria-hidden="true">Delivered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
