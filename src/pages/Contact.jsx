import React, { useState } from 'react';
import { Icon } from '../components/common/Icon';
import { saveContactMessage } from '../firebase/firestoreService';

export const ContactPage = ({ showToast }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await saveContactMessage(form);
      setSubmitted(true);
      showToast("✉️ Message sent successfully!");
    } catch (err) {
      console.error("Error saving message:", err);
      showToast("Error sending message. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ background: "var(--primary-dark)", padding: "52px 0 40px" }}>
        <div className="container">
          <div className="section-label" style={{ color: "var(--accent)" }}>Get In Touch</div>
          <h1 style={{ color: "#fff", fontSize: "2.2rem", marginBottom: 8 }}>Contact Us</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>
            Questions, mentorship interest, partnership proposals, or project queries — we welcome hearing from you.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="grid-2" style={{ gap: 48, alignItems: "start" }}>
          <div>
            <h2 style={{ marginBottom: 16, fontSize: "1.7rem" }}>Reach Our Community Team</h2>
            <p style={{ color: "var(--text-mid)", marginBottom: 28, lineHeight: 1.8 }}>
              SkillBridge is driven by a passionate community of volunteer educators, software engineers, and social mentors. Reach out through any of our channels below.
            </p>

            {[
              { icon: "mail", label: "Email Address", value: "community@skillbridge.org" },
              { icon: "phone", label: "Community Helpline", value: "+91 94420 12345 (Tamil & English)" },
              { icon: "globe", label: "Headquarters & Hubs", value: "Chennai & Coimbatore, Tamil Nadu, India" },
            ].map((c) => (
              <div key={c.label} style={{ display: "flex", gap: 14, marginBottom: 20, alignItems: "center" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "var(--accent-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <Icon name={c.icon} size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.label}</div>
                  <div style={{ fontWeight: 600, color: "var(--text)" }}>{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="card" style={{ padding: 32 }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "32px 10px" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
                <h3 style={{ marginBottom: 8, fontSize: 18 }}>Thank you! Your message was received.</h3>
                <p style={{ color: "var(--text-mid)", fontSize: 14, marginBottom: 20 }}>
                  A member of our team will respond to your inquiry within 24 to 48 hours.
                </p>
                <button
                  className="sb-btn sb-btn-outline"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", subject: "General Inquiry", message: "" });
                  }}
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label className="input-label">Full Name</label>
                  <input
                    className="input-field"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

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
                  <label className="input-label">Subject</label>
                  <select
                    className="input-field"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Request Us to Build a Project">🚀 Request Us to Build a Project</option>
                    <option value="Become a Mentor">Volunteer as a Mentor</option>
                    <option value="Post a Project">Post a Client Micro-Project</option>
                    <option value="College Partnership">College / NGO Collaboration</option>
                    <option value="Technical Support">Technical Support</option>
                  </select>
                </div>
                {form.subject === "Request Us to Build a Project" && (
                  <div style={{ background: "var(--accent-light)", padding: "10px 14px", borderRadius: 8, fontSize: 13, color: "#7A5500", border: "1px solid var(--accent)" }}>
                    💡 <strong>Client Project Build Request:</strong> Our platform admin and technical mentors will review your scope and reply directly to your email address within 24 hours.
                  </div>
                )}

                <div>
                  <label className="input-label">Your Message</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Write your note or question here..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  className="sb-btn sb-btn-primary"
                  style={{ justifyContent: "center", padding: "12px" }}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
