import React, { useState, useEffect } from 'react';
import { Icon } from '../components/common/Icon';
import { Avatar, Tag } from '../components/common/UIComponents';
import { getUdyamRegistrations, getUserProjectBuildRequests, createClientToAdminMailLink } from '../firebase/firestoreService';

export const DashboardPage = ({ user, setPage, showToast, onSignOut }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [udyamList, setUdyamList] = useState([]);
  const [buildRequests, setBuildRequests] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data for this user
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const [udyamData, buildData] = await Promise.all([
          getUdyamRegistrations(user?.uid),
          getUserProjectBuildRequests(user?.uid, user?.email)
        ]);

        const allProps = JSON.parse(localStorage.getItem("skillbridge_proposals") || "[]");
        const userProps = allProps.filter((p) => p.userId === user?.uid || p.userEmail === user?.email);

        if (isMounted) {
          setUdyamList(udyamData || []);
          setBuildRequests(buildData || []);
          setProposals(userProps || []);
        }
      } catch (err) {
        console.warn("Error loading dashboard data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [user]);

  const verifiedUrns = udyamList.filter((u) => u.urn);

  const menuItems = [
    { key: "overview", label: "Overview", icon: "dashboard" },
    { key: "udyam", label: "My Udyam Registrations", icon: "cert", count: udyamList.length },
    { key: "small_projects", label: "My Small Projects", icon: "projects", count: buildRequests.length },
    { key: "proposals", label: "Freelance Pitches", icon: "check", count: proposals.length },
    { key: "profile", label: "Profile & Account", icon: "profile" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)", background: "var(--surface)" }}>
      {/* Sidebar Navigation */}
      <div className="sidebar" style={{ width: 260, borderRight: "1px solid var(--border)", background: "#fff" }}>
        <div style={{ padding: "20px 20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar initials={(user?.name || "U").substring(0, 2).toUpperCase()} size={44} />
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                {user?.name || "Business Owner"}
              </div>
              <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, textTransform: "capitalize" }}>
                {user?.role === "udyam_registration" ? "Udyam Applicant" : user?.role === "small_project" ? "Project Client" : user?.role || "MSME Member"}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 0" }}>
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`sidebar-item${activeTab === item.key ? " active" : ""}`}
              onClick={() => setActiveTab(item.key)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span style={{ fontSize: 11, background: "var(--surface-alt)", padding: "2px 7px", borderRadius: 10, fontWeight: 700 }}>
                  {item.count}
                </span>
              )}
            </div>
          ))}

          <div
            className="sidebar-item"
            onClick={() => setPage("ai")}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px" }}
          >
            <Icon name="ai" size={16} />
            <span>MSME AI Advisor</span>
          </div>

          <div className="divider" style={{ margin: "16px 0" }} />

          <div
            className="sidebar-item"
            style={{ color: "var(--danger)", display: "flex", alignItems: "center", gap: 10, padding: "10px 20px" }}
            onClick={onSignOut}
          >
            <Icon name="logout" size={16} />
            <span>Sign Out</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div style={{ flex: 1, padding: "32px 32px", overflowY: "auto" }}>
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 24, marginBottom: 6, color: "var(--text)" }}>
                Welcome back, {user?.name?.split(" ")[0] || "Partner"}! 👋
              </h1>
              <p style={{ color: "var(--text-mid)", fontSize: 14 }}>
                Track your official MSME Udyam registration status, government certificates, and small-level business projects.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid-4" style={{ marginBottom: 32 }}>
              {[
                { label: "Udyam Applications", value: udyamList.length, color: "var(--primary)", desc: "Submitted filings" },
                { label: "Issued URNs", value: verifiedUrns.length, color: "var(--success)", desc: "Govt-ready certificate" },
                { label: "Small Projects", value: buildRequests.length, color: "#8B5CF6", desc: "Build & design tasks" },
                { label: "Freelance Pitches", value: proposals.length, color: "var(--accent)", desc: "Deliveries in pipeline" },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: "20px 18px",
                    borderTop: `4px solid ${m.color}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 800, color: m.color, fontFamily: "Inter, sans-serif" }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{m.desc}</div>
                </div>
              ))}
            </div>

            {/* Action Banner */}
            <div style={{ background: "linear-gradient(135deg, #1A1D2E 0%, #2E335A 100%)", borderRadius: 16, padding: "26px 30px", color: "#fff", marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
              <div style={{ maxWidth: 540 }}>
                <span style={{ background: "var(--accent)", color: "#1A1D2E", padding: "4px 10px", borderRadius: 4, fontSize: 11, fontWeight: 800, textTransform: "uppercase" }}>
                  Official MSME Assistance
                </span>
                <h3 style={{ fontSize: 20, color: "#fff", margin: "12px 0 6px" }}>
                  Need your 16-Digit Udyam Registration Number?
                </h3>
                <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5, margin: 0 }}>
                  Apply with Aadhaar, PAN, and Bank details. Enjoy collateral-free loans, priority bank credit, electricity subsidies, and 50% trademark fee discount.
                </p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="sb-btn sb-btn-primary"
                  onClick={() => setPage("udyam")}
                  style={{ padding: "12px 22px", fontWeight: 700 }}
                >
                  + New Udyam Filing
                </button>
                <button
                  className="sb-btn sb-btn-outline"
                  onClick={() => setPage("projects")}
                  style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}
                >
                  Request Small Project
                </button>
              </div>
            </div>

            {/* Recent Udyam Applications */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18 }}>Recent Udyam Registrations</h2>
                <button className="sb-btn sb-btn-outline sb-btn-sm" onClick={() => setActiveTab("udyam")}>
                  View All ({udyamList.length})
                </button>
              </div>

              {udyamList.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {udyamList.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="card"
                      style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{item.enterpriseName}</span>
                          <span style={{ fontSize: 12, background: item.urn ? "var(--success-light)" : "var(--accent-light)", color: item.urn ? "var(--success)" : "var(--primary-dark)", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                            {item.status}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                          Owner: {item.ownerName} • {item.businessType || "Micro"} • {item.city || "Tamil Nadu"} • Filed on {new Date(item.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        {item.urn ? (
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>Udyam Registration No</div>
                            <code style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>{item.urn}</code>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: "var(--text-mid)" }}>Processing with MSME portal</span>
                        )}
                        <button className="sb-btn sb-btn-outline sb-btn-sm" onClick={() => setActiveTab("udyam")}>
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 32, textAlign: "center" }}>
                  <p style={{ color: "var(--text-mid)", marginBottom: 14 }}>You haven't filed any Udyam registration applications yet.</p>
                  <button className="sb-btn sb-btn-primary" onClick={() => setPage("udyam")}>
                    Start Free Udyam Filing
                  </button>
                </div>
              )}
            </div>

            {/* Small Projects Spotlight */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18 }}>My Small-Level Projects</h2>
                <button className="sb-btn sb-btn-outline sb-btn-sm" onClick={() => setPage("projects")}>
                  + Request New Project
                </button>
              </div>

              {buildRequests.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {buildRequests.slice(0, 3).map((req) => (
                    <div key={req.id} className="card" style={{ padding: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{req.title}</span>
                        <span style={{ fontSize: 12, background: "var(--primary-light)", color: "var(--primary)", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
                          {req.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>
                        Category: {req.category} • Budget: {req.budget} • Delivery: {req.deadline}
                      </div>
                      {req.adminNotes && (
                        <div style={{ fontSize: 12, color: "var(--text-mid)", background: "var(--surface-alt)", padding: "8px 12px", borderRadius: 6 }}>
                          💬 <strong>Team Note:</strong> {req.adminNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 32, textAlign: "center" }}>
                  <p style={{ color: "var(--text-mid)", marginBottom: 14 }}>Need a website, billing sheet, social media banner, or Google Maps setup?</p>
                  <button className="sb-btn sb-btn-primary" onClick={() => setPage("projects")}>
                    Request Small Project
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: UDYAM REGISTRATIONS */}
        {activeTab === "udyam" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 22, marginBottom: 4 }}>My Udyam (MSME) Registrations</h2>
                <p style={{ color: "var(--text-mid)", fontSize: 14, margin: 0 }}>
                  Government of India 16-digit URN filings, status updates, and certificates.
                </p>
              </div>
              <button className="sb-btn sb-btn-primary" onClick={() => setPage("udyam")}>
                + Submit New Udyam Application
              </button>
            </div>

            {udyamList.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {udyamList.map((item) => (
                  <div key={item.id} className="card" style={{ padding: 24, borderLeft: item.urn ? "5px solid var(--success)" : "5px solid var(--accent)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                          Application ID: {item.id}
                        </span>
                        <h3 style={{ fontSize: 20, margin: "4px 0 6px", color: "var(--text)" }}>{item.enterpriseName}</h3>
                        <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
                          Proprietor / Signatory: <strong>{item.ownerName}</strong>
                        </div>
                      </div>
                      <span style={{
                        fontSize: 13,
                        fontWeight: 700,
                        padding: "4px 12px",
                        borderRadius: 6,
                        background: item.urn ? "var(--success-light)" : "var(--accent-light)",
                        color: item.urn ? "var(--success)" : "var(--primary-dark)"
                      }}>
                        {item.status}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, background: "var(--surface)", padding: 16, borderRadius: 10, marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>Aadhaar Number</div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{item.aadhaarNumber || "Provided"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>PAN Card</div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{item.panNumber || "Provided"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>Business Category</div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{item.category || "Service / Retail"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>Location</div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{item.city}, {item.state || "India"}</div>
                      </div>
                    </div>

                    {item.urn && (
                      <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 12, color: "#166534", fontWeight: 700 }}>GOVT UDYAM REGISTRATION NUMBER (URN):</div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: "#15803D", letterSpacing: "0.05em" }}>{item.urn}</div>
                        </div>
                        <button
                          className="sb-btn sb-btn-outline sb-btn-sm"
                          onClick={() => {
                            setPage("verify");
                          }}
                        >
                          Verify Certificate Online →
                        </button>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        Submitted on {new Date(item.submittedAt).toLocaleDateString()} • {item.notes || "Official documentation filed."}
                      </span>
                      <a
                        href={createClientToAdminMailLink({
                          clientName: item.ownerName,
                          clientEmail: item.email || user?.email,
                          title: `Udyam Inquiry for ${item.enterpriseName}`,
                          category: "Udyam Registration",
                          description: `Checking status on Udyam Application ${item.id} for enterprise ${item.enterpriseName}.`
                        })}
                        className="sb-btn sb-btn-outline sb-btn-sm"
                        style={{ textDecoration: "none" }}
                      >
                        Contact MSME Officer
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "56px 24px", background: "var(--surface-alt)", borderRadius: 14 }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>🏛️</div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>No Udyam Filings Found</h3>
                <p style={{ color: "var(--text-mid)", maxWidth: 460, margin: "0 auto 20px", fontSize: 14 }}>
                  Register your enterprise with the Ministry of MSME to unlock subsidies, bank overdraft benefits, and government tender exemptions.
                </p>
                <button className="sb-btn sb-btn-primary" onClick={() => setPage("udyam")}>
                  Start Udyam Registration
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SMALL PROJECTS */}
        {activeTab === "small_projects" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 22, marginBottom: 4 }}>My Small-Level Projects</h2>
                <p style={{ color: "var(--text-mid)", fontSize: 14, margin: 0 }}>
                  We build small-level websites, automated billing sheets, Canva banners, and digital marketing setups.
                </p>
              </div>
              <button className="sb-btn sb-btn-primary" onClick={() => setPage("projects")}>
                + Request Another Small Project
              </button>
            </div>

            {buildRequests.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {buildRequests.map((req) => (
                  <div key={req.id} className="card" style={{ padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <h3 style={{ fontSize: 18, marginBottom: 4 }}>{req.title}</h3>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                          Category: <strong>{req.category}</strong> • Target Delivery: <strong>{req.deadline}</strong> • Budget: <strong>{req.budget}</strong>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 4, background: "var(--primary-light)", color: "var(--primary)" }}>
                        {req.status}
                      </span>
                    </div>

                    <div style={{ background: "var(--surface)", padding: 14, borderRadius: 8, fontSize: 13, color: "var(--text)", lineHeight: 1.6, marginBottom: 14 }}>
                      <strong>Requirements:</strong><br />
                      {req.description}
                    </div>

                    {req.adminNotes && (
                      <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, padding: 12, fontSize: 13, color: "#1E40AF", marginBottom: 14 }}>
                        💬 <strong>Admin Update:</strong> {req.adminNotes}
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        Submitted on {new Date(req.submittedAt).toLocaleDateString()}
                      </span>
                      <a
                        href={createClientToAdminMailLink({
                          clientName: req.clientName,
                          clientEmail: req.clientEmail,
                          title: req.title,
                          category: req.category,
                          budget: req.budget,
                          deadline: req.deadline,
                          description: req.description
                        })}
                        className="sb-btn sb-btn-outline sb-btn-sm"
                        style={{ textDecoration: "none" }}
                      >
                        Send Email Update to Admin
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "56px 24px", background: "var(--surface-alt)", borderRadius: 14 }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>💻</div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>No Small Projects Requested</h3>
                <p style={{ color: "var(--text-mid)", maxWidth: 460, margin: "0 auto 20px", fontSize: 14 }}>
                  Need a simple project done? Small-level websites, inventory spreadsheets, social flyers, and setup will be delivered quickly by our verified talent.
                </p>
                <button className="sb-btn sb-btn-primary" onClick={() => setPage("projects")}>
                  Request a Small Project
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FREELANCE PITCHES */}
        {activeTab === "proposals" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, marginBottom: 4 }}>My Freelance Pitches</h2>
                <p style={{ color: "var(--text-mid)", fontSize: 14, margin: 0 }}>
                  Proposals submitted to execute small-level projects for clients.
                </p>
              </div>
              <button className="sb-btn sb-btn-outline sb-btn-sm" onClick={() => setPage("projects")}>
                Browse Micro-Projects
              </button>
            </div>

            {proposals.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {proposals.map((p) => (
                  <div key={p.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{p.projectTitle || "Small Project"}</span>
                      <span style={{ fontSize: 12, color: "var(--accent)", background: "var(--accent-light)", padding: "3px 9px", borderRadius: 4, fontWeight: 600 }}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>
                      <span>Proposed Bid: <strong>₹{p.bidAmount}</strong></span>
                      <span>Timeline: <strong>{p.deliveryDays} days</strong></span>
                      <span>Submitted: {new Date(p.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-mid)", background: "var(--surface-alt)", padding: "10px 14px", borderRadius: 8, whiteSpace: "pre-wrap" }}>
                      {p.coverLetter}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "48px 24px", background: "var(--surface-alt)", borderRadius: 14 }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>💼</div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>No Proposals Submitted</h3>
                <p style={{ color: "var(--text-mid)", maxWidth: 440, margin: "0 auto 20px", fontSize: 14 }}>
                  Browse our open small business tasks and pitch to do the work.
                </p>
                <button className="sb-btn sb-btn-primary" onClick={() => setPage("projects")}>
                  Browse Open Projects
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === "profile" && (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Profile & Account Details</h2>
            <div className="grid-2">
              <div className="card" style={{ padding: 28 }}>
                <div style={{ display: "flex", gap: 18, marginBottom: 20, alignItems: "center" }}>
                  <Avatar initials={(user?.name || "U").substring(0, 2).toUpperCase()} size={68} />
                  <div>
                    <h3 style={{ fontSize: 18, marginBottom: 4 }}>{user?.name}</h3>
                    <div style={{ color: "var(--text-muted)", fontSize: 14 }}>{user?.email}</div>
                    <div style={{ color: "var(--primary)", fontSize: 13, fontWeight: 700, textTransform: "capitalize", marginTop: 4 }}>
                      Role: {user?.role || "Business Owner"}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                  User ID: <code>{user?.uid}</code>
                </div>
              </div>

              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: 16, marginBottom: 14 }}>Services Enrolled</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <Tag>Udyam Registration</Tag>
                  <Tag>Small Business Projects</Tag>
                  <Tag>MSME Subsidies</Tag>
                  <Tag>Govt Tender Assistance</Tag>
                  <Tag>Fast Turnaround</Tag>
                </div>
                <div style={{ marginTop: 24 }}>
                  <button className="sb-btn sb-btn-outline sb-btn-sm" onClick={() => setPage("contact")}>
                    Need Help? Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
