import { useLayoutEffect, useRef, type ReactNode } from 'react'

/**
 * Sizes its lines so the widest one spans the container exactly.
 * Each child line must be a block-level span with white-space: nowrap.
 * Renders a <span> so it can sit inside headings.
 */
export function FitText({ children, className = '', max = 600 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const el = ref.current!
    let last = ''
    const fit = () => {
      el.style.fontSize = '100px'
      const lines = Array.from(el.children) as HTMLElement[]
      const widest = Math.max(...lines.map(l => l.scrollWidth))
      const avail = el.clientWidth
      if (!widest || !avail) { el.style.fontSize = last; return }
      last = `${Math.min(max, (avail / widest) * 100 * 0.995).toFixed(2)}px`
      el.style.fontSize = last
    }
    fit()
    let w = el.clientWidth
    const ro = new ResizeObserver(() => { if (el.clientWidth !== w) { w = el.clientWidth; fit() } })
    ro.observe(el)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
  }, [max])
  return <span ref={ref} className={`fit ${className}`}>{children}</span>
}
