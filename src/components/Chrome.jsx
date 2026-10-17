import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { asset } from '../lib/asset'
import { Icon, Btn, A } from './ui'
import { clinic, nav, services } from '../content/kumbakonam'

export function TopBar() {
  return (
    <div className="hidden lg:block bg-brand-900 text-brand-100 text-xs">
      <div className="mx-auto max-w-7xl px-6 h-9 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <A href={clinic.phoneHref} className="flex items-center gap-2 hover:text-white transition-colors">
            <Icon name="Phone" size={14} /> {clinic.phone}
          </A>
          <span className="flex items-center gap-2"><Icon name="Clock" size={14} /> {clinic.hours}</span>
        </div>
        <span className="flex items-center gap-2"><Icon name="MapPin" size={14} /> {clinic.shortAddress}</span>
      </div>
    </div>
  )
}

// Landing sections watched by the scroll-spy, mapped to the nav item they belong to.
// (Gallery and Contact Us are separate pages here; their landing teasers highlight the same items.)
const SPY = [['home', 'home'], ['about', 'about'], ['services', 'services'], ['gallery', 'gallery'], ['book', null], ['contact', 'contact-us']]

const navId = (href) => {
  if (href.includes('#')) return href.split('#')[1]
  return href.split('/').filter(Boolean)[1] || 'home'
}

