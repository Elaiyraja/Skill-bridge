import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
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

export const registerUser = async ({ name, email, password, role = "client" }) => {
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
      udyamRegistrations: [],
      projectRequests: []
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
      udyamRegistrations: [],
      projectRequests: []
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

/**
 * Social Login (Google, GitHub, Facebook)
 */
export const loginWithSocial = async (providerName) => {
  if (isFirebaseConfigured && auth) {
    let provider;
    if (providerName === "google") {
      provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
    } else if (providerName === "github") {
      provider = new GithubAuthProvider();
      provider.addScope("user:email");
    } else if (providerName === "facebook") {
      provider = new FacebookAuthProvider();
      provider.addScope("email");
      provider.addScope("public_profile");
    } else {
      throw new Error(`Unsupported provider: ${providerName}`);
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      let profile = {
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || `${providerName} User`,
        email: user.email || `${providerName}_user_${user.uid.slice(0, 6)}@skillbridge.local`,
        photoURL: user.photoURL || null,
        provider: providerName,
        role: "client",
        udyamRegistrations: [],
        projectRequests: []
      };

      if (db) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            profile = { ...profile, ...docSnap.data() };
          } else {
            await setDoc(doc(db, "users", user.uid), {
              ...profile,
              createdAt: new Date().toISOString()
            });
          }
        } catch (e) {
          console.warn("Firestore sync warning on social login:", e);
        }
      }

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      return profile;
    } catch (err) {
      console.warn(`${providerName} login error:`, err);
      if (err.code === "auth/operation-not-allowed" || err.code === "auth/configuration-not-found") {
        throw new Error(`${providerName.toUpperCase()} authentication is not enabled in your Firebase Console. Please enable ${providerName} in Firebase Console -> Authentication -> Sign-in method.`);
      }
      if (err.code === "auth/popup-closed-by-user") {
        throw new Error("Sign-in popup was closed before completing.");
      }
      if (err.code === "auth/unauthorized-domain") {
        throw new Error("This domain is not listed in Firebase Console -> Authentication -> Settings -> Authorized domains.");
      }
      throw new Error(err.message || `${providerName} sign-in failed.`);
    }
  } else {
    // Local / Offline simulation
    const dummyNames = {
      google: "Google User",
      github: "GitHub Developer",
      facebook: "Facebook User"
    };
    const profile = {
      uid: `${providerName}_demo_${Date.now()}`,
      name: dummyNames[providerName] || "Social User",
      email: `${providerName}.user@example.com`,
      provider: providerName,
      role: "client",
      createdAt: new Date().toISOString(),
      udyamRegistrations: [],
      projectRequests: []
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return profile;
  }
};

export const loginWithGoogle = () => loginWithSocial("google");
export const loginWithGithub = () => loginWithSocial("github");
export const loginWithFacebook = () => loginWithSocial("facebook");

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
