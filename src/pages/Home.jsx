import React, { useState } from 'react';
import { Icon } from '../components/common/Icon';
import { Badge, Tag } from '../components/common/UIComponents';

export const HomePage = ({ setPage, user }) => {
  const smallProjects = [
    {
      id: "sp-1",
      title: "Simple Business Website",
      category: "Web Design",
      budget: "₹1,500 – ₹3,500",
      timeline: "3–5 days",
      icon: "🌐",
      desc: "Clean, mobile-responsive single-page or 3-page website showcasing your shop, services, photo gallery, and WhatsApp direct ordering button."
    },
    {
      id: "sp-2",
      title: "Excel / Sheets Billing & Inventory",
      category: "Data & Billing",
      budget: "₹500 – ₹1,200",
      timeline: "2 days",
      icon: "📊",
      desc: "Automated invoice calculation, GST calculation, stock tracker, and daily sales report in Excel or Google Sheets."
    },
    {
      id: "sp-3",
      title: "Social Media Banner Pack (5-10 Designs)",
      category: "Graphic Design",
      budget: "₹400 – ₹800",
      timeline: "2 days",
      icon: "🎨",
      desc: "Eye-catching festival discount graphics, promotional offers, and product posters formatted for WhatsApp status and Instagram."
    },
    {
      id: "sp-4",
      title: "Google Business Profile & Maps Setup",
      category: "Local SEO",
      budget: "₹500 – ₹1,000",
      timeline: "24 hours",
      icon: "📍",
      desc: "Setup and optimize your local shop on Google Maps & Google Search with store hours, photos, directions, and phone numbers."
    },
    {
      id: "sp-5",
      title: "Catalog Data Entry & Clean-up",
      category: "Data Entry",
      budget: "₹300 – ₹800",
      timeline: "2 days",
      icon: "📝",
      desc: "Convert paper receipts, handwritten registers, or scanned PDFs into well-structured, error-free digital spreadsheets."
    },
    {
      id: "sp-6",
      title: "Small Automation / WhatsApp Script",
      category: "Python & Tools",
      budget: "₹800 – ₹2,000",
      timeline: "3 days",
      icon: "⚙️",
      desc: "Automated customer follow-up message scripts, scheduled email alerts, or simple data scraping tailored to your workflow."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-bg" style={{ padding: "76px 0 68px", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 380, height: 380, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: "40%", width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 40 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(232,160,32,0.18)", border: "1px solid rgba(232,160,32,0.4)", borderRadius: 20, padding: "5px 14px", marginBottom: 18 }}>
              <span style={{ fontSize: 13 }}>🇮🇳</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em" }}>
                UDYAM MSME REGISTRATION & SMALL PROJECTS HUB
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.1rem, 4.5vw, 3.2rem)", color: "#fff", lineHeight: 1.18, marginBottom: 18, maxWidth: 640 }}>
              Official Udyam Registration & Small-Level Projects Done for You.
            </h1>

            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", maxWidth: 580, lineHeight: 1.7, marginBottom: 30 }}>
              Need government MSME certification? We assist with <strong>instant Udyam Registration</strong> to unlock collateral-free bank loans & subsidies. Plus, <strong>small-level digital projects will be done quickly</strong> — from business websites and billing sheets to local SEO and design.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <button
                className="sb-btn sb-btn-accent sb-btn-lg"
                style={{ fontWeight: 700 }}
                onClick={() => setPage("udyam")}
              >
                📝 Register for Udyam (MSME)
              </button>
              <button
                className="sb-btn sb-btn-lg"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)" }}
                onClick={() => setPage("projects")}
              >
                🚀 Request a Small Project
              </button>
            </div>

            {/* Micro proof badges */}
            <div style={{ display: "flex", gap: 20, marginTop: 32, flexWrap: "wrap", fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
              <span>✓ 100% Online Filing</span>
              <span>✓ 16-Digit Official URN</span>
              <span>✓ ₹0 Collateral Loan Access</span>
              <span>✓ Fast Small Project Delivery</span>
            </div>
          </div>

          {/* Right Highlight Box */}
          <div className="hide-mobile" style={{ width: 340 }}>
            <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 16, padding: "26px 24px", color: "#fff" }}>
              <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent)", fontWeight: 700, marginBottom: 8 }}>
                Quick Udyam Services
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 14, fontWeight: 700, color: "#fff" }}>
                What We Do For Your Business:
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", fontSize: 13, lineHeight: 1.9 }}>
                <li>🏛️ <strong>New Udyam Registration</strong> for Shops & Startups</li>
                <li>📜 <strong>Download & Verify</strong> 16-Digit Udyam URN</li>
                <li>💻 <strong>Small Websites & Catalogs</strong> in 3–5 Days</li>
                <li>📊 <strong>Excel Invoice & Stock Sheets</strong> in 48 Hours</li>
                <li>🎨 <strong>Canva Banners & Posters</strong> for WhatsApp Promo</li>
              </ul>
              <button
                className="sb-btn sb-btn-accent"
                style={{ width: "100%", justifyContent: "center", fontWeight: 700 }}
                onClick={() => setPage("udyam")}
              >
                Start Udyam Filing Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Udyam Registration Spotlight */}
      <section className="container section">
        <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 44px" }}>
          <div className="section-label">Official MSME Certification</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.3rem)", color: "var(--text)", marginBottom: 12 }}>
            Why Every Micro & Small Business Needs Udyam Registration
          </h2>
          <p style={{ color: "var(--text-mid)", fontSize: 15, lineHeight: 1.6 }}>
            The Government of India provides immense financial, legal, and operational advantages to registered MSMEs.
          </p>
        </div>

        <div className="grid-3" style={{ gap: 24 }}>
          {[
            {
              icon: "🏦",
              title: "Collateral-Free Bank Credit",
              desc: "Apply for loans under the CGTMSE scheme where nationalized banks extend credit up to ₹2 Crore without demanding property or third-party guarantee."
            },
            {
              icon: "🛡️",
              title: "Delayed Payment Settlement",
              desc: "Buyers must legally settle payments within 45 days. Defaults attract 3x compound interest under MSME Samadhaan legal tribunal protection."
            },
            {
              icon: "🏛️",
              title: "Govt Tender Fee Waivers",
              desc: "Enjoy 100% waiver of Earnest Money Deposit (EMD) and security deposits when submitting bids for Central and State government tenders."
            },
            {
              icon: "⚡",
              title: "Electricity Bill Subsidies",
              desc: "Avail power tariff discounts for commercial and industrial workshops, plus capital investment subsidies from State MSME directorates."
            },
            {
              icon: "🏷️",
              title: "50% Trademark & Patent Discount",
              desc: "Get 50% government concession on trademark registrations, patent fees, and official bar-code subsidies for retail products."
            },
            {
              icon: "📉",
              title: "Lower Overdraft Interest Rates",
              desc: "Save 1% to 1.5% interest on bank overdrafts and cash credit accounts across all major public sector banks."
            }
          ].map((item) => (
            <div key={item.title} className="card" style={{ padding: 26 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-mid)", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <button className="sb-btn sb-btn-primary sb-btn-lg" onClick={() => setPage("udyam")}>
            Apply for Udyam Registration (Free Guidance) →
          </button>
        </div>
      </section>

      {/* Section 2: Small Level Projects Will Be Done */}
      <section style={{ background: "var(--surface-alt)", padding: "64px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(45, 74, 138, 0.1)", padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, color: "var(--primary)", marginBottom: 8 }}>
                <span>⚡ AFFORDABLE & RAPID EXECUTION</span>
              </div>
              <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.3rem)", color: "var(--text)", marginBottom: 6 }}>
                Small-Level Projects Will Be Done For You
              </h2>
              <p style={{ color: "var(--text-mid)", fontSize: 15, maxWidth: 640 }}>
                Don't overpay SaaS agencies. We execute small-level digital tasks, shop websites, Excel sheets, and marketing assets at reasonable rates with rapid turnaround.
              </p>
            </div>
            <button className="sb-btn sb-btn-accent" onClick={() => setPage("projects")}>
              🚀 Ask Us to Build Your Project
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 22 }}>
            {smallProjects.map((p) => (
              <div key={p.id} className="card" style={{ padding: 24, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>{p.icon}</span>
                  <span style={{ fontSize: 11, background: "var(--surface-alt)", padding: "3px 8px", borderRadius: 4, fontWeight: 600, color: "var(--text-muted)" }}>
                    {p.category}
                  </span>
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-mid)", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                  {p.desc}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--border)", fontSize: 12 }}>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Budget: </span>
                    <strong style={{ color: "var(--accent-dark, #A16A00)" }}>{p.budget}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Delivery: </span>
                    <strong style={{ color: "var(--primary)" }}>{p.timeline}</strong>
                  </div>
                </div>

                <button
                  className="sb-btn sb-btn-outline"
                  style={{ width: "100%", marginTop: 14, fontSize: 13, justifyContent: "center" }}
                  onClick={() => setPage("projects")}
                >
                  Request This Project →
                </button>
              </div>
            ))}
          </div>

          {/* Banner: Custom small tasks */}
          <div
            style={{
              background: "#fff",
              border: "1.5px solid var(--accent)",
              borderRadius: 14,
              padding: "24px 28px",
              marginTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: "var(--text)", marginBottom: 4 }}>
                Have a unique small-level task not listed above?
              </div>
              <div style={{ fontSize: 13, color: "var(--text-mid)" }}>
                Tell us your requirements — our team will evaluate and give you a prompt quote within hours.
              </div>
            </div>
            <button className="sb-btn sb-btn-accent" onClick={() => setPage("projects")}>
              Tell Us What to Build
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Simple 3-Step Process */}
      <section className="container section">
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 40px" }}>
          <div className="section-label">Seamless & Transparent</div>
          <h2 style={{ fontSize: "2rem", color: "var(--text)" }}>How It Works</h2>
        </div>

        <div className="grid-3" style={{ gap: 28 }}>
          {[
            {
              step: "01",
              title: "Submit Online",
              desc: "Fill in your Aadhaar & business details for Udyam Registration, or describe your small-level project requirements."
            },
            {
              step: "02",
              title: "Verification & Assignment",
              desc: "Our admin team verifies your data against official MSME registries or allocates a dedicated developer & mentor."
            },
            {
              step: "03",
              title: "Certificate or Delivery",
              desc: "Receive your official 16-digit Udyam Registration Certificate in your email, or review your completed project."
            }
          ].map((s) => (
            <div key={s.step} style={{ textAlign: "center", padding: "20px 16px" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--accent-light)",
                  color: "#7A5500",
                  fontWeight: 800,
                  fontSize: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  border: "2px solid var(--accent)"
                }}
              >
                {s.step}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-mid)", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Final CTA */}
      <section style={{ background: "var(--primary-dark)", padding: "64px 0", color: "#fff", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <h2 style={{ color: "#fff", fontSize: "2.2rem", marginBottom: 14 }}>
            Empower Your Business Today
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            Get your government Udyam MSME certificate and have your small-level digital tasks done with professional care.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="sb-btn sb-btn-accent sb-btn-lg" onClick={() => setPage("udyam")}>
              Apply for Udyam Registration
            </button>
            <button
              className="sb-btn sb-btn-lg"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)" }}
              onClick={() => setPage("projects")}
            >
              Request a Small Project
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
