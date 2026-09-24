import React, { useState } from 'react';
import {
  registerUser,
  loginUser,
  loginWithGoogle,
  loginWithGithub,
  loginWithFacebook
} from '../firebase/authService';

export const AuthPage = ({ mode, setPage, setUser, showToast }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "msme_owner" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const isLogin = mode === "login";

  const handleSocialLogin = async (provider) => {
    setError("");
    setSocialLoading(provider);
    try {
      let loggedUser;
      if (provider === "google") loggedUser = await loginWithGoogle();
      else if (provider === "github") loggedUser = await loginWithGithub();
      else if (provider === "facebook") loggedUser = await loginWithFacebook();

      showToast(`🎉 Signed in successfully as ${loggedUser.name}!`);
      setUser(loggedUser);
      setPage("dashboard");
    } catch (err) {
      setError(err.message || "Social sign-in failed. Please try again.");
    }
    setSocialLoading(null);
  };

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
      <div style={{ width: "100%", maxWidth: 480 }}>
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
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
            Udyam (MSME) Registration & Small-Level Projects Hub
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="card" style={{ padding: "34px 30px" }}>
          <h2 style={{ fontSize: 22, marginBottom: 6, color: "var(--text)" }}>
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h2>
          <p style={{ color: "var(--text-mid)", fontSize: 14, marginBottom: 22 }}>
            {isLogin
              ? "Sign in to manage your Udyam registration and small-level project requests."
              : "Register to get fast-track Udyam MSME certificate and request small-level projects."}
          </p>

          {/* Social Login Buttons: Google, GitHub, Facebook */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={!!socialLoading || loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                width: "100%",
                padding: "11px 16px",
                borderRadius: 8,
                border: "1.5px solid var(--border)",
                background: "#fff",
                color: "var(--text)",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>{socialLoading === "google" ? "Connecting to Google..." : "Continue with Google"}</span>
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                type="button"
                onClick={() => handleSocialLogin("github")}
                disabled={!!socialLoading || loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1.5px solid var(--border)",
                  background: "#24292e",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer"
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>{socialLoading === "github" ? "GitHub..." : "GitHub"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                disabled={!!socialLoading || loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1.5px solid #1877F2",
                  background: "#1877F2",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer"
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>{socialLoading === "facebook" ? "Facebook..." : "Facebook"}</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", margin: "20px 0", color: "var(--text-muted)", fontSize: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ padding: "0 12px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
              Or with Email
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

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
                <label className="input-label">Full Name / Business Owner</label>
                <input
                  className="input-field"
                  placeholder="e.g. Anand Murugan"
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
                placeholder="owner@yourbusiness.com"
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
                <label className="input-label">Your Primary Need</label>
                <select
                  className="input-field"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="udyam_registration">Need Udyam (MSME) Registration</option>
                  <option value="small_project">Need a Small-Level Project Done</option>
                  <option value="both">Both (Udyam + Small Project)</option>
                  <option value="freelancer">Freelancer / Project Contributor</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="sb-btn sb-btn-primary"
              style={{ justifyContent: "center", marginTop: 8, padding: "13px" }}
              disabled={loading || !!socialLoading}
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Register Free"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: "var(--text-mid)" }}>
            {isLogin ? "New to SkillBridge? " : "Already registered? "}
            <span
              style={{ color: "var(--primary)", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
              onClick={() => {
                setError("");
                setPage(isLogin ? "register" : "login");
              }}
            >
              {isLogin ? "Create an account" : "Sign in here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
