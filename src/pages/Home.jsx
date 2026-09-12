import React, { useState } from 'react';
import { Icon } from '../components/common/Icon';
import { Badge, ProgressBar, Avatar, Tag } from '../components/common/UIComponents';
import { COURSES } from '../data/courses';
import { INITIAL_PROJECTS } from '../data/projects';
import { STATS, SUCCESS_STORIES, MENTORS } from '../data/community';

export const CourseCard = ({ course, setPage, isEnrolled, progress = 0 }) => (
  <div
    className="card"
    style={{ padding: 22, cursor: "pointer", display: "flex", flexDirection: "column", height: "100%" }}
    onClick={() => setPage(`course-${course.id}`)}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
      <Badge type={course.level.toLowerCase()}>{course.level}</Badge>
      <Badge type="free">100% FREE</Badge>
    </div>

    <h3 style={{ fontSize: 17, fontFamily: "Inter, sans-serif", fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
      {course.title}
    </h3>

    <p style={{ fontSize: 13, color: "var(--text-mid)", marginBottom: 12, lineHeight: 1.6, flex: 1 }}>
      {course.description}
    </p>

    <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
      <span><Icon name="clock" size={12} /> {course.duration}</span>
      <span><Icon name="book" size={12} /> {course.lessons} lessons</span>
    </div>

    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
      {course.skills.map((s) => (
        <Tag key={s}>{s}</Tag>
      ))}
    </div>

    {isEnrolled ? (
      <div style={{ marginTop: "auto", paddingTop: 8, borderTop: "1px solid var(--surface-alt)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>Enrolled</span>
          <span>{progress}% complete</span>
        </div>
        <ProgressBar value={progress} />
      </div>
    ) : (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-muted)", marginTop: "auto", paddingTop: 8, borderTop: "1px solid var(--surface-alt)" }}>
        <span><Icon name="users" size={12} /> {course.instructor}</span>
        <span style={{ color: "var(--primary)", fontWeight: 600 }}>View Course →</span>
      </div>
    )}
  </div>
);

export const HomePage = ({ setPage, user, enrolledIds = [] }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Foundation", "Web", "Programming", "Design", "AI/ML", "Career"];

  const filtered = activeCategory === "All"
    ? COURSES.slice(0, 6)
    : COURSES.filter((c) => c.category === activeCategory).slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-bg" style={{ padding: "84px 0 76px", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 420, height: 420, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: "35%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 48 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(232,160,32,0.18)", border: "1px solid rgba(232,160,32,0.4)", borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em" }}>
                FREE FOR ALL LEARNERS
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", color: "#fff", lineHeight: 1.18, marginBottom: 20, maxWidth: 620 }}>
              Learn Skills.<br />Build Real Projects.<br />Shape Your Future.
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", maxWidth: 540, lineHeight: 1.8, marginBottom: 34 }}>
              Free practical education, mentorship, and entry-level freelance projects for motivated students across Tamil Nadu and beyond. Learn in English or தமிழ் — 100% free forever.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="sb-btn sb-btn-accent sb-btn-lg" onClick={() => setPage("courses")}>
                Start Learning Free
              </button>
              <button
                className="sb-btn sb-btn-lg"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)" }}
                onClick={() => setPage("projects")}
              >
                Explore Projects
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, minWidth: 290 }}>
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  borderRadius: 14,
                  padding: "20px 18px",
                  backdropFilter: "blur(10px)"
                }}
              >
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", fontFamily: "Inter, sans-serif" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "var(--accent)", marginTop: 2, fontWeight: 500 }}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7-Step Pathway */}
      <section className="section-sm" style={{ background: "var(--surface-alt)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="section-label">The Journey</div>
            <h2 className="section-title">How SkillBridge Works</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>A structured pipeline from initial interest to paid freelance opportunities.</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 8 }}>
            {[
              "Join Free",
              "Learn Lessons",
              "Practice Hands-on",
              "Get Certified",
              "Build Portfolio",
              "Bid on Projects",
              "Earn & Grow"
            ].map((step, i) => (
              <React.Fragment key={step}>
                <div style={{ textAlign: "center", padding: "10px 14px", background: "#fff", borderRadius: 10, border: "1px solid var(--border)", minWidth: 120 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: i === 0 ? "var(--accent)" : "var(--primary)",
                      color: i === 0 ? "#1A1D2E" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 13,
                      margin: "0 auto 6px"
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{step}</div>
                </div>
                {i < 6 && <div style={{ color: "var(--text-muted)", fontSize: 18 }}>→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div className="section-label">Why SkillBridge</div>
            <h2 className="section-title">Built for learners starting from scratch</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              We remove every barrier between a motivated learner and practical skills — tuition fees, language barriers, and lack of real project experience.
            </p>
          </div>
          <div className="grid-3">
            {[
              { icon: "heart", title: "Completely Free", desc: "All 17 core courses are free forever. No payment walls, no subscriptions. Learn comfortably at your pace." },
              { icon: "globe", title: "Tamil & English", desc: "Bilingual platform guidance and AI tutor in Tamil and English so language is never a stumbling block." },
              { icon: "cert", title: "Verifiable Certificates", desc: "Earn digital certificates with unique serial numbers upon completing lessons and final assessments." },
              { icon: "freelance", title: "Real Micro-Projects", desc: "Put skills to test on real gigs posted by clients. Build a portfolio and earn introductory stipends." },
              { icon: "ai", title: "SkillMate AI Companion", desc: "Your personal 24/7 AI learning buddy to explain complex concepts simply, review code, and roadmap steps." },
              { icon: "mentor", title: "Practitioner Mentorship", desc: "Get feedback and guidance from seasoned engineers, designers, and marketers who volunteer to mentor." },
            ].map((f) => (
              <div key={f.title} className="card" style={{ padding: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 20 }}>
                  <Icon name={f.icon} size={20} />
                </div>
                <h3 style={{ fontSize: 16, fontFamily: "Inter, sans-serif", fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section" style={{ background: "var(--surface-alt)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="section-label">Curated Curriculum</div>
              <h2 className="section-title" style={{ marginBottom: 4 }}>17 Free Practical Courses</h2>
              <p style={{ color: "var(--text-mid)", fontSize: 14 }}>From absolute computer literacy to modern web development and AI fundamentals.</p>
            </div>
            <button className="sb-btn sb-btn-outline" onClick={() => setPage("courses")}>
              View All 17 Courses →
            </button>
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 20,
                  border: `1.5px solid ${activeCategory === c ? "var(--primary)" : "var(--border)"}`,
                  background: activeCategory === c ? "var(--primary)" : "#fff",
                  color: activeCategory === c ? "#fff" : "var(--text-mid)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid-3">
            {filtered.map((course) => {
              const isEnrolled = enrolledIds.includes(course.id) || course.progress > 0;
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  setPage={setPage}
                  isEnrolled={isEnrolled}
                  progress={course.progress}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Banner */}
      <section className="section">
        <div className="container">
          <div
            style={{
              background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
              borderRadius: 20,
              padding: "54px 44px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "var(--accent)", marginBottom: 12 }}>
                OUR SOCIAL MISSION
              </div>
              <h2 style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", marginBottom: 16, lineHeight: 1.25 }}>
                Opportunity should never be limited by income or geography
              </h2>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.8 }}>
                SkillBridge exists to bridge the gap between academic theory and real-world employment. We empower ambitious youth with practical tech & creative capabilities, honest credentialing, and direct pathways into the digital economy.
              </p>
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              {[
                "100% Free course access for all registered learners",
                "SkillMate AI Assistant available in Tamil and English",
                "Guaranteed beginner-friendly micro-project marketplace",
                "Verifiable organization-level certificates on merit"
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 16px" }}>
                  <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: 16 }}>✓</div>
                  <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 14 }}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Freelance Projects Preview */}
      <section className="section" style={{ background: "var(--surface-alt)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="section-label">Micro-Gigs Marketplace</div>
              <h2 className="section-title" style={{ marginBottom: 4 }}>Featured Beginner Projects</h2>
              <p style={{ color: "var(--text-mid)", fontSize: 14 }}>Real clients posting small jobs. Practice your skills and earn your first stipend.</p>
            </div>
            <button className="sb-btn sb-btn-outline" onClick={() => setPage("projects")}>
              Browse All Projects →
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {INITIAL_PROJECTS.slice(0, 3).map((p) => (
              <div key={p.id} className="card" style={{ padding: 22, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--surface-alt)", padding: "3px 8px", borderRadius: 4 }}>
                    {p.category}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--success)", background: "var(--success-light)", padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>
                    {p.status}
                  </span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-mid)", marginBottom: 14, lineHeight: 1.6, flex: 1 }}>{p.description}</p>
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>
                  <span>💰 {p.budget}</span>
                  <span>⏱ {p.deadline}</span>
                  <Badge type="beginner">{p.level}</Badge>
                </div>
                <button
                  className="sb-btn sb-btn-primary sb-btn-sm"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setPage("projects")}
                >
                  View Details & Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="section-label">Community Support</div>
            <h2 className="section-title">Learn from Real Practitioners</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>Engineers, data analysts, and marketers giving back to the community.</p>
          </div>
          <div className="grid-3">
            {MENTORS.map((m) => (
              <div key={m.name} className="card" style={{ padding: 28, textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                  <Avatar initials={m.avatar} size={64} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{m.name}</h3>
                <div style={{ fontSize: 13, color: "var(--primary)", fontWeight: 500, marginBottom: 6 }}>{m.role}</div>
                <p style={{ fontSize: 13, color: "var(--text-mid)", marginBottom: 14, lineHeight: 1.6 }}>{m.bio}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
                  {m.expertise.map((e) => (
                    <Tag key={e}>{e}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="section-sm" style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="section-title" style={{ marginBottom: 10 }}>Ready to begin your journey?</h2>
          <p className="section-sub" style={{ margin: "0 auto 26px" }}>
            Join hundreds of motivated students. Access all courses and the SkillMate AI assistant for free today.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="sb-btn sb-btn-primary sb-btn-lg" onClick={() => setPage("register")}>
              Create Free Account
            </button>
            <button className="sb-btn sb-btn-ghost sb-btn-lg" onClick={() => setPage("ai")}>
              Chat with SkillMate AI
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
