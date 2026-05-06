import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'

export const metadata = {
  title: 'Privacy Policy — Panda Courses',
  description: 'Learn how Panda Courses collects, uses, and protects your personal information.',
}

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'var(--color-on-dark-muted)',
          fontFamily: 'var(--font-sans)',
          marginTop: '12px',
        }}>
          Last Updated: May 2026
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
          <h2>1. Information We Collect</h2>
          <p>
            When you use Panda Courses, we collect certain information to provide and improve our services. This includes:
          </p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, and password when you register.</li>
            <li><strong>Payment Information:</strong> Transaction details when you purchase a course (processed securely by our payment partners).</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our platform, including courses viewed and progress.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the collected data for various purposes:
          </p>
          <ul>
            <li>To provide and maintain our service.</li>
            <li>To notify you about changes to our service.</li>
            <li>To provide customer support.</li>
            <li>To monitor the usage of our service.</li>
            <li>To detect, prevent and address technical issues.</li>
          </ul>

          <h2>3. Data Security</h2>
          <p>
            The security of your data is important to us. We use industry-standard encryption and security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>

          <h2>4. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@pandacourses.com.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
