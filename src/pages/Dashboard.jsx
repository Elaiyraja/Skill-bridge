import React, { useState, useEffect } from 'react';
import { Icon } from '../components/common/Icon';
import { Avatar, ProgressBar, Tag } from '../components/common/UIComponents';
import { COURSES } from '../data/courses';
import { CourseCard } from './Home';

export const DashboardPage = ({ user, setPage, enrolledIds = [], onSignOut }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [proposals, setProposals] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Load user data from local storage
  useEffect(() => {
    try {
      const allProps = JSON.parse(localStorage.getItem("skillbridge_proposals") || "[]");
      const userProps = allProps.filter((p) => p.userId === user?.uid || p.userEmail === user?.email);
      setProposals(userProps);

      const allCerts = JSON.parse(localStorage.getItem("skillbridge_certificates") || "[]");
      const userCerts = allCerts.filter((c) => c.userId === user?.uid || c.studentName === user?.name);
      setCertificates(userCerts);
    } catch (e) {
      console.warn("Error reading dashboard data:", e);
    }
  }, [user]);

  const enrolledCourses = COURSES.filter((c) => enrolledIds.includes(c.id));
  const avgProgress = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progress || 25), 0) / enrolledCourses.length)
    : 0;

  const menuItems = [
    { key: "overview", label: "Overview", icon: "dashboard" },
    { key: "courses", label: "My Courses", icon: "book" },
    { key: "certificates", label: "My Certificates", icon: "cert" },
    { key: "proposals", label: "My Proposals", icon: "projects" },
    { key: "profile", label: "Profile", icon: "profile" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div style={{ padding: "16px 20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar initials={(user?.name || "U").substring(0, 2).toUpperCase()} size={42} />
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                {user?.name || "Community Learner"}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "capitalize" }}>
                {user?.role || "Student"}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 0" }}>
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`sidebar-item${activeTab === item.key ? " active" : ""}`}
              onClick={() => setActiveTab(item.key)}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </div>
          ))}

          <div
            className="sidebar-item"
            onClick={() => setPage("ai")}
          >
            <Icon name="ai" size={16} />
            <span>Ask SkillMate AI</span>
          </div>

          <div className="divider" style={{ margin: "16px 0" }} />

          <div
            className="sidebar-item"
            style={{ color: "var(--danger)" }}
            onClick={onSignOut}
          >
            <Icon name="logout" size={16} />
            <span>Sign Out</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div style={{ flex: 1, padding: "32px 28px", overflowY: "auto" }}>
        {activeTab === "overview" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 24, marginBottom: 4, color: "var(--text)" }}>
                Welcome back, {user?.name?.split(" ")[0] || "Learner"}! 👋
              </h1>
              <p style={{ color: "var(--text-mid)", fontSize: 14 }}>
                Track your course progress, certificates, and freelance proposals.
              </p>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid-4" style={{ marginBottom: 32 }}>
              {[
                { label: "Enrolled Courses", value: enrolledCourses.length, color: "var(--primary)" },
                { label: "Average Progress", value: `${avgProgress}%`, color: "var(--success)" },
                { label: "Certificates Earned", value: certificates.length, color: "var(--accent)" },
                { label: "Submitted Proposals", value: proposals.length, color: "#8B5CF6" },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: "20px 18px",
                    borderTop: `4px solid ${m.color}`,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 800, color: m.color, fontFamily: "Inter, sans-serif" }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Continue Learning */}
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>Continue Learning</h2>
            {enrolledCourses.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
                {enrolledCourses.map((c) => (
                  <div
                    key={c.id}
                    className="card"
                    style={{ padding: 18, display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}
                    onClick={() => setPage(`course-${c.id}`)}
                  >
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 10,
                        background: "var(--surface-alt)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        flexShrink: 0
                      }}
                    >
                      📚
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{c.title}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                        <span>{c.level} • {c.lessons} Lessons</span>
                        <span>{c.progress || 35}% completed</span>
                      </div>
                      <ProgressBar value={c.progress || 35} />
                    </div>
                    <button className="sb-btn sb-btn-primary sb-btn-sm" style={{ flexShrink: 0 }}>
                      Resume
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 32, textAlign: "center", marginBottom: 32 }}>
                <p style={{ color: "var(--text-mid)", marginBottom: 14 }}>You haven't enrolled in any courses yet.</p>
                <button className="sb-btn sb-btn-primary" onClick={() => setPage("courses")}>
                  Browse Free Courses
                </button>
              </div>
            )}

            {/* Suggested Next Courses */}
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>Explore Popular Tracks</h2>
            <div className="grid-3">
              {COURSES.filter((c) => !enrolledIds.includes(c.id)).slice(0, 3).map((c) => (
                <CourseCard
                  key={c.id}
                  course={c}
                  setPage={setPage}
                  isEnrolled={false}
                  progress={0}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab: My Courses */}
        {activeTab === "courses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20 }}>My Enrolled Courses ({enrolledCourses.length})</h2>
              <button className="sb-btn sb-btn-outline sb-btn-sm" onClick={() => setPage("courses")}>
                + Browse More Courses
              </button>
            </div>

            <div className="grid-3">
              {enrolledCourses.map((c) => (
                <CourseCard
                  key={c.id}
                  course={c}
                  setPage={setPage}
                  isEnrolled={true}
                  progress={c.progress || 30}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab: Certificates */}
        {activeTab === "certificates" && (
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>My Course Certificates</h2>
            <p style={{ color: "var(--text-mid)", fontSize: 14, marginBottom: 24 }}>
              Certificates awarded upon completing coursework and passing quizzes.
            </p>

            {certificates.length > 0 ? (
              <div className="grid-2">
                {certificates.map((cert) => (
                  <div key={cert.id} className="card" style={{ padding: 24, borderLeft: "4px solid var(--primary)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>{cert.id}</span>
                      <span style={{ fontSize: 12, color: "var(--success)", fontWeight: 600 }}>✓ {cert.status}</span>
                    </div>
                    <h3 style={{ fontSize: 16, marginBottom: 4 }}>{cert.courseTitle}</h3>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>
                      Issued to {cert.studentName} on {cert.issueDate}
                    </div>
                    <button
                      className="sb-btn sb-btn-outline sb-btn-sm"
                      onClick={() => setPage("verify")}
                    >
                      Verify Authenticity →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "48px 24px", background: "var(--surface-alt)", borderRadius: 14 }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>🏆</div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>No Certificates Issued Yet</h3>
                <p style={{ color: "var(--text-mid)", maxWidth: 440, margin: "0 auto 20px", fontSize: 14 }}>
                  Pick an enrolled course, complete the practice lessons, and pass the quiz in the course details to earn your certificate!
                </p>
                <button className="sb-btn sb-btn-primary" onClick={() => setActiveTab("courses")}>
                  View My Courses
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab: Proposals */}
        {activeTab === "proposals" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20 }}>My Submitted Project Proposals</h2>
              <button className="sb-btn sb-btn-outline sb-btn-sm" onClick={() => setPage("projects")}>
                Browse Open Projects
              </button>
            </div>

            {proposals.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {proposals.map((p) => (
                  <div key={p.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{p.projectTitle || "Freelance Project"}</span>
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
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>No Proposals Submitted Yet</h3>
                <p style={{ color: "var(--text-mid)", maxWidth: 440, margin: "0 auto 20px", fontSize: 14 }}>
                  Browse our open micro-projects, pitch your skills, and earn your first freelance gig stipend.
                </p>
                <button className="sb-btn sb-btn-primary" onClick={() => setPage("projects")}>
                  Browse Micro-Projects
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab: Profile */}
        {activeTab === "profile" && (
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 20 }}>My Learner Profile</h2>
            <div className="grid-2">
              <div className="card" style={{ padding: 28 }}>
                <div style={{ display: "flex", gap: 18, marginBottom: 20, alignItems: "center" }}>
                  <Avatar initials={(user?.name || "U").substring(0, 2).toUpperCase()} size={68} />
                  <div>
                    <h3 style={{ fontSize: 18, marginBottom: 4 }}>{user?.name}</h3>
                    <div style={{ color: "var(--text-muted)", fontSize: 14 }}>{user?.email}</div>
                    <div style={{ color: "var(--primary)", fontSize: 13, fontWeight: 600, textTransform: "capitalize", marginTop: 4 }}>
                      Role: {user?.role || "Student"}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                  Account ID: <code>{user?.uid}</code>
                </div>
              </div>

              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: 16, marginBottom: 14 }}>Acquired Skills & Learning Topics</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {enrolledCourses.flatMap((c) => c.skills).map((s, idx) => (
                    <Tag key={idx}>{s}</Tag>
                  ))}
                  {enrolledCourses.length === 0 && (
                    <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Enroll in courses to start collecting skills.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
