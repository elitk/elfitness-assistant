
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
    apiKey: "AIzaSyA5A1Dx14qCIP_qqZ5FDzzRbl2uqeK7254",
    authDomain: "efitness-assistant.firebaseapp.com",
    projectId: "efitness-assistant",
    storageBucket: "efitness-assistant.firebasestorage.app",
    messagingSenderId: "1086142388296",
    appId: "1:1086142388296:web:f5d2f1c1770011bf65607d",
    measurementId: "G-2TEZYCLLK4"
  };

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
