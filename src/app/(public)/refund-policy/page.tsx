import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageLayout, { LegalList, LegalSection, LegalSummaryItem } from '@/components/ui/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Refund Policy | PandaCourses',
  description: 'Read the PandaCourses refund policy for digital courses and memberships.',
  alternates: {
    canonical: 'https://pandacourses.com/refund-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const summaryItems: LegalSummaryItem[] = [
  {
    icon: 'file',
    text: 'All products are digital with instant access',
  },
  {
    icon: 'lock',
    text: 'All sales are final',
  },
  {
    icon: 'help',
    text: "Access problems? Contact support and we'll help",
  },
]

const refundSections: LegalSection[] = [
  {
    id: 'digital-products',
    title: 'Digital Products',
    content: (
      <>
        <p>
          All products and services offered on PandaCourses.com, including but not limited to online courses, digital downloads, membership access, and VIP content, are digital products.
        </p>
        <p>
          Due to the immediate access and downloadable nature of these products, all sales are final. Once a purchase is completed and access is granted, no refunds, cancellations, or exchanges will be provided under any circumstances.
        </p>
      </>
    ),
  },
  {
    id: 'no-exceptions',
    title: 'No Exceptions Policy',
    content: (
      <>
        <p>
          Panda Courses maintains a strict no-refund policy including, but not limited to, the following situations:
        </p>
        <LegalList
          items={[
            'Change of mind after purchase',
            'Accidental purchase',
            'Lack of usage or failure to complete the course',
            'Failure to read the product description',
            'Incompatibility with your device, software, or internet connection',
            'Dissatisfaction with content after access has been granted',
            'Financial hardship or personal reasons',
          ]}
        />
        <p>
          By completing a purchase on PandaCourses.com, you acknowledge and agree to this No-Refund Policy.
        </p>
      </>
    ),
  },
  {
    id: 'chargebacks',
    title: 'Payment Disputes & Chargebacks',
    tone: 'warning',
    content: (
      <>
        <p>
          If a user initiates a chargeback, dispute, or reversal without contacting Panda Courses first:
        </p>
        <LegalList
          items={[
            'Immediate suspension or permanent termination of account access may occur',
            'Access to all purchased products may be revoked',
            'The user may be permanently restricted from future purchases',
          ]}
        />
        <p style={{ margin: 0 }}>
          We reserve the right to provide payment processors with transaction records, access logs, IP logs, and proof of digital delivery to contest disputes.
        </p>
      </>
    ),
  },
  {
    id: 'exceptional',
    title: 'Exceptional Circumstances',
    tone: 'info',
    content: (
      <p style={{ margin: 0 }}>
        In extremely rare cases where a duplicate charge is verified due to a technical error on our end, Panda Courses may, at its sole discretion, issue a correction or refund. Such decisions are final.
      </p>
    ),
  },
  {
    id: 'access-support',
    title: 'Access Problems & Support',
    content: (
      <p>
        If you have trouble accessing your course, for example a link that does not open or a login problem, please{' '}
        <Link
          href="/contact"
          style={{
            color: 'var(--color-primary, #6B4EFF)',
            textDecoration: 'underline',
            fontWeight: 500,
          }}
        >
          contact our support team
        </Link>
        . We will help you resolve access issues.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: (
      <p>
        Email us at{' '}
        <a
          href="mailto:support@pandacourses.com"
          style={{
            color: 'var(--color-primary, #6B4EFF)',
            textDecoration: 'underline',
            fontWeight: 500,
          }}
        >
          support@pandacourses.com
        </a>{' '}
        or use our{' '}
        <Link
          href="/contact"
          style={{
            color: 'var(--color-primary, #6B4EFF)',
            textDecoration: 'underline',
            fontWeight: 500,
          }}
        >
          Contact page
        </Link>
        .
      </p>
    ),
  },
]

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      lastUpdated="May 2026"
      summary={summaryItems}
      sections={refundSections}
      showContactCta={true}
    />
  )
}
