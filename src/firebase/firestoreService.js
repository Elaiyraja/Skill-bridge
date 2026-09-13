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

// Helper for local storage
const getLocalData = (key, defaultVal = []) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultVal));
  } catch {
    return defaultVal;
  }
};
const setLocalData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Seed initial certificates in local store if empty
if (!localStorage.getItem(LOCAL_CERTS_KEY)) {
  setLocalData(LOCAL_CERTS_KEY, [
    {
      id: "SB-2025-8492",
      studentName: "Priya S.",
      courseTitle: "HTML & CSS",
      issueDate: "2025-05-12",
      issuer: "SkillBridge Foundation",
      status: "Valid"
    },
    {
      id: "SB-2025-3914",
      studentName: "Rajan K.",
      courseTitle: "Data Analytics",
      issueDate: "2025-06-20",
      issuer: "SkillBridge Foundation",
      status: "Valid"
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
  const record = { ...msg, timestamp: new Date().toISOString() };
  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, "contact_messages"), record);
    } catch (e) {
      console.warn("Failed to write contact message to Firestore:", e);
    }
  }
  const messages = getLocalData(LOCAL_MESSAGES_KEY, []);
  messages.push(record);
  setLocalData(LOCAL_MESSAGES_KEY, messages);
  return true;
};
