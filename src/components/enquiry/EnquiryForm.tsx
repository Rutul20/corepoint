import { AlertCircle, ArrowRight, CheckCircle2, ChevronDown, Info, LoaderCircle, Mail, MessageCircle, Phone } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { siteConfig, telHref } from '../../config/site'
import { enquiryProductGroups, enquiryTypes, productLabel } from '../../data/enquiry'
import { isEnquiryBackendConfigured, submitEnquiry, type EnquiryResult } from '../../services/enquiryService'
import type { EnquiryTypeId } from '../../types/product'
import { buttonClasses } from '../../utils/buttonClasses'
import { cn } from '../../utils/cn'
import { validateEnquiry, type EnquiryErrors, type EnquiryField, type EnquiryFormValues } from '../../utils/validation'
import { fieldAria, inputClasses } from './fieldProps'
import { FormField } from './FormField'

type FormStatus = 'idle' | 'submitting' | EnquiryResult['status']

const isEnquiryType = (value: string | null): value is EnquiryTypeId => enquiryTypes.some((type) => type.id === value)

const fieldOrder: EnquiryField[] = ['fullName', 'organisation', 'email', 'phone', 'city', 'enquiryType', 'productId', 'message', 'consent']

const emptyValues = (productId: string): EnquiryFormValues => ({
  fullName: '',
  organisation: '',
  email: '',
  phone: '',
  city: '',
  enquiryType: '',
  productId,
  message: '',
  consent: false,
  website: '',
})

