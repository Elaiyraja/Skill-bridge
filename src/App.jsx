import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/UIComponents';
import { SkillMateFAB } from './components/common/SkillMateFAB';
import { SkillMateAI } from './components/chat/SkillMateAI';

import { HomePage } from './pages/Home';
import { UdyamPage } from './pages/Udyam';
import { ProjectsPage } from './pages/Projects';
import { AboutPage } from './pages/About';
import { StoriesPage } from './pages/Stories';
import { VerifyPage } from './pages/Verify';
import { DashboardPage } from './pages/Dashboard';
import { AdminPage } from './pages/Admin';
import { ContactPage } from './pages/Contact';
import { AuthPage } from './pages/Auth';

import { subscribeToAuthChanges, logoutUser } from './firebase/authService';
import { getUserEnrolledCourseIds } from './firebase/firestoreService';

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  // Subscribe to Firebase / Local Auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
  };

  const handleSignOut = async () => {
    await logoutUser();
    setUser(null);
    showToast("You have been signed out.");
    setPage("home");
  };

  const renderPage = () => {
    if (page === "home") {
      return <HomePage setPage={setPage} user={user} />;
    }
    if (page === "udyam") {
      return <UdyamPage setPage={setPage} user={user} showToast={showToast} initialTab="apply" />;
    }
    if (page === "verify") {
      return <UdyamPage setPage={setPage} user={user} showToast={showToast} initialTab="verify" />;
    }
    if (page === "projects") {
      return <ProjectsPage setPage={setPage} user={user} showToast={showToast} />;
    }
    if (page === "about") {
      return <AboutPage setPage={setPage} />;
    }
    if (page === "stories") {
      return <StoriesPage setPage={setPage} />;
    }
    if (page === "ai") {
      return <SkillMateAI />;
    }
    if (page === "verify") {
      return <VerifyPage />;
    }
    if (page === "contact") {
      return <ContactPage showToast={showToast} />;
    }
    if (page === "admin") {
      return <AdminPage />;
    }
    if (page === "login") {
      return <AuthPage mode="login" setPage={setPage} setUser={setUser} showToast={showToast} />;
    }
    if (page === "register") {
      return <AuthPage mode="register" setPage={setPage} setUser={setUser} showToast={showToast} />;
    }
    if (page === "dashboard") {
      return user ? (
        <DashboardPage
          user={user}
          setPage={setPage}
          showToast={showToast}
          onSignOut={handleSignOut}
        />
      ) : (
        <AuthPage mode="login" setPage={setPage} setUser={setUser} showToast={showToast} />
      );
    }

    // Fallback page
    return (
      <div className="container section" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔧</div>
        <h2>Page Under Construction</h2>
        <p style={{ color: "var(--text-mid)", marginBottom: 20 }}>
          This page is being updated with community resources.
        </p>
        <button className="sb-btn sb-btn-primary" onClick={() => setPage("home")}>
          Return to Home
        </button>
      </div>
    );
  };

  const showNavAndFooter = !["login", "register"].includes(page);
  const isAIFullScreen = page === "ai";

  return (
    <div className="page-container">
      {showNavAndFooter && (
        <Navbar page={page} setPage={setPage} user={user} onSignOut={handleSignOut} />
      )}
      <main>{renderPage()}</main>
      {showNavAndFooter && !isAIFullScreen && <Footer setPage={setPage} />}
      {showNavAndFooter && !isAIFullScreen && <SkillMateFAB setPage={setPage} />}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
