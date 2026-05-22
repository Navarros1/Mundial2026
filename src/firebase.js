import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA6-6jALms0s-j9-OwrVTEGP3vl5IHnkRQ",
  authDomain: "mundial2026-7be30.firebaseapp.com",
  databaseURL: "https://mundial2026-7be30-default-rtdb.firebaseio.com",
  projectId: "mundial2026-7be30",
  storageBucket: "mundial2026-7be30.firebasestorage.app",
  messagingSenderId: "781839867693",
  appId: "1:781839867693:web:f1f57c18ac376a3a697da4"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
