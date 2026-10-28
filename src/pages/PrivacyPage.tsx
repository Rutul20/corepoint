import { siteConfig } from '../config/site'
import { LegalPage } from './LegalPage'

export function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p className="rounded-sm border border-dashed border-line-strong bg-mist p-5 text-sm text-muted">
        This page is a placeholder. Replace it with {siteConfig.name}&rsquo;s privacy policy, reviewed by a legal adviser, before the
        site goes live.
      </p>
      <p>
        The policy should explain what personal data the enquiry form collects (name, organisation, email, phone number, city and
        message), why it is collected, how long it is kept, who it is shared with, and how visitors can contact you to access or delete
        their data.
      </p>
      <p>
        It should also say that enquiries sent through the website form are delivered by email using Web3Forms (web3forms.com), a
        third-party form service, to {siteConfig.contact.email}.
      </p>
    </LegalPage>
  )
}
