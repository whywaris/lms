const reviews = [
  {
    flag: '🇺🇸',
    avatar: 'https://i.pravatar.cc/80?img=12',
    name: 'Brandon Mitchell',
    role: 'Day Trader • Los Angeles, USA',
    tag: '📊 ShitShow – 6 Week Trading Course',
    html: `I bought <span class="testi-hl">"ShitShow – 6 Week Trading Course"</span> and it's EXACTLY what I was looking for! Affordable price, incredible value. I love them! Best trading education I've received and I've tried many expensive programs before.`,
  },
  {
    flag: '🇬🇧',
    avatar: 'https://i.pravatar.cc/80?img=7',
    name: 'Oliver Thompson',
    role: 'Agency Owner • London, UK',
    tag: '🚀 Charlie Morgan - EasyGrow 2.0',
    html: `<span class="testi-hl">"Charlie Morgan – EasyGrow 2.0"</span> completely transformed my agency! I went from <span class="testi-hl">£3K to £15K monthly revenue in just 8 weeks</span>. The strategies are pure gold and the price was absolutely steal. Worth every penny!`,
  },
  {
    flag: '🇨🇦',
    avatar: 'https://i.pravatar.cc/80?img=47',
    name: 'Sophie Williams',
    role: 'No-Code Developer • Toronto, Canada',
    tag: '💻 Andy Lo - Andynocode Premium',
    html: `As a complete beginner, <span class="testi-hl">"Andy Lo – Andynocode Premium"</span> was a game-changer! I built <span class="testi-hl">3 profitable apps in 2 months without writing a single line of code</span>. Amazing course at an unbeatable price. Highly recommend!`,
  },
  {
    flag: '🇸🇬',
    avatar: 'https://i.pravatar.cc/80?img=33',
    name: 'Marcus Tan',
    role: 'E-commerce Entrepreneur • Singapore',
    tag: '🛍️ Salif Sibane – Siba Ecom Mastermind',
    html: `<span class="testi-hl">"Salif Sibane – Siba Ecom Mastermind"</span> helped me scale my Shopify store from <span class="testi-hl">$2K to $25K per month</span>! The dropshipping strategies are next-level. Best investment I've made in my business. Worth 100x the price!`,
  },
  {
    flag: '🇪🇬',
    avatar: 'https://i.pravatar.cc/80?img=49',
    name: 'Layla Hassan',
    role: 'Brand Designer • Cairo, Egypt',
    tag: '🎨 Jody Raynsford – CultBrand Academy',
    html: `<span class="testi-hl">"Jody Raynsford – CultBrand Academy"</span> revolutionized my branding approach! My <span class="testi-hl">client list grew by 400% in 3 months</span>. The course content is absolutely phenomenal and the affordable price made it accessible for me. Life-changing!`,
  },
  {
    flag: '🇦🇺',
    avatar: 'https://i.pravatar.cc/80?img=15',
    name: 'Jake Anderson',
    role: 'Online Coach • Sydney, Australia',
    tag: '🏆 Jesper Hensgens – Freedom Achievers',
    html: `I grabbed <span class="testi-hl">"Jesper Hensgens – Freedom Achievers"</span> and it exceeded all expectations! Built my online coaching business to <span class="testi-hl">$10K/month in 10 weeks</span>. The step-by-step system is brilliant and incredibly affordable. Best decision I've made!`,
  },
]

export default function Testimonials() {
  return (
    <section className="testi-section">
      <div className="testi-inner">

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <span className="testi-badge">✓ Verified Reviews</span>
          <h2 className="testi-heading">
            What Our <span className="testi-heading-accent">Customers Say</span>
          </h2>
          <p className="testi-subtext">
            Authentic feedback from Customers around the globe who get Real Courses.
          </p>
        </div>

        {/* Grid */}
        <div className="testi-grid">
          {reviews.map((r, i) => (
            <div key={i} className="testi-card">

              {/* Top row: verified badge + flag */}
              <div className="testi-top-row">
                <span className="testi-verified">✓ Verified</span>
                <span className="testi-flag">{r.flag}</span>
              </div>

              {/* Stars */}
              <span className="testi-stars">★★★★★</span>

              {/* Review text with highlights */}
              <p
                className="testi-text"
                dangerouslySetInnerHTML={{ __html: r.html }}
              />

              {/* Course tag */}
              <span className="testi-tag">{r.tag}</span>

              {/* Divider */}
              <div className="testi-divider" />

              {/* Reviewer */}
              <div className="testi-reviewer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="testi-avatar"
                  width={48}
                  height={48}
                />
                <div>
                  <p className="testi-reviewer-name">{r.name}</p>
                  <p className="testi-reviewer-role">{r.role}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
