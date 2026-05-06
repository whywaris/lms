import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'

export const metadata = {
  title: 'Terms & Conditions — Panda Courses',
  description: 'Read the comprehensive terms and conditions for using the Panda Courses platform.',
}

export default function TermsAndConditions() {
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
          Terms & Conditions
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
          <h2>ACCEPTANCE OF TERMS</h2>
          <p>
            PandaCourses.com (“Panda Courses,” “we,” or “us”) refers to its owners, officers, employees, agents, licensors, licensees, successors, and assigns. Panda Courses provides access to online resources, web pages, digital materials, and VIP areas through PandaCourses.com (the “Site”) for users (“you” or “User”).
          </p>
          <p>
            By accessing or using the Site, you agree to be bound by these Terms and Conditions, including any policies, guidelines, or notices referenced herein, such as the Privacy Policy, Program Policies, and Legal Notices (collectively, the “Terms”). If you do not agree to these Terms, you must discontinue use of the Site immediately.
          </p>
          <p>
            We reserve the right to modify or update these Terms at any time at our sole discretion. Any changes will become effective immediately upon posting on the Site. The most current version of the Terms will always be available on PandaCourses.com
          </p>

          <h2>CONTENT DISCLAIMER</h2>
          <p>
            Panda Courses and any hosting providers assume no responsibility for how users utilize the information made available on this Site. All content is provided for educational and informational purposes only.
          </p>
          <p>
            Any software, tools, or resources referenced on this Site must be legally obtained from the original creator or authorized seller for commercial use. Users are solely responsible for ensuring compliance with applicable laws in their country or region.
          </p>
          <p>
            Panda Courses does not guarantee the accuracy, completeness, or usefulness of any content and is not responsible for any actions taken based on information obtained from the Site or linked sources.
          </p>
          <p>
            If you do not understand or agree with any part of this Site or its content, you should discontinue use immediately.
          </p>

          <h2>USER-GENERATED CONTENT</h2>
          <p>
            Opinions expressed by users reflect the views of the individual author and do not necessarily represent those of Panda Courses.
          </p>
          <p>
            If you believe any content is inappropriate or objectionable, please contact us. We reserve the right to remove content at our discretion within a reasonable timeframe.
          </p>

          <h2>THIRD-PARTY LINKS</h2>
          <p>
            The Site may contain links to external websites that are not owned or controlled by Panda Courses. We are not responsible for the content, accuracy, or policies of any third-party websites. Accessing such sites is done at your own risk.
          </p>

          <h2>USER RESPONSIBILITY</h2>
          <p>
            You acknowledge that you are solely responsible for evaluating and bearing all risks associated with the use of any content on the Site. Under no circumstances shall Panda Courses be liable for any loss or damage resulting from reliance on Site content.
          </p>
          <p>
            Users accessing the Site from outside the United States agree to comply with all applicable local laws regarding online conduct and acceptable content.
          </p>

          <h2>COPYRIGHT & TRADEMARK POLICY (DMCA)</h2>
          <p>
            Panda Courses complies with the Digital Millennium Copyright Act (“DMCA”) and applicable intellectual property laws. We respond promptly to valid infringement notices.
          </p>
          <p>
            If you believe your copyrighted material has been infringed, you must submit a written DMCA notice including:
          </p>
          <ul>
            <li>Proof of authorization to act on behalf of the copyright owner</li>
            <li>Valid contact information, including an email address</li>
            <li>Identification of the copyrighted work and its location on the Site</li>
            <li>A statement of good-faith belief that the use is unauthorized</li>
            <li>A statement confirming the accuracy of the notice under penalty of perjury</li>
            <li>A physical or electronic signature of the authorized party</li>
          </ul>
          <p>
            Misrepresentation may result in liability for damages, including legal fees.
          </p>
          <p>
            Upon receiving a valid copyright or trademark request, we will review and remove the relevant content where applicable.
          </p>

          <h2>RELEASE AND INDEMNIFICATION</h2>
          <p>
            By using the Site, you agree to fully release and discharge Panda Courses and its affiliates from any and all claims, liabilities, damages, losses, or expenses arising from your use of the Site.
          </p>
          <p>
            You further agree to defend, indemnify, and hold harmless Panda Courses from any claims or damages resulting from your violation of these Terms.
          </p>

          <h2>DISCLAIMER OF WARRANTIES</h2>
          <p>
            Your use of PandaCourses.com is at your sole risk. The Site and services are provided on an “as is” and “as available” basis.
          </p>
          <p>
            To the fullest extent permitted by law, Panda Courses disclaims all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
          <p>
            We do not guarantee uninterrupted service, error-free functionality, or accuracy of results.
          </p>

          <h2>LIMITATION OF LIABILITY</h2>
          <p>
            Any materials downloaded or accessed through the Site are done at your own risk. Panda Courses is not responsible for any damage to your device, data loss, or other harm resulting from Site usage.
          </p>
          <p>
            No advice or information obtained from Panda Courses creates any warranty not expressly stated in these Terms.
          </p>

          <h2>GENERAL TERMS</h2>
          <p>
            If any provision of these Terms is found invalid, the remaining provisions shall remain in full force and effect. Failure to enforce any right shall not constitute a waiver.
          </p>
          <p>
            Certain provisions—including disclaimers, indemnification, and jurisdiction—will survive termination of these Terms.
          </p>

          <h2>JURISDICTION</h2>
          <p>
            All disputes related to the use of PandaCourses.com shall be governed by the laws of the State of Massachusetts, USA. You consent to exclusive jurisdiction and venue in the courts of Massachusetts.
          </p>

          <h2>COMPLETE AGREEMENT</h2>
          <p>
            These Terms constitute the entire agreement between you and Panda Courses regarding use of the Site, superseding any prior agreements or understandings.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
