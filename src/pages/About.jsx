import React from 'react';

export const AboutPage = ({ setPage }) => (
  <div>
    <div style={{ background: "var(--primary-dark)", padding: "56px 0 44px" }}>
      <div className="container">
        <div className="section-label" style={{ color: "var(--accent)" }}>About SkillBridge</div>
        <h1 style={{ color: "#fff", fontSize: "2.3rem", maxWidth: 640, marginBottom: 14 }}>
          A community built on the conviction that practical skills belong to everyone
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, maxWidth: 600 }}>
          Democratizing digital education, mentorship, and first-time freelance opportunities for learners across India.
        </p>
      </div>
    </div>

    <div className="container section">
      <div className="grid-2" style={{ gap: 48, alignItems: "start" }}>
        <div>
          <h2 style={{ marginBottom: 18, fontSize: "1.7rem" }}>Our Origin & Purpose</h2>
          <p style={{ color: "var(--text-mid)", lineHeight: 1.8, marginBottom: 16 }}>
            SkillBridge was founded around a simple observation: millions of young people possess the ambition, intelligence, and work ethic to thrive in modern software, data, and design roles — yet are held back by tuition barriers, complex technical jargon, and zero access to real client portfolios.
          </p>
          <p style={{ color: "var(--text-mid)", lineHeight: 1.8, marginBottom: 16 }}>
            Starting in Tamil Nadu, our platform was crafted to eliminate these obstacles by offering 100% free, curated practical tracks, pairing learners with an AI companion capable of conversing naturally in both <strong>Tamil and English</strong>, and connecting graduates immediately to micro-freelance opportunities.
          </p>
          <p style={{ color: "var(--text-mid)", lineHeight: 1.8 }}>
            We adhere strictly to the <strong>LEARN → PRACTICE → CERTIFY → PORTFOLIO → REAL PROJECTS</strong> pathway. Theory alone doesn't sustain a family — practical execution does.
          </p>
        </div>

        <div>
          <h2 style={{ marginBottom: 18, fontSize: "1.7rem" }}>Our Core Values</h2>
          {[
            {
              title: "Absolute Accessibility",
              desc: "Quality practical education must never be gated behind subscriptions or paywalls. Every single course on SkillBridge is free."
            },
            {
              title: "Practical Proof Over Memorization",
              desc: "We focus on building working web pages, automation scripts, and design assets that clients can actually use."
            },
            {
              title: "Bilingual Compassion",
              desc: "Language should be a bridge, not a wall. We support Tamil and English technical tutoring to foster native confidence."
            },
            {
              title: "Honest Impact & Transparent Metrics",
              desc: "We report actual verified student numbers, publish genuine testimonials, and never falsely inflate credentials."
            }
          ].map((v) => (
            <div key={v.title} style={{ marginBottom: 20, paddingLeft: 18, borderLeft: "3px solid var(--accent)" }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: "var(--text)" }}>{v.title}</div>
              <div style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.7 }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Certificate Authenticity Card */}
      <div style={{ background: "var(--accent-light)", borderRadius: 14, padding: "28px 32px", border: "1px solid rgba(232,160,32,0.3)" }}>
        <h3 style={{ marginBottom: 12, color: "#7A5500", fontSize: 18 }}>
          Clear Policy Regarding SkillBridge Certificates
        </h3>
        <p style={{ color: "var(--text-mid)", lineHeight: 1.8, marginBottom: 12, fontSize: 14 }}>
          Certificates issued by SkillBridge are <strong>independent organization course-completion credentials</strong> awarded after an applicant finishes required lessons and passes the associated knowledge checks.
        </p>
        <p style={{ color: "var(--text-mid)", lineHeight: 1.8, fontSize: 14 }}>
          We do <strong>not</strong> present our certificates as Government of India, MSME, or statutory university degrees unless a formalized institutional partnership is officially announced. Our credentials are designed to give employers and freelance clients clear, verifiable proof of your hands-on competencies.
        </p>
      </div>

      <div className="divider" />

      {/* Get Involved CTA */}
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <h2 style={{ marginBottom: 12, fontSize: "1.8rem" }}>Join Our Community Mission</h2>
        <p style={{ color: "var(--text-mid)", marginBottom: 24, maxWidth: 520, margin: "0 auto 24px" }}>
          Whether you are an industry practitioner ready to volunteer mentorship, an organization seeking local talent, or a student eager to learn — welcome to SkillBridge.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="sb-btn sb-btn-primary" onClick={() => setPage("courses")}>
            Start Learning
          </button>
          <button className="sb-btn sb-btn-outline" onClick={() => setPage("contact")}>
            Contact Our Team
          </button>
        </div>
      </div>
    </div>
  </div>
);
