import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageLayout, {
  LegalList,
  LegalSection,
  LegalSummaryItem,
} from '@/components/ui/LegalPageLayout'

/* ═══════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════ */
const SUPPORT_EMAIL = 'support@pandacourses.com'
const DMCA_EMAIL = 'support@pandacourses.com' // Can be adjusted if legal inbox changes
const GOVERNING_LAW = '' // e.g. "the laws of [jurisdiction]"; if empty, section is not rendered
const MIN_AGE = 18

export const metadata: Metadata = {
  title: 'Terms of Service | PandaCourses',
  description:
    'The terms that apply when you use PandaCourses, buy courses and access course materials.',
  alternates: {
    canonical: 'https://pandacourses.com/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const summaryItems: LegalSummaryItem[] = [
  {
    icon: 'file',
    title: 'Personal use only',
    text: 'Course access is for you only. Do not share or resell materials.',
  },
  {
    icon: 'lock',
    title: 'One account per person',
    text: 'Keep your login private. Account sharing may lead to suspension.',
  },
  {
    icon: 'help',
    title: 'Need help?',
    text: `Contact support at ${SUPPORT_EMAIL}.`,
  },
]

export default function TermsOfServicePage() {
  const termsSections: LegalSection[] = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: (
        <>
          <p>
            PandaCourses.com (&ldquo;PandaCourses,&rdquo; &ldquo;we,&rdquo; or &ldquo;us&rdquo;) refers to its owners, officers, employees, agents, licensors, licensees, successors, and assigns. PandaCourses provides access to online resources, web pages, digital materials, and VIP areas through PandaCourses.com (the &ldquo;Site&rdquo;) for users (&ldquo;you&rdquo; or &ldquo;User&rdquo;).
          </p>
          <p>
            By accessing or using the Site, you agree to be bound by these Terms of Service, including any policies, guidelines, or notices referenced herein, such as the Privacy Policy, Program Policies, and Legal Notices (collectively, the &ldquo;Terms&rdquo;). If you do not agree to these Terms, you must discontinue use of the Site immediately.
          </p>
          <p>
            We reserve the right to modify or update these Terms at any time at our sole discretion. Any changes will become effective immediately upon posting on the Site. The most current version of the Terms will always be available on PandaCourses.com.
          </p>
        </>
      ),
    },
    {
      id: 'service',
      title: 'Our Service',
      content: (
        <p>
          PandaCourses provides access to online course materials and digital resources. After purchase, you can log in to your dashboard, where course files are provided through Mega or Google Drive links. We may add, change or remove courses and features at any time.
        </p>
      ),
    },
    {
      id: 'accounts',
      title: 'Eligibility and Your Account',
      content: (
        <p>
          You must be at least {MIN_AGE} years old to use the Site. You agree to provide accurate information, keep your login details private and be responsible for everything that happens under your account. Each account is for one person. Please tell us at once if you think your account has been accessed without permission.
        </p>
      ),
    },
    {
      id: 'purchases',
      title: 'Purchases, Payments and Access',
      content: (
        <>
          <p>When purchasing access on PandaCourses, the following terms apply:</p>
          <LegalList
            items={[
              'Payments are processed by our payment partner (Stripe) and are charged in US dollars;',
              'The price shown at checkout applies to your purchase and prices may change for future purchases;',
              'Access is granted to your account after payment is confirmed;',
              '“Lifetime access” means access for as long as PandaCourses operates the platform;',
              <>
                Refunds are governed by our{' '}
                <Link href="/refund-policy">Refund Policy</Link>.
              </>,
            ]}
          />
          <div
            style={{
              marginTop: '16px',
              background: 'rgba(107, 78, 255, 0.06)',
              border: '1px solid rgba(107, 78, 255, 0.2)',
              borderLeft: '3px solid var(--color-primary, #6B4EFF)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              color: 'var(--color-charcoal, #2F2F2F)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-primary, #6B4EFF)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              Chargebacks and payment disputes are described in our{' '}
              <Link href="/refund-policy">Refund Policy</Link>.
            </span>
          </div>
        </>
      ),
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use',
      tone: 'warning',
      content: (
        <>
          <p style={{ marginTop: 0 }}>You agree not to:</p>
          <LegalList
            items={[
              'Share your account or login with others;',
              'Resell, sublicense, redistribute or publicly post course materials or download links;',
              'Copy or scrape the Site or its content in bulk;',
              'Bypass or attempt to bypass access controls;',
              'Use the Site for anything unlawful or to harm others;',
              'Interfere with the security or operation of the Site.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'content-ip',
      title: 'Content and Intellectual Property',
      content: (
        <p>
          Course materials, names and trademarks belong to their respective owners. Access to course materials is provided for your personal, non-commercial learning only. The PandaCourses name, logo and site design belong to PandaCourses and may not be used without permission.
        </p>
      ),
    },
    {
      id: 'disclaimer',
      title: 'Content Disclaimer',
      content: (
        <>
          <p>
            PandaCourses and any hosting providers assume no responsibility for how users utilize the information made available on this Site. All content is provided for educational and informational purposes only.
          </p>
          <p>
            Software, tools or services mentioned in course content may require separate licenses or purchases from their providers. You are responsible for complying with their terms and with the laws that apply to you.
          </p>
          <p>
            Course content is educational. We do not guarantee any results, income or outcomes.
          </p>
          <p>
            PandaCourses does not guarantee the accuracy, completeness, or usefulness of any content and is not responsible for any actions taken based on information obtained from the Site or linked sources.
          </p>
          <p>
            If you do not understand or agree with any part of this Site or its content, you should discontinue use immediately.
          </p>
        </>
      ),
    },
    {
      id: 'user-content',
      title: 'User-Generated Content',
      content: (
        <>
          <p>
            Opinions expressed by users reflect the views of the individual author and do not necessarily represent those of PandaCourses.
          </p>
          <p>
            If you believe any content is inappropriate or objectionable, please contact us. We reserve the right to remove content at our discretion within a reasonable timeframe.
          </p>
        </>
      ),
    },
    {
      id: 'third-party',
      title: 'Third-Party Links and Services',
      content: (
        <p>
          The Site may contain links to external websites that are not owned or controlled by PandaCourses. We are not responsible for the content, accuracy, or policies of any third-party websites. Accessing such sites is done at your own risk. Some features rely on third-party services such as payment, email and file-hosting providers, whose own terms apply.
        </p>
      ),
    },
    {
      id: 'responsibility',
      title: 'User Responsibility',
      content: (
        <>
          <p>
            You acknowledge that you are solely responsible for evaluating and bearing all risks associated with the use of any content on the Site. Under no circumstances shall PandaCourses be liable for any loss or damage resulting from reliance on Site content.
          </p>
          <p>
            Users accessing the Site from outside the United States agree to comply with all applicable local laws regarding online conduct and acceptable content.
          </p>
        </>
      ),
    },
    {
      id: 'dmca',
      title: 'Copyright and DMCA Notices',
      tone: 'info',
      content: (
        <>
          <p style={{ marginTop: 0 }}>
            PandaCourses respects intellectual property rights and responds to valid infringement notices.
          </p>
          <p>
            If you believe your copyrighted material has been infringed, send a written notice to{' '}
            <a href={`mailto:${DMCA_EMAIL}`}>{DMCA_EMAIL}</a> including:
          </p>
          <LegalList
            items={[
              'Proof of authorization to act on behalf of the copyright owner;',
              'Valid contact information, including an email address;',
              'Identification of the copyrighted work and its location on the Site;',
              'A statement of good-faith belief that the use is unauthorized;',
              'A statement that the notice is accurate, under penalty of perjury;',
              'A physical or electronic signature of the authorized party.',
            ]}
          />
          <p>
            Misrepresentation may result in liability for damages, including legal fees.
          </p>
          <p style={{ marginBottom: 0 }}>
            Upon receiving a valid copyright or trademark request, we will review it and remove the relevant content where applicable.
          </p>
        </>
      ),
    },
    {
      id: 'termination',
      title: 'Suspension and Termination',
      content: (
        <p>
          We may suspend or end your access if you break these Terms, misuse the Site, share your account, or start a payment dispute without contacting us first. Refunds are governed by our{' '}
          <Link href="/refund-policy">Refund Policy</Link>. You may stop using the Site at any time.
        </p>
      ),
    },
    {
      id: 'liability',
      title: 'Disclaimer of Warranties and Limitation of Liability',
      content: (
        <>
          <p>
            The Site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind. To the fullest extent permitted by law, PandaCourses is not liable for indirect, incidental or consequential losses, or for any loss resulting from reliance on Site content.
          </p>
          <p>
            Our total liability to you for any claim is limited to the amount you paid us in the 12 months before the claim arose. Under no circumstances shall PandaCourses be liable for any loss or damage resulting from reliance on Site content.
          </p>
        </>
      ),
    },
    {
      id: 'release',
      title: 'Release and Indemnification',
      content: (
        <>
          <p>
            By using the Site, you agree to fully release and discharge PandaCourses and its affiliates from any and all claims, liabilities, damages, losses, or expenses arising from your use of the Site.
          </p>
          <p>
            You further agree to defend, indemnify, and hold harmless PandaCourses from any claims or damages resulting from your violation of these Terms.
          </p>
        </>
      ),
    },
    // Conditionally include governing-law if GOVERNING_LAW is non-empty
    ...(GOVERNING_LAW
      ? [
          {
            id: 'governing-law',
            title: 'Governing Law',
            content: <p>These Terms are governed by {GOVERNING_LAW}.</p>,
          },
        ]
      : []),
    {
      id: 'changes',
      title: 'Changes to These Terms',
      content: (
        <p>
          We may update these Terms at any time. Changes take effect when posted on this page. The &lsquo;Last updated&rsquo; date shows the latest version. Continued use of the Site means you accept the updated Terms.
        </p>
      ),
    },
    {
      id: 'contact',
      title: 'Contact Us',
      content: (
        <p>
          Questions about these Terms? Email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or use our{' '}
          <Link href="/contact">Contact page</Link>.
        </p>
      ),
    },
  ]

  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="Please read these terms before using PandaCourses."
      lastUpdated="September 2026"
      readTime="6 min read"
      summary={summaryItems}
      sections={termsSections}
      showContactCta={true}
    />
  )
}
