import { Link } from '../lib/router'
import { useTitle } from '../lib/hooks'

export default function NotFound() {
  useTitle('Page not found')
  return (
    <section className="notfound">
      <div className="wrap notfound__inner">
        <p className="t-stencil notfound__code" aria-hidden="true">404</p>
        <h1 className="t-display notfound__title">This station doesn’t exist.</h1>
        <p className="t-lead">The page may have moved, or the link has a typo.</p>
        <Link to="/" className="btn btn--ink">Go to the home page</Link>
      </div>
    </section>
  )
}
