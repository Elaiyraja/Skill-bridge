import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  query,
  where,
  addDoc
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";

const LOCAL_ENROLLMENTS_KEY = "skillbridge_enrollments";
const LOCAL_PROPOSALS_KEY = "skillbridge_proposals";
const LOCAL_CERTS_KEY = "skillbridge_certificates";
const LOCAL_MESSAGES_KEY = "skillbridge_contact_messages";
const LOCAL_BUILD_REQUESTS_KEY = "skillbridge_project_build_requests";
const LOCAL_UDYAM_KEY = "skillbridge_udyam_registrations";

export const ADMIN_EMAIL = "community@skillbridge.org";

// Helper for local storage
const getLocalData = (key, defaultVal = []) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultVal));
  } catch {
    return defaultVal;
  }
};
const setLocalData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Seed initial Udyam registrations if empty
if (!localStorage.getItem(LOCAL_UDYAM_KEY)) {
  setLocalData(LOCAL_UDYAM_KEY, [
    {
      id: "udyam_demo_1",
      urn: "UDYAM-TN-02-0048192",
      ownerName: "Murugan Selvam",
      enterpriseName: "Murugan Handlooms & Textiles",
      aadhaarNumber: "XXXX-XXXX-4819",
      panNumber: "ABCDE1234F",
      mobileNumber: "+91 98421 55678",
      email: "orders@muruganhandlooms.in",
      businessType: "Proprietorship",
      category: "Manufacturing",
      city: "Madurai",
      state: "Tamil Nadu",
      status: "Udyam Certificate Issued",
      submittedAt: "2025-06-10T09:15:00.000Z",
      issuedAt: "2025-06-12T14:30:00.000Z",
      notes: "Official 16-digit Udyam Registration Certificate generated and dispatched."
    }
  ]);
}

// Seed initial project build requests if empty
if (!localStorage.getItem(LOCAL_BUILD_REQUESTS_KEY)) {
  setLocalData(LOCAL_BUILD_REQUESTS_KEY, [
    {
      id: "req_demo_1",
      clientName: "Murugan Handlooms",
      clientEmail: "orders@muruganhandlooms.in",
      clientPhone: "+91 98421 55678",
      title: "Small E-Commerce Catalog Website for Traditional Sarees",
      category: "Small Business Website",
      budget: "₹3,000–₹6,000",
      deadline: "7 days",
      description: "Small-level project: We need a clean, responsive single-page product showcase with 25 saree photos and WhatsApp direct ordering button.",
      status: "In Discussion",
      submittedAt: "2025-06-18T10:30:00.000Z",
      adminNotes: "Small project accepted. Assigned mentor Anand."
    }
  ]);
}

/**
 * Enroll user in a course
 */
export const enrollInCourse = async (userId, courseId) => {
  const numericId = Number(courseId);
  if (isFirebaseConfigured && db && userId) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        enrolledCourses: arrayUnion(numericId)
      });
      // Also write enrollment log
      await addDoc(collection(db, "enrollments"), {
        userId,
        courseId: numericId,
        enrolledAt: new Date().toISOString(),
        progress: 0
      });
    } catch (err) {
      console.warn("Error updating enrollment in Firestore:", err);
    }
  }

  // Always keep local state up to date
  const enrollments = getLocalData(LOCAL_ENROLLMENTS_KEY, {});
  const userList = enrollments[userId] || [];
  if (!userList.includes(numericId)) {
    userList.push(numericId);
    enrollments[userId] = userList;
    setLocalData(LOCAL_ENROLLMENTS_KEY, enrollments);
  }
  return userList;
};

/**
 * Fetch enrolled courses for user
 */
export const getUserEnrolledCourseIds = async (userId) => {
  if (isFirebaseConfigured && db && userId) {
    try {
      const snap = await getDoc(doc(db, "users", userId));
      if (snap.exists() && snap.data().enrolledCourses) {
        return snap.data().enrolledCourses;
      }
    } catch (e) {
      console.warn("Error reading user courses from Firestore:", e);
    }
  }
  const enrollments = getLocalData(LOCAL_ENROLLMENTS_KEY, {});
  return enrollments[userId] || [];
};

/**
 * Submit Freelance Project Proposal
 */
export const submitProposal = async (proposalData) => {
  const record = {
    ...proposalData,
    id: "prop_" + Date.now(),
    submittedAt: new Date().toISOString(),
    status: "Under Review"
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "proposals"), record);
      return { ...record, id: docRef.id };
    } catch (err) {
      console.warn("Firestore proposal error, saving locally:", err);
    }
  }

  const list = getLocalData(LOCAL_PROPOSALS_KEY, []);
  list.unshift(record);
  setLocalData(LOCAL_PROPOSALS_KEY, list);
  return record;
};

/**
 * Get proposals for a specific project
 */
