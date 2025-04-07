// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBGMT3v_6fopeh78Ze44AJIPPBM-4FczFM",  // Replace with your actual API key
  authDomain: "codecracker-7e97a.firebaseapp.com",
  projectId: "codecracker-7e97a",
  storageBucket: "codecracker-7e97a.appspot.com",  // fixed typo (.app -> .appspot.com)
  messagingSenderId: "747903395548",
  appId: "1:747903395548:web:5e6fb1dd81f751927cf619",
  measurementId: "G-PZXD0YT8ND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Handle Google login
const googleBtn = document.querySelector(".google");
googleBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // User info to store
    const userData = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString()
    };

    // Save to Firestore (under users collection with UID as document ID)
    await setDoc(doc(db, "users", user.uid), userData);

    alert(`Welcome ${user.displayName}! You're now signed in.`);
    // Redirect or load dashboard here if needed
  } catch (error) {
    console.error("Error logging in with Google:", error);
    alert("Google sign-in failed. Please try again.");
  }
});
