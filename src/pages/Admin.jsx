import React, { useState } from 'react';
import { Badge } from '../components/common/UIComponents';
import { COURSES } from '../data/courses';
import { INITIAL_PROJECTS } from '../data/projects';
import { isFirebaseConfigured, firebaseConfig } from '../firebase/config';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const adminMenu = [
    { key: "overview", label: "Platform Overview" },
    { key: "courses", label: "Courses Catalog" },
    { key: "projects", label: "Open Projects" },
    { key: "firebase", label: "Firebase Status" },
  ];

  const stats = [
    { label: "Community Courses", value: COURSES.length },
    { label: "Open Micro-Projects", value: INITIAL_PROJECTS.length },
    { label: "Total Lessons", value: COURSES.reduce((sum, c) => sum + c.lessons, 0) },
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
          >
            {item.label}
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

        {activeTab === "courses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20 }}>Course Catalog Management ({COURSES.length})</h2>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface-alt)" }}>
                    {["#", "Course Title", "Category", "Level", "Lessons", "Duration"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COURSES.map((c) => (
                    <tr key={c.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-muted)" }}>{c.id}</td>
                      <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600 }}>{c.title}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{c.category}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <Badge type={c.level.toLowerCase()}>{c.level}</Badge>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{c.lessons}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{c.duration}</td>
                    </tr>
                  ))}
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
    </div>
  );
};
