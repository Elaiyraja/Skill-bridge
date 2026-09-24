import React, { useState, useEffect } from 'react';
import { Badge, Modal } from '../components/common/UIComponents';
import { INITIAL_PROJECTS } from '../data/projects';
import { isFirebaseConfigured, firebaseConfig } from '../firebase/config';
import {
  getProjectBuildRequests,
  updateProjectBuildRequest,
  getContactMessages,
  createAdminReplyMailLink,
  getAllUdyamRegistrations,
  updateUdyamRegistration,
  ADMIN_EMAIL
} from '../firebase/firestoreService';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [buildRequests, setBuildRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [udyamRegistrations, setUdyamRegistrations] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Reply Composer Modal State
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replyDecision, setReplyDecision] = useState("accept"); // "accept" | "discuss" | "decline"
  const [replyNotes, setReplyNotes] = useState("");
  const [copiedNotification, setCopiedNotification] = useState(false);

  // URN Assign Modal State
  const [urnModalOpen, setUrnModalOpen] = useState(false);
  const [selectedUdyam, setSelectedUdyam] = useState(null);
  const [inputUrn, setInputUrn] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [reqs, msgs, udyam] = await Promise.all([
          getProjectBuildRequests(),
          getContactMessages(),
          getAllUdyamRegistrations()
        ]);
        setBuildRequests(reqs || []);
        setContactMessages(msgs || []);
        setUdyamRegistrations(udyam || []);
      } catch (err) {
        console.error("Error loading admin records:", err);
      }
      setLoadingData(false);
    };
    fetchData();
  }, []);

  const pendingRequestsCount = buildRequests.filter(
    (r) => r.status === "Pending Review" || !r.status
  ).length;

  const pendingUdyamCount = udyamRegistrations.filter(
    (u) => !u.urn || u.status === "Submitted - Verification in Progress"
  ).length;

  const handleOpenReplyModal = (req) => {
    setSelectedRequest(req);
    setReplyDecision("accept");
    setReplyNotes("");
    setCopiedNotification(false);
    setReplyModalOpen(true);
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    const updated = await updateProjectBuildRequest(requestId, { status: newStatus });
    setBuildRequests(updated);
  };

  const handleOpenUrnModal = (item) => {
    setSelectedUdyam(item);
    // suggest an official URN format if empty
    const stateCode = (item.state || "").includes("Tamil") ? "TN" : "DL";
    const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
    setInputUrn(item.urn || `UDYAM-${stateCode}-02-${randomDigits}`);
    setUrnModalOpen(true);
  };

  const handleSaveUrnAndIssueCertificate = async () => {
    if (!selectedUdyam || !inputUrn) return;
    const updated = await updateUdyamRegistration(selectedUdyam.id, {
      urn: inputUrn.trim().toUpperCase(),
      status: "Udyam Certificate Issued",
      issuedAt: new Date().toISOString(),
      adminNotes: "Official 16-digit Udyam Registration Number generated and verified."
    });
    setUdyamRegistrations(updated);
    setUrnModalOpen(false);
  };

  const handleUpdateUdyamStatusDirect = async (id, newStatus) => {
    const updated = await updateUdyamRegistration(id, { status: newStatus });
    setUdyamRegistrations(updated);
  };

  const handleMarkRepliedAndOpenMail = async () => {
    if (!selectedRequest) return;
    const mailLink = createAdminReplyMailLink({
      clientName: selectedRequest.clientName,
      clientEmail: selectedRequest.clientEmail,
      title: selectedRequest.title,
      category: selectedRequest.category,
      budget: selectedRequest.budget,
      deadline: selectedRequest.deadline,
      decision: replyDecision,
      customNotes: replyNotes
    });

    // Update status to Replied or Accepted
    const newStatus = replyDecision === "accept" ? "Accepted" : replyDecision === "discuss" ? "In Discussion" : "Declined";
    const updated = await updateProjectBuildRequest(selectedRequest.id, {
      status: newStatus,
      adminNotes: replyNotes,
      repliedAt: new Date().toISOString()
    });
    setBuildRequests(updated);

    // Open user's email client
    window.location.href = mailLink;
    setReplyModalOpen(false);
  };

  const handleCopyEmailText = () => {
    if (!selectedRequest) return;
    const mailLink = createAdminReplyMailLink({
      clientName: selectedRequest.clientName,
      clientEmail: selectedRequest.clientEmail,
      title: selectedRequest.title,
      category: selectedRequest.category,
      budget: selectedRequest.budget,
      deadline: selectedRequest.deadline,
      decision: replyDecision,
      customNotes: replyNotes
    });
    // Extract decoded body text from mailto
    const bodyMatch = mailLink.match(/body=([^&]*)/);
    const bodyText = bodyMatch ? decodeURIComponent(bodyMatch[1]) : "";
    navigator.clipboard.writeText(bodyText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const adminMenu = [
    { key: "overview", label: "Platform Overview" },
    {
      key: "udyam_registrations",
      label: "Udyam Applications",
      badge: pendingUdyamCount > 0 ? pendingUdyamCount : null
    },
    {
      key: "build_requests",
      label: "Client Build Requests",
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null
    },
    { key: "inquiries", label: "Contact Inquiries", count: contactMessages.length },
    { key: "projects", label: "Open Micro-Projects" },
    { key: "firebase", label: "Firebase Status" },
  ];

  const stats = [
    { label: "Udyam Applications", value: udyamRegistrations.length },
    { label: "Pending Udyam Reviews", value: pendingUdyamCount },
    { label: "Client Build Requests", value: buildRequests.length },
    { label: "Platform State", value: isFirebaseConfigured ? "Connected" : "Local Mode" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      {/* Sidebar */}
      <div className="sidebar">
        <div style={{ padding: "16px 20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 16 }}>Admin Dashboard</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>SkillBridge Foundation</div>
        </div>
        {adminMenu.map((item) => (
          <div
            key={item.key}
            className={`sidebar-item${activeTab === item.key ? " active" : ""}`}
            onClick={() => setActiveTab(item.key)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 10
                }}
              >
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {activeTab === "overview" && (
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 20 }}>Platform Metrics & Health</h1>
            <div className="grid-4" style={{ marginBottom: 32 }}>
              {stats.map((s) => (
                <div key={s.label} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 22 }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)" }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: 18, marginBottom: 14 }}>Backend Connectivity</h2>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>{isFirebaseConfigured ? "🟢" : "ℹ️"}</span>
                <span style={{ fontWeight: 600, fontSize: 15 }}>
                  {isFirebaseConfigured ? "Firebase is Connected and Active" : "Operating in Local Simulation & Storage Mode"}
                </span>
              </div>
              <p style={{ color: "var(--text-mid)", fontSize: 14, lineHeight: 1.6 }}>
                {isFirebaseConfigured
                  ? `Active Firebase Project: ${firebaseConfig.projectId}. Authentication and Firestore sync are operational.`
                  : "All user registrations, course enrollments, proposals, and certificates are safely persisted in high-fidelity browser storage. To bind a live Firebase project, set your VITE_FIREBASE_* variables in the .env file."}
              </p>
            </div>
          </div>
        )}

        {activeTab === "udyam_registrations" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 20, marginBottom: 4 }}>Udyam (MSME) Applications ({udyamRegistrations.length})</h2>
                <p style={{ color: "var(--text-mid)", fontSize: 13, margin: 0 }}>
                  Review applicant Aadhaar/PAN details, approve filings, and generate official 16-digit Udyam Registration Numbers.
                </p>
              </div>
            </div>

            <div className="card" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface-alt)" }}>
                    {["Enterprise & Owner", "Contact & Location", "Aadhaar / PAN", "Category", "Status", "URN / Action"].map((h) => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {udyamRegistrations.map((item) => (
                    <tr key={item.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "14px 14px" }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{item.enterpriseName}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                          Proprietor: {item.ownerName}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--primary)", marginTop: 2 }}>
                          ID: {item.id} • {new Date(item.submittedAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td style={{ padding: "14px 14px", fontSize: 13 }}>
                        <div>{item.mobileNumber || "N/A"}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.email || "N/A"}</div>
                        <div style={{ fontSize: 11, color: "var(--text-mid)" }}>{item.city}, {item.state || "India"}</div>
                      </td>

                      <td style={{ padding: "14px 14px", fontSize: 12 }}>
                        <div>Aadhaar: <code style={{ fontWeight: 600 }}>{item.aadhaarNumber || "Provided"}</code></div>
                        <div style={{ marginTop: 2 }}>PAN: <code style={{ fontWeight: 600 }}>{item.panNumber || "Provided"}</code></div>
                      </td>

                      <td style={{ padding: "14px 14px", fontSize: 13 }}>
                        <div style={{ fontWeight: 600 }}>{item.category || "Micro"}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.businessType || "Proprietorship"}</div>
                      </td>

                      <td style={{ padding: "14px 14px" }}>
                        <select
                          className="input-field"
                          value={item.status}
                          onChange={(e) => handleUpdateUdyamStatusDirect(item.id, e.target.value)}
                          style={{ fontSize: 12, padding: "4px 8px", width: "auto" }}
                        >
                          <option value="Submitted - Verification in Progress">Under Verification</option>
                          <option value="Aadhaar Verified - Awaiting MSME Dispatch">Aadhaar Verified</option>
                          <option value="Udyam Certificate Issued">Certificate Issued</option>
                          <option value="On Hold - Documents Clarification">Needs Clarification</option>
                        </select>
                      </td>

                      <td style={{ padding: "14px 14px" }}>
                        {item.urn ? (
                          <div>
                            <code style={{ fontSize: 12, fontWeight: 700, color: "var(--success)", display: "block" }}>{item.urn}</code>
                            <button
                              className="sb-btn sb-btn-ghost sb-btn-sm"
                              onClick={() => handleOpenUrnModal(item)}
                              style={{ fontSize: 11, padding: "2px 6px", marginTop: 4 }}
                            >
                              Edit URN
                            </button>
                          </div>
                        ) : (
                          <button
                            className="sb-btn sb-btn-primary sb-btn-sm"
                            onClick={() => handleOpenUrnModal(item)}
                            style={{ fontSize: 12, padding: "6px 12px" }}
                          >
                            + Issue URN
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {udyamRegistrations.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                        No Udyam applications submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 20 }}>Open Micro-Projects ({INITIAL_PROJECTS.length})</h2>
            <div className="card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface-alt)" }}>
                    {["Title", "Client", "Category", "Budget", "Status"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INITIAL_PROJECTS.map((p) => (
                    <tr key={p.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600 }}>{p.title}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{p.clientName}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{p.category}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600 }}>{p.budget}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <Badge type="free">{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "build_requests" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 20, marginBottom: 4 }}>
                  Client Project Build Requests ({buildRequests.length})
                </h2>
                <p style={{ fontSize: 13, color: "var(--text-mid)" }}>
                  Direct inquiries from clients and businesses requesting SkillBridge to build their projects. Click "Reply via Email" to send an official response.
                </p>
              </div>
            </div>

            {loadingData ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading requests...</div>
            ) : buildRequests.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                <h3 style={{ fontSize: 16, marginBottom: 6 }}>No Project Requests Yet</h3>
                <p style={{ fontSize: 13, color: "var(--text-mid)" }}>
                  When clients submit project build requests on the Freelance page, they will appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {buildRequests.map((req) => {
                  const isPending = !req.status || req.status === "Pending Review";
                  const statusBadgeType =
                    req.status === "Accepted"
                      ? "success"
                      : req.status === "In Discussion"
                      ? "primary"
                      : req.status === "Declined"
                      ? "danger"
                      : "warning";

                  return (
                    <div
                      key={req.id}
                      className="card"
                      style={{
                        padding: 24,
                        borderLeft: isPending ? "4px solid var(--accent)" : "4px solid var(--primary)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 11, background: "var(--surface-alt)", padding: "2px 8px", borderRadius: 4, fontWeight: 600, color: "var(--text-muted)" }}>
                              {req.category}
                            </span>
                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                              {new Date(req.submittedAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
                            {req.title}
                          </h3>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              padding: "4px 10px",
                              borderRadius: 6,
                              background:
                                req.status === "Accepted"
                                  ? "var(--success-light)"
                                  : req.status === "In Discussion"
                                  ? "rgba(45,74,138,0.12)"
                                  : req.status === "Declined"
                                  ? "var(--danger-light)"
                                  : "var(--accent-light)",
                              color:
                                req.status === "Accepted"
                                  ? "var(--success)"
                                  : req.status === "In Discussion"
                                  ? "var(--primary)"
                                  : req.status === "Declined"
                                  ? "var(--danger)"
                                  : "#7A5500"
                            }}
                          >
                            {req.status || "Pending Review"}
                          </span>
                        </div>
                      </div>

                      {/* Client Meta Info Grid */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                          gap: 12,
                          background: "var(--surface)",
                          padding: "12px 16px",
                          borderRadius: 8,
                          marginBottom: 14,
                          fontSize: 13
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>CLIENT NAME</div>
                          <div style={{ fontWeight: 600, color: "var(--text)" }}>{req.clientName || "Client"}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>REPLY EMAIL</div>
                          <div style={{ fontWeight: 600, color: "var(--primary)" }}>
                            <a href={`mailto:${req.clientEmail}`} style={{ color: "var(--primary)", textDecoration: "underline" }}>
                              {req.clientEmail || "Not specified"}
                            </a>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>PHONE / WHATSAPP</div>
                          <div style={{ color: "var(--text)" }}>{req.clientPhone || "—"}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>BUDGET</div>
                          <div style={{ fontWeight: 700, color: "var(--accent-dark, #A16A00)" }}>{req.budget}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>TIMELINE</div>
                          <div style={{ color: "var(--text)" }}>{req.deadline}</div>
                        </div>
                      </div>

                      {/* Requirements Scope */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>
                          Project Scope & Requirements:
                        </div>
                        <div style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.6, background: "#fff", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)" }}>
                          {req.description}
                        </div>
                      </div>

                      {req.adminNotes && (
                        <div style={{ marginBottom: 14, fontSize: 12, color: "var(--text-muted)", background: "var(--accent-light)", padding: "8px 12px", borderRadius: 6 }}>
                          <strong>Admin Reply Notes:</strong> {req.adminNotes}
                          {req.repliedAt && ` (Replied on ${new Date(req.repliedAt).toLocaleDateString()})`}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Update Status:</span>
                          <select
                            className="input-field"
                            style={{ padding: "4px 8px", fontSize: 12, width: "auto" }}
                            value={req.status || "Pending Review"}
                            onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                          >
                            <option value="Pending Review">Pending Review</option>
                            <option value="Accepted">Accepted</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="Declined">Declined</option>
                          </select>
                        </div>

                        <div style={{ display: "flex", gap: 10 }}>
                          <button
                            className="sb-btn sb-btn-primary"
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, padding: "8px 16px" }}
                            onClick={() => handleOpenReplyModal(req)}
                          >
                            <span>✉️ Reply to Client via Email</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "inquiries" && (
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 4 }}>Contact Form Inquiries ({contactMessages.length})</h2>
            <p style={{ fontSize: 13, color: "var(--text-mid)", marginBottom: 20 }}>
              General messages and inquiries submitted via the Contact Us page.
            </p>

            {contactMessages.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📬</div>
                <p style={{ color: "var(--text-muted)" }}>No contact inquiries received yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {contactMessages.map((msg) => (
                  <div key={msg.id || msg.timestamp} className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{msg.name}</div>
                        <div style={{ fontSize: 12, color: "var(--primary)" }}>{msg.email}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 11, background: "var(--surface-alt)", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
                          {msg.subject}
                        </span>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                          {new Date(msg.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: 13, color: "var(--text-mid)", background: "var(--surface)", padding: "10px 14px", borderRadius: 8, margin: "10px 0", lineHeight: 1.6 }}>
                      {msg.message}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <a
                        href={`mailto:${msg.email}?subject=Re: SkillBridge Inquiry - ${encodeURIComponent(msg.subject)}&body=Dear ${encodeURIComponent(msg.name)},%0D%0A%0D%0AThank you for contacting SkillBridge.`}
                        className="sb-btn sb-btn-outline"
                        style={{ fontSize: 12, padding: "6px 14px", textDecoration: "none" }}
                      >
                        ✉️ Reply to Sender
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "firebase" && (
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>Firebase Integration Guidelines</h2>
            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 16, marginBottom: 10 }}>How to link your live Firebase Project</h3>
              <ol style={{ paddingLeft: 20, color: "var(--text-mid)", fontSize: 14, lineHeight: 1.8 }}>
                <li>Open the <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" style={{ color: "var(--primary)", textDecoration: "underline" }}>Firebase Console</a>.</li>
                <li>Create or select your project (e.g. <code>skillbridge-edu</code>).</li>
                <li>Enable <strong>Authentication</strong> (Email/Password provider).</li>
                <li>Enable <strong>Cloud Firestore</strong> database.</li>
                <li>Add a Web App and copy your config values into <code>.env</code>.</li>
                <li>Restart the dev server: <code>npm.cmd run dev</code>. The app will immediately recognize the keys and switch to 🟢 Firebase Live mode!</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Reply Email Composer Modal */}
      {selectedRequest && (
        <Modal
          isOpen={replyModalOpen}
          onClose={() => setReplyModalOpen(false)}
          title={`✉️ Reply to Client: ${selectedRequest.clientName}`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Header info */}
            <div style={{ background: "var(--surface-alt)", padding: "12px 16px", borderRadius: 8, fontSize: 13 }}>
              <div><strong>Recipient Email:</strong> {selectedRequest.clientEmail}</div>
              <div><strong>Project:</strong> {selectedRequest.title} ({selectedRequest.category})</div>
              <div><strong>Client Budget:</strong> {selectedRequest.budget} | <strong>Timeline:</strong> {selectedRequest.deadline}</div>
            </div>

            {/* Decision posture */}
            <div>
              <label className="input-label" style={{ fontWeight: 700, marginBottom: 8, display: "block" }}>
                Select Decision / Reply Posture:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setReplyDecision("accept")}
                  style={{
                    padding: "10px 8px",
                    borderRadius: 8,
                    border: replyDecision === "accept" ? "2px solid var(--success)" : "1px solid var(--border)",
                    background: replyDecision === "accept" ? "var(--success-light)" : "#fff",
                    color: replyDecision === "accept" ? "var(--success)" : "var(--text)",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  🟢 Accept & Build
                </button>
                <button
                  type="button"
                  onClick={() => setReplyDecision("discuss")}
                  style={{
                    padding: "10px 8px",
                    borderRadius: 8,
                    border: replyDecision === "discuss" ? "2px solid var(--primary)" : "1px solid var(--border)",
                    background: replyDecision === "discuss" ? "rgba(45,74,138,0.1)" : "#fff",
                    color: replyDecision === "discuss" ? "var(--primary)" : "var(--text)",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  🟡 Discuss / Clarify
                </button>
                <button
                  type="button"
                  onClick={() => setReplyDecision("decline")}
                  style={{
                    padding: "10px 8px",
                    borderRadius: 8,
                    border: replyDecision === "decline" ? "2px solid var(--danger)" : "1px solid var(--border)",
                    background: replyDecision === "decline" ? "var(--danger-light)" : "#fff",
                    color: replyDecision === "decline" ? "var(--danger)" : "var(--text)",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  🔴 Decline Politely
                </button>
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="input-label">Additional Message / Question for Client (optional):</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="e.g. We have assigned mentor Anand and two top web track learners. Let's schedule a call this Tuesday at 4 PM..."
                value={replyNotes}
                onChange={(e) => setReplyNotes(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>

            {/* Notification alert */}
            {copiedNotification && (
              <div style={{ background: "var(--success-light)", color: "var(--success)", padding: "8px 12px", borderRadius: 6, fontSize: 13, textAlign: "center", fontWeight: 600 }}>
                📋 Email message copied to your clipboard!
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
              <button
                type="button"
                className="sb-btn sb-btn-ghost"
                onClick={handleCopyEmailText}
                style={{ fontSize: 13 }}
              >
                📋 Copy Email Body
              </button>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="sb-btn sb-btn-ghost"
                  onClick={() => setReplyModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="sb-btn sb-btn-primary"
                  onClick={handleMarkRepliedAndOpenMail}
                  style={{ fontWeight: 700 }}
                >
                  🚀 Open Mail & Mark as {replyDecision === "accept" ? "Accepted" : replyDecision === "discuss" ? "In Discussion" : "Declined"}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* URN Assignment & Certificate Issuance Modal */}
      {urnModalOpen && selectedUdyam && (
        <Modal
          title={`Official Udyam Registration — ${selectedUdyam.enterpriseName}`}
          onClose={() => setUrnModalOpen(false)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 13, color: "var(--text-mid)", margin: 0 }}>
              Verify applicant details and issue the 16-digit Government of India Udyam Registration Number (URN).
            </p>

            <div style={{ background: "var(--surface)", padding: 14, borderRadius: 8, fontSize: 13 }}>
              <div><strong>Enterprise:</strong> {selectedUdyam.enterpriseName}</div>
              <div><strong>Owner / Signatory:</strong> {selectedUdyam.ownerName}</div>
              <div><strong>Aadhaar:</strong> {selectedUdyam.aadhaarNumber} • <strong>PAN:</strong> {selectedUdyam.panNumber}</div>
              <div><strong>Location:</strong> {selectedUdyam.city}, {selectedUdyam.state}</div>
            </div>

            <div>
              <label className="input-label">16-Digit Udyam Registration Number (URN):</label>
              <input
                type="text"
                className="input-field"
                value={inputUrn}
                onChange={(e) => setInputUrn(e.target.value)}
                placeholder="UDYAM-TN-02-0048192"
                style={{ fontWeight: 700, letterSpacing: "0.05em", fontFamily: "monospace", fontSize: 15 }}
              />
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                Format: <code>UDYAM-XX-00-0000000</code> (State code - District - 7 digits)
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
              <button
                type="button"
                className="sb-btn sb-btn-ghost"
                onClick={() => setUrnModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sb-btn sb-btn-primary"
                onClick={handleSaveUrnAndIssueCertificate}
                style={{ fontWeight: 700 }}
              >
                🏛️ Save & Issue Certificate
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
