import React from 'react';

export const Footer = ({ setPage }) => {
  const navigateSafe = (target) => {
    const routeMap = {
      "Courses": "courses",
      "Free Learning": "courses",
      "AI Assistant": "ai",
      "Certificates": "verify",
      "Projects": "projects",
      "Freelance": "projects",
      "Build Portfolio": "courses",
      "Mentors": "about",
      "About Us": "about",
      "Our Mission": "about",
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
              Free practical learning, mentorship, and opportunities for students who want to build a better future.
            </p>
          </div>

          {/* Learn Column */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 12, opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Learn
            </div>
            {["Courses", "Free Learning", "AI Assistant", "Certificates"].map((item) => (
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

          {/* Work Column */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 12, opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Work
            </div>
            {["Projects", "Freelance", "Build Portfolio", "Mentors"].map((item) => (
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
            {["About Us", "Our Mission", "Success Stories", "Contact"].map((item) => (
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
            © 2025 SkillBridge Foundation. A community social-impact education initiative.
          </div>
          <div style={{ fontSize: 12, opacity: 0.45 }}>
            Certificates issued by SkillBridge organization. Independent social credential, not a Government of India certification.
          </div>
        </div>
      </div>
    </footer>
  );
};
