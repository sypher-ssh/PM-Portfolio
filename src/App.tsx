import { Router, useRouter } from './lib/router'
import { Shell } from './components/Shell'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Aerrand from './pages/work/Aerrand'
import BrainBox from './pages/work/BrainBox'

function Routes() {
  const { pathname } = useRouter()
  switch (pathname) {
    case '/': return <Home />
    case '/work': return <Home focusWork />
    case '/work/aerrand':
    case '/aerrand': return <Aerrand />
    case '/work/brain-box': return <BrainBox />
    case '/about': return <About />
    case '/contact': return <Contact />
    default: return <NotFound />
  }
}

export default function App() {
  return (
    <Router>
      <Shell>
        <Routes />
      </Shell>
    </Router>
  )
}
