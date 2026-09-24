import React, { useState } from 'react';
import { Avatar } from './UIComponents';
import { isFirebaseConfigured } from '../../firebase/config';

const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "udyam", label: "Udyam Registration" },
  { key: "projects", label: "Small Projects" },
  { key: "about", label: "About MSME" },
  { key: "contact", label: "Contact Us" },
  { key: "ai", label: "SkillMate AI" },
];

export const Navbar = ({ page, setPage, user, onSignOut }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{ background: "#fff", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: "flex", alignItems: "center", height: 64, gap: 28 }}>
        {/* Logo */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}
          onClick={() => setPage("home")}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 19,
              fontFamily: "Lora, serif"
            }}
          >
            S
          </div>
          <div>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, color: "var(--text)", lineHeight: 1.1 }}>SkillBridge</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.02em" }}>Udyam & Small Projects</div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hide-mobile" style={{ display: "flex", gap: 22, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <span
              key={item.key}
              className={`nav-link${page === item.key ? " active" : ""}`}
              onClick={() => setPage(item.key)}
            >
              {item.label}
            </span>
          ))}
        </div>

        {/* Right Section / Auth & Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto", flexShrink: 0 }}>
          {/* Firebase Status indicator */}
          <span
            title={isFirebaseConfigured ? "Connected to live Firebase project" : "Operating in local persistence mode"}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: 12,
              background: isFirebaseConfigured ? "var(--success-light)" : "var(--surface-alt)",
              color: isFirebaseConfigured ? "var(--success)" : "var(--text-mid)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4
            }}
            className="hide-mobile"
          >
            <span style={{ fontSize: 9 }}>{isFirebaseConfigured ? "🟢" : "💾"}</span>
            {isFirebaseConfigured ? "Firebase Live" : "Local Mode"}
          </span>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                className="sb-btn sb-btn-ghost sb-btn-sm hide-mobile"
                onClick={() => setPage("dashboard")}
              >
                Dashboard
              </button>
              <div
                onClick={() => setPage("dashboard")}
                style={{ cursor: "pointer" }}
                title={`Signed in as ${user.name}`}
              >
                <Avatar initials={(user.name || "U").substring(0, 2).toUpperCase()} size={36} />
              </div>
              <button
                className="sb-btn sb-btn-sm"
                style={{ padding: "6px 10px", color: "var(--danger)", fontSize: 12 }}
                onClick={onSignOut}
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button
                className="sb-btn sb-btn-ghost sb-btn-sm hide-mobile"
                onClick={() => setPage("login")}
              >
                Sign In
              </button>
              <button
                className="sb-btn sb-btn-primary sb-btn-sm"
                onClick={() => setPage("register")}
              >
                Join Free
              </button>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="sb-btn sb-btn-ghost sb-btn-sm show-mobile"
            style={{ display: "none", padding: "6px 10px", fontSize: 18 }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div style={{ background: "#fff", borderTop: "1px solid var(--border)", padding: "16px 24px" }}>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.key}
              style={{
                padding: "10px 0",
                fontSize: 15,
                fontWeight: 500,
                color: page === item.key ? "var(--primary)" : "var(--text-mid)",
                cursor: "pointer",
                borderBottom: "1px solid var(--surface-alt)"
              }}
              onClick={() => {
                setPage(item.key);
                setMenuOpen(false);
              }}
            >
              {item.label}
            </div>
          ))}

          {user ? (
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                className="sb-btn sb-btn-outline"
                style={{ width: "100%" }}
                onClick={() => {
                  setPage("dashboard");
                  setMenuOpen(false);
                }}
              >
                My Dashboard ({user.name})
              </button>
              <button
                className="sb-btn sb-btn-ghost"
                style={{ width: "100%", color: "var(--danger)" }}
                onClick={() => {
                  onSignOut();
                  setMenuOpen(false);
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <button
                className="sb-btn sb-btn-outline"
                style={{ flex: 1 }}
                onClick={() => {
                  setPage("login");
                  setMenuOpen(false);
                }}
              >
                Sign In
              </button>
              <button
                className="sb-btn sb-btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  setPage("register");
                  setMenuOpen(false);
                }}
              >
                Join Free
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
