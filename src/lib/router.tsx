/**
 * A small router built for page transitions.
 * Navigation closes the "door" (see components/Door.tsx), swaps the page while
 * it is closed, then opens it again. It also keeps track of in-app history so
 * the Back button can return to the previous page, or to a sensible parent.
 *
 * Set VITE_ROUTER=hash to use #/path URLs on hosts without SPA rewrites.
 */
import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type AnchorHTMLAttributes, type CSSProperties, type ReactNode, type Ref,
} from 'react'

const HASH = import.meta.env.VITE_ROUTER === 'hash'

export type Phase = 'boot' | 'idle' | 'closing' | 'opening'

function normalize(path: string) {
  const clean = path.split('?')[0].split('#')[0] || '/'
  return clean.length > 1 ? clean.replace(/\/+$/, '') : '/'
}

function readPath() {
  if (typeof window === 'undefined') return '/'
  if (HASH) {
    const h = window.location.hash.slice(1)
    return h.startsWith('/') ? normalize(h) : '/'
  }
  return normalize(window.location.pathname)
}

export const toHref = (to: string) => (HASH ? `#${to}` : to)

/** URLs that show the same page component (so no transition between them). */
export const pageKey = (path: string) => (path === '/' || path === '/work' ? 'home' : path === '/aerrand' ? '/work/aerrand' : path)

type HistoryState = { idx?: number } | null

type RouterValue = {
  /** The page currently on screen. */
  pathname: string
  /** Where we are heading while the door is closing. */
  pending: string | null
  phase: Phase
  /** Increments every time a page has fully entered (door open). */
  enterKey: number
  canGoBack: boolean
  navigate: (to: string) => void
  back: (fallback: string) => void
  /** Called by the door once it is fully closed / fully open. */
  commit: () => void
  settle: () => void
}

const RouterContext = createContext<RouterValue | null>(null)

export function Router({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(readPath)
  const [pending, setPending] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('boot')
  const [enterKey, setEnterKey] = useState(0)
  const [idx, setIdx] = useState<number>(() => (window.history.state as HistoryState)?.idx ?? 0)
  const pendingRef = useRef<string | null>(null)
  const phaseRef = useRef<Phase>('boot')
  phaseRef.current = phase
  const pathRef = useRef(pathname)
  pathRef.current = pathname

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    if ((window.history.state as HistoryState)?.idx == null) window.history.replaceState({ idx: 0 }, '')
    const onPop = (e: PopStateEvent) => {
      setIdx((e.state as HistoryState)?.idx ?? 0)
      const to = readPath()
      if (pageKey(to) === pageKey(pathRef.current) && phaseRef.current === 'idle') {
        setPathname(to)
        window.dispatchEvent(new CustomEvent('route:same', { detail: to }))
        return
      }
      begin(to)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const begin = useCallback((to: string) => {
    pendingRef.current = to
    setPending(to)
    if (phaseRef.current === 'idle') setPhase('closing')
  }, [])

  const navigate = useCallback((to: string) => {
    const next = normalize(to)
    const current = readPath()
    if (next === current && phaseRef.current === 'idle') {
      // Same page: let the page handle it (e.g. scroll to top).
      window.dispatchEvent(new CustomEvent('route:same', { detail: next }))
      return
    }
    const nextIdx = ((window.history.state as HistoryState)?.idx ?? 0) + 1
    window.history.pushState({ idx: nextIdx }, '', toHref(next))
    setIdx(nextIdx)
    if (pageKey(next) === pageKey(current) && phaseRef.current === 'idle') {
      // Different URL, same page (e.g. / and /work): no door, just scroll.
      setPathname(next)
      window.dispatchEvent(new CustomEvent('route:same', { detail: next }))
      return
    }
    begin(next)
  }, [begin])

  const back = useCallback((fallback: string) => {
    const current = (window.history.state as HistoryState)?.idx ?? 0
    if (current > 0) window.history.back()
    else {
      window.history.replaceState({ idx: 0 }, '', toHref(normalize(fallback)))
      begin(normalize(fallback))
    }
  }, [begin])

  const commit = useCallback(() => {
    const to = pendingRef.current
    if (to) setPathname(to)
    pendingRef.current = null
    setPending(null)
    setPhase('opening')
  }, [])

  const settle = useCallback(() => {
    setPhase('idle')
    setEnterKey(k => k + 1)
    // A navigation may have been requested while the door was moving.
    if (pendingRef.current) setPhase('closing')
  }, [])

  const value = useMemo<RouterValue>(() => ({
    pathname, pending, phase, enterKey, canGoBack: idx > 0, navigate, back, commit, settle,
  }), [pathname, pending, phase, enterKey, idx, navigate, back, commit, settle])

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used inside <Router>')
  return ctx
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; ref?: Ref<HTMLAnchorElement> }

export function Link({ to, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter()
  return (
    <a
      href={toHref(to)}
      onClick={e => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        navigate(to)
      }}
      {...rest}
    />
  )
}

type NavLinkProps = Omit<LinkProps, 'style' | 'className'> & {
  match?: string[]
  className?: (active: boolean) => string
  style?: (active: boolean) => CSSProperties
}

export function NavLink({ to, match, className, style, ...rest }: NavLinkProps) {
  const { pathname } = useRouter()
  const prefixes = match ?? [to]
  const active = prefixes.some(p => pathname === p || pathname.startsWith(p + '/'))
  return (
    <Link to={to} aria-current={active ? 'page' : undefined}
      className={className?.(active)} style={style?.(active)} {...rest} />
  )
}
