import React, { useState } from 'react';
import { verifyCertificate } from '../firebase/firestoreService';

export const VerifyPage = () => {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (idToTest) => {
    const target = idToTest || certId;
    if (!target.trim()) return;

    setLoading(true);
    const verification = await verifyCertificate(target.trim());
    setResult(verification);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ background: "var(--primary-dark)", padding: "52px 0 40px" }}>
        <div className="container">
          <div className="section-label" style={{ color: "var(--accent)" }}>Credential Authenticity</div>
          <h1 style={{ color: "#fff", fontSize: "2.2rem", marginBottom: 8 }}>Verify Certificate</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>
            Validate course completion credentials issued by the SkillBridge Organization.
          </p>
        </div>
      </div>

      <div className="container section" style={{ maxWidth: 680 }}>
        <div className="card" style={{ padding: 36 }}>
          <h2 style={{ marginBottom: 8, fontSize: 20 }}>Enter Certificate Serial Number</h2>
          <p style={{ color: "var(--text-mid)", fontSize: 14, marginBottom: 20 }}>
            Type the certificate code (e.g. <code>SB-2025-8492</code>) as printed on the completion document.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <input
              className="input-field"
              placeholder="e.g. SB-2025-8492"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            />
            <button
              className="sb-btn sb-btn-primary"
              onClick={() => handleVerify()}
              disabled={loading || !certId.trim()}
              style={{ minWidth: 110 }}
            >
              {loading ? "Checking..." : "Verify"}
            </button>
          </div>

          {/* Quick Demo Test Buttons */}
          <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span>Sample IDs to test:</span>
            {["SB-2025-8492", "SB-2025-3914"].map((id) => (
              <button
                key={id}
                onClick={() => {
                  setCertId(id);
                  handleVerify(id);
                }}
                style={{
                  background: "var(--surface-alt)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 11,
                  color: "var(--primary)",
                  cursor: "pointer"
                }}
              >
                {id}
              </button>
            ))}
          </div>

          {/* Verification Result Card */}
          {result && (
            <div style={{ marginTop: 28 }}>
              {result.valid ? (
                <div
                  style={{
                    background: "var(--success-light)",
                    border: "1px solid var(--success)",
                    borderRadius: 12,
                    padding: 24
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--success)", fontWeight: 700, fontSize: 18, marginBottom: 18 }}>
                    <span>✅</span> Valid & Authenticated Certificate
                  </div>

                  {[
                    ["Student Name", result.studentName],
                    ["Course Name", result.courseTitle],
                    ["Issue Date", result.issueDate],
                    ["Serial ID", result.id],
                    ["Issuer", result.issuer || "SkillBridge Organization"],
                    ["Status", "Official Credential Completed"]
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 14,
                        marginBottom: 10,
                        paddingBottom: 8,
                        borderBottom: "1px solid rgba(42,157,92,0.2)"
                      }}
                    >
                      <span style={{ color: "var(--text-mid)" }}>{k}</span>
                      <span style={{ fontWeight: 600, color: "var(--text)" }}>{v}</span>
                    </div>
                  ))}

                  <div style={{ marginTop: 14, fontSize: 12, color: "var(--text-mid)", lineHeight: 1.6 }}>
                    This credential was awarded upon passing comprehensive module assignments and final quizzes on SkillBridge.
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "var(--danger-light)",
                    border: "1px solid var(--danger)",
                    borderRadius: 12,
                    padding: 24,
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 8 }}>❌</div>
                  <div style={{ color: "var(--danger)", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
                    Certificate Not Found
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-mid)" }}>
                    No record matches the serial code entered. Please check for spelling mistakes or verify the ID.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div style={{ marginTop: 22, background: "var(--accent-light)", borderRadius: 10, padding: 18, fontSize: 13, color: "#7A5500", lineHeight: 1.6 }}>
          <strong>Note:</strong> SkillBridge issues organization-level completion credentials. We do not claim accreditation under AICTE, UGC, or MSME.
        </div>
      </div>
    </div>
  );
};
