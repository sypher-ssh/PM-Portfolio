import { createContext, useContext, useEffect, useState } from 'react'
import { site } from '../content/site'

const DEFAULT_DESCRIPTION = 'Arnold Ihechere is a product manager and designer in Windsor, Ontario, and co-founder of AERRAND, a same-day delivery platform on the App Store and Google Play.'

/** Sets the tab title and the page description (used by search results). */
export function useTitle(page?: string, description?: string) {
  useEffect(() => {
    document.title = page ? `${page} | ${site.name}` : `${site.name} | ${site.role}`
    const meta = document.querySelector('meta[name="description"]')
    meta?.setAttribute('content', description ?? DEFAULT_DESCRIPTION)
  }, [page, description])
}

/** Local time where Arnold lives, e.g. "4:54 AM". */
export function useLocalTime() {
  const fmt = () => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: site.timeZone }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = window.setInterval(() => setTime(fmt()), 20_000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

export function useMedia(query: string) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on(); mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

/* Header tone: pages with a dark hero ask for light header text. */
export type Tone = 'dark' | 'light'
export const ToneContext = createContext<{ tone: Tone; setTone: (t: Tone) => void }>({ tone: 'dark', setTone: () => {} })
export function useHeaderTone(tone: Tone) {
  const { setTone } = useContext(ToneContext)
  useEffect(() => { setTone(tone); return () => setTone('dark') }, [tone, setTone])
}
