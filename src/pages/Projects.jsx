import React, { useState } from 'react';
import { Icon } from '../components/common/Icon';
import { Badge, Tag, Modal } from '../components/common/UIComponents';
import { INITIAL_PROJECTS } from '../data/projects';
import {
  submitProposal,
  saveProjectBuildRequest,
  createClientToAdminMailLink,
  ADMIN_EMAIL
} from '../firebase/firestoreService';

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

  // Post project modal state (for micro-tasks)
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Website",
    budget: "₹500–₹1,500",
    deadline: "5 days",
    description: "",
    skills: "HTML, CSS"
  });

  // Client "Ask to build a project" modal state
  const [buildRequestModalOpen, setBuildRequestModalOpen] = useState(false);
  const [buildSubmitting, setBuildSubmitting] = useState(false);
  const [buildConfirmation, setBuildConfirmation] = useState(null);
  const [buildForm, setBuildForm] = useState({
    clientName: user?.name || "",
    clientEmail: user?.email || "",
    clientPhone: "",
    title: "",
    category: "Website",
    budget: "₹3,000–₹8,000",
    deadline: "10 days",
    description: "",
  });

  const categories = ["All", "Website", "Graphic Design", "Data Entry", "Content Writing", "Python", "Mobile App", "Custom Software"];

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

  const handleBuildRequestSubmit = async (e) => {
    e.preventDefault();
    if (!buildForm.title || !buildForm.clientEmail || !buildForm.description) {
      showToast("Please provide your project title, email, and description.");
      return;
    }

    setBuildSubmitting(true);
    try {
      const record = await saveProjectBuildRequest({
        clientName: buildForm.clientName || user?.name || "Prospective Client",
        clientEmail: buildForm.clientEmail || user?.email || "",
        clientPhone: buildForm.clientPhone || "",
        title: buildForm.title,
        category: buildForm.category,
        budget: buildForm.budget,
        deadline: buildForm.deadline,
        description: buildForm.description,
        userId: user?.uid || "guest_client"
      });

      setBuildConfirmation(record);
      setBuildRequestModalOpen(false);
      showToast("🚀 Project request submitted! Check email options below.");
    } catch (err) {
      console.error(err);
      showToast("Error saving project request. Please try again.");
    }
    setBuildSubmitting(false);
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
        {/* Post / Request Project Banner */}
        <div
          style={{
            background: "var(--accent-light)",
            border: "1.5px solid var(--accent)",
            borderRadius: 14,
            padding: "24px 28px",
            marginBottom: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 18
          }}
        >
          <div style={{ maxWidth: 580 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(232,160,32,0.25)", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#7A5500", marginBottom: 8 }}>
              <span>💼 FOR CLIENTS & BUSINESSES</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#7A5500", marginBottom: 4 }}>
              Need a Website, App, or Custom Project Built?
            </div>
            <div style={{ fontSize: 13, color: "var(--text-mid)", lineHeight: 1.6 }}>
              Have our senior mentors and supervised student developers build your project, or post a micro-task for learners. Our admin team will directly email you back with feasible milestones!
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="sb-btn sb-btn-accent"
              style={{ fontWeight: 700 }}
              onClick={() => setBuildRequestModalOpen(true)}
            >
              🚀 Ask Us to Build a Project
            </button>
            <button
              className="sb-btn sb-btn-outline"
              style={{ background: "#fff", borderColor: "var(--border)" }}
              onClick={() => setPostModalOpen(true)}
            >
              + Post a Micro-Task
            </button>
          </div>
        </div>

        {/* Confirmation banner when request is submitted */}
        {buildConfirmation && (
          <div
            className="card"
            style={{
              padding: 24,
              marginBottom: 28,
              background: "var(--success-light)",
              borderColor: "var(--success)",
              borderWidth: 1.5
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--success)", marginBottom: 6 }}>
                  ✅ Project Build Request Submitted to Admin!
                </div>
                <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 8 }}>
                  Project: <strong>"{buildConfirmation.title}"</strong> ({buildConfirmation.category}) — Target Budget: {buildConfirmation.budget}
                </div>
                <p style={{ fontSize: 13, color: "var(--text-mid)", lineHeight: 1.6, maxWidth: 640 }}>
                  We have logged your specifications into our database. Our platform admin will review your scope and reply to <strong>{buildConfirmation.clientEmail}</strong> within 24 hours.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <a
                  href={createClientToAdminMailLink(buildConfirmation)}
                  className="sb-btn sb-btn-primary"
                  style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <span>✉️ Open Mail to Admin</span>
                </a>
                <button
                  className="sb-btn sb-btn-ghost"
                  onClick={() => setBuildConfirmation(null)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

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

      {/* Ask Us to Build Your Project Modal */}
      <Modal
        isOpen={buildRequestModalOpen}
        onClose={() => setBuildRequestModalOpen(false)}
        title="Request SkillBridge to Build Your Project"
      >
        <p style={{ fontSize: 13, color: "var(--text-mid)", marginBottom: 16, lineHeight: 1.6 }}>
          Have our mentor-guided team build your website, application, or business tool. Fill in your details below — our admin will review and <strong>reply directly to your email</strong> within 24 hours.
        </p>

        <form onSubmit={handleBuildRequestSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="grid-2">
            <div>
              <label className="input-label">Your Name / Business Name *</label>
              <input
                className="input-field"
                placeholder="e.g. Rajesh Kumar or Apex Solutions"
                value={buildForm.clientName}
                onChange={(e) => setBuildForm({ ...buildForm, clientName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="input-label">Email for Admin Reply *</label>
              <input
                className="input-field"
                type="email"
                placeholder="client@yourbusiness.com"
                value={buildForm.clientEmail}
                onChange={(e) => setBuildForm({ ...buildForm, clientEmail: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label className="input-label">Phone / WhatsApp (optional)</label>
              <input
                className="input-field"
                placeholder="e.g. +91 98765 43210"
                value={buildForm.clientPhone}
                onChange={(e) => setBuildForm({ ...buildForm, clientPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="input-label">Project Category *</label>
              <select
                className="input-field"
                value={buildForm.category}
                onChange={(e) => setBuildForm({ ...buildForm, category: e.target.value })}
              >
                {categories.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Project Title / Goal *</label>
            <input
              className="input-field"
              placeholder="e.g. Modern Responsive Website for Dental Clinic"
              value={buildForm.title}
              onChange={(e) => setBuildForm({ ...buildForm, title: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div>
              <label className="input-label">Target Budget (₹) *</label>
              <select
                className="input-field"
                value={buildForm.budget}
                onChange={(e) => setBuildForm({ ...buildForm, budget: e.target.value })}
              >
                <option value="₹1,000–₹3,000">₹1,000 – ₹3,000 (Small Task)</option>
                <option value="₹3,000–₹8,000">₹3,000 – ₹8,000 (Standard Website)</option>
                <option value="₹8,000–₹15,000">₹8,000 – ₹15,000 (E-commerce / App)</option>
                <option value="₹15,000+">₹15,000+ (Custom System)</option>
                <option value="Flexible">Flexible / Open to Quote</option>
              </select>
            </div>
            <div>
              <label className="input-label">Expected Timeline *</label>
              <select
                className="input-field"
                value={buildForm.deadline}
                onChange={(e) => setBuildForm({ ...buildForm, deadline: e.target.value })}
              >
                <option value="3-5 days">Urgent (3–5 days)</option>
                <option value="1-2 weeks">Standard (1–2 weeks)</option>
                <option value="3-4 weeks">Detailed (3–4 weeks)</option>
                <option value="Flexible">Flexible Timeline</option>
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Detailed Requirements & Scope *</label>
            <textarea
              className="input-field"
              rows={4}
              placeholder="Describe what pages or features you need, any reference links, target audience, and preferred design style..."
              value={buildForm.description}
              onChange={(e) => setBuildForm({ ...buildForm, description: e.target.value })}
              required
              style={{ resize: "vertical" }}
            />
          </div>

          <div style={{ background: "var(--surface-alt)", padding: "12px 16px", borderRadius: 8, fontSize: 12, color: "var(--text-mid)" }}>
            ℹ️ When you submit, our system will notify the admin team. You will also get a direct link to send the formatted brief to <strong>community@skillbridge.org</strong> from your mail app.
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
            <button
              type="button"
              className="sb-btn sb-btn-ghost"
              onClick={() => setBuildRequestModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sb-btn sb-btn-accent"
              disabled={buildSubmitting}
            >
              {buildSubmitting ? "Submitting..." : "🚀 Send Request to Admin"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
