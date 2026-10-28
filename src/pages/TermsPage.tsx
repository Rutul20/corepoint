import { siteConfig } from '../config/site'
import { LegalPage } from './LegalPage'

export function TermsPage() {
  return (
    <LegalPage title="Terms and conditions">
      <p className="rounded-sm border border-dashed border-line-strong bg-mist p-5 text-sm text-muted">
        This page is a placeholder. Replace it with {siteConfig.name}&rsquo;s terms and conditions, reviewed by a legal adviser, before
        the site goes live.
      </p>
      <p>
        Typical topics include use of the website, accuracy of product information and illustrations, intellectual property, limitation
        of liability and the law that governs the terms.
      </p>
    </LegalPage>
  )
}
