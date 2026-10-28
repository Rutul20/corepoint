import { ExternalLink, Mail, MapPin, MessageCircle, Phone, Star, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { EnquiryForm } from '../components/enquiry/EnquiryForm'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { siteConfig, telHref } from '../config/site'
import { buttonClasses } from '../utils/buttonClasses'

export function ContactPage() {
  const { contact } = siteConfig
  const [office] = contact.phones

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's Find the Right Solution for Your Practice."
        description="Contact our team to learn more about the Aura dental chairs, explore available configurations, or arrange a product demonstration."
        crumbs={[{ label: 'Contact' }]}
        actions={
          <>
            <a href={telHref(office.display)} className={buttonClasses('primary', 'md')}>
              <Phone className="h-4 w-4" aria-hidden="true" /> Call {office.display}
            </a>
            {contact.whatsapp && (
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className={buttonClasses('secondary', 'md')}>
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
              </a>
            )}
          </>
        }
      />

      <section aria-label="Contact details and enquiry form" className="bg-mist py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="space-y-5 lg:col-span-5">
            <ContactCard icon={Phone} title="Phone">
              <ul className="space-y-3">
                {contact.phones.map((phone) => (
                  <li key={phone.display} className="flex items-baseline justify-between gap-4">
                    <span className="text-sm text-muted">{phone.person ? `${phone.label} · ${phone.person}` : phone.label}</span>
                    <a href={telHref(phone.display)} className="font-semibold text-ink hover:text-accent">
                      {phone.display}
                    </a>
                  </li>
                ))}
              </ul>
            </ContactCard>

            <ContactCard icon={Mail} title="Email">
              <a href={`mailto:${contact.email}`} className="break-all font-semibold text-ink hover:text-accent">
                {contact.email}
              </a>
            </ContactCard>

            {contact.whatsapp && (
              <ContactCard icon={MessageCircle} title="WhatsApp">
                <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink hover:text-accent">
                  Message {contact.whatsappPerson ?? 'us'} on WhatsApp
                </a>
              </ContactCard>
            )}

            {contact.addresses.map((address) => (
              <ContactCard key={address.label} icon={MapPin} title={address.label}>
                <address className="not-italic text-[15px] leading-relaxed text-ink">
                  {address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <a
                  href={address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-tech-ink hover:underline"
                >
                  Get directions <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </ContactCard>
            ))}

            {contact.googleProfile && (
              <ContactCard icon={Star} title="Find us on Google">
                <a
                  href={contact.googleProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-tech-ink hover:underline"
                >
                  See our Google business profile <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </ContactCard>
            )}
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.05}>
            <EnquiryForm />
          </Reveal>
        </Container>
      </section>
    </>
  )
}

function ContactCard({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 border border-line bg-white p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong">
        <Icon className="h-4 w-4 text-ink" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="eyebrow mb-2 text-muted">{title}</h2>
        {children}
      </div>
    </div>
  )
}
