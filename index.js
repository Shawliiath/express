import express from 'express';
import { addUserToFirestore } from './firestore.js';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';  
import path from 'path';
import { fileURLToPath } from 'url';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import session from 'express-session';

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBSD-94Kap34CKFw2obydw6XbBrgOUrHCY",
  authDomain: "expresstest-36c71.firebaseapp.com",
  projectId: "expresstest-36c71",
  storageBucket: "expresstest-36c71.firebasestorage.app",
  messagingSenderId: "261678089805",
  appId: "1:261678089805:web:9916c847aa4a3f54de7e04",
  measurementId: "G-TBRSMR6ST9"
};

// initialisation firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// moteur de vue
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// midleware sess
app.use(session({
  secret: '',
  resave: false,
  saveUninitialized: true,
}));

app.get("/", (req, res) => {
  res.render('index'); 
});

app.post("/register", async (req, res) => {
  const { nom, email, motdepasse } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(motdepasse, 10);
    await addUserToFirestore(nom, email, hashedPassword);
    res.send('<p>Utilisateur ajouté avec succès. <a href="/login">Se connecter</a></p>');
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).send("Erreur lors de l'inscription.");
  }
});

app.get("/login", (req, res) => {
  res.render('login');  
});

app.post("/login", async (req, res) => {
  const { email, motdepasse } = req.body;
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    let userFound = null;

    querySnapshot.forEach(doc => {
      const user = doc.data();
      if (user.email === email) {
        userFound = user;
      }
    });

    if (!userFound) {
      return res.status(404).send('<p>Utilisateur non trouvé.</p>');
    }

    const match = await bcrypt.compare(motdepasse, userFound.motdepasse);
    if (!match) {
      return res.status(401).send('<p>Mot de passe incorrect.</p>');
    }

    req.session.user = userFound;
    
    res.send('<p>Connexion réussie ! Bienvenue. <a href="/dashboard">Accéder au tableau de bord</a></p>');
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).send("Erreur lors de la connexion.");
  }
});

// middleware log
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// dashboard route
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(`<h1>Bienvenue ${req.session.user.nom} dans votre tableau de bord !</h1>`);
});

// logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});