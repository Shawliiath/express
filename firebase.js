import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Importer Firestore
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Configuration de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBSD-94Kap34CKFw2obydw6XbBrgOUrHCY",
  authDomain: "expresstest-36c71.firebaseapp.com",
  projectId: "expresstest-36c71",
  storageBucket: "expresstest-36c71.firebasestorage.app",
  messagingSenderId: "261678089805",
  appId: "1:261678089805:web:9916c847aa4a3f54de7e04",
  measurementId: "G-TBRSMR6ST9"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialiser Firestore
const db = getFirestore(app);