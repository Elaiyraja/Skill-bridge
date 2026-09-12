import React, { useState } from 'react';
import { registerUser, loginUser } from '../firebase/authService';

export const AuthPage = ({ mode, setPage, setUser, showToast }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in your email address and password.");
      return;
    }
    if (!isLogin && !form.name) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);
    try {
      let loggedUser;
      if (isLogin) {
        loggedUser = await loginUser({ email: form.email, password: form.password });
        showToast(`👋 Welcome back, ${loggedUser.name}!`);
      } else {
        loggedUser = await registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        });
        showToast(`🎉 Account created! Welcome to SkillBridge, ${loggedUser.name}!`);
      }

      setUser(loggedUser);
      setPage("dashboard");
    } catch (err) {
      setError(err.message || "Authentication error. Please verify your details.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface-alt)",
        padding: "36px 20px"
      }}
    >
      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 26,
              fontFamily: "Lora, serif",
              margin: "0 auto 12px",
              boxShadow: "0 6px 18px rgba(45, 74, 138, 0.2)"
            }}
          >
            S
          </div>
          <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 24, color: "var(--text)" }}>
            SkillBridge
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Free Practical Skills & Community Freelancing
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="card" style={{ padding: "36px 32px" }}>
          <h2 style={{ fontSize: 22, marginBottom: 6, color: "var(--text)" }}>
            {isLogin ? "Welcome Back" : "Create Free Account"}
          </h2>
          <p style={{ color: "var(--text-mid)", fontSize: 14, marginBottom: 24 }}>
            {isLogin
              ? "Sign in to resume your courses and freelance proposals."
              : "Join our community. All courses are completely free."}
          </p>

          {error && (
            <div
              style={{
                background: "var(--danger-light)",
                color: "var(--danger)",
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 18,
                border: "1px solid rgba(214, 64, 69, 0.2)"
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {!isLogin && (
              <div>
                <label className="input-label">Full Name</label>
                <input
                  className="input-field"
                  placeholder="e.g. Priya Sundaram"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="input-label">Email Address</label>
              <input
                className="input-field"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="input-label">Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="input-label">I want to join SkillBridge as</label>
                <select
                  className="input-field"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="student">Student / Learner</option>
                  <option value="freelancer">Freelancer (bidding on gigs)</option>
                  <option value="client">Client (posting micro-projects)</option>
                  <option value="mentor">Mentor / Industry Volunteer</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="sb-btn sb-btn-primary"
              style={{ justifyContent: "center", marginTop: 8, padding: "13px" }}
              disabled={loading}
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Join Free Today"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: "var(--text-mid)" }}>
            {isLogin ? "New to SkillBridge? " : "Already have an account? "}
            <span
              style={{ color: "var(--primary)", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
              onClick={() => {
                setError("");
                setPage(isLogin ? "register" : "login");
              }}
            >
              {isLogin ? "Create account" : "Sign in here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
