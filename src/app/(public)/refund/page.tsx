import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'

export const metadata = {
  title: 'Refund Policy — Panda Courses',
  description: 'Understand the strict no-refund policy for digital products on Panda Courses.',
}

export default function RefundPolicy() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: 'var(--color-brand-navy)',
        padding: '80px 32px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: '700',
          color: 'var(--color-on-dark)',
          fontFamily: 'var(--font-sans)',
          margin: '0',
          letterSpacing: '-1px',
        }}>
          Refund Policy
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'var(--color-on-dark-muted)',
          fontFamily: 'var(--font-sans)',
          marginTop: '12px',
        }}>
          Effective Date: May 2026
        </p>
      </section>

      {/* Content Area */}
      <section style={{
        flex: 1,
        width: '100%',
        padding: '64px 32px',
      }}>
        <div 
          className="course-description"
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <p>
            All products and services offered on PandaCourses.com, including but not limited to online courses, digital downloads, membership access, and VIP content, are digital products.
          </p>
          <p>
            Due to the immediate access and downloadable nature of these products, all sales are final. Once a purchase is completed and access is granted, no refunds, cancellations, or exchanges will be provided under any circumstances.
          </p>

          <h2>No Exceptions Policy</h2>
          <p>
            Panda Courses maintains a strict no-refund policy including, but not limited to, the following situations:
          </p>
          <ul>
            <li>Change of mind after purchase</li>
            <li>Accidental purchase</li>
            <li>Lack of usage or failure to complete the course</li>
            <li>Failure to read the product description</li>
            <li>Incompatibility with your device, software, or internet connection</li>
            <li>Dissatisfaction with content after access has been granted</li>
            <li>Financial hardship or personal reasons</li>
          </ul>
          <p>
            By completing a purchase on PandaCourses.com, you acknowledge and agree to this No-Refund Policy.
          </p>

          <h2>Payment Disputes & Chargebacks</h2>
          <p>
            If a user initiates a chargeback, dispute, or reversal without contacting Panda Courses first:
          </p>
          <ul>
            <li>Immediate suspension or permanent termination of account access may occur</li>
            <li>Access to all purchased products may be revoked</li>
            <li>The user may be permanently restricted from future purchases</li>
          </ul>
          <p>
            We reserve the right to provide payment processors with transaction records, access logs, IP logs, and proof of digital delivery to contest disputes.
          </p>

          <h2>Exceptional Circumstances</h2>
          <p>
            In extremely rare cases where a duplicate charge is verified due to a technical error on our end, Panda Courses may, at its sole discretion, issue a correction or refund. Such decisions are final.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
