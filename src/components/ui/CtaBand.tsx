import { MessageCircle, Phone } from 'lucide-react'
import { siteConfig, telHref } from '../../config/site'
import { productLabel } from '../../data/enquiry'
import { buttonClasses } from '../../utils/buttonClasses'
import { Container } from './Container'
import { Reveal } from './Reveal'

/** Closing call to action used at the bottom of most pages: WhatsApp and phone. */
export function CtaBand({ productId }: { productId?: string }) {
  const { contact } = siteConfig
  const product = productId ? productLabel(productId) : undefined
  const whatsappText = product ? `Hello Corepoint Healthcare, I would like to know more about the ${product}.` : undefined
  const whatsappHref = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp}${whatsappText ? `?text=${encodeURIComponent(whatsappText)}` : ''}`
    : null

  return (
    <section aria-labelledby="cta-title" className="bg-night py-20 text-white sm:py-24">
      <Container className="flex flex-col items-center text-center">
        <Reveal className="max-w-3xl">
          <p className="eyebrow flex items-center justify-center gap-3 text-white/60">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            {siteConfig.tagline}
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
          </p>
          <h2 id="cta-title" className="mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-balance sm:text-[2.6rem]">
            Let&rsquo;s Find the Right Solution for Your Practice.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/70">
            Message or call our team about a chair, a full clinic set-up or a product demonstration.
          </p>
        </Reveal>
        <Reveal className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row" delay={0.08}>
          {whatsappHref && (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClasses('accent', 'lg')}>
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp us
            </a>
          )}
          <a href={telHref(contact.phones[0].display)} className={buttonClasses('inverse', 'lg')}>
            <Phone className="h-4 w-4" aria-hidden="true" /> {contact.phones[0].display}
          </a>
        </Reveal>
      </Container>
    </section>
  )
}