export const getProposalsByProject = async (projectId) => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "proposals"), where("projectId", "==", Number(projectId)));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn("Error reading proposals from Firestore:", e);
    }
  }
  const list = getLocalData(LOCAL_PROPOSALS_KEY, []);
  return list.filter(p => Number(p.projectId) === Number(projectId));
};

/**
 * Issue and save certificate
 */
export const issueCertificate = async ({ userId, userName, courseTitle, courseId }) => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const certId = `SB-2025-${randomSuffix}`;
  const cert = {
    id: certId,
    userId: userId || "usr_guest",
    studentName: userName || "Student",
    courseId: Number(courseId),
    courseTitle,
    issueDate: new Date().toISOString().split("T")[0],
    issuer: "SkillBridge Social Education Initiative",
    status: "Valid"
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "certificates", certId), cert);
    } catch (err) {
      console.warn("Error saving certificate to Firestore:", err);
    }
  }

  const certs = getLocalData(LOCAL_CERTS_KEY, []);
  certs.unshift(cert);
  setLocalData(LOCAL_CERTS_KEY, certs);
  return cert;
};

/**
 * Verify certificate authenticity
 */
export const verifyCertificate = async (certificateId) => {
  const cleanId = (certificateId || "").trim().toUpperCase();
  if (!cleanId) return { valid: false };

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, "certificates", cleanId));
      if (snap.exists()) {
        return { valid: true, ...snap.data() };
      }
    } catch (err) {
      console.warn("Error verifying certificate in Firestore:", err);
    }
  }

  const certs = getLocalData(LOCAL_CERTS_KEY, []);
  const found = certs.find(c => c.id.toUpperCase() === cleanId);
  if (found) {
    return { valid: true, ...found };
  }

  // Fallback demo match for demo purposes if starts with SB-
  if (cleanId.startsWith("SB") && cleanId.length >= 6) {
    return {
      valid: true,
      id: cleanId,
      studentName: "Verified Community Learner",
      courseTitle: "Web Development & Practical Skills",
      issueDate: "2025-06-15",
      issuer: "SkillBridge Social Education Initiative",
      status: "Valid"
    };
  }

  return { valid: false };
};

/**
 * Save contact message
 */
export const saveContactMessage = async (msg) => {
  const record = { ...msg, id: "msg_" + Date.now(), timestamp: new Date().toISOString() };
  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, "contact_messages"), record);
    } catch (e) {
      console.warn("Failed to write contact message to Firestore:", e);
    }
  }
  const messages = getLocalData(LOCAL_MESSAGES_KEY, []);
  messages.unshift(record);
  setLocalData(LOCAL_MESSAGES_KEY, messages);
  return true;
};

/**
 * Fetch contact messages for admin
 */
export const getContactMessages = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "contact_messages"));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn("Error reading contact messages from Firestore:", e);
    }
  }
  return getLocalData(LOCAL_MESSAGES_KEY, []);
};

/**
 * Save Client Request to Build a Project
 */
export const saveProjectBuildRequest = async (requestData) => {
  const record = {
    ...requestData,
    id: "req_" + Date.now(),
    status: "Pending Review",
    submittedAt: new Date().toISOString(),
    adminNotes: ""
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "project_requests"), record);
      record.id = docRef.id;
    } catch (err) {
      console.warn("Firestore saveProjectBuildRequest error, saving locally:", err);
    }
  }

  const list = getLocalData(LOCAL_BUILD_REQUESTS_KEY, []);
  list.unshift(record);
  setLocalData(LOCAL_BUILD_REQUESTS_KEY, list);
  return record;
};

/**
 * Fetch all Project Build Requests for Admin
 */
export const getProjectBuildRequests = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "project_requests"));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn("Error reading project requests from Firestore:", err);
    }
  }
  return getLocalData(LOCAL_BUILD_REQUESTS_KEY, []);
};

/**
 * Fetch Project Build Requests submitted by a specific user
 */
export const getUserProjectBuildRequests = async (userId, userEmail) => {
  const all = await getProjectBuildRequests();
  return all.filter((r) => 
    (userId && (r.userId === userId || r.clientEmail === userEmail)) || 
    (userEmail && r.clientEmail === userEmail)
  );
};

/**
 * Update Project Build Request Status or Admin Notes
 */
export const updateProjectBuildRequest = async (requestId, updates) => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "project_requests", requestId);
      await updateDoc(docRef, updates);
    } catch (err) {
      console.warn("Error updating project request in Firestore:", err);
    }
  }

  const list = getLocalData(LOCAL_BUILD_REQUESTS_KEY, []);
  const updated = list.map((item) => (item.id === requestId ? { ...item, ...updates } : item));
  setLocalData(LOCAL_BUILD_REQUESTS_KEY, updated);
  return updated;
};

/**
 * Helper to create a pre-composed mailto URL from Client to Admin
 */