// Which nav item is active: the current page, or (on the landing page) the section being read.
function useActiveNav() {
  const { pathname } = useLocation()
  const parts = pathname.split('/').filter(Boolean)
  const i = parts.indexOf('kumbakonam')
  const seg = i === -1 ? undefined : parts[i + 1]
  const staticId = seg === 'gallery' || seg === 'contact-us' ? seg : seg === 'thankyou' ? 'none' : seg ? 'services' : null
  const [spy, setSpy] = useState('home')

  useEffect(() => {
    if (staticId) return
    const update = () => {
      let current = null
      let found = false
      for (const [id, item] of SPY) {
        const el = document.getElementById(id)
        if (el) found = true
        if (el && el.getBoundingClientRect().top <= 220) current = item
      }
      setSpy(found ? current : null)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [staticId, pathname])

  return staticId ?? spy
}

const navLink = (on) =>
  `relative px-4 py-2 text-sm font-medium transition-colors duration-200 after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-300 after:ease-out hover:text-brand-600 hover:after:scale-x-100 ${
    on ? 'text-brand-600 after:scale-x-100' : 'text-ink after:scale-x-0'
  }`

export function Header() {
  const activeNav = useActiveNav()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const last = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      setHidden(y > last.current && y > 240 && !open)
      last.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-out ${hidden ? '-translate-y-full' : 'translate-y-0'} ${
        scrolled ? 'bg-white/85 backdrop-blur-md shadow-[0_8px_30px_-18px_rgba(40,36,89,.4)]' : 'bg-white'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-[68px] lg:h-[76px] flex items-center justify-between">
        <A href="/kumbakonam" aria-label="AVM Smiles home">
          <img src={asset('/assets/images/avm-logo.png')} alt="AVM Smiles" className="h-11 lg:h-[52px] w-auto" width="87" height="52" />
        </A>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {nav.map((n) =>
            n.dropdown ? (
              <div key={n.label} className="relative group">
                <A href={n.href} aria-current={activeNav === navId(n.href) ? 'true' : undefined} className={`flex items-center gap-1 ${navLink(activeNav === navId(n.href))}`}>
                  {n.label} <Icon name="ChevronDown" size={16} className="transition-transform duration-200 group-hover:rotate-180" />
                </A>
                <div className="invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 absolute left-0 top-full pt-2">
                  <div className="w-72 rounded-2xl bg-white p-2 shadow-[0_18px_48px_-16px_rgba(40,36,89,.35)] border border-line">
                    {services.map((s) => (
                      <A key={s.slug} href={`/kumbakonam/${s.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink hover:bg-brand-50 hover:text-brand-600 transition-colors">
                        <Icon name={s.icon} size={18} className="text-brand-500" /> {s.title}
                      </A>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <A key={n.label} href={n.href} aria-current={activeNav === navId(n.href) ? 'true' : undefined} className={navLink(activeNav === navId(n.href))}>
                {n.label}
              </A>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Btn variant="accent" href="#book" className="hidden sm:inline-flex !py-2.5">
            <Icon name="CalendarCheck" size={18} /> Book Appointment
          </Btn>
          <button
            className="lg:hidden grid place-items-center h-11 w-11 rounded-full text-brand-700 hover:bg-brand-50 transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? 'X' : 'Menu'} />
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <div className={`lg:hidden fixed inset-0 top-[68px] transition-opacity duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-brand-900/50" onClick={() => setOpen(false)} />
        <nav
          aria-label="Mobile"
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-6 overflow-y-auto transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {nav.map((n) => (
            <A key={n.label} href={n.href} onClick={() => setOpen(false)} className="block py-3 text-base font-medium border-b border-line text-ink">
              {n.label}
            </A>
          ))}
          <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-[.18em] text-muted">Services</p>
          {services.map((s) => (
            <A key={s.slug} href={`/kumbakonam/${s.slug}`} className="flex items-center gap-3 py-2 text-sm text-ink">
              <Icon name={s.icon} size={18} className="text-brand-500" /> {s.title}
            </A>
          ))}
          <Btn variant="accent" href="#book" onClick={() => setOpen(false)} className="w-full mt-6">
            <Icon name="CalendarCheck" size={18} /> Book Appointment
          </Btn>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  // Lucide no longer ships brand logos, so these three are simple inline glyphs.
  const social = [
    ['Facebook', clinic.social.facebook, 'M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z'],
    ['Instagram', clinic.social.instagram, 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'],
    ['YouTube', clinic.social.youtube, 'M22 8.5a3 3 0 0 0-2-2C18 6 12 6 12 6s-6 0-8 .5a3 3 0 0 0-2 2C1.5 10.5 1.5 12 1.5 12s0 1.5.5 3.5a3 3 0 0 0 2 2C6 18 12 18 12 18s6 0 8-.5a3 3 0 0 0 2-2c.5-2 .5-3.5.5-3.5s0-1.5-.5-3.5zM10 15V9l5 3-5 3z'],
  ]
  return (
    <footer className="bg-brand-900 text-brand-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="inline-block bg-white rounded-2xl p-3">
            <img src={asset('/assets/images/avm-logo.png')} alt="AVM Smiles" className="h-12 w-auto" />
          </span>
          <p className="mt-5 text-sm leading-relaxed">Healthy Smiles Start Here &ndash; Care That Lasts.</p>
          <div className="mt-5 flex gap-3">
            {social.filter(([, href]) => href).map(([label, href, d]) => (
              <A key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid place-items-center h-10 w-10 rounded-full bg-white/10 hover:bg-accent hover:-translate-y-0.5 text-white transition-all duration-200">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" fillRule="evenodd" aria-hidden="true"><path d={d} /></svg>
              </A>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2.5 text-sm">
            {nav.map((n) => (
              <li key={n.label}><A href={n.href} className="hover:text-white transition-colors">{n.label}</A></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}><A href={`/kumbakonam/${s.slug}`} className="hover:text-white transition-colors">{s.title}</A></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><Icon name="Phone" size={18} className="shrink-0 mt-0.5 text-brand-300" /><A href={clinic.phoneHref} className="hover:text-white">{clinic.phone}</A></li>
            <li className="flex gap-3"><Icon name="MessageCircle" size={18} className="shrink-0 mt-0.5 text-brand-300" /><A href={clinic.whatsappHref} className="hover:text-white">WhatsApp us</A></li>
            <li className="flex gap-3"><Icon name="Mail" size={18} className="shrink-0 mt-0.5 text-brand-300" /><A href={`mailto:${clinic.email}`} className="hover:text-white break-all">{clinic.email}</A></li>
            <li className="flex gap-3"><Icon name="MapPin" size={18} className="shrink-0 mt-0.5 text-brand-300" /><span>{clinic.address}</span></li>
            <li className="flex gap-3"><Icon name="Clock" size={18} className="shrink-0 mt-0.5 text-brand-300" /><span>{clinic.hours}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-brand-300 pb-24 lg:pb-5">
        &copy; {new Date().getFullYear()} AVM Smiles Dental Clinic, Kumbakonam. All rights reserved.
      </div>
    </footer>
  )
}

export function FloatingActions() {
  return (
    <>
      <A
        href={clinic.whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="pulse-ring fixed z-40 right-4 bottom-20 lg:bottom-6 grid place-items-center h-14 w-14 rounded-full bg-whatsapp text-white shadow-lg hover:scale-110 transition-transform duration-200"
      >
        <Icon name="MessageCircle" size={28} />
      </A>
      <div className="lg:hidden fixed z-40 inset-x-0 bottom-0 bg-white/95 backdrop-blur border-t border-line p-3 grid grid-cols-2 gap-3">
        <Btn variant="outline" href={clinic.phoneHref}><Icon name="Phone" size={18} /> Call Now</Btn>
        <Btn variant="accent" href="#book"><Icon name="CalendarCheck" size={18} /> Book Now</Btn>
      </div>
    </>
  )
}
