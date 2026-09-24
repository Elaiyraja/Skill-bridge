import React, { useState } from 'react';
import { Icon } from '../components/common/Icon';
import { Badge, Modal } from '../components/common/UIComponents';
import { saveUdyamRegistration, verifyUdyamURN } from '../firebase/firestoreService';

export const UdyamPage = ({ setPage, user, showToast }) => {
  const [activeTab, setActiveTab] = useState("apply"); // "apply" | "benefits" | "verify"
  const [submitting, setSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(null);

  // Form State
  const [form, setForm] = useState({
    ownerName: user?.name || "",
    aadhaarNumber: "",
    panNumber: "",
    mobileNumber: "",
    email: user?.email || "",
    enterpriseName: "",
    businessType: "Proprietorship",
    category: "Services",
    activityDescription: "",
    bankAccount: "",
    bankIfsc: "",
    employeesCount: "1-5",
    investmentRange: "< ₹10 Lakhs",
    district: "Chennai",
    state: "Tamil Nadu",
    pinCode: ""
  });

  // Verify State
  const [verifyUrn, setVerifyUrn] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ownerName || !form.aadhaarNumber || !form.enterpriseName || !form.mobileNumber) {
      showToast("Please fill in the required fields (Name, Aadhaar, Business Name, Mobile).");
      return;
    }

    setSubmitting(true);
    try {
      const record = await saveUdyamRegistration({
        ...form,
        userId: user?.uid || "guest"
      });
      setApplicationSuccess(record);
      showToast("🎉 Udyam Registration application submitted successfully!");
    } catch (err) {
      console.error("Error submitting Udyam registration:", err);
      showToast("Error submitting application. Please try again.");
    }
    setSubmitting(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verifyUrn.trim()) return;

    setVerifying(true);
    try {
      const result = await verifyUdyamURN(verifyUrn.trim());
      setVerificationResult(result);
    } catch (err) {
      console.error(err);
      setVerificationResult({ valid: false });
    }
    setVerifying(false);
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ background: "var(--primary-dark)", padding: "52px 0 44px", color: "#fff" }}>
        <div className="container">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(232, 160, 32, 0.2)", border: "1px solid rgba(232, 160, 32, 0.4)", borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 13 }}>🇮🇳</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em" }}>
              MINISTRY OF MSME ASSISTANCE PORTAL
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", marginBottom: 12, lineHeight: 1.2 }}>
            Official Udyam (MSME) Registration
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, maxWidth: 680, lineHeight: 1.6 }}>
            Get your government-verified 16-digit Udyam Registration Number (URN) & e-Certificate. Unlock collateral-free bank loans, tender preferences, and subsidies for your micro or small business.
          </p>

          {/* Quick Tab Switcher */}
          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <button
              className={`sb-btn ${activeTab === "apply" ? "sb-btn-accent" : "sb-btn-ghost"}`}
              style={{ color: activeTab === "apply" ? "#000" : "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              onClick={() => setActiveTab("apply")}
            >
              📝 Apply for Udyam Registration
            </button>
            <button
              className={`sb-btn ${activeTab === "benefits" ? "sb-btn-accent" : "sb-btn-ghost"}`}
              style={{ color: activeTab === "benefits" ? "#000" : "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              onClick={() => setActiveTab("benefits")}
            >
              ⭐ Key Benefits & Eligibility
            </button>
            <button
              className={`sb-btn ${activeTab === "verify" ? "sb-btn-accent" : "sb-btn-ghost"}`}
              style={{ color: activeTab === "verify" ? "#000" : "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              onClick={() => setActiveTab("verify")}
            >
              🔍 Verify URN Certificate
            </button>
          </div>
        </div>
      </div>

      <div className="container section">
        {/* Tab 1: Apply */}
        {activeTab === "apply" && (
          <div>
            {applicationSuccess ? (
              <div className="card" style={{ padding: 40, textAlign: "center", maxWidth: 640, margin: "0 auto", borderColor: "var(--success)" }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
                <h2 style={{ fontSize: 24, marginBottom: 8, color: "var(--success)" }}>
                  Application Received Successfully!
                </h2>
                <div style={{ background: "var(--surface)", padding: 18, borderRadius: 10, margin: "20px 0", textAlign: "left", fontSize: 14 }}>
                  <div style={{ marginBottom: 6 }}><strong>Application Reference:</strong> {applicationSuccess.id}</div>
                  <div style={{ marginBottom: 6 }}><strong>Enterprise Name:</strong> {applicationSuccess.enterpriseName}</div>
                  <div style={{ marginBottom: 6 }}><strong>Applicant Name:</strong> {applicationSuccess.ownerName}</div>
                  <div style={{ marginBottom: 6 }}><strong>Status:</strong> <span style={{ color: "var(--accent-dark, #A16A00)", fontWeight: 700 }}>Under Review & Verification</span></div>
                  <div><strong>Registered Email:</strong> {applicationSuccess.email}</div>
                </div>
                <p style={{ color: "var(--text-mid)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                  Our team is cross-verifying your Aadhaar & PAN details with the official MSME registry. Your 16-digit Udyam Registration Certificate will be dispatched to your email within <strong>24 to 48 business hours</strong>.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <button
                    className="sb-btn sb-btn-outline"
                    onClick={() => {
                      setApplicationSuccess(null);
                      setForm({
                        ownerName: "",
                        aadhaarNumber: "",
                        panNumber: "",
                        mobileNumber: "",
                        email: "",
                        enterpriseName: "",
                        businessType: "Proprietorship",
                        category: "Services",
                        activityDescription: "",
                        bankAccount: "",
                        bankIfsc: "",
                        employeesCount: "1-5",
                        investmentRange: "< ₹10 Lakhs",
                        district: "Chennai",
                        state: "Tamil Nadu",
                        pinCode: ""
                      });
                    }}
                  >
                    Submit Another Application
                  </button>
                  <button
                    className="sb-btn sb-btn-primary"
                    onClick={() => setPage("dashboard")}
                  >
                    View in Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 36, alignItems: "start" }}>
                {/* Form Card */}
                <div className="card" style={{ padding: 36 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div>
                      <h2 style={{ fontSize: 22, color: "var(--text)", marginBottom: 4 }}>
                        Udyam Registration Application Form
                      </h2>
                      <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                        All small businesses, freelancers, traders, and shop owners are eligible.
                      </p>
                    </div>
                    <span style={{ background: "var(--accent-light)", color: "#7A5500", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 12 }}>
                      100% Online & Paperless
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {/* Step 1: Owner Info */}
                    <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--primary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>👤 1. Entrepreneur (Owner) Information</span>
                      </div>
                      <div className="grid-2">
                        <div>
                          <label className="input-label">Applicant Full Name (as on Aadhaar) *</label>
                          <input
                            className="input-field"
                            placeholder="e.g. S. Murugan"
                            value={form.ownerName}
                            onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="input-label">Aadhaar Card Number (12 Digits) *</label>
                          <input
                            className="input-field"
                            placeholder="XXXX XXXX XXXX"
                            maxLength={14}
                            value={form.aadhaarNumber}
                            onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid-2" style={{ marginTop: 12 }}>
                        <div>
                          <label className="input-label">PAN Number (10 Characters)</label>
                          <input
                            className="input-field"
                            placeholder="ABCDE1234F"
                            maxLength={10}
                            style={{ textTransform: "uppercase" }}
                            value={form.panNumber}
                            onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                          />
                        </div>
                        <div>
                          <label className="input-label">Mobile Number (Aadhaar Linked) *</label>
                          <input
                            className="input-field"
                            placeholder="+91 98421 XXXXX"
                            value={form.mobileNumber}
                            onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <label className="input-label">Email Address for Certificate Dispatch *</label>
                        <input
                          className="input-field"
                          type="email"
                          placeholder="owner@yourshop.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Step 2: Enterprise Details */}
                    <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--primary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>🏢 2. Enterprise / Shop / Firm Details</span>
                      </div>

                      <div className="grid-2">
                        <div>
                          <label className="input-label">Enterprise / Business Name *</label>
                          <input
                            className="input-field"
                            placeholder="e.g. Murugan Textiles / QuickTech Digital"
                            value={form.enterpriseName}
                            onChange={(e) => setForm({ ...form, enterpriseName: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="input-label">Type of Organization</label>
                          <select
                            className="input-field"
                            value={form.businessType}
                            onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                          >
                            <option value="Proprietorship">Proprietorship (Single Owner)</option>
                            <option value="Partnership">Partnership Firm</option>
                            <option value="Hindu Undivided Family (HUF)">Hindu Undivided Family (HUF)</option>
                            <option value="Private Limited Company">Private Limited Company</option>
                            <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                            <option value="Self-Employed / Freelancer">Self-Employed / Freelancer</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid-2" style={{ marginTop: 12 }}>
                        <div>
                          <label className="input-label">Major Activity *</label>
                          <select
                            className="input-field"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                          >
                            <option value="Services">Services (Digital, IT, Tailoring, Consulting)</option>
                            <option value="Manufacturing">Manufacturing (Handloom, Food, Production)</option>
                            <option value="Retail / Wholesale Trade">Retail / Wholesale Trade (Shops, Distribution)</option>
                          </select>
                        </div>
                        <div>
                          <label className="input-label">Total Employees</label>
                          <select
                            className="input-field"
                            value={form.employeesCount}
                            onChange={(e) => setForm({ ...form, employeesCount: e.target.value })}
                          >
                            <option value="1 (Self-Employed)">1 (Self-Employed)</option>
                            <option value="2-5">2 to 5 Persons</option>
                            <option value="6-10">6 to 10 Persons</option>
                            <option value="10+">10+ Persons</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <label className="input-label">Description of Main Business Activity</label>
                        <textarea
                          className="input-field"
                          rows={2}
                          placeholder="e.g. Retail sale of silk & cotton sarees, stitching services, small IT software..."
                          value={form.activityDescription}
                          onChange={(e) => setForm({ ...form, activityDescription: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Step 3: Location & Bank */}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--primary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>📍 3. Location & Bank Account</span>
                      </div>

                      <div className="grid-3">
                        <div>
                          <label className="input-label">District *</label>
                          <input
                            className="input-field"
                            placeholder="e.g. Madurai / Coimbatore"
                            value={form.district}
                            onChange={(e) => setForm({ ...form, district: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="input-label">State</label>
                          <input
                            className="input-field"
                            value={form.state}
                            onChange={(e) => setForm({ ...form, state: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="input-label">Pin Code</label>
                          <input
                            className="input-field"
                            placeholder="600001"
                            maxLength={6}
                            value={form.pinCode}
                            onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid-2" style={{ marginTop: 12 }}>
                        <div>
                          <label className="input-label">Bank Account Number</label>
                          <input
                            className="input-field"
                            placeholder="e.g. 104829104819"
                            value={form.bankAccount}
                            onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="input-label">Bank IFSC Code</label>
                          <input
                            className="input-field"
                            placeholder="e.g. SBIN0001234"
                            style={{ textTransform: "uppercase" }}
                            value={form.bankIfsc}
                            onChange={(e) => setForm({ ...form, bankIfsc: e.target.value.toUpperCase() })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ marginTop: 12 }}>
                      <button
                        type="submit"
                        className="sb-btn sb-btn-accent"
                        style={{ width: "100%", padding: "14px", fontSize: 16, fontWeight: 700 }}
                        disabled={submitting}
                      >
                        {submitting ? "Processing Application..." : "🚀 Submit Udyam Registration Application"}
                      </button>
                      <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>
                        🔒 Your data is securely encrypted. We assist in filing directly with the Ministry of MSME, Govt of India.
                      </p>
                    </div>
                  </form>
                </div>

                {/* Right Info Sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div className="card" style={{ padding: 24, background: "var(--accent-light)", borderColor: "var(--accent)" }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#7A5500", marginBottom: 10 }}>
                      📋 Documents Required
                    </div>
                    <ul style={{ paddingLeft: 18, fontSize: 13, color: "var(--text-mid)", lineHeight: 1.8 }}>
                      <li><strong>Aadhaar Card</strong> (linked with active mobile for OTP)</li>
                      <li><strong>PAN Card</strong> (Proprietor / Firm PAN)</li>
                      <li><strong>Bank Account Details</strong> (Account Number & IFSC)</li>
                      <li><strong>Business Address Proof</strong> or electricity bill</li>
                    </ul>
                  </div>

                  <div className="card" style={{ padding: 24 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 10 }}>
                      💡 Need Help Registering?
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-mid)", lineHeight: 1.6, marginBottom: 14 }}>
                      Our Udyam Helpdesk team can review your documents and complete the filing for you over WhatsApp or Call.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <a
                        href="https://wa.me/919442012345?text=Hi%20SkillBridge,%20I%20need%20help%20with%20Udyam%20Registration"
                        target="_blank"
                        rel="noreferrer"
                        className="sb-btn sb-btn-outline"
                        style={{ textDecoration: "none", textAlign: "center", fontSize: 13, borderColor: "var(--success)", color: "var(--success)" }}
                      >
                        💬 WhatsApp Udyam Desk
                      </a>
                      <button
                        className="sb-btn sb-btn-ghost"
                        style={{ fontSize: 13 }}
                        onClick={() => setPage("contact")}
                      >
                        Contact Support Team
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Benefits */}
        {activeTab === "benefits" && (
          <div>
            <div style={{ textAlign: "center", maxWidth: 650, margin: "0 auto 36px" }}>
              <h2 style={{ fontSize: 26, marginBottom: 8 }}>Why Register Under Udyam (MSME)?</h2>
              <p style={{ color: "var(--text-mid)", fontSize: 15 }}>
                Udyam Registration is the official identification for micro and small enterprises by the Government of India. Here is what your business receives:
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {[
                {
                  icon: "💳",
                  title: "Collateral-Free Bank Loans",
                  desc: "Eligible for credit under the CGTMSE scheme where banks provide loans to micro & small units without demanding third-party guarantee or collateral."
                },
                {
                  icon: "🛡️",
                  title: "Protection Against Delayed Payments",
                  desc: "Buyers must settle dues within 45 days. Delayed payments legally attract compound interest at 3 times the RBI bank rate under MSME Samadhaan."
                },
                {
                  icon: "🏛️",
                  title: "Government Tender Exemption",
                  desc: "Complete waiver of Earnest Money Deposit (EMD) and tender fee when bidding for central & state government public procurement contracts."
                },
                {
                  icon: "⚡",
                  title: "Electricity & Tax Subsidies",
                  desc: "Concessions on industrial power bills, special capital investment subsidies, and priority tax rebates by state MSME directorates."
                },
                {
                  icon: "🏷️",
                  title: "50% Trademark & Patent Subsidy",
                  desc: "Get 50% discount on government fee for trademark registration, patent protection, and bar-code subsidies."
                },
                {
                  icon: "🏦",
                  title: "Interest Rate Concession on Overdrafts",
                  desc: "Enjoy 1% to 1.5% interest rate rebate on working capital overdraft (OD) facilities from public sector banks."
                }
              ].map((b) => (
                <div key={b.title} className="card" style={{ padding: 26 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>{b.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-mid)", lineHeight: 1.6 }}>{b.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: 36 }}>
              <button className="sb-btn sb-btn-accent sb-btn-lg" onClick={() => setActiveTab("apply")}>
                Start Udyam Application Now →
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Verify */}
        {activeTab === "verify" && (
          <div style={{ maxWidth: 580, margin: "0 auto" }}>
            <div className="card" style={{ padding: 36, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <h2 style={{ fontSize: 22, marginBottom: 8 }}>Verify Udyam Registration Number (URN)</h2>
              <p style={{ color: "var(--text-mid)", fontSize: 14, marginBottom: 24 }}>
                Enter the 16-digit Udyam Registration Number to verify registration status and enterprise authenticity.
              </p>

              <form onSubmit={handleVerify} style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                <input
                  className="input-field"
                  placeholder="e.g. UDYAM-TN-02-0048192"
                  style={{ textTransform: "uppercase" }}
                  value={verifyUrn}
                  onChange={(e) => setVerifyUrn(e.target.value.toUpperCase())}
                  required
                />
                <button type="submit" className="sb-btn sb-btn-primary" disabled={verifying}>
                  {verifying ? "Checking..." : "Verify"}
                </button>
              </form>

              {verificationResult && (
                <div style={{ textAlign: "left" }}>
                  {verificationResult.valid ? (
                    <div style={{ background: "var(--success-light)", border: "1.5px solid var(--success)", padding: 20, borderRadius: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--success)", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>
                        <span>✅</span> Udyam Registration Certificate Verified
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.8, color: "var(--text)" }}>
                        <div><strong>URN:</strong> {verificationResult.urn}</div>
                        <div><strong>Enterprise:</strong> {verificationResult.enterpriseName}</div>
                        <div><strong>Owner / Authorized:</strong> {verificationResult.ownerName}</div>
                        <div><strong>Category:</strong> {verificationResult.category || "MSME"}</div>
                        <div><strong>State:</strong> {verificationResult.state || "Tamil Nadu"}</div>
                        <div><strong>Status:</strong> <span style={{ color: "var(--success)", fontWeight: 600 }}>Active & Registered</span></div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: "var(--danger-light)", border: "1.5px solid var(--danger)", padding: 20, borderRadius: 10, color: "var(--danger)" }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>❌ URN Not Found</div>
                      <p style={{ fontSize: 13, margin: 0 }}>
                        No registered enterprise found with this URN. If you just applied, verification takes 24 hours.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
