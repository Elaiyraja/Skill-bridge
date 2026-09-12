import React, { useState } from 'react';
import { CourseCard } from './Home';
import { COURSES } from '../data/courses';

export const CoursesPage = ({ setPage, enrolledIds = [] }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  const categories = ["All", "Foundation", "Web", "Programming", "Data", "Design", "AI/ML", "Marketing", "Career", "Soft Skills"];
  const levels = ["All", "Beginner", "Intermediate"];

  const filtered = COURSES.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || c.category === category;
    const matchLevel = level === "All" || c.level === level;
    return matchSearch && matchCat && matchLevel;
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ background: "var(--primary-dark)", padding: "52px 0 40px" }}>
        <div className="container">
          <div className="section-label" style={{ color: "var(--accent)" }}>Course Catalog</div>
          <h1 style={{ color: "#fff", fontSize: "2.2rem", marginBottom: 8 }}>17 Free Practical Courses</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, maxWidth: 640 }}>
            Structured from fundamentals to job-ready applications. Learn at your own pace with hands-on practice, quizzes, and certificates.
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Search and Filters Bar */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            border: "1px solid var(--border)",
            marginBottom: 32,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          <div style={{ flex: "1 1 240px" }}>
            <input
              className="input-field"
              placeholder="Search by course name, skill (e.g. Python, Excel, HTML)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ minWidth: 160 }}>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by Category"
            >
              {categories.map((c) => (
                <option key={c} value={c}>Category: {c}</option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: 150 }}>
            <select
              className="input-field"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              aria-label="Filter by Level"
            >
              {levels.map((l) => (
                <option key={l} value={l}>Level: {l}</option>
              ))}
            </select>
          </div>
          <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: "auto", fontWeight: 500 }}>
            Showing {filtered.length} of {COURSES.length} courses
          </span>
        </div>

        {/* Courses Grid */}
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

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 20px", background: "#fff", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontSize: 18, marginBottom: 6 }}>No matching courses found</h3>
            <p style={{ color: "var(--text-mid)", fontSize: 14, marginBottom: 18 }}>
              Try adjusting your search query or selecting "All" categories.
            </p>
            <button
              className="sb-btn sb-btn-outline"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setLevel("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
