// // firebase-service.js
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
// import firebaseConfig from './firebase-config.js';

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// export const firebaseService = {
//   // Track question progress
//   async saveQuestionProgress(userId, questionId, isSolved) {
//     try {
//       const userDocRef = doc(db, "users", userId);
//       const userDocSnap = await getDoc(userDocRef);
      
//       let solvedQuestions = {};
//       if (userDocSnap.exists()) {
//         solvedQuestions = userDocSnap.data().solvedQuestions || {};
//       }
      
//       solvedQuestions[questionId] = isSolved;
      
//       await setDoc(userDocRef, { solvedQuestions }, { merge: true });
//       return true;
//     } catch (error) {
//       console.error("Error saving question progress:", error);
//       return false;
//     }
//   },

//   // Load user progress
//   async loadUserProgress(userId) {
//     try {
//       const userDocRef = doc(db, "users", userId);
//       const userDocSnap = await getDoc(userDocRef);
      
//       if (userDocSnap.exists()) {
//         return userDocSnap.data().solvedQuestions || {};
//       }
//       return {};
//     } catch (error) {
//       console.error("Error loading user progress:", error);
//       return {};
//     }
//   },

//   // Get current user
//   getCurrentUser() {
//     return auth.currentUser;
//   },

//   // Listen for auth state changes
//   onAuthStateChanged(callback) {
//     return onAuthStateChanged(auth, callback);
//   }
// };