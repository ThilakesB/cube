import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
  apiKey: "AIzaSyC9FmYz176w40PgN04QkIDZhhq0hQUYdWU",
  authDomain: "cubeerp-9b3f8.firebaseapp.com",
  projectId: "cubeerp-9b3f8",
  storageBucket: "cubeerp-9b3f8.firebasestorage.app",
  messagingSenderId: "812759553524",
  appId: "1:812759553524:web:2a3192f3d4fa31b6bf55a1",
  measurementId: "G-H18LSTM4GC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };