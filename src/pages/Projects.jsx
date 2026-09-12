import React, { useState } from 'react';
import { Icon } from '../components/common/Icon';
import { Badge, Tag, Modal } from '../components/common/UIComponents';
import { INITIAL_PROJECTS } from '../data/projects';
import { submitProposal } from '../firebase/firestoreService';

export const ProjectsPage = ({ setPage, user, showToast }) => {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Proposal modal state
  const [selectedProject, setSelectedProject] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Post project modal state
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Website",
    budget: "₹500–₹1,500",
    deadline: "5 days",
    description: "",
    skills: "HTML, CSS"
  });

  const categories = ["All", "Website", "Graphic Design", "Data Entry", "Content Writing", "Python"];

  const filtered = projects.filter((p) => {
    const matchS =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchC = category === "All" || p.category === category;
    return matchS && matchC;
  });

  const handleOpenProposal = (project) => {
    if (!user) {
      showToast("Please sign in or create an account to submit a proposal.");
      setPage("register");
      return;
    }
    setSelectedProject(project);
    setBidAmount(project.budgetNum ? String(project.budgetNum) : "500");
    setDeliveryDays("3");
    setCoverLetter(`Hi ${project.clientName},\n\nI have reviewed your project requirements for "${project.title}". As a dedicated SkillBridge learner, I can deliver clean, high-quality results on time.\n\nLooking forward to working together!`);
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    if (!bidAmount || !coverLetter) {
      showToast("Please fill in your bid amount and cover letter.");
      return;
    }

    setSubmitting(true);
    try {
      await submitProposal({
        projectId: selectedProject.id,
        projectTitle: selectedProject.title,
        userId: user.uid,
        userName: user.name,
        userEmail: user.email,
        bidAmount: Number(bidAmount),
        deliveryDays: Number(deliveryDays),
        coverLetter
      });

      // Increment proposal count on card
      setProjects((prev) =>
        prev.map((p) => (p.id === selectedProject.id ? { ...p, proposalsCount: (p.proposalsCount || 0) + 1 } : p))
      );

      setSelectedProject(null);
      showToast("🚀 Proposal successfully submitted to client!");
    } catch (err) {
      console.error(err);
      showToast("Error submitting proposal. Please try again.");
    }
    setSubmitting(false);
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) {
      showToast("Please provide a title and description.");
      return;
    }

    const created = {
      id: Date.now(),
      title: newProject.title,
      category: newProject.category,
      budget: newProject.budget,
      deadline: newProject.deadline,
      skills: newProject.skills.split(",").map((s) => s.trim()),
      level: "Beginner",
      status: "Open",
      clientName: user ? user.name : "Local Business Partner",
      clientLocation: "Tamil Nadu, India",
      description: newProject.description,
      proposalsCount: 0
    };

    setProjects([created, ...projects]);
    setPostModalOpen(false);
    setNewProject({ title: "", category: "Website", budget: "₹500–₹1,500", deadline: "5 days", description: "", skills: "HTML, CSS" });
    showToast("🎉 Your project has been posted for SkillBridge learners!");
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ background: "var(--primary-dark)", padding: "52px 0 40px" }}>
        <div className="container">
          <div className="section-label" style={{ color: "var(--accent)" }}>Freelance Marketplace</div>
          <h1 style={{ color: "#fff", fontSize: "2.2rem", marginBottom: 8 }}>Open Micro-Projects</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, maxWidth: 620 }}>
            Real projects posted by local businesses and mentors. Build client confidence, gain portfolio proof, and earn stipends.
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Post Project Banner */}
        <div
          style={{
            background: "var(--accent-light)",
            border: "1.5px solid var(--accent)",
            borderRadius: 14,
            padding: "20px 24px",
            marginBottom: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#7A5500", marginBottom: 4 }}>
              Are you a client or small business owner with a task?
            </div>
            <div style={{ fontSize: 13, color: "var(--text-mid)" }}>
              Post a small project here and receive genuine, enthusiastic proposals from motivated learners.
            </div>
          </div>
          <button className="sb-btn sb-btn-accent" onClick={() => setPostModalOpen(true)}>
            + Post a Project
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1 1 240px" }}>
            <input
              className="input-field"
              placeholder="Search projects by title, task, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ minWidth: 180 }}>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by Category"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: "auto", fontWeight: 500 }}>
            {filtered.length} projects open
          </span>
        </div>

        {/* Project Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {filtered.map((p) => (
            <div key={p.id} className="card" style={{ padding: 24, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: "var(--text-mid)", background: "var(--surface-alt)", padding: "3px 9px", borderRadius: 4, fontWeight: 500 }}>
                  {p.category}
                </span>
                <span style={{ fontSize: 12, color: "var(--success)", background: "var(--success-light)", padding: "3px 9px", borderRadius: 4, fontWeight: 600 }}>
                  {p.status}
                </span>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                {p.title}
              </h3>

              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span>🏢 {p.clientName}</span>
                <span>•</span>
                <span>📍 {p.clientLocation || "Tamil Nadu"}</span>
              </div>

              <p style={{ fontSize: 13, color: "var(--text-mid)", marginBottom: 16, lineHeight: 1.6, flex: 1 }}>
                {p.description}
              </p>

              <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--text-muted)", marginBottom: 14, flexWrap: "wrap" }}>
                <span>💰 <strong>{p.budget}</strong></span>
                <span>⏱ {p.deadline}</span>
                <Badge type="beginner">{p.level}</Badge>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 18 }}>
                {p.skills.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--surface-alt)" }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  📩 {p.proposalsCount || 0} proposals
                </span>
                <button
                  className="sb-btn sb-btn-primary sb-btn-sm"
                  onClick={() => handleOpenProposal(p)}
                >
                  Submit Proposal →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Proposal Modal */}
      <Modal
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        title={`Submit Proposal: ${selectedProject?.title}`}
      >
        <form onSubmit={handleProposalSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 13, color: "var(--text-mid)", background: "var(--surface-alt)", padding: "10px 14px", borderRadius: 8 }}>
            Client: <strong>{selectedProject?.clientName}</strong> | Typical Budget: {selectedProject?.budget}
          </div>

          <div className="grid-2">
            <div>
              <label className="input-label">Your Bid Amount (₹)</label>
              <input
                className="input-field"
                type="number"
                placeholder="e.g. 800"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="input-label">Estimated Days</label>
              <input
                className="input-field"
                type="number"
                placeholder="e.g. 3"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="input-label">Cover Letter / Pitch</label>
            <textarea
              className="input-field"
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain how your skills and coursework will help complete this task..."
              required
              style={{ resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
            <button
              type="button"
              className="sb-btn sb-btn-ghost"
              onClick={() => setSelectedProject(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sb-btn sb-btn-primary"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Send Proposal"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Post Project Modal */}
      <Modal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        title="Post a New Freelance Project"
      >
        <form onSubmit={handleCreateProject} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="input-label">Project Title</label>
            <input
              className="input-field"
              placeholder="e.g. Clean & Format Customer Survey Excel Sheet"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div>
              <label className="input-label">Category</label>
              <select
                className="input-field"
                value={newProject.category}
                onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
              >
                {categories.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Budget Range</label>
              <input
                className="input-field"
                placeholder="e.g. ₹500–₹1,000"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label className="input-label">Delivery Timeline</label>
              <input
                className="input-field"
                placeholder="e.g. 4 days"
                value={newProject.deadline}
                onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="input-label">Required Skills (comma-separated)</label>
              <input
                className="input-field"
                placeholder="e.g. Excel, Typing, Accuracy"
                value={newProject.skills}
                onChange={(e) => setNewProject({ ...newProject, skills: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="input-label">Project Scope & Description</label>
            <textarea
              className="input-field"
              rows={4}
              placeholder="Describe the deliverables, instructions, and expectations..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              required
              style={{ resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
            <button
              type="button"
              className="sb-btn sb-btn-ghost"
              onClick={() => setPostModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="sb-btn sb-btn-accent">
              Publish Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