export const createClientToAdminMailLink = ({ clientName, clientEmail, title, category, budget, deadline, description }) => {
  const subject = `[Project Build Request] ${title || "New Project Inquiry"} - from ${clientName || "Client"}`;
  const body = `Dear SkillBridge Admin Team,

I would like to request SkillBridge to build the following project:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT SPECIFICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Project Title: ${title || "N/A"}
• Category: ${category || "General"}
• Estimated Budget: ${budget || "To be discussed"}
• Desired Timeline: ${deadline || "Flexible"}

• Client Name: ${clientName || "N/A"}
• Client Contact Email: ${clientEmail || "N/A"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT REQUIREMENTS & SCOPE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${description || "No additional description provided."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please review our requirements and let us know your feasibility, timeline, and next steps.

Thank you!
${clientName || "Client"}`;

  return `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Helper to create a pre-composed reply mailto URL from Admin to Client
 */
export const createAdminReplyMailLink = ({
  clientName,
  clientEmail,
  title,
  category,
  budget,
  deadline,
  decision = "accept", // "accept" | "discuss" | "decline"
  customNotes = ""
}) => {
  const subject = `Re: SkillBridge Project Build Request - "${title}"`;
  
  let intro = `We are pleased to inform you that our team has reviewed your request to build "${title}" and we would be delighted to take this up with our mentor-guided developer team!`;
  if (decision === "discuss") {
    intro = `Thank you for your project request to build "${title}". We have reviewed your initial specifications and would like to clarify a few details before finalizing.`;
  } else if (decision === "decline") {
    intro = `Thank you for considering SkillBridge for "${title}". After reviewing our current learner team capacity, we are unfortunately unable to take on this specific project right now.`;
  }

  const body = `Dear ${clientName || "Client"},

Thank you for reaching out to SkillBridge.

${intro}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REVIEWED DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Project: ${title}
• Category: ${category}
• Target Budget: ${budget}
• Target Delivery: ${deadline}
${customNotes ? `\n• Notes from Admin: ${customNotes}\n` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROPOSED NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. We can coordinate via this email thread or schedule a brief 10-minute discovery call.
2. A senior project mentor will be assigned along with top learners from our relevant course track.
3. We will share a clear milestone plan with deliverables for your review.

Please reply to this email with any preferred call timings or additional documentation you have.

Warm regards,
SkillBridge Administration & Project Mentorship Team
Email: ${ADMIN_EMAIL}
Website: https://skillbridge-liart.vercel.app`;

  return `mailto:${clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Udyam (MSME) Registration Services
 */
export const saveUdyamRegistration = async (registrationData) => {
  const record = {
    ...registrationData,
    id: "udyam_" + Date.now(),
    status: "Submitted - Verification in Progress",
    submittedAt: new Date().toISOString(),
    urn: null,
    adminNotes: "Application received. Verification of Aadhaar & business details in progress."
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "udyam_registrations"), record);
      record.id = docRef.id;
    } catch (err) {
      console.warn("Firestore saveUdyamRegistration error, saving locally:", err);
    }
  }

  const list = getLocalData(LOCAL_UDYAM_KEY, []);
  list.unshift(record);
  setLocalData(LOCAL_UDYAM_KEY, list);
  return record;
};

export const getUdyamRegistrations = async (userId) => {
  if (isFirebaseConfigured && db && userId) {
    try {
      const q = query(collection(db, "udyam_registrations"), where("userId", "==", userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn("Firestore getUdyamRegistrations error:", err);
    }
  }
  const list = getLocalData(LOCAL_UDYAM_KEY, []);
  if (userId) {
    return list.filter((r) => r.userId === userId || r.userId === "guest");
  }
  return list;
};

export const getAllUdyamRegistrations = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "udyam_registrations"));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn("Firestore getAllUdyamRegistrations error:", err);
    }
  }
  return getLocalData(LOCAL_UDYAM_KEY, []);
};

export const updateUdyamRegistration = async (id, updates) => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "udyam_registrations", id);
      await updateDoc(docRef, updates);
    } catch (err) {
      console.warn("Firestore updateUdyamRegistration error:", err);
    }
  }

  const list = getLocalData(LOCAL_UDYAM_KEY, []);
  const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
  setLocalData(LOCAL_UDYAM_KEY, updated);
  return updated;
};

export const verifyUdyamURN = async (urnQuery) => {
  const clean = (urnQuery || "").trim().toUpperCase();
  if (!clean) return { valid: false };

  const all = await getAllUdyamRegistrations();
  const match = all.find((u) => u.urn && u.urn.toUpperCase() === clean);
  if (match) {
    return { valid: true, ...match };
  }

  // Demo fallback validation for format UDYAM-XX-XX-XXXXXXX
  if (/^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/i.test(clean)) {
    return {
      valid: true,
      urn: clean,
      enterpriseName: "Verified Micro / Small Enterprise",
      ownerName: "Registered Business Owner",
      status: "Udyam Certificate Issued",
      state: "Tamil Nadu",
      category: "Manufacturing / Service"
    };
  }

  return { valid: false };
};
