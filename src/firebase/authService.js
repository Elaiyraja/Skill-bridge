import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./config";

const LOCAL_USER_KEY = "skillbridge_current_user";
const LOCAL_USERS_DB = "skillbridge_registered_users";

const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_DB) || "[]");
  } catch {
    return [];
  }
};

const saveLocalUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_DB, JSON.stringify(users));
};

export const registerUser = async ({ name, email, password, role = "student" }) => {
  if (isFirebaseConfigured && auth) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const userData = {
      uid: user.uid,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      enrolledCourses: [2, 4, 5], // Default foundation enrollments
      completedCourses: [],
      certificates: []
    };

    if (db) {
      await setDoc(doc(db, "users", user.uid), userData);
    }
    return userData;
  } else {
    // Local persistence mode
    const users = getLocalUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      uid: "usr_" + Date.now(),
      name,
      email,
      role,
      password, // only kept locally in demo mode
      createdAt: new Date().toISOString(),
      enrolledCourses: [2, 4, 5],
      completedCourses: [],
      certificates: []
    };

    users.push(newUser);
    saveLocalUsers(users);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
    return newUser;
  }
};

export const loginUser = async ({ email, password }) => {
  if (isFirebaseConfigured && auth) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let profile = {
      uid: user.uid,
      name: user.displayName || email.split("@")[0],
      email: user.email,
      role: "student"
    };

    if (db) {
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          profile = { ...profile, ...docSnap.data() };
        }
      } catch (err) {
        console.warn("Could not fetch user document from Firestore:", err);
      }
    }
    return profile;
  } else {
    const users = getLocalUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      // Demo fallback: if logging in with any demo credentials
      if (email && password.length >= 4) {
        const fallbackUser = {
          uid: "demo_usr_" + Date.now(),
          name: email.split("@")[0].replace(".", " ").toUpperCase(),
          email,
          role: "student",
          createdAt: new Date().toISOString(),
          enrolledCourses: [2, 4, 5],
          completedCourses: [],
          certificates: []
        };
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(fallbackUser));
        return fallbackUser;
      }
      throw new Error("Invalid email or password.");
    }

    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    return user;
  }
};

export const logoutUser = async () => {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  localStorage.removeItem(LOCAL_USER_KEY);
};

export const subscribeToAuthChanges = (callback) => {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userDoc = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
          email: firebaseUser.email,
          role: "student"
        };
        if (db) {
          try {
            const snap = await getDoc(doc(db, "users", firebaseUser.uid));
            if (snap.exists()) {
              userDoc = { ...userDoc, ...snap.data() };
            }
          } catch (e) {
            console.warn("Error fetching user on state change:", e);
          }
        }
        callback(userDoc);
      } else {
        callback(null);
      }
    });
  } else {
    // Initial check from local storage
    const saved = localStorage.getItem(LOCAL_USER_KEY);
    if (saved) {
      try {
        callback(JSON.parse(saved));
      } catch {
        callback(null);
      }
    } else {
      callback(null);
    }
    // Return unsubscribe no-op
    return () => {};
  }
};
