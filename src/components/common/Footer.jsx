import React from 'react';

export const Footer = ({ setPage }) => {
  const navigateSafe = (target) => {
    const routeMap = {
      "Udyam Registration": "udyam",
      "Verify URN": "verify",
      "MSME Benefits": "udyam",
      "AI Assistant": "ai",
      "Small Projects": "projects",
      "Request a Build": "projects",
      "Our Work": "projects",
      "About Us": "about",
      "MSME Guidelines": "about",
      "Success Stories": "stories",
      "Contact": "contact",
    };
    const pageKey = routeMap[target] || "home";
    setPage(pageKey);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ background: "var(--primary-dark)", color: "#fff", padding: "48px 0 24px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1A1D2E", fontWeight: 800, fontSize: 16, fontFamily: "Lora, serif" }}>
                S
              </div>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 20 }}>SkillBridge</div>
            </div>
            <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.7, maxWidth: 260 }}>
              Official assistance for MSME / Udyam Registration & affordable execution of small-level business and digital projects.
            </p>
          </div>

          {/* Udyam Services Column */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 12, opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Udyam Services
            </div>
            {["Udyam Registration", "Verify URN", "MSME Benefits", "AI Assistant"].map((item) => (
              <div
                key={item}
                style={{ fontSize: 14, opacity: 0.75, marginBottom: 8, cursor: "pointer", transition: "opacity 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
                onClick={() => navigateSafe(item)}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Small Projects Column */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 12, opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Small Projects
            </div>
            {["Small Projects", "Request a Build", "Our Work", "AI Assistant"].map((item) => (
              <div
                key={item}
                style={{ fontSize: 14, opacity: 0.75, marginBottom: 8, cursor: "pointer", transition: "opacity 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
                onClick={() => navigateSafe(item)}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Organization Column */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 12, opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Organization
            </div>
            {["About Us", "MSME Guidelines", "Success Stories", "Contact"].map((item) => (
              <div
                key={item}
                style={{ fontSize: 14, opacity: 0.75, marginBottom: 8, cursor: "pointer", transition: "opacity 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
                onClick={() => navigateSafe(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13, opacity: 0.55 }}>
            © 2025 SkillBridge MSME Hub. Empowering micro, small, and medium businesses across India.
          </div>
          <div style={{ fontSize: 12, opacity: 0.45 }}>
            Assistance portal for Udyam (Ministry of MSME, Govt of India) & hands-on delivery of small-level projects.
          </div>
        </div>
      </div>
    </footer>
  );
};
