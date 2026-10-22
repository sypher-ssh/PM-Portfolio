/** Every app screen used on the site, imported once so pages can share them. */
import aHome from '../assets/aerrand/v2/home.webp'
import aGuard from '../assets/aerrand/v2/home-guard.webp'
import aApprove from '../assets/aerrand/v2/approve.webp'
import aWelcome from '../assets/aerrand/v2/welcome.webp'
import aSend from '../assets/aerrand/v2/send.webp'
import aDelivered from '../assets/aerrand/v2/delivered.webp'
import rHome from '../assets/aerrand/v2/aerrander-home.webp'
import rInspect from '../assets/aerrand/v2/aerrander-inspect.webp'
import rEarnings from '../assets/aerrand/v2/aerrander-earnings.webp'
import rDone from '../assets/aerrand/v2/aerrander-done.webp'
import v1Home from '../assets/aerrand/v1/home.webp'
import v1Aerrander from '../assets/aerrand/v1/aerrander-home.webp'
import admin from '../assets/aerrand/admin.webp'
import icon from '../assets/aerrand/icon.png'
import scooter from '../assets/aerrand/vehicles/scooter.webp'
import moto from '../assets/aerrand/vehicles/moto.webp'
import car from '../assets/aerrand/vehicles/car.webp'
import truck from '../assets/aerrand/vehicles/truck.webp'
import business from '../assets/aerrand/business.webp'
import bWelcome from '../assets/brainbox/welcome.webp'
import bPlan from '../assets/brainbox/plan.webp'
import bNeeds from '../assets/brainbox/needs.webp'
import bHome from '../assets/brainbox/home.webp'
import bLearn from '../assets/brainbox/learn.webp'
import bPractice from '../assets/brainbox/practice.webp'
import bMock from '../assets/brainbox/mock.webp'
import bQuestion from '../assets/brainbox/question.webp'
import jHero from '../assets/junkcycle/d-hero.webp'
import jServices from '../assets/junkcycle/d-services.webp'
import jHow from '../assets/junkcycle/d-how.webp'
import jContact from '../assets/junkcycle/d-contact.webp'
import jmHero from '../assets/junkcycle/m-hero.webp'
import jmServices from '../assets/junkcycle/m-services.webp'
import jmHow from '../assets/junkcycle/m-how.webp'
import jmWaitlist from '../assets/junkcycle/m-waitlist.webp'

export const aerrand = {
  icon, admin, business,
  customer: { home: aHome, guard: aGuard, approve: aApprove, welcome: aWelcome, send: aSend, delivered: aDelivered },
  aerrander: { home: rHome, inspect: rInspect, earnings: rEarnings, done: rDone },
  v1: { home: v1Home, aerrander: v1Aerrander },
  vehicles: { scooter, moto, car, truck },
}

export const brainbox = {
  welcome: bWelcome, plan: bPlan, needs: bNeeds, home: bHome,
  learn: bLearn, practice: bPractice, mock: bMock, question: bQuestion,
}

export const junkcycle = {
  desktop: { hero: jHero, services: jServices, how: jHow, contact: jContact },
  mobile: { hero: jmHero, services: jmServices, how: jmHow, waitlist: jmWaitlist },
}
