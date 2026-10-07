/**
 * ─────────────────────────────────────────────────────────────────────
 *  EDIT ME. Your personal details live here.
 *  Anything left as an empty string is simply hidden on the live site.
 * ─────────────────────────────────────────────────────────────────────
 */
export const site = {
  name: 'Arnold Ihechere',
  firstName: 'Arnold',
  lastName: 'Ihechere',
  role: 'Product manager and designer',
  location: 'Windsor, Ontario',
  timeZone: 'America/Toronto',
  availability: 'Open to product manager and product designer roles',

  /** Public email shown on the contact page and footer, e.g. 'arnold@example.com'. */
  email: 'chiziarnold@gmail.com',
  /** Full LinkedIn URL, e.g. 'https://www.linkedin.com/in/your-handle'. */
  linkedin: 'https://www.linkedin.com/in/arnold-ihechere',
  /** Put your resume in /public (e.g. public/resume.pdf) and set this to '/resume.pdf'. */
  resumeUrl: '/Arnold_Ihechere_Resume.pdf',
  /** Second resume aimed at product design and UI/UX roles. */
  designResumeUrl: '/Arnold_Ihechere_Product_Designer_Resume.pdf',
  /**
   * Where the contact form posts. '/api/contact' is the Twilio SendGrid function
   * in /api (needs the environment variables listed in .env.example on Vercel).
   * If it isn't reachable, the form falls back to opening the visitor's email app.
   */
  formEndpoint: '/api/contact',

  /** AERRAND store listings. Badges appear on the case study for any link that's set. */
  aerrandAppStore: 'https://apps.apple.com/ca/app/aerrand/id6784352399',
  aerrandGooglePlay: 'https://play.google.com/store/apps/details?id=com.aerrand.customer',
  aerranderAppStore: 'https://apps.apple.com/ca/app/aerrander/id6784360776',
  aerranderGooglePlay: 'https://play.google.com/store/apps/details?id=com.aerrand.driverapp',
}

/** Show the dashed "fill this in" hints. On in dev, off in production builds. */
export const SHOW_TODOS = import.meta.env.DEV || import.meta.env.VITE_SHOW_TODOS === 'true'

/** Labels shown on the door during page transitions. */
export const pageLabels: Record<string, string> = {
  '/': 'Home',
  '/work': 'Selected work',
  '/work/aerrand': 'AERRAND',
  '/work/brain-box': 'Brain Box',
  '/aerrand': 'AERRAND',
  '/about': 'About',
  '/contact': 'Contact',
}

/** Where the Back button goes when there is no previous page in this visit. */
export function parentOf(path: string) {
  if (path.startsWith('/work/')) return '/work'
  return '/'
}