export function EnquiryForm() {
  const [params] = useSearchParams()
  const search = params.toString()
  const [values, setValues] = useState<EnquiryFormValues>(() => emptyValues(''))
  const [touched, setTouched] = useState<Partial<Record<EnquiryField, boolean>>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [appliedSearch, setAppliedSearch] = useState<string | null>(null)
  const submitting = useRef(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  // "Request a quote" and "Request a Demo" links pre-fill the form via ?type=…&product=….
  if (search !== appliedSearch) {
    setAppliedSearch(search)
    const type = params.get('type')
    const product = params.get('product')
    setValues((current) => ({
      ...current,
      enquiryType: isEnquiryType(type) ? type : current.enquiryType,
      productId: product && productLabel(product) ? product : current.productId,
    }))
  }
  useEffect(() => {
    if (search) nameRef.current?.focus({ preventScroll: true })
  }, [search])

  const errors: EnquiryErrors = validateEnquiry(values)
  const visibleError = (field: EnquiryField) => (submitAttempted || touched[field] ? errors[field] : undefined)

  const update =
    (field: Exclude<keyof EnquiryFormValues, 'consent'>) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value } = event.target
      setValues((current) => ({ ...current, [field]: value }))
      if (status !== 'idle' && status !== 'submitting') setStatus('idle')
    }
  const markTouched = (field: EnquiryField) => () => setTouched((current) => ({ ...current, [field]: true }))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current) return
    setSubmitAttempted(true)

    const firstInvalid = fieldOrder.find((field) => errors[field])
    if (firstInvalid) {
      document.getElementById(`enquiry-${firstInvalid}`)?.focus()
      return
    }
    // Honeypot filled in: almost certainly a bot, so send nothing.
    if (values.website) return

    submitting.current = true
    setStatus('submitting')
    const result = await submitEnquiry({
      fullName: values.fullName.trim(),
      organisation: values.organisation.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      city: values.city.trim(),
      enquiryType: values.enquiryType as EnquiryTypeId,
      enquiryTypeLabel: enquiryTypes.find((type) => type.id === values.enquiryType)?.label ?? values.enquiryType,
      productId: values.productId,
      productName: productLabel(values.productId) ?? values.productId,
      message: values.message.trim(),
      source: window.location.href,
    })
    submitting.current = false
    setStatus(result.status)
    setErrorMessage(result.status === 'error' ? result.message : '')
    if (result.status === 'success') {
      setValues(emptyValues(values.productId))
      setTouched({})
      setSubmitAttempted(false)
    }
    requestAnimationFrame(() => statusRef.current?.focus())
  }

  const { contact } = siteConfig
  const summary = enquirySummary(values)
  const mailtoHref = `mailto:${contact.email}?subject=${encodeURIComponent(summary.subject)}&body=${encodeURIComponent(summary.body)}`
  const whatsappHref = contact.whatsapp ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`${summary.subject}\n\n${summary.body}`)}` : null
  const isSubmitting = status === 'submitting'

  // Other ways to send the same enquiry, when online sending is off or fails.
  const sendInstead = (
    <div className="mt-4 flex flex-wrap gap-2">
      <a href={mailtoHref} className={buttonClasses('primary', 'sm')}>
        <Mail className="h-4 w-4" aria-hidden="true" /> Send by email
      </a>
      {whatsappHref && (
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClasses('secondary', 'sm')}>
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> Send on WhatsApp
        </a>
      )}
      <a href={telHref(contact.phones[0].display)} className={buttonClasses('ghost', 'sm')}>
        <Phone className="h-4 w-4" aria-hidden="true" /> {contact.phones[0].display}
      </a>
    </div>
  )

  return (
    <form
      id="enquiry"
      noValidate
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
      className="scroll-mt-24 border border-line bg-white p-6 shadow-[0_30px_60px_-40px_rgba(20,22,25,0.25)] sm:p-10"
    >
      <h3 className="text-xl font-semibold tracking-[-0.015em]">Product enquiry</h3>
      <p className="mt-1.5 text-sm text-muted">
        Fields marked <span className="text-accent">*</span> are required.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <FormField id="enquiry-fullName" label="Full name" required error={visibleError('fullName')}>
          <input
            ref={nameRef}
            id="enquiry-fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={values.fullName}
            onChange={update('fullName')}
            onBlur={markTouched('fullName')}
            className={cn(inputClasses(Boolean(visibleError('fullName'))), 'h-12')}
            {...fieldAria('enquiry-fullName', visibleError('fullName'))}
          />
        </FormField>

        <FormField id="enquiry-organisation" label="Dental clinic or organisation">
          <input
            id="enquiry-organisation"
            name="organisation"
            type="text"
            autoComplete="organization"
            value={values.organisation}
            onChange={update('organisation')}
            className={cn(inputClasses(false), 'h-12')}
          />
        </FormField>

        <FormField id="enquiry-email" label="Email address" required error={visibleError('email')}>
          <input
            id="enquiry-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={update('email')}
            onBlur={markTouched('email')}
            className={cn(inputClasses(Boolean(visibleError('email'))), 'h-12')}
            {...fieldAria('enquiry-email', visibleError('email'))}
          />
        </FormField>

        <FormField id="enquiry-phone" label="Phone number" error={visibleError('phone')}>
          <input
            id="enquiry-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={update('phone')}
            onBlur={markTouched('phone')}
            className={cn(inputClasses(Boolean(visibleError('phone'))), 'h-12')}
            {...fieldAria('enquiry-phone', visibleError('phone'))}
          />
        </FormField>

        <FormField id="enquiry-city" label="City">
          <input
            id="enquiry-city"
            name="city"
            type="text"
            autoComplete="address-level2"
            value={values.city}
            onChange={update('city')}
            className={cn(inputClasses(false), 'h-12')}
          />
        </FormField>

        <FormField id="enquiry-enquiryType" label="Enquiry type" required error={visibleError('enquiryType')}>
          <div className="relative">
            <select
              id="enquiry-enquiryType"
              name="enquiryType"
              required
              value={values.enquiryType}
              onChange={update('enquiryType')}
              onBlur={markTouched('enquiryType')}
              className={cn(inputClasses(Boolean(visibleError('enquiryType'))), 'h-12 appearance-none pr-10')}
              {...fieldAria('enquiry-enquiryType', visibleError('enquiryType'))}
            >
              <option value="" disabled>
                Choose one
              </option>
              {enquiryTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </FormField>

        <FormField id="enquiry-productId" label="Product or service" required error={visibleError('productId')} className="sm:col-span-2">
          <div className="relative">
            <select
              id="enquiry-productId"
              name="productId"
              required
              value={values.productId}
              onChange={update('productId')}
              onBlur={markTouched('productId')}
              className={cn(inputClasses(Boolean(visibleError('productId'))), 'h-12 appearance-none pr-10')}
              {...fieldAria('enquiry-productId', visibleError('productId'))}
            >
              <option value="" disabled>
                Choose a product or service
              </option>
              {enquiryProductGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <SelectChevron />
          </div>
        </FormField>

        <FormField
          id="enquiry-message"
          label="Message"
          error={visibleError('message')}
          hint="Tell us about your practice, the configuration you need or a preferred demo date."
          className="sm:col-span-2"
        >
          <textarea
            id="enquiry-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={update('message')}
            onBlur={markTouched('message')}
            className={cn(inputClasses(Boolean(visibleError('message'))), 'resize-y py-3 leading-relaxed')}
            {...fieldAria('enquiry-message', visibleError('message'), 'Tell us about your practice')}
          />
        </FormField>

        {/* Honeypot: hidden from people and assistive technology. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="enquiry-website">Website</label>
          <input id="enquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={update('website')} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="enquiry-consent" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
            <input
              id="enquiry-consent"
              name="consent"
              type="checkbox"
              checked={values.consent}
              onChange={(event) => {
                const { checked } = event.target
                setValues((current) => ({ ...current, consent: checked }))
              }}
              onBlur={markTouched('consent')}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-sm border-line-strong accent-ink"
              {...fieldAria('enquiry-consent', visibleError('consent'))}
            />
            <span>
              I agree to be contacted about this enquiry. See our{' '}
              <Link to="/privacy" className="font-medium text-ink underline underline-offset-4">
                privacy policy
              </Link>
              .<span className="text-accent" aria-hidden="true"> *</span>
            </span>
          </label>
          {visibleError('consent') && (
            <p id="enquiry-consent-error" className="mt-1.5 pl-8 text-[13px] font-medium text-accent-deep">
              {visibleError('consent')}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={isSubmitting} className={buttonClasses('accent', 'lg', 'w-full sm:w-auto')}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Request Product Information <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
        {!isEnquiryBackendConfigured && (
          <p className="flex items-start gap-2 text-xs leading-snug text-muted sm:max-w-[17rem]">
            <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Online sending is not connected yet. After you check the form, we&rsquo;ll help you send it by email or WhatsApp.
          </p>
        )}
      </div>

      <div ref={statusRef} tabIndex={-1} className="outline-none" role={status === 'error' || status === 'not-configured' ? 'alert' : 'status'}>
        {status === 'success' && (
          <StatusPanel tone="success" icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />} title="Thank you, your enquiry has been sent.">
            It has been emailed to our team, and we will reply to the email address you provided.
          </StatusPanel>
        )}
        {status === 'not-configured' && (
          <StatusPanel tone="warning" icon={<Info className="h-5 w-5" aria-hidden="true" />} title="Your enquiry has not been sent yet.">
            <p>Online sending isn&rsquo;t connected to our inbox yet, so nothing was submitted. Send the same details in one tap:</p>
            {sendInstead}
          </StatusPanel>
        )}
        {status === 'error' && (
          <StatusPanel tone="error" icon={<AlertCircle className="h-5 w-5" aria-hidden="true" />} title="Your enquiry was not sent.">
            <p>{errorMessage} Your details are still in the form, so you can try again or send them in one tap:</p>
            {sendInstead}
          </StatusPanel>
        )}
      </div>
    </form>
  )
}

function SelectChevron() {
  return <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
}

function StatusPanel({ tone, icon, title, children }: { tone: 'success' | 'warning' | 'error'; icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'mt-6 flex gap-3 rounded-sm border p-4 text-sm leading-relaxed',
        tone === 'success' && 'border-tech/40 bg-tech/10 text-ink',
        tone === 'warning' && 'border-line-strong bg-mist text-ink',
        tone === 'error' && 'border-accent/40 bg-accent/5 text-ink',
      )}
    >
      <span className={cn('mt-px shrink-0', tone === 'success' ? 'text-tech-ink' : tone === 'error' ? 'text-accent' : 'text-muted')}>{icon}</span>
      <div>
        <p className="font-semibold">{title}</p>
        <div className="mt-1 text-ink-soft">{children}</div>
      </div>
    </div>
  )
}

/** The enquiry as plain text, for sending by email or WhatsApp when no backend is connected. */
function enquirySummary(values: EnquiryFormValues): { subject: string; body: string } {
  const type = enquiryTypes.find((t) => t.id === values.enquiryType)
  const subject = `${type?.label ?? 'Enquiry'}: ${productLabel(values.productId) ?? 'Dental equipment'}`
  const body = [
    `Name: ${values.fullName}`,
    values.organisation ? `Clinic: ${values.organisation}` : null,
    `Email: ${values.email}`,
    values.phone ? `Phone: ${values.phone}` : null,
    values.city ? `City: ${values.city}` : null,
    values.message ? `\n${values.message}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join('\n')
  return { subject, body }
}
