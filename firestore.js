import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

const firebaseConfig = {
  apiKey: "AIzaSyBSD-94Kap34CKFw2obydw6XbBrgOUrHCY",
  authDomain: "expresstest-36c71.firebaseapp.com",
  projectId: "expresstest-36c71",
  storageBucket: "expresstest-36c71.firebasestorage.app",
  messagingSenderId: "261678089805",
  appId: "1:261678089805:web:9916c847aa4a3f54de7e04",
  measurementId: "G-TBRSMR6ST9"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export async function addUserToFirestore(nom, email, motdepasse) {
  try {
    // mdp hach
    const hashedPassword = await bcrypt.hash(motdepasse, 10); 

    
    const docRef = await addDoc(collection(db, 'users'), {
      nom: nom,
      email: email,
      motdepasse: hashedPassword 
    });
    console.log("Document écrit avec ID: ", docRef.id);
  } catch (e) {
    console.error("Erreur d'ajout de document: ", e);
  }
}