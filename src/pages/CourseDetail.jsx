import React, { useState } from 'react';
import { Icon } from '../components/common/Icon';
import { Badge, ProgressBar } from '../components/common/UIComponents';
import { COURSES } from '../data/courses';
import { issueCertificate } from '../firebase/firestoreService';

export const CourseDetailPage = ({ courseId, setPage, user, enrolledIds = [], onEnroll, showToast }) => {
  const course = COURSES.find((c) => c.id === parseInt(courseId)) || COURSES[0];
  const [activeTab, setActiveTab] = useState("overview");

  const isEnrolled = enrolledIds.includes(course.id);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [generatedCert, setGeneratedCert] = useState(null);

  const sampleQuestions = [
    {
      q: `What is the primary purpose of learning ${course.title}?`,
      options: [
        "To build practical skills for modern digital opportunities",
        "To memorize theoretical definitions without practicing",
        "To avoid working on real projects",
        "None of the above"
      ],
      correct: 0
    },
    {
      q: "How does SkillBridge recommend you apply your learning?",
      options: [
        "By only watching tutorial videos",
        "By practicing exercises and bidding on real micro-projects",
        "By waiting for somebody else to do the work",
        "By skipping hands-on assessments"
      ],
      correct: 1
    },
    {
      q: "What type of certificate does SkillBridge issue upon passing?",
      options: [
        "Government of India accreditation certificate",
        "SkillBridge organization course-completion certificate",
        "A formal university degree",
        "No certificate is issued"
      ],
      correct: 1
    }
  ];

  const handleEnrollClick = () => {
    if (!user) {
      showToast("Please sign in or create an account to enroll.");
      setPage("register");
      return;
    }
    onEnroll(course.id);
    showToast(`🎉 Successfully enrolled in ${course.title}!`);
  };

  const handleQuizSubmit = async () => {
    let score = 0;
    sampleQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 2) {
      const cert = await issueCertificate({
        userId: user?.uid || "usr_guest",
        userName: user?.name || "Demo Learner",
        courseId: course.id,
        courseTitle: course.title
      });
      setGeneratedCert(cert);
      showToast("🏆 Congratulations! You passed the quiz and earned your certificate!");
    } else {
      showToast("Review the concepts and try again to score at least 2/3!");
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ background: "var(--primary-dark)", padding: "48px 0" }}>
        <div className="container">
          <div
            style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
            onClick={() => setPage("courses")}
          >
            ← Back to All Courses
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <Badge type={course.level.toLowerCase()}>{course.level}</Badge>
            <Badge type="free">100% FREE</Badge>
            <span style={{ fontSize: 12, color: "var(--accent-light)", background: "rgba(232,160,32,0.18)", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>
              {course.category}
            </span>
          </div>

          <h1 style={{ color: "#fff", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", marginBottom: 12 }}>
            {course.title}
          </h1>

          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, marginBottom: 20, maxWidth: 620, lineHeight: 1.7 }}>
            {course.description}
          </p>

          <div style={{ display: "flex", gap: 20, fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 24, flexWrap: "wrap" }}>
            <span><Icon name="book" size={13} /> {course.lessons} structured lessons</span>
            <span><Icon name="clock" size={13} /> {course.duration}</span>
            <span><Icon name="users" size={13} /> {course.instructor}</span>
            <span><Icon name="cert" size={13} /> Verifiable Completion Certificate</span>
          </div>

          {isEnrolled ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                className="sb-btn sb-btn-accent sb-btn-lg"
                onClick={() => setActiveTab("curriculum")}
              >
                Continue Course Lessons
              </button>
              <span style={{ color: "var(--accent-light)", fontSize: 13, fontWeight: 600 }}>
                ✓ Enrolled in this Course
              </span>
            </div>
          ) : (
            <button className="sb-btn sb-btn-accent sb-btn-lg" onClick={handleEnrollClick}>
              Enroll Free Now
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container section-sm">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 36 }}>
          {/* Main Tabs Area */}
          <div>
            {/* Tabs Header */}
            <div style={{ display: "flex", gap: 4, borderBottom: "2px solid var(--border)", marginBottom: 28, overflowX: "auto" }}>
              {["overview", "curriculum", "quiz", "certificate"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "10px 22px",
                    border: "none",
                    background: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    color: activeTab === tab ? "var(--primary)" : "var(--text-mid)",
                    borderBottom: activeTab === tab ? "2px solid var(--primary)" : "2px solid transparent",
                    marginBottom: -2,
                    cursor: "pointer",
                    textTransform: "capitalize"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div>
                <h2 style={{ fontSize: 18, marginBottom: 16 }}>What you will learn</h2>
                <div className="grid-2" style={{ marginBottom: 32 }}>
                  {course.skills
                    .concat([
                      "Hands-on real-world mini projects",
                      "Industry-relevant best practices",
                      "Final quiz assessment",
                      "Verifiable completion certificate"
                    ])
                    .map((item) => (
                      <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: "var(--success)", fontWeight: 700, marginTop: 1 }}>✓</span>
                        <span style={{ fontSize: 14, color: "var(--text-mid)" }}>{item}</span>
                      </div>
                    ))}
                </div>

                <h2 style={{ fontSize: 18, marginBottom: 12 }}>Prerequisites & Requirements</h2>
                <ul style={{ listStyle: "disc", paddingLeft: 22, color: "var(--text-mid)", fontSize: 14, lineHeight: 2, marginBottom: 28 }}>
                  <li>A smartphone, tablet, or desktop computer with internet connectivity.</li>
                  <li>No prior programming or specialized background required for beginner level courses.</li>
                  <li>Dedication to complete lesson walkthroughs and practical mini-projects.</li>
                </ul>

                <h2 style={{ fontSize: 18, marginBottom: 12 }}>Instructors & Community Mentors</h2>
                <p style={{ color: "var(--text-mid)", fontSize: 14, lineHeight: 1.7 }}>
                  Curated and monitored by <strong>{course.instructor}</strong> with active peer review and community questions answered in Tamil and English via <strong>SkillMate AI</strong>.
                </p>
              </div>
            )}

            {/* Tab: Curriculum */}
            {activeTab === "curriculum" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <h2 style={{ fontSize: 18 }}>Course Curriculum ({course.lessons} lessons)</h2>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Total duration: {course.duration}</span>
                </div>

                {course.curriculum && course.curriculum.length > 0 ? (
                  course.curriculum.map((w, idx) => (
                    <div key={idx} className="card" style={{ padding: 18, marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 4, letterSpacing: "0.04em" }}>
                            {w.week}
                          </div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>{w.topic}</div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: 12, color: "var(--text-muted)" }}>
                          <div>{w.lessons} lessons</div>
                          <div>{w.duration}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "var(--text-mid)" }}>Curriculum lessons are actively being loaded.</p>
                )}
              </div>
            )}

            {/* Tab: Quiz */}
            {activeTab === "quiz" && (
              <div>
                <h2 style={{ fontSize: 18, marginBottom: 8 }}>Practice Quiz & Knowledge Check</h2>
                <p style={{ color: "var(--text-mid)", fontSize: 14, marginBottom: 24 }}>
                  Answer these questions to test your comprehension. Score at least 2 out of 3 to qualify for your course certificate.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 }}>
                  {sampleQuestions.map((q, qIndex) => (
                    <div key={qIndex} className="card" style={{ padding: 20 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
                        {qIndex + 1}. {q.q}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {q.options.map((opt, oIndex) => {
                          const isSelected = selectedAnswers[qIndex] === oIndex;
                          const isCorrect = q.correct === oIndex;
                          let bg = "#fff";
                          if (quizSubmitted) {
                            if (isCorrect) bg = "var(--success-light)";
                            else if (isSelected) bg = "var(--danger-light)";
                          } else if (isSelected) {
                            bg = "var(--surface-alt)";
                          }

                          return (
                            <label
                              key={oIndex}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: `1px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                                background: bg,
                                cursor: quizSubmitted ? "default" : "pointer",
                                fontSize: 14
                              }}
                            >
                              <input
                                type="radio"
                                name={`q_${qIndex}`}
                                checked={isSelected}
                                onChange={() => {
                                  if (!quizSubmitted) {
                                    setSelectedAnswers({ ...selectedAnswers, [qIndex]: oIndex });
                                  }
                                }}
                                disabled={quizSubmitted}
                              />
                              {opt}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {!quizSubmitted ? (
                  <button
                    className="sb-btn sb-btn-primary"
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length < sampleQuestions.length}
                    style={{
                      opacity: Object.keys(selectedAnswers).length < sampleQuestions.length ? 0.6 : 1
                    }}
                  >
                    Submit Assessment
                  </button>
                ) : (
                  <div style={{ background: quizScore >= 2 ? "var(--success-light)" : "var(--danger-light)", padding: 20, borderRadius: 12 }}>
                    <h3 style={{ color: quizScore >= 2 ? "var(--success)" : "var(--danger)", marginBottom: 6 }}>
                      {quizScore >= 2 ? "🎉 Assessment Passed!" : "⚠️ Needs Review"}
                    </h3>
                    <p style={{ fontSize: 14, color: "var(--text-mid)", marginBottom: 14 }}>
                      You scored {quizScore} out of {sampleQuestions.length} correct.
                    </p>
                    {quizScore >= 2 ? (
                      <button className="sb-btn sb-btn-primary sb-btn-sm" onClick={() => setActiveTab("certificate")}>
                        View Your Certificate →
                      </button>
                    ) : (
                      <button
                        className="sb-btn sb-btn-outline sb-btn-sm"
                        onClick={() => {
                          setQuizSubmitted(false);
                          setSelectedAnswers({});
                        }}
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Certificate */}
            {activeTab === "certificate" && (
              <div>
                <h2 style={{ fontSize: 18, marginBottom: 16 }}>Course Certificate</h2>

                {/* Certificate Visual Preview */}
                <div
                  style={{
                    border: "4px double var(--primary)",
                    borderRadius: 16,
                    padding: "44px 32px",
                    textAlign: "center",
                    background: "linear-gradient(135deg, #FAFBFD 0%, #EEF2FA 100%)",
                    marginBottom: 24,
                    boxShadow: "0 6px 20px rgba(45, 74, 138, 0.08)",
                    position: "relative"
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "var(--accent)", marginBottom: 8 }}>
                    SKILLBRIDGE INITIATIVE
                  </div>
                  <div style={{ fontFamily: "Lora, serif", fontSize: 26, color: "var(--primary-dark)", marginBottom: 6 }}>
                    Certificate of Completion
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 18 }}>
                    This acknowledges that
                  </div>
                  <div
                    style={{
                      fontFamily: "Lora, serif",
                      fontStyle: "italic",
                      fontSize: 28,
                      color: "var(--primary)",
                      marginBottom: 16,
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: 14,
                      maxWidth: 480,
                      margin: "0 auto 16px"
                    }}
                  >
                    {user?.name || (generatedCert ? generatedCert.studentName : "Your Name Here")}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-mid)", marginBottom: 4 }}>
                    has successfully completed the practical curriculum & assessment for
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 28 }}>
                    {course.title}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", borderTop: "1px solid var(--border)", paddingTop: 14, flexWrap: "wrap", gap: 8 }}>
                    <span>Date: {generatedCert ? generatedCert.issueDate : "2025-06-15"}</span>
                    <span>Certificate ID: <strong>{generatedCert ? generatedCert.id : "SB-2025-DEMO"}</strong></span>
                    <span
                      style={{ color: "var(--primary)", cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => setPage("verify")}
                    >
                      Verify at /verify
                    </span>
                  </div>
                </div>

                {/* Disclaimer Alert */}
                <div style={{ background: "var(--accent-light)", borderRadius: 10, padding: 18, fontSize: 13, color: "#7A5500", lineHeight: 1.6 }}>
                  <strong>Honest Credentialing Statement:</strong> This certificate is issued directly by the SkillBridge Organization upon successful course completion and quiz assessment. It is an independent community credential demonstrating applied skill, not an accredited degree or Government of India / MSME certification.
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div style={{ position: "sticky", top: 84, alignSelf: "start" }}>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--success)", marginBottom: 4 }}>
                100% FREE
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
                No credit card, no hidden fees
              </div>

              {isEnrolled ? (
                <button
                  className="sb-btn sb-btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginBottom: 12 }}
                  onClick={() => setActiveTab("curriculum")}
                >
                  Continue Lessons
                </button>
              ) : (
                <button
                  className="sb-btn sb-btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginBottom: 12 }}
                  onClick={handleEnrollClick}
                >
                  Enroll Free
                </button>
              )}

              <button
                className="sb-btn sb-btn-ghost"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast("📋 Course link copied to clipboard!");
                }}
              >
                Share Course Link
              </button>

              <div className="divider" />

              {[
                ["Duration", course.duration],
                ["Lessons", `${course.lessons} lessons`],
                ["Skill Level", course.level],
                ["Certificate", "Yes, upon passing quiz"],
                ["Language", "English & தமிழ் (AI)"],
                ["Access", "Lifetime Free Access"]
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
                  <span style={{ color: "var(--text-muted)" }}>{k}</span>
                  <span style={{ fontWeight: 500, color: "var(--text)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
