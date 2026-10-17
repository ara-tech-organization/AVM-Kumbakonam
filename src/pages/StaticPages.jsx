import { useEffect } from 'react'
import { Icon, Btn, Reveal, Photo, A } from '../components/ui'
import BookingForm from '../components/BookingForm'
import { Gallery as BeforeAfter } from '../components/Sections'
import { clinic, gallerySlots } from '../content/kumbakonam'
import { useSeo } from '../lib/seo'
import meta from '../content/static-pages.json'

const seo = Object.fromEntries(Object.entries(meta).map(([k, v]) => [k, { ...v, path: `/kumbakonam/${v.slug}` }]))

function PageHero({ title, text }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-brand-100/70 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:py-16">
        <nav aria-label="Breadcrumb" className="rise flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted">
          <A href="/kumbakonam" className="hover:text-brand-600">Home</A>
          <Icon name="ChevronRight" size={14} />
          <span className="font-medium text-brand-700">{title}</span>
        </nav>
        <h1 className="rise mt-4 text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.15] text-brand-900" style={{ '--d': '100ms' }}>{title}</h1>
        <p className="rise mx-auto mt-4 max-w-2xl leading-relaxed text-muted" style={{ '--d': '200ms' }}>{text}</p>
      </div>
    </section>
  )
}

export function ContactPage({ treatment, setTreatment }) {
  useSeo(seo['contact-us'])
  const details = [
    ['Phone', 'Phone', clinic.phone, clinic.phoneHref],
    ['Mail', 'Email', clinic.email, `mailto:${clinic.email}`],
    ['MapPin', 'Address', clinic.address],
    ['Clock', 'Working Hours', clinic.hours.replace('Monday - Saturday: ', 'Monday to Saturday | ')],
  ]
  return (
    <>
      <PageHero
        title="Contact Us"
        text="Whether you need a routine dental checkup, cosmetic dentistry, dental implants, invisible aligners, or urgent dental care, AVM Smiles in Kumbakonam is here to help. Contact our team to book your appointment and take the next step toward a healthier, brighter smile."
      />
      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="text-[clamp(1.375rem,2.4vw,1.875rem)] font-semibold leading-tight text-brand-900">Book Your Dental Appointment in Kumbakonam</h2>
              <p className="mt-3 leading-relaxed text-muted">Our friendly dental team is ready to answer your questions, explain available treatment options, and help you make informed decisions about your oral health.</p>
            </Reveal>
            <div className="mt-6 space-y-4">
              {details.map(([i, t, v, href], k) => (
                <Reveal key={t} delay={k * 60}>
                  <div className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600"><Icon name={i} size={22} /></span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-900">{t}</p>
                      {href
                        ? <A href={href} className="mt-1 block break-words text-sm text-muted hover:text-brand-600">{v}</A>
                        : <p className="mt-1 text-sm text-muted">{v}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Btn variant="primary" href={clinic.mapsHref} target="_blank" rel="noreferrer"><Icon name="Navigation" size={18} /> Get Directions</Btn>
              <Btn variant="whatsapp" href={clinic.whatsappHref} target="_blank" rel="noreferrer"><Icon name="MessageCircle" size={18} /> WhatsApp</Btn>
              <Btn variant="outline" href={clinic.social.instagram} target="_blank" rel="noreferrer">Instagram</Btn>
              <Btn variant="outline" href={clinic.social.facebook} target="_blank" rel="noreferrer">Facebook</Btn>
            </div>
          </div>
          <Reveal delay={100}><BookingForm id="book" treatment={treatment} setTreatment={setTreatment} /></Reveal>
        </div>
        <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="h-96 overflow-hidden rounded-[28px] border border-line shadow-[0_18px_48px_-16px_rgba(40,36,89,.25)]">
              <iframe title="AVM Smiles Kumbakonam on Google Maps" src={clinic.mapEmbed} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="h-full w-full border-0" />
            </div>
            <p className="mt-6 text-center leading-relaxed text-muted">Visit AVM Smiles in Kumbakonam for comprehensive dental care tailored to your needs. We look forward to welcoming you and helping you maintain a healthy, confident smile for years to come.</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export function GalleryPage() {
  useSeo(seo.gallery)
  return (
    <>
      <PageHero
        title="Gallery"
        text="Take a look at the AVM Smiles gallery in Kumbakonam to explore our clinic facilities, dental care environment, and treatment spaces. Discover our dedication to comfortable dental experiences and personalized oral healthcare for every patient."
      />
      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-6 md:grid-cols-3">
          {gallerySlots.map((g, i) => (
            <Reveal key={g.label} delay={(i % 3) * 70}>
              <figure className="group overflow-hidden rounded-[20px] border border-line bg-white">
                <div className="aspect-[4/3] overflow-hidden">
                  <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
                    <Photo src={g.src} alt={g.label} label={g.label} icon="Camera" />
                  </div>
                </div>
                <figcaption className="px-4 py-3 text-sm font-medium text-brand-900">{g.label}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
      <BeforeAfter fullPage />
    </>
  )
}

export function ThankYouPage() {
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Thank You | AVM Smiles Dental Clinic in Kumbakonam'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    return () => {
      document.title = prevTitle
      robots.remove()
    }
  }, [])
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-brand-100/70 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:py-28">
        <span className="rise mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-600"><Icon name="CircleCheck" size={44} /></span>
        <h1 className="rise mt-6 text-[clamp(2rem,4.2vw,3rem)] font-bold leading-[1.15] text-brand-900" style={{ '--d': '100ms' }}>Thank You!</h1>
        <p className="rise mt-4 leading-relaxed text-muted" style={{ '--d': '200ms' }}>
          Your appointment request has been received. Our AVM Smiles Kumbakonam team will contact you shortly to confirm your visit.
        </p>
        <div className="rise mt-8 flex flex-wrap justify-center gap-3" style={{ '--d': '300ms' }}>
          <Btn variant="primary" href="/kumbakonam"><Icon name="Building2" size={18} /> Back to Home</Btn>
          <Btn variant="outline" href={clinic.phoneHref}><Icon name="Phone" size={18} /> {clinic.phone}</Btn>
        </div>
      </div>
    </section>
  )
}
