import React from 'react';
import { Avatar, Badge } from '../components/common/UIComponents';
import { SUCCESS_STORIES } from '../data/community';

export const StoriesPage = ({ setPage }) => (
  <div>
    <div style={{ background: "var(--primary-dark)", padding: "52px 0 40px" }}>
      <div className="container">
        <div className="section-label" style={{ color: "var(--accent)" }}>Community Proof</div>
        <h1 style={{ color: "#fff", fontSize: "2.2rem", marginBottom: 8 }}>Real Learners, Real Outcomes</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>
          Authentic stories and milestones from students who built practical skills on SkillBridge.
        </p>
      </div>
    </div>

    <div className="container section">
      <div
        style={{
          background: "var(--accent-light)",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 32,
          fontSize: 13,
          color: "#7A5500",
          border: "1px solid rgba(232, 160, 32, 0.3)"
        }}
      >
        🔒 <strong>Integrity Commitment:</strong> All stories are documented with verified permission from participants. Outcomes and compensation figures are reported accurately without marketing inflation.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28 }}>
        {SUCCESS_STORIES.map((s) => (
          <div key={s.name} className="card" style={{ padding: 28, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "center" }}>
              <Avatar initials={s.avatar} size={54} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, color: "var(--text)" }}>{s.name}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.location}</div>
                <div style={{ marginTop: 4 }}>
                  <Badge type="beginner">{s.course}</Badge>
                </div>
              </div>
            </div>

            <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.7, borderLeft: "3px solid var(--accent)", paddingLeft: 14, flex: 1 }}>
              "{s.outcome}"
            </p>

            <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid var(--surface-alt)", fontSize: 12, color: "var(--primary)", fontWeight: 600 }}>
              ✓ Verified {s.badge}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 48, padding: "44px 32px", background: "var(--surface-alt)", borderRadius: 16 }}>
        <h3 style={{ fontSize: 20, marginBottom: 10 }}>Your Success Story Could Be Next</h3>
        <p style={{ color: "var(--text-mid)", marginBottom: 22, maxWidth: 500, margin: "0 auto 22px" }}>
          Enroll in your first free course today, practice with the SkillMate AI tutor, and bid on micro-gigs.
        </p>
        <button className="sb-btn sb-btn-primary sb-btn-lg" onClick={() => setPage("courses")}>
          Start Learning Free
        </button>
      </div>
    </div>
  </div>
);
