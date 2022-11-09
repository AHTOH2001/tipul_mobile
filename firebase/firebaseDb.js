import { initializeApp } from "firebase/app"
import * as firestore from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBKVRgw47XThW9yLH44d0hbq2staPjELVc",
  authDomain: "ppo-lab2-tabata-timer.firebaseapp.com",
  projectId: "ppo-lab2-tabata-timer",
  storageBucket: "ppo-lab2-tabata-timer.appspot.com",
  messagingSenderId: "790974388416",
  appId: "1:790974388416:web:49b33628b4691db336f525",
  measurementId: "G-H3TQJVQ013"
};


export const app = initializeApp(firebaseConfig);
export const db = firestore.getFirestore();

export default firestore;