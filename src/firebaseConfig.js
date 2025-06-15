import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAP7c85W56Z75noLzD_vVin2IoM02DkKjg",
    authDomain: "piccantometro.firebaseapp.com",
    projectId: "piccantometro",
    storageBucket: "piccantometro.firebasestorage.app",
    messagingSenderId: "716174745933",
    appId: "1:716174745933:web:f77360b39f8dd58affd704",
    measurementId: "G-H94S9GV2J5"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
