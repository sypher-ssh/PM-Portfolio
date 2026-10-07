import type { CSSProperties, ReactNode } from 'react'

type Finish = 'natural' | 'black' | 'white'

type IPhoneProps = {
  src?: string
  alt: string
  /** Width of the phone, any CSS length (e.g. 'clamp(160px, 18vw, 260px)'). */
  width?: string
  finish?: Finish
  /** Draw an iOS status bar over the screen. Off for screens that bring their own. */
  statusBar?: boolean
  /** Adds an extruded edge so the phone has real thickness when rotated in 3D. */
  depth?: boolean
  /** Soft contact shadow under the phone. */
  ground?: boolean
  className?: string
  style?: CSSProperties
  /** Extra layers drawn on the screen (e.g. a second image for version wipes). */
  children?: ReactNode
  loading?: 'lazy' | 'eager'
}

/** A realistic iPhone 16 Pro, drawn in CSS. Screens are 402 × 874 pt. */
export function IPhone({
  src, alt, width = '260px', finish = 'natural', statusBar = true, depth = false, ground = false,
  className = '', style, children, loading = 'lazy',
}: IPhoneProps) {
  return (
    <div className={`iphone ${className}`} data-finish={finish} style={{ width, ...style }} role="img" aria-label={alt}>
      {ground && <div className="iphone__shadow" aria-hidden="true" />}
      {depth && Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="iphone__slice" aria-hidden="true"
          style={{ transform: `translateZ(${-(i + 1) * 1.25}cqw)`, filter: `brightness(${0.86 - i * 0.025})` }} />
      ))}
      <div className="iphone__body">
        <span className="iphone__btn iphone__btn--action" />
        <span className="iphone__btn iphone__btn--volup" />
        <span className="iphone__btn iphone__btn--voldown" />
        <span className="iphone__btn iphone__btn--power" />
        <div className="iphone__bezel">
          <div className="iphone__screen">
            {src && <img src={src} alt="" loading={loading} decoding="async" width={402} height={874} className="iphone__shot" />}
            {children}
            {statusBar && <StatusBar />}
            <div className="iphone__island" />
            <div className="iphone__glare" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBar() {
  return (
    <div className="iphone__status" aria-hidden="true">
      <span>9:41</span>
      <span className="iphone__status-icons">
        <svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" /><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" /><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" /></svg>
        <svg viewBox="0 0 16 12"><path d="M8 11.6 5.6 9.1a3.4 3.4 0 0 1 4.8 0L8 11.6Z" fill="currentColor" /><path d="M3.5 7a6.3 6.3 0 0 1 9 0l-1.4 1.4a4.3 4.3 0 0 0-6.2 0L3.5 7Z" fill="currentColor" /><path d="M1.2 4.7a9.6 9.6 0 0 1 13.6 0l-1.4 1.4a7.6 7.6 0 0 0-10.8 0L1.2 4.7Z" fill="currentColor" /></svg>
        <svg viewBox="0 0 27 12"><rect x="0.5" y="0.5" width="23" height="11" rx="3.2" fill="none" stroke="currentColor" strokeOpacity=".4" /><rect x="2" y="2" width="20" height="8" rx="2" fill="currentColor" /><path d="M25 4v4c.8-.3 1.3-1.1 1.3-2S25.8 4.3 25 4Z" fill="currentColor" fillOpacity=".45" /></svg>
      </span>
    </div>
  )
}

/** A MacBook Pro 14" with the screen at 1512 × 982. */
export function Laptop({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`laptop ${className}`} role="img" aria-label={alt}>
      <div className="laptop__lid">
        <div className="laptop__notch" />
        <div className="laptop__screen">
          <img src={src} alt="" loading="lazy" decoding="async" width={1512} height={982} />
        </div>
      </div>
      <div className="laptop__base" />
    </div>
  )
}

/** A minimal browser window. */
export function Browser({ src, alt, url, width, height }: { src: string; alt: string; url: string; width: number; height: number }) {
  return (
    <div className="browser" role="img" aria-label={alt}>
      <div className="browser__bar" aria-hidden="true">
        <span className="browser__dot" style={{ background: '#ff5f57' }} />
        <span className="browser__dot" style={{ background: '#febc2e' }} />
        <span className="browser__dot" style={{ background: '#28c840' }} />
        <span className="browser__url">{url}</span>
      </div>
      <img src={src} alt="" loading="lazy" decoding="async" width={width} height={height} style={{ width: '100%', height: 'auto' }} />
    </div>
  )
}
