import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageLayout, {
  LegalList,
  LegalTable,
  LegalCards,
  LegalSection,
  LegalSummaryItem,
} from '@/components/ui/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy | PandaCourses',
  description: 'How PandaCourses collects, uses and protects your personal information.',
  alternates: {
    canonical: 'https://pandacourses.com/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const summaryItems: LegalSummaryItem[] = [
  {
    icon: 'file',
    title: 'Only what we need',
    text: 'We collect the information required to run your account and deliver courses.',
  },
  {
    icon: 'lock',
    title: 'We do not sell your data',
    text: 'Your personal information is never sold to third parties.',
  },
  {
    icon: 'mail',
    title: 'You choose your emails',
    text: 'Every marketing email has an unsubscribe link.',
  },
]

const privacySections: LegalSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    content: (
      <p>
        PandaCourses (&quot;we&quot;, &quot;us&quot;) operates pandacourses.com, an online platform for digital courses. This Privacy Policy explains what personal information we collect, how we use it, who we share it with, and the choices you have.
      </p>
    ),
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    content: (
      <>
        <p>When you use PandaCourses, we collect the following information:</p>
        <LegalList
          items={[
            <>
              <strong>Account Information:</strong> name, email address and password when you register. Passwords are handled by our authentication provider and are not visible to us in readable form.
            </>,
            <>
              <strong>Payment Information:</strong> transaction details when you purchase, such as amount, date and plan. Card details are entered on our payment processor&apos;s checkout and are not stored by us.
            </>,
            <>
              <strong>Usage Data:</strong> how you use the platform, including courses viewed and progress.
            </>,
            <>
              <strong>Technical Data:</strong> IP address, browser and device type, pages visited and access logs.
            </>,
            <>
              <strong>Communications:</strong> messages you send to support and records of emails we send you, such as delivery status.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    content: (
      <>
        <p>We use the collected information for the following purposes:</p>
        <LegalList
          items={[
            'To provide and maintain the service and grant access after purchase;',
            'To process payments and help prevent fraud;',
            'To send account and service emails such as welcome, plan activation and password reset;',
            'To send marketing or announcement emails where permitted, with an unsubscribe option;',
            'To provide customer support;',
            'To monitor usage, improve the platform and fix technical issues;',
            'To keep transaction, access and IP records that help us resolve payment disputes and meet legal obligations.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'emails',
    title: 'Emails and Communications',
    tone: 'info',
    content: (
      <p style={{ margin: 0 }}>
        We send two kinds of emails. Account and service emails, such as welcome and plan confirmation emails, are necessary for your account and are sent even if you opt out of marketing. Marketing and announcement emails are optional: every one includes an unsubscribe link, and you can also contact us to opt out. Unsubscribing does not affect your access to purchased content.
      </p>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and Analytics',
    content: (
      <p>
        We use cookies and similar technologies. Essential cookies keep you signed in and remember preferences such as your dashboard theme. Analytics cookies (Google Analytics) help us understand how the site is used and are set according to your cookie choices where a consent banner is shown. With your consent we also use Microsoft Clarity to understand how visitors use our site (for example heatmaps and session recordings); sensitive inputs are masked. You can control or delete cookies in your browser settings; blocking essential cookies may stop parts of the site from working.
      </p>
    ),
  },
  {
    id: 'sharing',
    title: 'Who We Share Information With',
    content: (
      <>
        <p>
          We do not sell your personal information. We share it only with service providers that help us run the platform, and only as needed:
        </p>
        <LegalTable
          columns={['Provider', 'Purpose', 'Data involved']}
          rows={[
            [
              <strong>Supabase</strong>,
              'Database and authentication',
              'Account data, course access and progress',
            ],
            [
              <strong>Stripe</strong>,
              'Payment processing',
              'Payment and transaction details',
            ],
            [
              <strong>Resend</strong>,
              'Email delivery',
              'Email address, name, email delivery status',
            ],
            [
              <strong>Cloudflare</strong>,
              'Hosting, content delivery and file storage',
              'Technical data, IP address, requests',
            ],
            [
              <strong>Google Analytics</strong>,
              'Website analytics',
              'Usage and device data (per your cookie choices)',
            ],
            [
              <strong>Microsoft Clarity</strong>,
              'Website analytics, heatmaps and session recordings',
              'Usage and device data, with text inputs masked (only with your consent)',
            ],
          ]}
        />
        <p style={{ marginTop: '16px' }}>
          We may also disclose information to payment processors, banks or authorities to respond to payment disputes, prevent fraud or comply with the law.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Data Security',
    content: (
      <p>
        We use reasonable technical and organizational measures, including encrypted connections (HTTPS) and access controls, to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure.
      </p>
    ),
  },
  {
    id: 'retention',
    title: 'Data Retention',
    content: (
      <p>
        We keep your information while your account is active and as long as needed to provide the service, resolve disputes and meet legal obligations. When we no longer need it, we delete or anonymize it.
      </p>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Rights and Choices',
    content: (
      <>
        <p>Depending on where you live, you may have the right to:</p>
        <LegalCards
          items={[
            {
              title: 'Access',
              text: 'Request a copy of your information',
            },
            {
              title: 'Correct',
              text: 'Update inaccurate information',
            },
            {
              title: 'Delete',
              text: 'Ask us to delete your information',
            },
            {
              title: 'Opt out',
              text: 'Unsubscribe from marketing emails at any time',
            },
          ]}
        />
        <p style={{ marginTop: '16px' }}>
          To make a request, email{' '}
          <a href="mailto:support@pandacourses.com">support@pandacourses.com</a>. We may need to verify your identity, and we may keep some information where the law or a payment dispute requires it.
        </p>
      </>
    ),
  },
  {
    id: 'international',
    title: 'International Data Transfers',
    content: (
      <p>
        Our service providers operate in several countries, including the United States, so your information may be processed outside your country.
      </p>
    ),
  },
  {
    id: 'children',
    title: "Children's Privacy",
    content: (
      <p>
        PandaCourses is not intended for anyone under 18, and we do not knowingly collect information from children.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top shows when it was last changed. Continued use of the site after changes means you accept the updated policy.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: (
      <p>
        If you have any questions about this Privacy Policy, contact us at{' '}
        <a href="mailto:support@pandacourses.com">support@pandacourses.com</a> or through our{' '}
        <Link href="/contact">Contact page</Link>.
      </p>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="How we collect, use and protect your information."
      lastUpdated="September 2026"
      readTime="5 min read"
      summary={summaryItems}
      sections={privacySections}
      showContactCta={true}
    />
  )
}
