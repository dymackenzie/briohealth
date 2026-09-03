import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import Container from '@/components/ui/Container'
import ContactForm from '@/components/forms/ContactForm'
import Button from '@/components/ui/Button'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import CtaBandSection from '@/components/sections/CtaBandSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Brio Health',
  description: 'Contact Brio Health Inc. in Richmond BC. Call (604) 271-9355 or email info@yourbriohealth.com.',
}

export default async function ContactPage() {
  const settings = await client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } })

  const phone = settings?.phone || '(604) 271-9355'
  const email = settings?.email || 'info@yourbriohealth.com'
  const address = settings?.addressLine || '2168 – 3779 Sexsmith Road'
  const city = settings?.city || 'Richmond, BC'
  const hoursNote = settings?.hoursNote || 'Please call for current hours'
  const hours = settings?.hours || []

  return (
    <>
      {/* Hero */}
      <section className="bg-sand-200 py-[clamp(4rem,9vw,8rem)]">
        <Container>
          <div className="max-w-2xl">
            <p className="text-[0.8125rem] font-semibold tracking-[0.14em] uppercase text-teal-500 mb-3">Get in Touch</p>
            <h1 className="font-display text-[clamp(2.75rem,6vw,5rem)] text-ink-900 leading-[1.02] mb-4">Contact Us</h1>
            <p className="text-ink-500 text-[1.1875rem] leading-relaxed">
              Call or email us if you have any questions. To book an appointment, use the button below.
            </p>
            <div className="mt-6">
              <Button href="https://yourbriohealth.janeapp.com" external variant="primary" size="lg">
                Book Appointment
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact info + form */}
      <section className="bg-canvas py-[clamp(4rem,9vw,8rem)]">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact details */}
            <div>
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] text-ink-900 mb-6">Get in touch</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[var(--r-md)] bg-teal-050 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-teal-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900 text-[0.875rem] mb-0.5">Phone</p>
                    <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-teal-500 font-semibold text-lg hover:text-teal-600 transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[var(--r-md)] bg-teal-050 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-teal-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900 text-[0.875rem] mb-0.5">Email</p>
                    <a href={`mailto:${email}`} className="text-teal-500 font-semibold text-lg hover:text-teal-600 transition-colors">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[var(--r-md)] bg-teal-050 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-teal-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900 text-[0.875rem] mb-0.5">Address</p>
                    <p className="text-ink-700 text-[1.0625rem]">{address}<br />{city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[var(--r-md)] bg-teal-050 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-teal-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900 text-[0.875rem] mb-1">Hours</p>
                    {hours.length > 0 ? (
                      <div className="space-y-0.5">
                        {hours.map((h: any) => (
                          <div key={h.day} className="flex gap-3 text-[0.9375rem] text-ink-700">
                            <span className="w-24 font-medium">{h.day}</span>
                            <span>{h.open} – {h.close}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-ink-500 text-[0.9375rem]">{hoursNote}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Map embed */}
              <div className="mt-8 overflow-hidden rounded-[var(--r-xl)] h-56">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2607.4099946497485!2d-123.09849692300455!3d49.15866797132396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5486776c6a63b495%3A0x70c5db7e96a2efad!2s2168-3779%20Sexsmith%20Rd%2C%20Richmond%2C%20BC!5e0!3m2!1sen!2sca!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Brio Health location"
                />
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] text-ink-900 mb-6">Send us a message</h2>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      <CtaBandSection section={{
        heading: 'Ready to book your appointment?',
        primaryCta: { label: 'Book Now', style: 'accent', link: { kind: 'booking' } },
        background: 'teal',
      }} />
    </>
  )
}
